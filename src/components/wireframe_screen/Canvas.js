import React, { Component } from 'react';
import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';
import CanvasTarget from './CanvasTarget.js'

class Canvas extends Component {
    state = {
      controlsArr: this.props.controlsArr,
      height: '',
      width: '',
      name: ''
    }

    handleDrop = () => {
      var controlsArrNew = this.state.controlsArr;
      controlsArrNew.push({item: "2"});
      this.setState(state => ({
        controlsArr: controlsArrNew,
      }));
    }

    render() {
        const {connectDropTarget, hovered, item} = this.props;
        console.log("CANVAS RENDERED");
        return (
          <DndProvider backend={Backend}>            
            <CanvasTarget controlsArr={this.state.controlsArr} handleDrop={this.handleDrop}>
            </CanvasTarget>
          </DndProvider>
        );
    }
}


export default (Canvas);