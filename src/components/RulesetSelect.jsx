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
  let rulesets = props.ruleData.rulesets;
  console.error('rendering RulesetSelect!!', props.ruleData.creator, props.ruleData.usingRuleset, props.ruleData.rulesetSelected)
  let readyToChange = props.ruleData.usingRuleset !== props.ruleData.rulesetSelected;
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
                .filter(ruleset => !ruleset.creator.includes('backup'))
                .map((ruleset, i) => {
                  let highlighted = '';
                  let using = '';
                  if (ruleset.index == props.ruleData.rulesetSelected) {
                    highlighted = ' highlighted';
                  }
                  if (ruleset.index == props.ruleData.rulesIndex) {
                    using = ' using';
                  }
                  let dateDisplay = '';
                  if (ruleset.dialect !== 'Empty') {
                    dateDisplay = niceDate(ruleset.created);
                  }
                  return (
                    <div key={ruleset.index} id={`ruleset-${ruleset.index}`} onClick={props.onSelectRuleset} className={`ruleset-listing${using}${highlighted}`}>
                      <div>'{ruleset.dialect}'</div>
                      <div className='ruleset-info'>{dateDisplay}</div>
                      <small>{ruleset.changed.length} edits by {ruleset.creator}</small>
                      <div className='ruleset-info'>
                        ID: #{ruleset.index}
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
