import React from 'react';
import '../css/LoadingBar.css';

function LoadingBar(props) {
  console.error('LoadingBar rendering!', props.progress)
  
  return (    
    <div id='loading-area'>
      <div className='loading-segment'></div>
      <div className='loading-segment'></div>
      <div className='loading-segment'></div>
    </div>
  );
}

const isEqual = (prevProps, nextProps) => {  
  let equalTest = (
    true === true
  );
  return equalTest;
}
export default LoadingBar;