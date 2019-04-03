import React from 'react';
import '../css/Button.css';
import { swapSpeed } from '../App';

const clickListeners = {
  onPointerDown: {
    lowerCase: {
      down: 'pointerdown',
      up: 'pointerup'
    },
    camelCase: {
      down: 'onPointerDown',
      up: 'onPointerUp'
    }
  },
  onTouchStart: {
    lowerCase: {
      down: 'touchstart',
      up: 'touchend'
    },
    camelCase: {
      down: 'onTouchStart',
      up: 'onTouchEnd'
    }
  },
  onMouseDown: {
    lowerCase: {
      down: 'mousedown',
      up: 'mouseup'
    },
    camelCase: {
      down: 'onMouseDown',
      up: 'onMouseUp'
    }
  },
}
const clickFunction = window.PointerEvent ? 'onPointerDown' : window.TouchEvent ? 'onTouchStart' : 'onMouseDown';
console.log(clickFunction)
const clickListener = clickListeners[clickFunction];
let bounceTimeout;
let fingerDownAt = 0;
let fingerDown = false;
const pressButton = (event) => {
  let timeSince = Date.now() - fingerDownAt;
  let buttonEl = event.target;
  console.log('down',event.pointerId)
  if (timeSince > swapSpeed * 2) {
    fingerDown = true;
    fingerDownAt = Date.now();
    let buttonId = event.target.id;
    // buttonEl.style.transform = 'perspective(12%)';
    buttonEl.classList.add('pressed');
    bounceTimeout = setTimeout(() => {
      let pressed = buttonEl.classList.contains('pressed');
      if (pressed && !fingerDown) {
        buttonEl.classList.remove('pressed');
      }
    }, swapSpeed * 2);
  }
}
const releaseButton = (event) => {
  fingerDown = false;
  let timeSince = Date.now() - fingerDownAt;
  let buttonEl = event.target;
  console.log('up',event.pointerId)
  if (timeSince > swapSpeed * 2) {
    console.error('up', timeSince, swapSpeed * 2)
    buttonEl.classList.remove('pressed');
  }
}

function Button(props) {
  if (props.className !== 'mode-toggle-button' && props.className !== 'feedback-select-toggle' && props.className !== 'style-toggle-button' && props.className !== 'ruleset-listing') {    
    requestAnimationFrame(() => {
      let but = document.getElementById(`${props.type}-button`);
      if (but) {        
        but.addEventListener(clickListener.lowerCase.down, pressButton);        
        but.addEventListener(clickListener.lowerCase.up, releaseButton);
      }
    });
  }
  let className = props.className || '';
  let click = clickListener.camelCase.down;
  if (props.type === 'choose-ruleset' || className.includes('nav-link')) {
  // if (props.type === 'choose-ruleset' || props.type === 'main' || className.includes('nav-link')) {
    click = 'onClick';
  }
  if (props.unavailable) {
    className += ' not-ready';
  }
  return (    
    <button
      disabled={props.disabled}
      id={`${props.type}-button`}
      {...{ [click]: (event) => { props.onClick(event, props.type) } }}
      className={className + (props.selected ? ' selected' : '') + (props.discovered ? ' discovered' : '')}>
      {props.label}
    </button>
  );
}
const isEqual = (prevProps, nextProps) => {
  return prevProps.selected == nextProps.selected && prevProps.label == nextProps.label && prevProps.disabled == nextProps.disabled && prevProps.discovered == nextProps.discovered && prevProps.unavailable == nextProps.unavailable;
}
export default React.memo(Button, isEqual);