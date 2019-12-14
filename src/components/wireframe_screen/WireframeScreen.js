import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import zoomIn from '../../images/3-512.png';
import zoomOut from '../../images/4-512.png';
import Canvas from './Canvas.js';
import { saveHandler } from '../../store/database/asynchHandler';

class WireframeScreen extends Component {
    state = {
      controlsArr:  JSON.parse(JSON.stringify(this.props.wireframe.controls)),
      height: '',
      width: '',
      name: '',
      selectedControl: -1,
      madeChange: false
    }

    handleSave = (e) => {
      e.preventDefault();

      const { props } = this;
      const { firebase, profile } = props;
      const { wireframes } = this.props;
      wireframes[props.wireframe.id].controls = this.state.controlsArr;
      props.save(profile, wireframes, firebase);
      this.madeChange(false);
    }

    componentDidMount() {
      document.addEventListener('keydown', this.keysHandler);
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
        this.setState(state => ({
          ...state,
          controlsArr: controlArrNew
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
        controlsArr: controlsArrNew
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
      console.log("----------?--------");
      var controlsArrNew = JSON.parse(JSON.stringify(this.state.controlsArr));
      var control = this.state.controlsArr[index];
      control.width = width;
      control.height = height;
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

    handleClose = () => {
      if(this.state.madeChange){

      }else{
        this.props.history.push('/');
      }
    }

    render() {
        const auth = this.props.auth;
        if (!auth.uid) {
            return <Redirect to="/" />;
        }
        return (
            <div className="card z-depth-0 wireframer">
                {/* <Modal header="Modal Header" trigger={trigger}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </Modal> */}
                <div className = "wireframeEditor">
                  <div className = "wireframeFinalize">
                    <img className = "zoom" src = {zoomIn}/>
                    <img className = "zoom" src = {zoomOut} />
                    <button onClick={this.handleSave} disabled={!this.state.madeChange}>Save</button>
                    <button>Close</button>
                  </div>

                  <div>
                    <div>Height: <input type="number" id="height"></input></div>
                    <div>Width: <input type="number" id="width"></input></div>
                  </div>

                  <div>
                    <button onClick={() => this.addControl("container")}><div className = "container_wireframe"></div></button>
                    <div>Container </div>
                  </div>

                  <div>
                    <button onClick={() => this.addControl("label")}><label>Label</label></button>
                    <div>Label </div>
                  </div>

                  <div>
                    <button onClick={() => this.addControl("button")}>ADD BUTTON</button>
                    <div>Button </div>
                  </div>

                  <div>
                    <button onClick={() => this.addControl("textfield")}> <input type = "text"></input> </button>
                    <div>Textfield </div>
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
                  <div> Properties: </div>
                  <div> Font Size: <input type="number"></input></div>
                  <div> Font Color: <input type="color"></input></div>
                  <div> Background Color: <input type="color"></input></div>
                  <div> Border Color: <input type="color"></input></div>
                  <div> Border Thickness: <input type="number"></input></div>
                  <div> Border Radius: <input type="number"></input></div>
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