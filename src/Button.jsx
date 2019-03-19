import React from 'react';
import './Button.css';

function Button(props) {  
  let selected = props.selected ? ' selected' : '';
  return (    
    <button
      id={`${props.type}-button`}
      onClick={props.onClick}
      className={props.className + selected}>
      {props.label}&nbsp;
    </button>
  );
}

export default Button;