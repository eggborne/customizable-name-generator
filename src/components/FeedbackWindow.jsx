

import React from 'react';
 // eslint-disable-next-line
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Button from './Button';
import FeedbackButtonSelection from './FeedbackButtonSelection';
import '../css/Button.css';
import '../css/FeedbackWindow.css';
// import TinyGesture from 'tinygesture';
import { namePatterns } from '../js/namegenerator.js';

function FeedbackWindow(props) {
  console.error('rendering FeedbackWindow!!', props);

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
  if (props.nameData && props.nameData.wordUnits) {
    names = [];
    for (let wordType in props.nameData.wordUnits) {
      names.push([]);
      let word = props.nameData.wordUnits[wordType];
      word.map(unit => {
        names[names.length - 1].push(unit);      
      })
    };
  }
  let types = [];
  let article = '';
  let longestWord = 0;
  requestAnimationFrame(() => {
    [...document.querySelectorAll('.name-letter')].map(letterEl => {
      let width = (window.innerWidth * 0.68) / longestWord;
      let fontSize = width * 0.75;
      letterEl.style.fontSize = fontSize + 'px';
      letterEl.style.width = width + 'px';
    });
  });
  let selectedString = '';
  let selectedIds = [];
  props.selectedLetters.map(letterObj => {
    selectedString += letterObj.char;
    selectedIds.push(letterObj.id)
  })  
  return (
    <div id='feedback-shade' className={props.showing ? 'shade showing' : 'shade'}>
      <div id='feedback-info-message'>Select letters to edit rules</div>                 
      <div className={props.showing ? 'floating-window' : 'floating-window hidden'} id='feedback-panel'>        
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
            longestWord = (name.join('').length > longestWord) ? name.join('').length : longestWord;
            return <><div key={n}>
              {name.map((unit, i) => {
                unit = unit.toUpperCase();
                let unitClass = '';
                let unitType = '';
                if (props.nameData.style) {
                  unitType = pattern[n][i];
                  unitClass = pattern[n][i].type;
                  if (unitType.type === 'repeater') {
                    // console.log(unitType.value);
                    // console.info(types);
                    // console.info(types[n]);
                    // console.info(types[n][1])
                    unitClass = types[n][unitType.value].type + ' repeater';
                  }
                  if (unit === ' ') {
                    unitClass += ' space';
                  }
                }
                types[n].push(unitType);                
                return <div key={i} className={unitClass + ' name-unit'}>{
                  unit.split('').map((letter, l) => {
                    let letterId = `name-letter-word-${n}-unit-${i}-char-${l}`;
                    let letterClass = 'name-letter';                    
                    if (selectedIds.includes(letterId)) {
                      letterClass += ' selected';
                    }
                    let clickAction = letter !== ' ' && letter !== '-' ? props.onClickLetter : () => null;
                    return <div key={l} id={letterId} className={letterClass} onPointerDown={clickAction}>{letter}</div>;
                  })
                }</div>
              })
            }
            </div>
              <div id='feedback-article'>{n === 0 && `${article}`}</div>
            </>
          })}
        </div>
        <input id='invalid-string-input' placeholder='Enter letters' type='text' name='invalid-string' />
        <div id='feedback-selected-display'>{selectedString}</div>      
        <FeedbackButtonSelection
          feedbackTypesSelected={props.feedbackTypesSelected}
          feedbackTypesDiscovered={props.feedbackTypesDiscovered}
          onClickFeedback={props.onClickFeedback}
          selectedLetters={props.selectedLetters}/>
        <div id='feedback-footer' className='lower-nav-panel floating'>
          <Button onClick={props.onClickBack} label={'EXIT'} type='close-feedback' className='bottom-nav nav-link cancel-button' />
          <Button disabled={!props.feedbackTypesSelected.length} onClick={props.onClickSendFeedback} label={'SUBMIT'} type='submit-feedback' className='bottom-nav nav-link' />
        </div>
      </div>
    </div>
  );
}
const isEqual = (prevProps, nextProps) => {
  let equalTest = (prevProps.showing === nextProps.showing
    && prevProps.selectedLetters.length === nextProps.selectedLetters.length
    && prevProps.feedbackTypesSelected.length === nextProps.feedbackTypesSelected.length
    && prevProps.feedbackTypesDiscovered.length === nextProps.feedbackTypesDiscovered.length

  );
  return equalTest;
}

export default React.memo(FeedbackWindow, isEqual);