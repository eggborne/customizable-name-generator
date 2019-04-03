import React from 'react';
import Button from './Button';
import '../css/Button.css';

function FeedbackButtonSelection(props) {
  let noneSelected = props.selectedLetters && !props.selectedLetters.length;
  return (
    <div className='feedback-button-area'>
      <Button disabled={noneSelected} onClick={event => props.onClickFeedback(event, 'startWord')} label={'...should never begin a word'} type='start-word' className='feedback-select-toggle' selected={!noneSelected && props.feedbackTypesSelected.includes('startWord')} discovered={props.feedbackTypesDiscovered.includes('startWord')} />
      <Button disabled={noneSelected} onClick={event => props.onClickFeedback(event, 'endWord')} label={'...should never end a word'} type='end-word' className='feedback-select-toggle' selected={!noneSelected && props.feedbackTypesSelected.includes('endWord')} discovered={props.feedbackTypesDiscovered.includes('endWord')} />
      <Button disabled={noneSelected} onClick={event => props.onClickFeedback(event, 'midWord')} label={'...should never be in the middle of a word'} type='mid-word' className='feedback-select-toggle' selected={!noneSelected && props.feedbackTypesSelected.includes('midWord')} discovered={props.feedbackTypesDiscovered.includes('midWord')} />
      <Button disabled={noneSelected} onClick={event => props.onClickFeedback(event, 'loneWord')} label={'...should never appear by itself'} type='lone-word' className='feedback-select-toggle' selected={!noneSelected && props.feedbackTypesSelected.includes('loneWord')} discovered={props.feedbackTypesDiscovered.includes('loneWord')} />
      <Button disabled={noneSelected} onClick={event => props.onClickFeedback(event, 'universal')} label={'...should never appear at all'} type='universal-word' className='feedback-select-toggle' selected={!noneSelected && props.feedbackTypesSelected.includes('universal')} discovered={props.feedbackTypesDiscovered.includes('universal')} />
    </div>
  );
}

const isEqual = (prevProps, nextProps) => {
  let equalTest = (
    prevProps.selectedLetters === nextProps.selectedLetters
    && prevProps.feedbackTypesSelected.length === nextProps.feedbackTypesSelected.length
    && prevProps.feedbackTypesDiscovered.length === nextProps.feedbackTypesDiscovered.length    
  );
  return equalTest;
}

export default React.memo(FeedbackButtonSelection, isEqual);
