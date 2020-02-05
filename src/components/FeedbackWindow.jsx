import React from 'react';
import Button from './Button';
import FeedbackButtonSelection from './FeedbackButtonSelection';
import '../css/Button.css';
import '../css/FeedbackWindow.css';
// import TinyGesture from 'tinygesture';
import { namePatterns } from '../js/namegenerator.js';

function FeedbackWindow(props) {

  console.error('rendering FeedbackWindow!!', props);

  let sequenceTextInput0 = React.createRef();
  let sequenceTextInput1 = React.createRef();

  function handleClickSequenceUnit(event) {
    let position = 0;
    let focusedInput;
    if (sequenceTextInput0.current.classList.contains('focused')) {
      focusedInput = sequenceTextInput0.current;
    } else if (sequenceTextInput1.current.classList.contains('focused')) {
      position = 1;
      focusedInput = sequenceTextInput1.current;
    }
    if (!focusedInput) {
      sequenceTextInput0.current.focus = true;
      focusedInput = sequenceTextInput0.current;
    }
    focusedInput.value = event.target.innerHTML;
    props.onEnterSequenceUnit(event.target.innerHTML, position)
  }
  
  requestAnimationFrame(() => {
    // [...document.querySelectorAll('.name-letter')].map(word => {
    //   console.log('word', word);
    //   word.onpointerover = event => {
    //     console.log('moved onto', event.target);
    //   };
    // })
    // nameArea.addEventListener('pointerenter', event => {
    //   console.log('moved onto', event.target);
    // });
    // const gesture = new TinyGesture(nameArea, {});
    // console.info('gesture', gesture)
    // gesture.on('panmove', event => {
    //   console.log('moved on', event.target)
    // });
  });
  let names = [[''], ['']];
  let types = [];
  let article = '';
  let longestWord = 0;
  if (props.showing === 'editName') {
    if (props.nameData && props.nameData.wordUnits) {
      names = [];
      for (let wordType in props.nameData.wordUnits) {
        names.push([]);
        let word = props.nameData.wordUnits[wordType];
        word.map(unit => {
          names[names.length - 1].push(unit);
        });
      }
    }
    requestAnimationFrame(() => {
      [...document.querySelectorAll('.name-letter')].map(letterEl => {
        let width = (window.innerWidth * 0.68) / longestWord;
        if (width > (window.innerHeight / 12)) {
          width = window.innerHeight / 12;
        }
        let fontSize = width * 0.75;
        letterEl.style.fontSize = fontSize + 'px';
        letterEl.style.width = width + 'px';
      });
    });
  }
  let selectedString = '';
  let selectedIds = [];
  props.selectedLetters.map(letterObj => {
    selectedString += letterObj.char;
    selectedIds.push(letterObj.id);
  });

  let inputPlaceholder = '';
  let inputValue = '';
  if (props.showing === 'enter') {
    inputPlaceholder = 'enter letters'
  }
  if (props.showing === 'editString') {
    inputValue = props.selectedString;
  }  
  let typeClass = props.showing;
  if (typeClass === 'editString') {
    typeClass = 'enter';
  }
  return (
    <div id='feedback-shade' className={typeClass ? 'shade showing' : 'shade'}>
      {props.showing === 'editName' && <div id='feedback-info-message'>Select letters to edit rules</div>}
      <div className={props.showing ? `${typeClass} floating-window` : `${typeClass} floating-window hidden`} id='feedback-panel'>
        {props.showing === 'editName' && (
          <div id='feedback-title'>
            {names.map((name, n) => {
              if (name.slice(name.length - 4, name.length).join('') === ' the') {
                article = 'the';
                name = name.slice(0, name.length - 4);
              }
              let pattern;
              types[n] = [];
              if (namePatterns[props.nameData.style]) {
                pattern = Object.values(namePatterns[props.nameData.style]);
              }
              longestWord = name.join('').length > longestWord ? name.join('').length : longestWord;
              return (
                <>
                  <div key={n}>
                    {name.map((unit, i) => {
                      unit = unit.toUpperCase();
                      let unitClass = '';
                      let unitType = '';
                      if (props.nameData.style) {
                        unitType = pattern[n][i];
                        unitClass = pattern[n][i].type;
                        if (unitType.type === 'repeater') {
                          unitClass = types[n][unitType.value].type + ' repeater';
                        }
                        if (unit === ' ') {
                          unitClass += ' space';
                        }
                      }
                      types[n].push(unitType);
                      return (
                        <div key={i} className={unitClass + ' name-unit'}>
                          {unit.split('').map((letter, l) => {
                            let letterId = `name-letter-word-${n}-unit-${i}-char-${l}`;
                            let letterClass = 'name-letter';
                            if (selectedIds.includes(letterId)) {
                              letterClass += ' selected';
                            }
                            let clickAction = letter !== ' ' && letter !== '-' ? props.onClickLetter : () => null;
                            return (
                              <div key={l} id={letterId} className={letterClass} onPointerDown={clickAction}>
                                {letter}
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                  <div id='feedback-article'>{n === 0 && `${article}`}</div>
                </>
              );
            })}
          </div>
        )}
        {props.currentEditType === 'invalidFollowers' &&
          <>
            <div className='follower-selection-area'>
              {props.ruleData.onsets.sort().sort((a, b) => a.length - b.length).map((sequenceUnit, p) => {
                let unitClass = 'invalid-word word-piece followers-selection';                
                let elementID = `followers-selection-list-${p}`;
                return (
                  <div onClick={(event) => handleClickSequenceUnit(event)} key={elementID} id={elementID} className={unitClass}>
                    {sequenceUnit}
                  </div>
                );
              })}
              <div style={{width: '100%', height: '1vh'}}></div>
              {props.ruleData.nuclei.sort().sort((a, b) => a.length - b.length).map((sequenceUnit, p) => {
                let unitClass = 'invalid-word word-piece followers-selection';                            
                let elementID = `followers-selection-list-${p}`;
                  return (
                    <div onClick={(event) => handleClickSequenceUnit(event)} key={elementID} id={elementID} className={unitClass}>
                      {sequenceUnit}
                    </div>
                  );
              })}
              <div style={{ width: '100%', height: '1vh' }}></div>
              {props.ruleData.codas.sort().sort((a, b) => a.length - b.length).map((sequenceUnit, p) => {
                let unitClass = 'invalid-word word-piece followers-selection';                          
                let elementID = `followers-selection-list-${p}`;
                return (
                  <div onClick={(event) => handleClickSequenceUnit(event)} key={elementID} id={elementID} className={unitClass}>
                    {sequenceUnit}
                  </div>
                );
              })}
            </div>
            <div id='follower-inputs'>
              <input
                readOnly
                ref={sequenceTextInput0}
                onFocus={(event) => { props.onClickInput(event) }}
                // onChange={(event) => props.onEnterSequenceUnit(event, 0)}
                maxLength='5'
                placeholder={props.inputFocused === 'submit-preceder-input' ? 'Click a unit above' : 'Click to enter unit'}
                type='text'
                className={props.inputFocused === 'submit-preceder-input' ? 'large-input sequence sequence0 focused' : 'large-input sequence sequence0'}
                id='submit-preceder-input'>
              </input>
              <div>will never be followed by</div>
              <input
                readOnly
                ref={sequenceTextInput1}
                onFocus={(event) => { props.onClickInput(event) }}
                // onChange={(event) => props.onEnterSequenceUnit(event, 1)}
                maxLength='5'
                placeholder={props.inputFocused === 'submit-follower-input' ? 'Click a unit above' : 'Click to enter unit'}
                type='text'
                className={props.inputFocused === 'submit-follower-input' ? 'large-input sequence sequence1 focused' : 'large-input sequence sequence1'}
                id='submit-follower-input'>
              </input>
            </div>
          </>
        }
        {props.currentEditType !== 'invalidFollowers' &&                      
          <>
            <div id='feedback-selected-display'>
              <input value={selectedString} onClick={(event) => props.onClickInput(event)} onChange={(event) => props.onEnterLetter(event)} maxLength='5' placeholder={inputPlaceholder} type='text' className='large-input'  id='submit-string-input'></input>
            </div>
            <FeedbackButtonSelection className={typeClass} currentEditType={props.currentEditType} feedbackTypesSelected={props.feedbackTypesSelected} feedbackTypesDiscovered={props.feedbackTypesDiscovered} onClickFeedback={props.onClickFeedback} selectedLetters={props.selectedLetters} />
          </>
        }        
        <div id='feedback-footer' className='lower-nav-panel floating'>
          <Button onClick={props.onClickBack} label={'EXIT'} type='close-feedback' className='bottom-nav nav-link cancel-button' />
          <Button disabled={!props.feedbackTypesSelected.length} onClick={props.onClickSendFeedback} label={'SUBMIT'} type='submit-feedback' className='bottom-nav nav-link' />
        </div>
      </div>
    </div>
  );
}
const isEqual = (prevProps, nextProps) => {
  if (!prevProps.showing && nextProps.showing && nextProps.showing === 'editString') {    
    setTimeout(() => { document.getElementById('submit-string-input').value = nextProps.selectedString.string }, 1);    
  }
  let equalTest =
    prevProps.inputFocused === nextProps.inputFocused
    && prevProps.showing === nextProps.showing
    && prevProps.selectedLetters.length === nextProps.selectedLetters.length
    && prevProps.feedbackTypesSelected.length === nextProps.feedbackTypesSelected.length
    && prevProps.feedbackTypesDiscovered.length === nextProps.feedbackTypesDiscovered.length
    && prevProps.highlightedSequenceUnit == nextProps.highlightedSequenceUnit;
  return equalTest;
};

export default React.memo(FeedbackWindow, isEqual);
