import React from 'react';
import '../css/NameDisplay.css';
import { swapSpeed } from '../App';
import LoadingBar from './LoadingBar';

const clickFunction = window.PointerEvent ? 'onPointerDown' : window.TouchEvent ? 'onTouchStart' : 'onMouseDown';
let pressedAt = 0;
let fingerDown = false;
const hideName = () => {
  if (!document.getElementById('main-button').classList.contains('unavailable')) {
    pressedAt = window.performance.now();
    document.getElementById('name-display').style.background = 'transparent';
    fingerDown = true;
    document.getElementById('name-display').classList.add('not-showing');
    setTimeout(() => {
      if (!fingerDown) {
        document.getElementById('name-display').classList.remove('not-showing');
      }
    }, swapSpeed * 2);
  }
  pressedAt = window.performance.now();
  fingerDown = true;
  // document.getElementById('name-display').classList.add('hiding');

  setTimeout(() => {
    if (!fingerDown) {
      // document.getElementById('name-display').classList.remove('hiding');
      document.getElementById('name-display').classList.remove('not-showing');
    }
  }, swapSpeed * 2);
};
const showName = () => {
  fingerDown = false;
  if (window.performance.now() - pressedAt > swapSpeed * 2) {
    document.getElementById('name-display').classList.remove('not-showing');
  }
  // setTimeout(() => {
  //   document.getElementById('name-display').classList.add('bounced');
  //   setTimeout(() => {
  //     document.getElementById('name-display').classList.remove('bounced');
  //   }, 40)
  // }, 60);
};

function NameDisplay(props) {
  // console.error('NameDisplay rendering!!', window.location.pathname, props);
  let displayName;
  let nameFontStyle = { fontSize: 'var(--name-font-size)' };
  let className = props.bulkMode ? 'quick' : undefined;
  if (props.nameData) {
    displayName = props.nameData.fullName;
    if (props.nameData.invalid) {
      className = 'purple-text';
    }
    if (props.nameData.banned) {
      className = 'green-text';
    }
    if (window.location.pathname !== '/namegenerator/') {
      className = 'not-showing';
    } else if (props.dataReady) {
      if (document.getElementById('name-display') && document.getElementById('name-display').classList.contains('obscured')) {
        document.getElementById('name-display').classList.remove('obscured');
      }          
    }
    if (window.innerWidth < window.innerHeight) {
      if (displayName.length > 12) {
        nameFontStyle.fontSize = window.innerWidth / 11;
        if (displayName.length > 16) {
          nameFontStyle.fontSize = `${window.innerWidth / 13}px`;
        }
      }
      if (displayName.length < 8) {
        nameFontStyle.fontSize = `${window.innerWidth / 9}px`;
      }
    }
  } else {
    // className = 'not-showing';
    console.error('------------------------- no nameData');
  }
  // className += ' obscured';
  return (
    <div id='name-area'>
      {/* <div style={nameFontStyle} onClick={(event) => props.onClickName(event, props.nameData)} id="name-display" className={className}>{displayName}</div> */}
      <div id='name-display'
        style={nameFontStyle}
        {...{
          [clickFunction]: event => {
            props.onClickName(event, props.nameData);
          }
        }}
        className={className + ' obscured'}>
        <div id='name-text'>{displayName}</div>
        {!props.nameData && !props.dataReady &&
          <LoadingBar progress={props.progress} />
        }
      </div>      
      <div id='name-stats' className='hidden' />
    </div>
  );
}

const isEqual = (prevProps, nextProps) => {
  let generating = false;
  if (nextProps.location.location.pathname == '/') {
    if (!prevProps.fingerDown && nextProps.fingerDown) {
      if (nextProps.fingerDown.target.id === 'main-button') {
        hideName();
        generating = true;
      }
    }
    if (prevProps.fingerDown && !nextProps.fingerDown) {
      if (prevProps.fingerDown.target.id === 'main-button') {
        showName();
        generating = true;
      }
    }
  }
  let equalTest = (!generating && prevProps.nameData && nextProps.nameData && prevProps.nameData.fullName == nextProps.nameData.fullName) || nextProps.location.location.pathname != '/';
  return equalTest;
};
export default React.memo(NameDisplay, isEqual);
