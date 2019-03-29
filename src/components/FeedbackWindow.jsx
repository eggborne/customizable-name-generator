

import React from 'react';
 // eslint-disable-next-line
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Button from './Button';
import '../css/Button.css';
import '../css/FeedbackWindow.css';
import TinyGesture from 'tinygesture'; 
import { namePatterns } from '../js/randomname.js';

function FeedbackWindow(props) {
  console.error('rendering FeedbackWindow!!');

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

  let names = [];
  if (props.nameData && props.nameData.wordUnits) {
    for (let wordType in props.nameData.wordUnits) {
      names.push([]);
      let word = props.nameData.wordUnits[wordType];
      console.log('word', word);
      // word = word.join('').split(' ');
      word.map(unit => {
        console.warn('doing unit', unit)
        names[names.length - 1].push(unit);      
        // names[names.length - 1].push(unit);
      })
    };
    
  } else {
    names = [[''], ['']];
  }
  let types = [];
  let article = '';
  return (
    <div id='feedback-shade' className={props.showing ? 'shade showing' : 'shade'}>
      <div id='feedback-info-message'>Select letters to edit rules</div>                 
      <div className={props.showing ? 'floating-window' : 'floating-window hidden'} id='feedback-panel'>        
        <div id='feedback-title'>
          {names.map((name, n) => {
            console.log('name?', name.slice(name.length - 4, name.length))
            console.log('the?', ' the')
            if (name.slice(name.length - 4, name.length).join('') === ' the') {
              article = 'the';
              name = name.slice(0, name.length - 4);              
            }
            let pattern;
            types[n] = [];
            if (namePatterns[props.nameData.style]) {
              pattern = Object.values(namePatterns[props.nameData.style]);
            }
            return <><div key={n}>
              {name.map((unit, i) => {
                unit = unit.toUpperCase();
                let unitClass = '';
                let unitType = '';
                if (props.nameData.style) {
                  unitType = pattern[n][i];
                  unitClass = pattern[n][i].type;
                  if (unitType.type === 'repeater') {
                    console.log(unitType.value);
                    console.info(types);
                    console.info(types[n]);
                    console.info(types[n][1])
                    unitClass = types[n][unitType.value].type + ' repeater';
                  }
                  if (unit === ' ') {
                    unitClass += ' space';
                  }
                }
                types[n].push(unitType);
                return <div key={i} className={unitClass + ' name-unit'}>{
                  unit.split('').map((letter, l) => {
                    let clickAction = letter !== ' ' && letter !== '-' ? props.onClickLetter : () => null;
                    return <div key={l} className={'name-letter'} onPointerDown={clickAction}>{letter}</div>;
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
        <div id='feedback-selected-display'>{props.nameData.fullName}</div>      
        <div id='feedback-button-area'>
          <Button onClick={props.onClickFeedback} label={'Should never begin a word'} type='start-word' className='feedback-select-toggle' selected={false} />
          <Button onClick={props.onClickFeedback} label={'Should never end a word'} type='end-word' className='feedback-select-toggle' selected={false} />
          <Button onClick={props.onClickFeedback} label={'Should never be in the middle of a word'} type='mid-word' className='feedback-select-toggle' selected={false} />
          <Button onClick={props.onClickFeedback} label={'Should never appear by itself'} type='lone-word' className='feedback-select-toggle' selected={true} />
          <Button onClick={props.onClickFeedback} label={'Should never appear at all'} type='universal-word' className='feedback-select-toggle' selected={false} />
        </div>
        <div id='feedback-footer' className='lower-nav-panel floating'>
          <Button onClick={props.onClickBack} label={'EXIT'} type='close-feedback' className='bottom-nav nav-link cancel-button' />
          <Button onClick={props.onClickFeedback} label={'SUBMIT'} type='submit-feedback' className='bottom-nav nav-link' />
        </div>
      </div>
    </div>
  );
}
const isEqual = (prevProps, nextProps) => {
  return prevProps.showing === nextProps.showing;
}

export default React.memo(FeedbackWindow, isEqual);