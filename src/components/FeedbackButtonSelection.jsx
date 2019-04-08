import React from 'react';
import Button from './Button';
import '../css/Button.css';

const unitTypes = ['onsets', 'codas', 'nuclei']
function FeedbackButtonSelection(props) {
  
  console.error('FBS', props.currentEditType)
  let noneSelected = props.selectedLetters && !props.selectedLetters.length;
  let enterMode = props.className.toString().includes('enter');
  let editNameMode = props.className.toString().includes('editName');
  let editStringMode = props.className.toString().includes('editString');
  if (enterMode) {
    noneSelected = false;

  }
  return (
    <div className={`feedback-button-area ${props.className}`}>
      {(editNameMode) && <>
        <Button disabled={noneSelected} onClick={event => props.onClickFeedback(event, 'startWord')} label={'...should never begin a word'} type='start-word' className='feedback-select-toggle' selected={!noneSelected && props.feedbackTypesSelected.includes('startWord')} discovered={props.feedbackTypesDiscovered.includes('startWord')} />
        <Button disabled={noneSelected} onClick={event => props.onClickFeedback(event, 'endWord')} label={'...should never end a word'} type='end-word' className='feedback-select-toggle' selected={!noneSelected && props.feedbackTypesSelected.includes('endWord')} discovered={props.feedbackTypesDiscovered.includes('endWord')} />
        <Button disabled={noneSelected} onClick={event => props.onClickFeedback(event, 'midWord')} label={'...should never be in the middle of a word'} type='mid-word' className='feedback-select-toggle' selected={!noneSelected && props.feedbackTypesSelected.includes('midWord')} discovered={props.feedbackTypesDiscovered.includes('midWord')} />
        <Button disabled={noneSelected} onClick={event => props.onClickFeedback(event, 'loneWord')} label={'...should never appear by itself'} type='lone-word' className='feedback-select-toggle' selected={!noneSelected && props.feedbackTypesSelected.includes('loneWord')} discovered={props.feedbackTypesDiscovered.includes('loneWord')} />
        <Button disabled={noneSelected} onClick={event => props.onClickFeedback(event, 'universal')} label={'...should never appear at all'} type='universal-word' className='feedback-select-toggle' selected={!noneSelected && props.feedbackTypesSelected.includes('universal')} discovered={props.feedbackTypesDiscovered.includes('universal')} />
      </>}
      {(enterMode || editStringMode) && <>
        {unitTypes.includes(props.currentEditType) ?
          <>
            <Button disabled={noneSelected} onClick={event => props.onClickFeedback(event, 'startWord')} label={'...can start a syllable'} type='start-word' className='feedback-select-toggle' selected={!noneSelected && props.feedbackTypesSelected.includes('onsets')} discovered={props.feedbackTypesDiscovered.includes('onsets')} />
            <Button disabled={noneSelected} onClick={event => props.onClickFeedback(event, 'endWord')} label={'...can end a syllable'} type='end-word' className='feedback-select-toggle' selected={!noneSelected && props.feedbackTypesSelected.includes('codas')} discovered={props.feedbackTypesDiscovered.includes('codas')} />
            <Button disabled={noneSelected} onClick={event => props.onClickFeedback(event, 'midWord')} label={'...can appear as a vowel or vowel-like unit'} type='mid-word' className='feedback-select-toggle' selected={!noneSelected && props.feedbackTypesSelected.includes('nuclei')} discovered={props.feedbackTypesDiscovered.includes('nuclei')} />
          </>
          :
          props.currentEditType === 'invalidFollowers' ? 
            null
            :
            <>
              <Button disabled={noneSelected} onClick={event => props.onClickFeedback(event, 'startWord')} label={'...should never begin a word'} type='start-word' className='feedback-select-toggle' selected={!noneSelected && props.feedbackTypesSelected.includes('startWord')} discovered={props.feedbackTypesDiscovered.includes('startWord')} />
              <Button disabled={noneSelected} onClick={event => props.onClickFeedback(event, 'endWord')} label={'...should never end a word'} type='end-word' className='feedback-select-toggle' selected={!noneSelected && props.feedbackTypesSelected.includes('endWord')} discovered={props.feedbackTypesDiscovered.includes('endWord')} />
              <Button disabled={noneSelected} onClick={event => props.onClickFeedback(event, 'midWord')} label={'...should never be in the middle of a word'} type='mid-word' className='feedback-select-toggle' selected={!noneSelected && props.feedbackTypesSelected.includes('midWord')} discovered={props.feedbackTypesDiscovered.includes('midWord')} />
              <Button disabled={noneSelected} onClick={event => props.onClickFeedback(event, 'loneWord')} label={'...should never appear by itself'} type='lone-word' className='feedback-select-toggle' selected={!noneSelected && props.feedbackTypesSelected.includes('loneWord')} discovered={props.feedbackTypesDiscovered.includes('loneWord')} />
              <Button disabled={noneSelected} onClick={event => props.onClickFeedback(event, 'universal')} label={'...should never appear at all'} type='universal-word' className='feedback-select-toggle' selected={!noneSelected && props.feedbackTypesSelected.includes('universal')} discovered={props.feedbackTypesDiscovered.includes('universal')} />
            </>
          }
      </>}
    </div>
  );
}

const isEqual = (prevProps, nextProps) => {
  let equalTest = (
    prevProps.selectedLetters === nextProps.selectedLetters
    && prevProps.feedbackTypesSelected.length === nextProps.feedbackTypesSelected.length
    && prevProps.feedbackTypesDiscovered.length === nextProps.feedbackTypesDiscovered.length 
    && prevProps.className === nextProps.className
  );
  return equalTest;
}

export default React.memo(FeedbackButtonSelection, isEqual);
