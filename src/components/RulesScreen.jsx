import React from 'react';
 // eslint-disable-next-line
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Button from './Button';
import '../css/Button.css';
import '../css/RulesScreen.css';

function RulesScreen(props) {
  // console.error('rendering RulesScreen!!', props.ruleData);
  let followerLists = [];
  let followers = { ...props.ruleData.invalidFollowers };
  for (let list in followers) {
    followers[list].unshift(list);
    followerLists.push(followers[list]);
  }
  return (
    <div className={props.location.location.pathname.includes('/rules') ? undefined : 'hidden'} id='rules-screen'>
      <div id='rules-title'>RULES</div>
      <div id='rules-info-display'>using ruleset #{props.ruleData.usingRuleset}</div>
      <div id='rules-list'>
        <div className='rule-header'>
          <div>Banned letter sequences</div>
          <div><Button className='rule-edit-button' onClick={() => null} label={'EDIT'} type='edit-banned' /></div>
        </div>
        <div>
          <h3>Anywhere</h3>
          <div className='invalid-word-list' id='universal-word-list'>
            {props.ruleData.universal.map((word, i) => {
              return <div className='invalid-word' key={i}>{word}</div>;  
            })}
          </div>
          <h3>Beginning of word</h3>
          <div className='invalid-word-list' id='start-word-list'>
            {props.ruleData.startWord.map((word, i) => {
              return <div className='invalid-word' key={i}>{word}</div>;
            })}
          </div>
          <h3>Middle of word</h3>
          <div className='invalid-word-list' id='mid-word-list'>
            {props.ruleData.midWord.map((word, i) => {
              return <div className='invalid-word' key={i}>{word}</div>;
            })}
          </div>
          <h3>End of word</h3>
          <div className='invalid-word-list' id='end-word-list'>
            {props.ruleData.endWord.map((word, i) => {
              return <div className='invalid-word' key={i}>{word}</div>;
            })}
          </div>
          <h3>Exact word only</h3>
          <div className='invalid-word-list' id='lone-word-list'>
            {props.ruleData.loneWord.map((word, i) => {
              return <div className='invalid-word' key={i}>{word}</div>;
            })}
          </div>       
        </div>
        <div className='rule-header'>
          <div>Banned combinations</div>
          <div><Button className='rule-edit-button' onClick={() => null} label={'EDIT'} type='edit-combinations' /></div>
        </div>
        <div>
          <h3>Left column can never be followed by right column</h3>
          <div className='invalid-word-list' id='followers-word-list'>
            {followerLists.map((wordList, i) => {
              let categoryLetter = wordList[0];
              wordList.splice(0, 1);
              return (
                <div key={i}>
                  <div className='invalid-row'>
                    <div className='invalid-preceder'>{categoryLetter}</div>
                    <div className='follower-area'>{
                      wordList.map((word, j) => {
                        return <div className='invalid-word word-piece' key={j}>{word}</div>;
                      })
                    }</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className='lower-nav-panel'>
        <div><Link to='/' replace><Button  className='bottom-nav back-button nav-link' onClick={() => null} label={'BACK'} type='rules-back' /></Link></div>
        <div><Link to='/rules/rulesetselect' replace><Button className='bottom-nav nav-link' onClick={props.onClickChangeRuleset} label={'CHOOSE RULESET...'} type='change-ruleset' /></Link></div>
      </div>
    </div>
  );
}
function isEqual(prevProps, nextProps) {
  // let leaving = prevProps.location.location.pathname === '/history' && nextProps.location.location.pathname === '/';
  let equalTest = (
    (prevProps.location.location.pathname == nextProps.location.location.pathname
      || prevProps.location.location.pathname.includes('rules') && nextProps.location.location.pathname.includes('rules'))
    && prevProps.ruleData.usingRuleset == nextProps.ruleData.usingRuleset
  );  
  return equalTest;
}
export default React.memo(RulesScreen, isEqual);
// export default RulesScreen;






