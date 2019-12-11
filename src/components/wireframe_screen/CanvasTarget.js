import React, { Component } from 'react';
import Control from './Control.js'
import {DropTarget} from 'react-dnd'

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    hovered: monitor.isOver(),
    item: monitor.getItem(),
  }
}

class CanvasTarget extends Component {
    state = {
      controlsArr: this.props.controlsArr,
    }
    render() {
        const {connectDropTarget, hovered, item} = this.props;
        const backgroundColor = hovered ? 'green' : 'white';
        console.log("CANVAS TARGET RENDERED");

        return connectDropTarget(
          <div className = "wireframeCanvas" style={{background: backgroundColor}}>
            {this.props.controlsArr.map((control, index) => (
                <Control 
                  index = {index} 
                  control = {control} 
                  handleDrop={this.props.handleDrop}/>
              ))}
          </div>
        );
    }
}

export default DropTarget('item', {}, collect)(CanvasTarget);