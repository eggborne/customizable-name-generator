import React from 'react';
import './NameDisplay.css';

function NameDisplay(props) {
  return (    
    <div id='name-area'>
      <div id="name-display"></div>
      <div id="name-stats" className='hidden'></div>
    </div>
  );
}

export default NameDisplay;