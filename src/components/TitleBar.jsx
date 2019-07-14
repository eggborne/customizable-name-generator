import React from 'react';
import LoginStatusIndicator from './LoginStatusIndicator'
import '../css/TitleBar.css';

function TitleBar(props) {
  // console.error('rendering TitleBar!', props)
  return (    
    <div id="title-footer">
      <div id='title-area'>
        <LoginStatusIndicator {...props} />
        {/* <div id='title-text' className={props.userLoggedIn ? 'logged-in' : undefined}>{props.userLoggedIn ? props.titleText : 'not logged in'}</div> */}
        <div id='tally-text'>{props.statusText}</div>
      </div>
      <a href='mailto:mike@mikedonovan.dev'><i id='mail-icon' className='material-icons'>mail</i></a>
      <a href='https://github.com/eggborne/customizable-name-generator'><img id='github-icon' src={`https://eggborne.com/namegenerator/githubicon.png`} alt='View on GitHub'></img></a>
    </div>
  );
}

export default TitleBar;