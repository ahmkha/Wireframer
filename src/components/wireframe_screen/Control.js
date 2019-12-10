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
        const auth = this.props.auth;
        const wireframe = this.props.wireframe;
        const { isDragging, connectDragSource, control} = this.props;
        const divStyle = {
          opacity: isDragging ? 0 : 1,
        };
        
        return connectDragSource(
          <button style = {divStyle}> TEEEEEEEEEEEEEST</button>
        )
    }
}



export default DragSource('item', spec, collect)(Control);