import React from 'react';
import '../css/Button.css';

const clickFunction = window.PointerEvent ? 'onPointerDown' : window.TouchEvent ? 'onTouchStart' : 'onClick';

function Button(props) {
  // console.warn(`Rendering ${props.type}-button`);
  let className = props.className || '';
  let click = clickFunction;
  if (props.type === 'choose-ruleset') {
    click = 'onClick';
  }
  return (    
    <button
      disabled={props.disabled}
      id={`${props.type}-button`}
      {...{ [click]: (event) => props.onClick(event, props.type) }}
      // onClick={(event) => props.onClick(event, props.type) }
      className={className + (props.selected ? ' selected' : '')}>
      {props.label}
    </button>
  );
}
const isEqual = (prevProps, nextProps) => {
  return prevProps.selected == nextProps.selected && prevProps.disabled == nextProps.disabled;
}
export default React.memo(Button, isEqual);