import React, { Component } from 'react';
import {DragSource} from 'react-dnd'

const spec = {
  beginDrag(props) {
    return props.control;
  },
  endDrag(props, monitor, component) {
    if(!monitor.didDrop()){
      return;
    }
    return props.handleDrop();
  }
}

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging(),
  }
}


class Control extends Component {
    state = {
        controlType: '',
        posX: '',
        posY: '',
        height: '',
        width: '',
        text: '',
        fontSize: '',
        bgColor: '',
        borderColor: '',
        textColor: '',
        borderThickness: '',
        borderRadius: ''
    }

    render() {
        const { isDragging, connectDragSource, control} = this.props;
        const divStyle = {
          opacity: isDragging ? 0 : 1,
        };
        console.log("button rendered");
        if(this.props.control.controlType === "button"){
          return connectDragSource(
            <button style = {divStyle}> {this.props.control.text}</button>
          )
        }else{
          return connectDragSource(
            <button style = {divStyle}> TEEEEEEEEEEEEEST</button>
          )
        }
    }
}



export default DragSource('item', spec, collect)(Control);