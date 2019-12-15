import React, { Component } from 'react';
import {Rnd} from 'react-rnd';

class Control extends Component {
    render() {
      console.log(this.props.control);
      if(this.props.control.controlType === "button"){
        return (
          <Rnd
            size={{ width: this.props.control.width,  height: this.props.control.height }}
            position={{ x: this.props.control.posX, y: this.props.control.posY }}
            bounds="parent"
            minWidth={75}
            minHeight={38}
            style={{ borderStyle: 'solid', borderColor: 'black' }}
            className = {this.props.control.className}
            onClick={(e) => this.props.selectControl(e, this.props.index)}
            onDragStop={(e, d) => this.props.repositionControl(this.props.index, d.x, d.y)}
            onResizeStop={(e, direction, ref, delta, position) => this.props.resizeControl(this.props.index, ref.style.width, ref.style.height)}
          >
            <button style={{ width: '100%', height: '100%'}}>{this.props.control.text}</button>
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
            style={{ borderStyle: 'solid', borderColor: 'black'}}
            className = {this.props.control.className}
            onClick={(e) => this.props.selectControl(e, this.props.index)}
            onDragStop={(e, d) => this.props.repositionControl(this.props.index, d.x, d.y)}
            onResizeStop={(e, direction, ref, delta, position) => this.props.resizeControl(this.props.index, ref.style.width, ref.style.height)}
          >
            <input type = "text" style={{ width: '100%', height: '100%'}} value={this.props.control.text}></input>
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
            style={{ borderStyle: 'solid', borderColor: 'black' }}
            className = {this.props.control.className}
            onClick={(e) => this.props.selectControl(e, this.props.index)}
            onDragStop={(e, d) => this.props.repositionControl(this.props.index, d.x, d.y)}
            onResizeStop={(e, direction, ref, delta, position) => this.props.resizeControl(this.props.index, ref.style.width, ref.style.height)}
          >
            <label style={{ width: '100%', height: '100%'}}>{this.props.control.text}</label>
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
              <div className = "container_wireframe" style={{ width: '100%', height: '100%'}}></div>
            </Rnd>
          )
      }
    }
}



export default (Control);