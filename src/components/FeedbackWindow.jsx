

import React from 'react';
 // eslint-disable-next-line
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Button from './Button';
import '../css/Button.css';
import '../css/FeedbackWindow.css';

function FeedbackWindow(props) {
  console.error('rendering FeedbackWindow!!');

  return (
    <div className={props.showing ? undefined : 'hidden'} id='feedback-panel'>
      <div id='feedback-title'>{props.nameData.fullName}</div>
      <input id='invalid-string-input' placeholder='Enter letters' type='text' name='invalid-string' />
      <div id='feedback-selected-display'>{props.nameData.fullName}</div>
      
      <div id='feedback-button-area'>
        <Button onClick={props.onClickFeedback} label={'Should never begin a word'} type='start-word' className='feedback-select-toggle' selected={false} />
        <Button onClick={props.onClickFeedback} label={'Should never end a word'} type='end-word' className='feedback-select-toggle' selected={false} />
        <Button onClick={props.onClickFeedback} label={'Should never be in the middle of a word'} type='mid-word' className='feedback-select-toggle' selected={false} />
        <Button onClick={props.onClickFeedback} label={'Should never appear by itself'} type='lone-word' className='feedback-select-toggle' selected={true} />
        <Button onClick={props.onClickFeedback} label={'Should never appear at all'} type='universal-word' className='feedback-select-toggle' selected={false} />
        {/* <div onClick='selectFeedback(event, "start")' id='start-word-button' class='feedback-select-toggle disabled'>Should never begin a word</div>
        <div onClick='selectFeedback(event, "end")' id='end-word-button' class='feedback-select-toggle disabled'>Should never end a word</div>
        <div onClick='selectFeedback(event, "mid")' id='mid-word-button' class='feedback-select-toggle disabled'>Should never be in the middle of a word</div>
        <div onClick='selectFeedback(event, "lone")' id='lone-word-button' class='feedback-select-toggle disabled'>Should never appear by itself</div>
        <div onClick='selectFeedback(event, "universal")' id='universal-word-button' class='feedback-select-toggle disabled'>Should never appear at all</div> */}
      </div>
      <div id='feedback-footer' className='lower-nav-panel floating'>
        <Button onClick={props.onClickBack} label={'EXIT'} type='close-feedback' className='bottom-nav nav-link' />
        <Button onClick={props.onClickFeedback} label={'SUBMIT'} type='submit-feedback' className='bottom-nav nav-link' />

        {/* <button onClick='dismissFeedbackWindow()' id='close-feedback-button'>EXIT</button>
        <button disabled onClick='submitChangedRules()' id='submit-feedback-button'>SUBMIT</button> */}
      </div>
    </div>
  );
}

export default FeedbackWindow;