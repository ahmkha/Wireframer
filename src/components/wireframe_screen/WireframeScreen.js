import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import zoomIn from '../../images/3-512.png';
import zoomOut from '../../images/4-512.png';
import Canvas from './Canvas.js';
import { DndProvider } from 'react-dnd'
import Backend from 'react-dnd-html5-backend'

class WireframeScreen extends Component {
    state = {
      controlsArr: [{
        controlType: "butt",
        item: "button",
        text: "button"
      }],
      height: '',
      width: '',
      name: ''
    }

    handleChange = (e) => {
        const { target } = e;

        this.setState(state => ({
            ...state,
            [target.id]: target.value,
        }));
    }
    
    addControl = (type) => {
      console.log("-------REACHED?-------------");
      var control = {
        controlType: type,
        item: type,
        text: "button"
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
          <DndProvider backend={Backend}>
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
                    <button><div className = "container_wireframe"></div></button>
                    <div>Container </div>
                  </div>

                  <div>
                    <button><label>Label</label></button>
                    <div>Label </div>
                  </div>

                  <div>
                    <button onClick={() => this.addControl("button")}>ADD BUTTON</button>
                    <div>Button </div>
                  </div>

                  <div>
                    <button> <input type = "text"></input> </button>
                    <div>Textfield </div>
                  </div>

                  <div></div>

                </div>

                <Canvas controlsArr={this.state.controlsArr}></Canvas>

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
            </DndProvider>
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