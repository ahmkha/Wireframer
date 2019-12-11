import React, { Component } from 'react';
import {Rnd} from 'react-rnd';

class Control extends Component {
    state = {
        controlType: this.props.control.controlType,
        posX: this.props.control.posX,
        posY: this.props.control.posY,
        height: this.props.control.height,
        width: this.props.control.width,
        text: this.props.control.text,
        fontSize: this.props.control.fontSize,
        bgColor: this.props.control.bgColor,
        borderColor: this.props.control.borderColor,
        textColor: this.props.control.textColor,
        borderThickness: this.props.control.borderThickness,
        borderRadius: this.props.control.borderRadius,
        index: this.props.index
    }

    render() {
      if(this.props.control.controlType === "button"){
        return (
          <Rnd
            default={{
              x: 0,
              y: 0,
              width: 50,
              height: 10,
            }}
            bounds="parent"
            minWidth={105}
            minHeight={28}
            style={{ borderStyle: 'solid', borderColor: 'black' }}
            onClick={(e) => this.props.selectControl(e, this.state.index)}
          >
            <button style={{ width: '100%', height: '100%'}}>TEEEESSSST
            </button>
          </Rnd>
        )
      }else if(this.props.control.controlType === "textfield"){
        return (
          <Rnd
            default={{
              x: 0,
              y: 0,
              width: 200,
              height: 100,
            }}
            bounds="parent"
            minWidth={200}
            minHeight={100}
            style={{ borderStyle: 'solid', borderColor: 'black' }}
            onClick={(e) => this.props.selectControl(e, this.state.index)}
          >
            <input type = "text" style={{ width: '100%', height: '100%'}}></input>
          </Rnd>
        )
      }else if(this.props.control.controlType === "label"){
        return (
          <Rnd
            default={{
              x: 0,
              y: 0,
              width: 100,
              height: 30,
            }}
            bounds="parent"
            minWidth={100}
            minHeight={30}
            style={{ borderStyle: 'solid', borderColor: 'black' }}
            onClick={(e) => this.props.selectControl(e, this.state.index)}
          >
            <label style={{ width: '100%', height: '100%'}}>Label</label>
          </Rnd>
        )
      }else{
        return (
            <Rnd
              default={{
                x: 0,
                y: 0,
                width: 200,
                height: 100,
              }}
              bounds="parent"
              minWidth={200}
              minHeight={100}
              style={{ borderStyle: 'solid', borderColor: 'black' }}
              onClick={(event) => this.props.selectControl(event, this.state.index)}
            >
              <div className = "container_wireframe" style={{ width: '100%', height: '100%'}}></div>
            </Rnd>
          )
      }
    }
}



export default (Control);