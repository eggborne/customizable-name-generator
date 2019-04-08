import React from 'react';
// eslint-disable-next-line
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Button from './Button';
import '../css/Button.css';
import '../css/RulesetSelect.css';

const niceDate = (grossDate) => {
  let niceDate = new Date(grossDate);
  let hours = niceDate.getHours();
  let ampm = 'am';
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
  return `${niceDate.getMonth() + 1}/${niceDate.getDate()} ${hours}:${mins}${ampm}`;
}

function RulesetSelect(props) {
  let rulesets = props.rulesets;
  console.error('rendering RulesetSelect!!', props)
  let readyToChange = props.usingRuleset !== props.rulesetSelected;
  return (
    <div className={props.location.location.pathname === '/rules/rulesetselect' ? 'shade showing' : 'shade'}>
      <div className={props.location.location.pathname === '/rules/rulesetselect' ? 'floating-window' : 'floating-window hidden'} id='ruleset-select-screen'>
        <div className='title-header' id='ruleset-title'>
          SELECT RULESET
        </div>
        <div id='ruleset-list'>
          {rulesets.length ? (
            <>
              {rulesets
                .filter(ruleset => !ruleset.dialect.includes('backup'))
                .sort((a, b) => a.index - b.index)
                .map((ruleset, i) => {
                  let rulesetSelected = parseInt(props.rulesetSelected);
                  let rulesetIndex = parseInt(ruleset.index);
                  let usingRuleset = parseInt(props.usingRuleset);
                  let highlighted = '';
                  let using = '';
                  let owned = '';
                  let titleDisplay = `'${ruleset.dialect}'`;
                  let creatorDisplay = ruleset.creator;
                  // console.warn('-----------------------------------------------------------------')
                  // console.warn('props.userID', props.userID)
                  // console.warn('props.usingRuleset', usingRuleset)
                  // console.warn('props.rulesetSelected', rulesetSelected)
                  // console.warn('ruleset.creatorID', ruleset.creatorID)
                  // console.warn('ruleset.index', rulesetIndex)
                  // console.warn('-----------------------------------------------------------------')
                  if (props.userID == ruleset.creatorID || ruleset.dialect === 'Empty') {
                    owned = ' owned';
                  }
                  if (rulesetIndex == usingRuleset) {
                    using = ' using';
                  }
                  if (rulesetIndex == rulesetSelected) {
                    highlighted = ' highlighted';
                  }
                  let dateDisplay = '';
                  if (ruleset.dialect !== 'Empty') {
                    dateDisplay = niceDate(ruleset.created);
                  } else {
                    titleDisplay = `${props.username}'s New Empty Ruleset`;
                    creatorDisplay = props.username;
                  }
                  return (
                    <div key={rulesetIndex} id={`ruleset-${rulesetIndex}`} onClick={props.onSelectRuleset} className={`ruleset-listing${using}${highlighted}${owned}`}>
                      <div>{titleDisplay}</div>
                      <div className='ruleset-info'>{dateDisplay}</div>
                      <small>{ruleset.totalRules} rules by <span id='ruleset-creator-credit'>{creatorDisplay}</span></small>
                      <div className='ruleset-info'>
                        ID: #{rulesetIndex}
                      </div>
                    </div>
                  );
                })}
            </>
          ) : (
            <div id='loading-message'>loading...</div>
          )}
        </div>
        <div className='lower-nav-panel floating'>
          <div>
            <Link to='/rules' replace>
              <Button className='bottom-nav nav-link cancel-button' onClick={props.onDismissRulesetSelect} label={'CANCEL'} />
            </Link>
          </div>
          <div>
            <Link to={readyToChange ? `/rules` : '/rules/rulesetselect'} replace>
              <Button disabled={!readyToChange} className='bottom-nav nav-link' onClick={props.onChooseNewRuleset} label={'CHANGE'} type='choose-ruleset' />
            </Link>
          </div>
          <div />
        </div>
      </div>
    </div>
  );
}

export default RulesetSelect;
