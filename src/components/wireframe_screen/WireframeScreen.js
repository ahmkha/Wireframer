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
import { getFirestore } from 'redux-firestore';

class WireframeScreen extends Component {
    state = {
      controlsArr:  this.props.wireframe  ? [] : JSON.parse(JSON.stringify(this.props.wireframe.controls)),
      height: this.props.wireframe  ? 100: this.props.wireframe.height,
      width: this.props.wireframe  ? 100 : this.props.wireframe.width,
      name: this.props.wireframe  ? '' : this.props.wireframe.name,
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
      const { id } = this.props;
      if(id != 0) {
        const fireStore = getFirestore();
        const ref = fireStore.collection('users').doc(this.props.auth.uid);
        ref.get().then(function(doc) {
            if (doc.exists) {
                var wireframes = doc.data().wireframes;
                const temp = wireframes[id];
                wireframes.splice(id, 1);
                wireframes.unshift(temp);
                fireStore.collection('users').doc(doc.id).update({
                    wireframes: wireframes
                }).then(() => {
                    console.log("Added a new wireframe");
                }).catch((err) => {
                    console.log(err);
                });
            } else {
                console.log("No such document!");
            }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });
      }
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

      wireframes[props.wireframe.id].name = this.state.name;
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


    render() {
        const auth = this.props.auth;
        const close = <button id="close" onClick={this.close}>Close</button>;
        const trigger = <button id="trig">Close</button>;

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
                    <img className = "zoom" src = {zoomIn}/>
                    <img className = "zoom" src = {zoomOut} />
                    <button onClick={this.handleSave} disabled={!this.state.madeChange}>Save</button>
                    {
                      this.state.madeChange ? 
                      <Modal header="Unsaved Changes" trigger={this.state.madeChange ? trigger : null}>
                        You didn't save yet. You tryna save?
                        <button className="btn green lighten-1 z-depth-0" onClick={this.saveModal}>Save Work!</button>
                        <button className="btn pink lighten-1 z-depth-0" onClick={this.close}>Close this, chief.</button>
                      </Modal> : close
                    }

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