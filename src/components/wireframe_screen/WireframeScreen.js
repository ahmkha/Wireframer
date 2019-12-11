import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import zoomIn from '../../images/3-512.png';
import zoomOut from '../../images/4-512.png';
import Canvas from './Canvas.js';

class WireframeScreen extends Component {
    state = {
      controlsArr: [],
      height: '',
      width: '',
      name: '',
      selectedControl: -1,
    }

    componentDidMount() {
      document.addEventListener('keydown', this.keysHandler.bind(this));
    }

    keysHandler(event) {
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

        this.setState(state => ({
            ...state,
            [target.id]: target.value,
        }));
    }

    copyControl = (index) => {
      if(this.state.selectedControl != -1){
        var controlDupe = this.state.controlsArr[index];
        controlDupe.posX -= 100;
        controlDupe.posY -= 100;
        var controlArrNew = this.state.controlsArr;
        controlArrNew.push(controlDupe);
        this.setState(state => ({
          controlsArr: controlArrNew
        }));
      }
    }

    deleteControl = (index) => {
      if(this.state.selectedControl != -1){
        var controlArrNew = this.state.controlsArr;
        controlArrNew.splice(index, 1);
        this.setState(state => ({
          controlsArr: controlArrNew,
          selectedControl: -1
        }));
      }
    }

    selectControl = (event, index) => {
      event.stopPropagation();
      this.setState(state => ({
        selectedControl: index
    }));
    }
    
    addControl = (type) => {
      var control = {
        controlType: type,
        posX: 0,
        posY: 0,
        height: 100,
        width: 100,
        text: "Stinky",
        fontSize: 15,
        bgColor: "#ffffff",
        borderColor:"#ffffff",
        textColor:"#ffffff",
        borderThickness: 15,
        borderRadius: 15 
      }
      var controlsArrNew = this.state.controlsArr;
      controlsArrNew.push(control);
      this.setState(state => ({
        controlsArr: controlsArrNew
      }));
    }

    render() {
        const auth = this.props.auth;
        if (!auth.uid) {
            return <Redirect to="/" />;
        }

        return (
            <div className="card z-depth-0 wireframer">
                <div className = "wireframeEditor">

                  <div className = "wireframeFinalize">
                    <img className = "zoom" src = {zoomIn}/>
                    <img className = "zoom" src = {zoomOut} />
                    <button>Save</button>
                    <button>Close</button>
                  </div>

                  <div>
                    <div>Height: <input type="number"></input></div>
                    <div>Width: <input type="number"></input></div>
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

                <Canvas controlsArr={this.state.controlsArr} selectControl={this.selectControl}></Canvas>

                <div className = "controls">
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
    auth: state.firebase.auth,
  };
};

export default compose(
  connect(mapStateToProps),
  firestoreConnect([
    { collection: 'users' },
  ]),
)(WireframeScreen);