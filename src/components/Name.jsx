import React from 'react';
import '../css/Button.css';

const clickFunction = window.PointerEvent ? 'onPointerDown' : window.TouchEvent ? 'onTouchStart' : 'onClick';

function Name(props) {
  return (    
    <div key={props.nameData.fullName} onPointerDown={() => props.onClickName(props.nameData)} className={props.className}>{props.nameData.fullName}</div>
  );
}
// const isEqual = (prevProps, nextProps) => {
//   return prevProps.selected == nextProps.selected && prevProps.disabled == nextProps.disabled;
// }
export default Name;