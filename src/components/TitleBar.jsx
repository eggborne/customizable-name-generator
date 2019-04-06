import React from 'react';
import '../css/TitleBar.css';

function TitleBar(props) {
  return (    
    <div id="title-footer">
      <div id='title-area'>
        <div id='title-text' className={props.userLoggedIn ? 'logged-in' : undefined}>{props.titleText}</div>
        <div id='tally-text'>{props.statusText}</div>
      </div>
      <i id='mail-icon' className='material-icons'>mail</i>
      <img id='github-icon' src={`https://eggborne.com/namegenerator/githubicon.png`} alt='View on GitHub'></img>
    </div>
  );
}

export default TitleBar;