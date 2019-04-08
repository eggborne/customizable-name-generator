import React from 'react';
// eslint-disable-next-line
import '../css/Button.css';
import '../css/AddStringScreen.css';

function AddStringScreen(props) {
  // console.error('rendering AddStringScreen!!', props.location.location.pathname);
  let shadeClass;
  let windowClass;
  if (props.location) {
    shadeClass = props.location.location.pathname === '/addrule' ? 'shade showing' : 'shade';
    windowClass = props.location.location.pathname === '/addrule' ? 'floating-window' : 'floating-window hidden';
  } else {    
    shadeClass = 'shade';
    windowClass = 'floating-window-hidden';
  }
  return (
    <div className={shadeClass} id='add-string-shade'>
      <div className={windowClass} id='add-string-screen'>
        {props.render}
      </div>
    </div>
  );
}

const isEqual = (prevProps, nextProps) => {
  return (
    prevProps.feedbackTypesSelected.length == nextProps.feedbackTypesSelected.length && prevProps.feedbackTypesDiscovered.length == nextProps.feedbackTypesDiscovered.length
    && 
    ((prevProps.location.location.pathname === '/addrule' && nextProps.location.location.pathname === '/addrule')
      || (prevProps.location.location.pathname !== '/addrule' && nextProps.location.location.pathname !== '/addrule'))
  );
}

export default React.memo(AddStringScreen, isEqual);