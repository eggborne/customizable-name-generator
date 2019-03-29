import React from 'react';
 // eslint-disable-next-line
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Button from './Button';
import '../css/Button.css';
import '../css/RulesetSelect.css';

function RulesetSelect(props) {
  let rulesets = props.ruleData.rulesets;
  // console.error('rendering RulesetSelect!!', props.ruleData.creator, props.ruleData.usingRuleset, props.ruleData.rulesetSelected)
  let readyToChange = props.ruleData.usingRuleset !== props.ruleData.rulesetSelected;
  return (

    <div className={props.location.location.pathname === '/rules/rulesetselect' ? 'shade showing' : 'shade'}>

    <div className={props.location.location.pathname === '/rules/rulesetselect' ? 'floating-window' : 'floating-window hidden'} id='ruleset-select-screen'>
      <div className='title-header' id='ruleset-title'>SELECT RULESET</div>
      <div id='ruleset-list'>
        {rulesets.length ?
          <>
            {rulesets.filter(ruleset => ruleset.creator === 'empty' || ruleset.creator === 'mike' || ruleset.creator.includes('custom')).map((ruleset, i) => {
              let highlighted = '';
              let using = '';
              if (ruleset.creator === props.ruleData.rulesetSelected) {
                highlighted = ' highlighted';
              }
              if (ruleset.creator === props.ruleData.creator) {
                using = ' using';
              }
              let creatorDisplay = ruleset.creator;
              if (ruleset.creator.split('-')[0] === 'custom') {
                let splitRules = ruleset.creator.split('-');
                splitRules[1] = parseInt(splitRules[1]);
                let niceDate = new Date(splitRules[1]);
                let hours = niceDate.getHours();
                let ampm = 'am'
                if (hours > 12) {
                  hours -= 12;
                  ampm = 'pm';
                } else if (hours === 0) {
                  hours = 12;
                }
                let mins = niceDate.getMinutes();
                if (mins < 10) {
                  mins = '0' + mins;
                }
                creatorDisplay = `User-${ruleset.index} ${niceDate.getMonth() + 1}/${niceDate.getDate()}, ${hours}:${mins}${ampm}`;
              }
              return (
                <div key={ruleset.index} id={ruleset.creator} onClick={props.onSelectRuleset} className={`ruleset-listing${using}${highlighted}`}>
                  {creatorDisplay}<br />
                  {creatorDisplay.includes('User') && `#${ruleset.creator.split('-')[1]}`}
                  <div className='ruleset-info'>
                    Edits: {ruleset.changed.length}
                  </div>
                </div>);
            })}
          </>
          :
          <div id='loading-message'>loading...</div>
        }
        </div>
        
      <div className='lower-nav-panel floating'>
        <div><Link to='/rules' replace><Button className='bottom-nav nav-link cancel-button' onClick={props.onDismissRulesetSelect} label={'CANCEL'} /></Link></div>
        <div><Link to='/rules' replace><Button disabled={!readyToChange} className='bottom-nav nav-link' onClick={props.onChooseNewRuleset} label={'CHANGE'} type='choose-ruleset' /></Link></div>
        <div></div>
      </div>
      </div>

    </div>
  );
}

export default RulesetSelect;



















