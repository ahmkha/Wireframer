import React, { Component } from 'react';
import {Rnd} from 'react-rnd';

class Control extends Component {
    render() {
      let styleObject = {
        width: '100%',
        height: '100%',
        fontSize: this.props.control.fontSize,
        color: this.props.control.textColor,
        backgroundColor: this.props.control.bgColor,
        border: String(this.props.control.borderThickness) + 'px solid',
        borderColor: this.props.control.borderColor,
        borderRadius: this.props.control.borderRadius,
        display: 'inline-block',
    }

      console.log(this.props.control);
      if(this.props.control.controlType === "button"){
        return (
          <Rnd
            size={{ width: this.props.control.width,  height: this.props.control.height }}
            position={{ x: this.props.control.posX, y: this.props.control.posY }}
            bounds="parent"
            minWidth={75}
            minHeight={38}
            className = {this.props.control.className}
            onClick={(e) => this.props.selectControl(e, this.props.index)}
            onDragStop={(e, d) => this.props.repositionControl(this.props.index, d.x, d.y)}
            onResizeStop={(e, direction, ref, delta, position) => this.props.resizeControl(this.props.index, ref.style.width, ref.style.height)}
          >
            <button style={styleObject}>{this.props.control.text}</button>
          </Rnd>
        )
      }else if(this.props.control.controlType === "textfield"){
        return (
          <Rnd
            size={{ width: this.props.control.width,  height: this.props.control.height }}
            position={{ x: this.props.control.posX, y: this.props.control.posY }}
            bounds="parent"
            minWidth={50}
            minHeight={50}
            className = {this.props.control.className}
            onClick={(e) => this.props.selectControl(e, this.props.index)}
            onDragStop={(e, d) => this.props.repositionControl(this.props.index, d.x, d.y)}
            onResizeStop={(e, direction, ref, delta, position) => this.props.resizeControl(this.props.index, ref.style.width, ref.style.height)}
          >
            <input type = "text" style={styleObject} defaultValue={this.props.control.text} ></input>
          </Rnd>
        )
      }else if(this.props.control.controlType === "label"){
        return (
          <Rnd
            size={{ width: this.props.control.width,  height: this.props.control.height }}
            position={{ x: this.props.control.posX, y: this.props.control.posY }}
            bounds="parent"
            minWidth={50}
            minHeight={25}
            className = {this.props.control.className}
            onClick={(e) => this.props.selectControl(e, this.props.index)}
            onDragStop={(e, d) => this.props.repositionControl(this.props.index, d.x, d.y)}
            onResizeStop={(e, direction, ref, delta, position) => this.props.resizeControl(this.props.index, ref.style.width, ref.style.height)}
          >
            <label style={styleObject}>{this.props.control.text}</label>
          </Rnd>
        )
      }else{
        return (
            <Rnd
              size={{ width: this.props.control.width,  height: this.props.control.height }}
              position={{ x: this.props.control.posX, y: this.props.control.posY }}
              bounds="parent"
              minWidth={50}
              minHeight={50}
              style={{ borderStyle: 'solid', borderColor: 'black' }}
              className = {this.props.control.className}
              onClick={(event) => this.props.selectControl(event, this.props.index)}
              onDragStop={(e, d) => this.props.repositionControl(this.props.index, d.x, d.y)}
              onResizeStop={(e, direction, ref, delta, position) => this.props.resizeControl(this.props.index, ref.style.width, ref.style.height)}
            >
              <div className = "container_wireframe" style={styleObject}></div>
            </Rnd>
          )
      }
    }
}



export default (Control);