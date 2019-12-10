import React, { Component } from 'react';
import { useDrag } from 'react-dnd';


function ControlComponent() {

    const [{isDragging}, drag] = useDrag({
        item: { type: 'control', controlObj: "<buttton" },
            collect: monitor => ({
                isDragging: !!monitor.isDragging(),
            }),
      })

    return (
        <button ref={drag}>TEEEEEEEEEEEEEST</button>
    );
}

export default ControlComponent;