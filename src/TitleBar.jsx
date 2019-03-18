import React from 'react';
import './TitleBar.css';

function TitleBar(props) {
  return (    
    <div id="title-footer">
      <div id='title-area'>
        <div id='title-text'>{props.titleText}</div>
        <div id='tally-text'>total names generated:</div>
      </div>
      <i id='mail-icon' className='material-icons'>mail</i>
      <img id='github-icon' src='githubicon.png' alt='View on GitHub'></img>
    </div>
  );
}

export default TitleBar;