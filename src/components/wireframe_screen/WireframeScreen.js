import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import zoomIn from '../../images/3-512.png';
import zoomOut from '../../images/4-512.png';
import Canvas from './Canvas.js';
import { saveHandler } from '../../store/database/asynchHandler';
import { Modal } from 'react-materialize';
import { SketchPicker } from 'react-color';
import { HuePicker } from 'react-color';

class WireframeScreen extends Component {
    state = {
      controlsArr: JSON.parse(JSON.stringify(this.props.wireframe.controls)),
      name: this.props.wireframe.name,
      selectedControl: -1,
      zheight: 100,
      zwidth: 60,
      zoom: 1,
      height: this.props.wireframe.height,
      width: this.props.wireframe.width,
      updatedHeight: this.props.wireframe.height,
      updatedWidth: this.props.wireframe.width,
      dimensionChange: false,
      dimensionUpdated: false,
      madeChange: false
    }

    zoomIn = () => {
      var canvas = document.getElementById("draw");
      var factor = 0;
      if(this.state.zoom >= 1)
        factor = this.state.zoom + 1;
      else
        factor = this.state.zoom * 2;
      this.setState({ zoom: factor }, () => {
        canvas.style.width = (this.state.zwidth / this.state.zoom) + "%";
        canvas.style.height = (this.state.zheight / this.state.zoom) + "%";
        canvas.style.transform = "scale(" + this.state.zoom + ")";
        console.log("width: " + this.state.zwidth / this.state.zoom);
        console.log("height: " + this.state.zheight / this.state.zoom);
      });
    }

    zoomOut = () => {
      console.log("zooming out");
      var canvas = document.getElementById("draw");
      var factor = 0;
      if(this.state.zoom > 1)
        factor = this.state.zoom - 1;
      else
        factor = this.state.zoom / 2;
      this.setState({ zoom: factor }, () => {
        canvas.style.width = (this.state.zwidth * (1 / this.state.zoom)) + "%";
        canvas.style.height = (this.state.zheight * (1 / this.state.zoom)) + "%";
        canvas.style.transform = "scale(" + this.state.zoom + ")";
        console.log("width: " + this.state.zwidth * (1 / this.state.zoom));
        console.log("height: " + this.state.zheight * (1 / this.state.zoom));
      });
    }

    handleSave = (e) => {
      e.preventDefault();

      const { props } = this;
      const { firebase, profile } = props;
      const { wireframes } = this.props;
      wireframes[props.wireframe.id].controls = this.state.controlsArr;
      wireframes[props.wireframe.id].name = this.state.name;

      if (this.state.dimensionUpdated) {
        wireframes[props.wireframe.id].height = this.state.height;
        wireframes[props.wireframe.id].width = this.state.width;
      }

      props.save(profile, wireframes, firebase);
      this.madeChange(false);
    }

    handleDimension = (e) => {
      const { target } = e;

      this.setState(state => ({
          ...state,
          [target.id]: target.value,
          dimensionChange: true,
      }))
    }



    handleUpdateDimensions = (e) => {
        e.preventDefault();

        const { props } = this;
        const { firebase, profile } = props;
        const { wireframes } = this.props;
        if ((this.state.height>5000) || (this.state.height<1) || (this.state.width>5000) || (this.state.width<1)) {
            console.log("Invalid Dimensions")
        }
        else {
            // document.getElementById("wireframeCanvas").style.height = (this.state.updatedHeight * 625/5000) + "px";
            // document.getElementById("wireframeCanvas").style.width = (this.state.updatedWidth * 625/5000) + "px";
            this.setState({dimensionUpdated: true, madeChange: true});
        }
    }


    componentDidMount() {
      document.addEventListener('keydown', this.keysHandler);
      var height = document.getElementById("height");
      var width = document.getElementById("width");
      var { wireframe } = this.props;
      // document.getElementById("wireframeCanvas").style.height = (this.state.height * 600/5000) + "px";
      // document.getElementById("wireframeCanvas").style.width = (this.state.width * 600/5000) + "px";
      height.value = wireframe.height;
      width.value = wireframe.width;

    }

    componentWillUnmount() {
      document.removeEventListener('keydown', this.keysHandler);
    }

    keysHandler = (event) => {
        event.stopImmediatePropagation();
        if(event.keyCode === 68 && event.ctrlKey){
            event.preventDefault();
            this.copyControl(this.state.selectedControl);
        }else if(event.keyCode === 46){
            event.preventDefault();
            this.deleteControl(this.state.selectedControl);
        }
    }

    handleChange = (e) => {
      const { target } = e;
      const { props } = this;
      const { firebase, profile } = props;
      const { wireframes } = this.props;

      this.setState(state => ({
          ...state,
          [target.id]: target.value,
          madeChange: true,
      }))
    }


    copyControl = (index) => {
      if(index !== -1){
        var controlDupe = JSON.parse(JSON.stringify(this.state.controlsArr[index]));
        controlDupe.posX -= 100;
        controlDupe.posY -= 100;
        if(controlDupe.posX < 0){
          controlDupe.posX = 0;
        }
        if(controlDupe.posY < 0){
          controlDupe.posY = 0;
        }
        var controlArrNew = JSON.parse(JSON.stringify(this.state.controlsArr));
        controlArrNew.push(controlDupe);
        var newIndex = controlArrNew.length - 1
        this.setState(state => ({
          ...state,
          controlsArr: controlArrNew,
          selectedControl: newIndex
        }));
        this.madeChange(true);
      }
    }

    deleteControl = (index) => {
      if(index !== -1){
        var controlArrNew = JSON.parse(JSON.stringify(this.state.controlsArr));
        controlArrNew.splice(index, 1);
        controlArrNew = JSON.parse(JSON.stringify(controlArrNew));
        this.setState(state => ({
          controlsArr: controlArrNew,
          selectedControl: -1
        }));
        this.madeChange(true);
      }
    }

    selectControl = (event, index) => {
      event.stopPropagation();

      {this.state.controlsArr.map((control) => (
        control.className -= "borderimg"
      ))}
      if (index !== -1){
        this.state.controlsArr[index].className = "borderimg";
        console.log(this.state.controlsArr[index].className);
      }

      this.setState(state => ({
        ...state,
        selectedControl: index
      }));
  }


    
    addControl = (type) => {
      var widthControl = 0;
      var heightControl = 0;
      var textControl = "";
      if (type === "button"){
        widthControl = 50;
        heightControl = 10;
        textControl = "Button";
      } else if (type === "label"){
        widthControl = 100;
        heightControl = 30;
        textControl = "Label";
      }else if (type === "textfield"){
        widthControl = 200;
        heightControl = 100;
        textControl = "Textfield";
      }else{
        widthControl = 200;
        heightControl = 100;
      }
      var control = {
        controlType: type,
        posX: 0,
        posY: 0,
        height: heightControl,
        width: widthControl,
        text: textControl,
        fontSize: 12,
        bgColor: "#ffffff",
        borderColor:"#ffffff",
        textColor:"#000000",
        borderThickness: 1,
        borderRadius: 0 
      }
      var controlsArrNew = JSON.parse(JSON.stringify(this.state.controlsArr));
      controlsArrNew.push(control);
      this.setState(state => ({
        ...state,
        controlsArr: controlsArrNew,
        selectedControl: controlsArrNew.length - 1
      }));
      this.madeChange(true);
    }

    repositionControl = (index, x, y) => {
      var controlsArrNew = JSON.parse(JSON.stringify(this.state.controlsArr));
      var control = this.state.controlsArr[index];
      control.posX = x;
      control.posY = y;
      controlsArrNew[index] = control;
      this.setState(state => ({
        ...state,
        controlsArr: controlsArrNew
      }));
      this.madeChange(true);
    }

    resizeControl = (index, width, height) => {
      var controlsArrNew = JSON.parse(JSON.stringify(this.state.controlsArr));
      var control = this.state.controlsArr[index];
      control.width = Number(width.substring(0, width.length - 2));
      control.height = Number(height.substring(0, height.length - 2));
      controlsArrNew[index] = control;
      this.setState(state => ({
        ...state,
        controlsArr: controlsArrNew
      }));
      this.madeChange(true);
    }

    madeChange = (bool) => {
      this.setState(state => ({
        ...state,
        madeChange: bool
      }));
    }

    saveModal = (e) => {
      this.handleSave(e);
      this.props.history.push('/');
    }

    close = () => {
        const { id } = this.props;
        const { props } = this;
        const { firebase, profile } = props;
        const { wireframes } = this.props;

        const temp = wireframes[id];
        wireframes.splice(id, 1);
        wireframes.unshift(temp);
        props.save(profile, wireframes, firebase);
        this.props.history.push('/');
    }

    setTextValue = () => {
      if (this.state.selectedControl === -1 || this.state.controlsArr[this.state.selectedControl].control_type === "container") {
          return ""
      }
      else {
          return this.state.controlsArr[this.state.selectedControl].text;
      }
  }

  changeControlText = (e) => {
    if (this.state.selectedControl !== -1){
        const { target } = e;

        let newControls = this.state.controlsArr;
        newControls[this.state.selectedControl].text = target.value;

        this.setState(state => ({
            ...state,
            controlsArr: newControls,
          }));
    }
  }

  setFontSize = () => {
      if (this.state.selectedControl === -1 || this.state.controlsArr[this.state.selectedControl].controlType === "container") {
          return ""
      }
      else {
          return this.state.controlsArr[this.state.selectedControl].fontSize;
      }
  }

  changeFontSize = (e) => {
    if (this.state.selectedControl !== -1){
        const { target } = e;

        let newControls = this.state.controlsArr;
        newControls[this.state.selectedControl].fontSize = Number(target.value);

        this.setState(state => ({
            ...state,
            controlsArr: newControls,
          }));
    }
  }

  setColor = (color_type) => {
      if (this.state.selectedControl === -1) {
          return "#000";
      }
      else {
          if (color_type === "text" && this.state.controlsArr[this.state.selectedControl].controlType !== "container") {
              return this.state.controlsArr[this.state.selectedControl].textColor;
          }
          else {
              if (color_type === "background") {
                  return this.state.controlsArr[this.state.selectedControl].bgColor;
              }
              else {
                  return this.state.controlsArr[this.state.selectedControl].borderColor;
              }
          }
      }
  }

  changeColor = (color, color_type) => {
    if (this.state.selectedControl !== -1){
        let newControls = this.state.controlsArr;

        if (color_type === "text") {
            newControls[this.state.selectedControl].textColor = color.hex;

            this.setState(state => ({
                ...state,
                controlsArr: newControls,
            }));
        }

        if (color_type === "background") {
            newControls[this.state.selectedControl].bgColor = color.hex;

            this.setState(state => ({
                ...state,
                controlsArr: newControls,
            }));
        }
        
        if (color_type === "border") {
            newControls[this.state.selectedControl].borderColor = color.hex;

            this.setState(state => ({
                ...state,
                controlsArr: newControls,
            }));
        }
      }
  }

  setBorderThickness = () => {
      if (this.state.selectedControl === -1) {
          return ""
      }
      else {
          return this.state.controlsArr[this.state.selectedControl].borderThickness;
      }
  }

  changeBorderThickness = (e) => {
    if (this.state.selectedControl !== -1){
        const { target } = e;

        let newControls = this.state.controlsArr;
        newControls[this.state.selectedControl].borderThickness = Number(target.value);

        this.setState(state => ({
            ...state,
            controlsArr: newControls,
          }));
      }
  }

  setBorderRadius = () => {
      if (this.state.selectedControl === -1) {
          return ""
      }
      else {
          return this.state.controlsArr[this.state.selectedControl].borderRadius;
      }
  }

  changeBorderRadius = (e) => {
    if (this.state.selectedControl !== -1){
        const { target } = e;

        let newControls = this.state.controlsArr;
        newControls[this.state.selectedControl].borderRadius = Number(target.value);

        this.setState(state => ({
            ...state,
            controlsArr: newControls,
          }));
      }
  }

    render() {
        const auth = this.props.auth;
        const close = <button id="close" onClick={this.close}>Close</button>;
        const trigger = <button id="trig">Close</button>;
        const wireframe = this.props.wireframe;
        const height = this.props.wireframe.height;
        const width = this.props.wireframe.width;

        if (!auth.uid) {
            return <Redirect to="/" />;
        }
        return (
            <div className="card z-depth-0 wireframer">
                <div>
                  <label htmlFor="email" className="active">Name:</label>
                  <input type="text" name="name" id="name" onChange={this.handleChange} defaultValue={this.state.name} />
                </div>

                <div className = "wireframeEditor">
                  <div className = "wireframeFinalize">
                    <img className = "zoom" src = {zoomIn} onClick={this.zoomIn}/>
                    <img className = "zoom" src = {zoomOut} onClick={this.zoomOut}/>
                    <button onClick={this.handleSave} disabled={!this.state.madeChange}>Save</button>
                    {
                      this.state.madeChange ? 
                      <Modal header="Unsaved Changes" id = "save_modal_container" trigger={this.state.madeChange ? trigger : null}>
                        You didn't save yet. You tryna save?
                        <button className="btn green lighten-1 z-depth-0" onClick={this.saveModal}>Save Work!</button>
                        <button className="btn pink lighten-1 z-depth-0" onClick={this.close}>Close this, chief.</button>
                      </Modal> : close
                    }

                  </div>

                  <div>
                    <div>Height: <input type="number" id="height" defaultValue={height} onChange={this.handleDimension}></input></div>
                    <div>Width: <input type="number" id="width" defaultValue={width} onChange={this.handleDimension}></input></div>
                    <button id="updateButton" disabled={!this.state.dimensionChange} onClick={this.handleUpdateDimensions}>Update Dimensions</button>

                  </div>

                  <div className="controls_container">
                    <div>
                      <button onClick={() => this.addControl("container")} className = "container_control_button" ><div className = "container_control"></div></button>
                      <div className="center-align">Container </div>
                    </div>
                    <br /><br />

                    <div>
                      <button onClick={() => this.addControl("label")}  className = "label_control_button"><label className="label_control"> Label</label></button>
                      <div className="center-align">Label </div>
                    </div>

                    <div>
                      <button onClick={() => this.addControl("button")}>ADD BUTTON</button>
                      <div className="center-align">Button </div>
                    </div>

                    <div>
                      <button onClick={() => this.addControl("textfield")}> <input type = "text" className="text_control"></input> </button>
                      <div className="center-align">Textfield </div>
                    </div>
                  </div>

                  <div></div>

                </div>

                <Canvas 
                  controlsArr={this.state.controlsArr}
                  selectControl={this.selectControl} 
                  repositionControl={this.repositionControl}
                  resizeControl={this.resizeControl}
                >

                </Canvas>

                <div className = "controls">
                  {/* <div style={{  border: '10px solid transparent', padding: '15px', borderImageSource: {border},
                    borderImageRepeat: 'round',
                    borderImageSlice: '30',
                    borderImageWidth: '10px'}}> Properties: </div> */}
                  <div className = "control-edit-properties">
                    <div>Properties </div><br />
                    <div> Text: <input value={this.setTextValue()} onChange={this.changeControlText} type="text"></input></div><br />
                    <div> Font Size: <input value={this.setFontSize()} onChange={this.changeFontSize} type="number"></input></div><br />
                    <div> Font Color: <HuePicker width = "200px" color={this.setColor("text")} onChange={(color) => this.changeColor(color, "text")} className="color-picker" /></div><br />
                    <div> Background: <HuePicker width = "200px" color={this.setColor("background")} onChange={(color) => this.changeColor(color, "background")} className="color-picker" /></div><br />
                    <div> Border Color: <HuePicker width = "200px" color={this.setColor("border")} onChange={(color) => this.changeColor(color, "border")} className="color-picker" /></div><br />
                    <div> Border Thickness: <input value={this.setBorderThickness()} onChange={this.changeBorderThickness} type="number"></input></div><br />
                    <div> Border Radius: <input value={this.setBorderRadius()} onChange={this.changeBorderRadius} type="number"></input></div>
                  </div>

                </div>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
  const { id } = ownProps.match.params;
  const  wireframes  = state.firebase.profile.wireframes;
  const wireframe = wireframes ? wireframes[id] : null;
  if(wireframe)
    wireframe.id = id;

  return {
    wireframe,
    wireframes,
    id,
    profile: state.firebase.auth,
    auth: state.firebase.auth,
  };
};

const mapDispatchToProps = dispatch => ({
  save: (profile, wireframe, firebase) => dispatch(saveHandler(profile, wireframe, firebase)),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect([
    { collection: 'users' },
  ]),
)(WireframeScreen);