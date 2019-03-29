import React from 'react';
import '../css/Button.css';

const clickFunction = window.PointerEvent ? 'onPointerDown' : window.TouchEvent ? 'onTouchStart' : 'onClick';

function Name(props) {
  // console.info('Name', props.nameData.fullName, props.nameEditing, props)
  return (    
    <div key={props.nameData.fullName} onClick={(event) => props.onClickName(event, props.nameData)} className={`${props.className}${props.nameData.fullName === props.nameEditing ? ' highlighted' : ''}`}>{props.nameData.fullName}</div>
  );
}

// const isEqual = (prevProps, nextProps) => {
//   return prevProps.selected == nextProps.selected && prevProps.disabled == nextProps.disabled;
// }
export default Name;