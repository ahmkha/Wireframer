import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';
import Control from './Control.js'
import CanvasTarget from './CanvasTarget.js'
import {DropTarget} from 'react-dnd'

class Canvas extends Component {
    state = {
      controlsArr: [{item: "1"}],
      height: '',
      width: '',
      name: ''
    }

    handleDrop = () => {
      console.log("-----------WORKS?----------------");
      var controlsArrNew = this.state.controlsArr;
      controlsArrNew.push({item: "2"});
      this.setState(state => ({
        controlsArr: controlsArrNew,
      }));
    }

    render() {
        const auth = this.props.auth;
        const wireframe = this.props.wireframe;
        const {connectDropTarget, hovered, item} = this.props;

        return (
          <DndProvider backend={Backend}>            
            <CanvasTarget controlsArr={this.state.controlsArr} handleDrop={this.handleDrop}>
            </CanvasTarget>
          </DndProvider>
        );
    }
}


export default (Canvas);