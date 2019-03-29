import React from 'react';
import '../css/TitleBar.css';

function TitleBar(props) {
  // let percentUnique = Math.round((props.uniqueGenerated / props.totalCalls) * 100);
  return (    
    <div id="title-footer">
      <div id='title-area'>
        <div id='title-text'>{props.titleText}</div>
        {/* <div id='tally-text'>total names generated: {props.totalCalls} ({percentUnique}% unique)</div> */}
        <div id='tally-text'>{props.statusText}</div>
      </div>
      <i id='mail-icon' className='material-icons'>mail</i>
      <img id='github-icon' src={`https://eggborne.com/namegenerator/githubicon.png`} alt='View on GitHub'></img>
    </div>
  );
}

export default TitleBar;