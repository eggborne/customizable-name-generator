import React from 'react';
 // eslint-disable-next-line
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Button from './Button';
import '../css/Button.css';
import '../css/RulesScreen.css';

function RulesScreen(props) {
  console.error('rendering RulesScreen!!', props.selectedString);  
  let followerLists = [];
  let followers = { ...props.ruleData.invalidFollowers };
  for (let list in followers) {
    followers[list].unshift(list);
    followerLists.push(followers[list]);
  }  
  let consonantStarters = [
    props.ruleData.consonantStarters.filter(unit => unit.length === 1),
    props.ruleData.consonantStarters.filter(unit => unit.length === 2),
    props.ruleData.consonantStarters.filter(unit => unit.length === 3),
    props.ruleData.consonantStarters.filter(unit => unit.length === 4)
  ];
  let consonantEnders = [
    props.ruleData.consonantEnders.filter(unit => unit.length === 1),
    props.ruleData.consonantEnders.filter(unit => unit.length === 2) ,
    props.ruleData.consonantEnders.filter(unit => unit.length === 3),
    props.ruleData.consonantEnders.filter(unit => unit.length === 4)
  ];
  let vowelUnits = [
    props.ruleData.vowelUnits.filter(unit => unit.length === 1),
    props.ruleData.vowelUnits.filter(unit => unit.length === 2) ,
    props.ruleData.vowelUnits.filter(unit => unit.length === 3),
    props.ruleData.vowelUnits.filter(unit => unit.length === 4)
  ];
  return (
    <div className={props.location.location.pathname.includes('/rules') ? undefined : 'hidden'} id='rules-screen'>
      <div className='title-header' id='rules-title'>RULES
      <div className='title-info' id='rules-info-display'>using ruleset #{props.ruleData.usingRuleset}</div>
      </div>
      <div id='rules-list'>
        <div className='rule-area'>
          <div className='rule-header'>
            <div>Valid Word Units</div>
            {/* <div><Button className='rule-edit-button' onClick={props.onClickEdit} label={'EDIT'} type='edit-combinations' /></div> */}
          </div>
          <div>
            <h3>Consonants that can begin a syllable</h3>
            {consonantStarters.map((list, i) =>
                <div key={i} className='rule-word-list valid'>
                  {
                    list.map((word, j) => {
                      return <div className='invalid-word word-piece' key={j}>{word}</div>;
                    })
                  }
                </div>
            )}
            <h3>Consonants that can end a syllable</h3>
            {consonantEnders.map((list, i) =>
              <div key={i} className='rule-word-list valid'>
                {
                  list.map((word, j) => {
                    return <div className='invalid-word word-piece' key={j}>{word}</div>;
                  })
                }
              </div>
            )}
            <h3>Vowel Units</h3>
            {vowelUnits.map((list, i) =>
                <div key={i} className='rule-word-list valid'>
                  {
                    list.map((word, j) => {
                      return <div className='invalid-word word-piece' key={j}>{word}</div>;
                    })
                  }
                </div>
            )}
          </div>
        </div>
        <div className='rule-area'>
          <div className='rule-header'>
            <div>Banned letter sequences</div>
            {/* <div><Button className='rule-edit-button' onClick={props.onClickEdit} label={'EDIT'} type='edit-banned' /></div> */}
          </div>
          <div>
            <h3>Anywhere</h3>
            <div className='rule-word-list invalid' id='universal-word-list'>
              {props.ruleData.universal.map((wordPiece, i) => {
                let elementID = `universal-word-list-${wordPiece}-${i}`;
                let pieceSelected = props.selectedString.string === wordPiece && props.selectedString.id === elementID;
                return <div
                  onClick={(event) => { props.onClickWordPiece(event) }}
                  key={i}
                  id={elementID}
                  className={pieceSelected ? 'invalid-word selected' : 'invalid-word'}>               
                  <div>{wordPiece}</div>
                  <div className='mini-edit-button-area'>
                    <div><Button className='string-delete-button' onClick={(event) => { props.onClickEdit(event) }} label={'DEL'} type='delete-invalid-universal' /></div>
                    <div><Button className='string-edit-button' onClick={(event) => { props.onClickEdit(event) }} label={'EDIT'} type='edit-invalid-universal' /></div>
                  </div>
                </div>;
              })}
            {/* <div onClick={props.onClickAdd} className={'invalid-word add-invalid-string-button'}>ADD</div> */}
              <button onClick={props.onClickAdd} id='add-universal-button' className='add-invalid-button'>+</button>
            </div>
            <h3>Beginning of word</h3>
            <div className='rule-word-list invalid' id='start-word-list'>
              {props.ruleData.startWord.map((wordPiece, i) => {
                let elementID = `start-word-list-${wordPiece}-${i}`;
                let pieceSelected = props.selectedString.string === wordPiece && props.selectedString.id === elementID;
                return <div 
                  onClick={(event) => { props.onClickWordPiece(event) }}
                  key={i}
                  id={elementID}                  
                  className={pieceSelected ? 'invalid-word selected' : 'invalid-word'}>
                  <div>{wordPiece}</div>
                  <div className='mini-edit-button-area'>
                    <div><Button className='string-delete-button' onClick={(event) => { props.onClickEdit(event) }} label={'DEL'} type='delete-invalid-start' /></div>
                    <div><Button className='string-edit-button' onClick={(event) => { props.onClickEdit(event) }} label={'EDIT'} type='edit-invalid-start' /></div>
                  </div>
                </div>;
              })}
            {/* <div onClick={props.onClickAdd} className={'invalid-word add-invalid-string-button'}>ADD</div> */}
              <input onClick={props.onClickAdd} placeholder='ADD' type='text' id='start-input' className='add-invalid-input'></input>
            </div>
            <h3>Middle of word</h3>
            <div className='rule-word-list invalid' id='mid-word-list'>
              {props.ruleData.midWord.map((wordPiece, i) => {
                let elementID = `mid-word-list-${wordPiece}-${i}`;
                let pieceSelected = props.selectedString.string === wordPiece && props.selectedString.id === elementID;
                return <div
                  onClick={(event) => { props.onClickWordPiece(event) }}
                  key={i}
                  id={elementID}                  
                  className={pieceSelected ? 'invalid-word selected' : 'invalid-word'}>
                  <div>{wordPiece}</div>
                  <div className='mini-edit-button-area'>
                    <div><Button className='string-delete-button' onClick={(event) => { props.onClickEdit(event) }} label={'DEL'} type='delete-invalid-mid' /></div>
                    <div><Button className='string-edit-button' onClick={(event) => { props.onClickEdit(event) }} label={'EDIT'} type='edit-invalid-mid' /></div>
                  </div>
                </div>;
              })}
            {/* <div onClick={props.onClickAdd} className={'invalid-word add-invalid-string-button'}>ADD</div> */}
              <input onClick={props.onClickAdd} placeholder='ADD' type='text' id='mid-input' className='add-invalid-input'></input>
            </div>
            <h3>End of word</h3>
            <div className='rule-word-list invalid' id='end-word-list'>
              {props.ruleData.endWord.map((wordPiece, i) => {
                let elementID = `end-word-list-${wordPiece}-${i}`;
                let pieceSelected = props.selectedString.string === wordPiece && props.selectedString.id === elementID;
                return <div
                  onClick={(event) => { props.onClickWordPiece(event) }}
                  key={i}
                  id={elementID}                  
                  className={pieceSelected ? 'invalid-word selected' : 'invalid-word'}>
                  <div>{wordPiece}</div>
                  <div className='mini-edit-button-area'>
                    <div><Button className='string-delete-button' onClick={(event) => { props.onClickEdit(event) }} label={'DEL'} type='delete-invalid-end' /></div>
                    <div><Button className='string-edit-button' onClick={(event) => { props.onClickEdit(event) }} label={'EDIT'} type='edit-invalid-end' /></div>
                  </div>
                </div>;
              })}
            {/* <div onClick={props.onClickAdd} className={'invalid-word add-invalid-string-button'}>ADD</div> */}
              <input onClick={props.onClickAdd} placeholder='ADD' type='text' id='end-input' className='add-invalid-input'></input>
            </div>
            <h3>Exact word only</h3>
            <div className='rule-word-list invalid' id='lone-word-list'>
              {props.ruleData.loneWord.map((wordPiece, i) => {
                let elementID = `lone-word-list-${wordPiece}-${i}`;
                let pieceSelected = props.selectedString.string === wordPiece && props.selectedString.id === elementID;
                return <div
                  onClick={(event) => { props.onClickWordPiece(event) }} 
                  key={i}
                  id={elementID}                  
                  className={pieceSelected ? 'invalid-word selected' : 'invalid-word'}>
                  <div>{wordPiece}</div>
                  <div className='mini-edit-button-area'>
                    <div><Button className='string-delete-button' onClick={(event) => { props.onClickEdit(event) }} label={'DEL'} type='delete-invalid-lone' /></div>
                    <div><Button className='string-edit-button' onClick={(event) => { props.onClickEdit(event) }} label={'EDIT'} type='edit-invalid-lone' /></div>
                  </div>
                </div>;
              })}
              {/* <div onClick={props.onClickAdd} className={'invalid-word add-invalid-string-button'}>ADD</div> */}
              <input onClick={props.onClickAdd} placeholder='ADD' type='text' id='lone-input' className='add-invalid-input'></input>
            </div>
          </div>
        </div>
        <div className='rule-area'>
          <div className='rule-header'>
            <div>Banned combinations</div>
            {/* <div><Button className='rule-edit-button' onClick={props.onClickEdit} label={'EDIT'} type='edit-combinations' /></div> */}
          </div>
          <div>
            <h3>Left column can never be followed by right column</h3>
            <div className='rule-word-list' id='followers-word-list'>
              {followerLists.map((wordList, i) => {
                let categoryLetter = wordList[0];
                wordList.splice(0, 1);
                return (
                  <div key={i}>
                    <div className='invalid-row'>
                      <div className={'invalid-preceder'}>{categoryLetter}</div>
                      <div className='follower-area'>{
                        wordList.map((wordPiece, j) => {
                          let elementID = `followers-word-list-${categoryLetter}-${wordPiece}-${j}`;
                          let pieceSelected = props.selectedString.string === wordPiece && props.selectedString.id === elementID;
                          return (<div
                            key={j}
                            id={elementID}
                            onClick={(event) => { props.onClickWordPiece(event) }}
                            className={pieceSelected ? 'invalid-word word-piece selected' : 'invalid-word word-piece'}>                            
                            <div className='edit-button-top-half'>{pieceSelected && <div className='edit-button-preceder'>{categoryLetter}</div>}{wordPiece}</div>
                            <div className='mini-edit-button-area'>
                              <div><Button className='string-delete-button' onClick={(event) => { props.onClickEdit(event) }} label={'DEL'} type='delete-follower' /></div>
                              <div><Button className='string-edit-button' onClick={(event) => { props.onClickEdit(event) }} label={'EDIT'} type='edit-follower' /></div>
                            </div>
                          </div>);
                        })
                      }
                        <div onClick={props.onClickAdd} className={'invalid-word word-piece add-invalid-string-button'}>ADD</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>        
      </div>
      <div className='lower-nav-panel'>
        <div><Link to='/' replace><Button onClick={props.onClickBack} className='bottom-nav back-button nav-link' label={'BACK'} type='rules-back' /></Link></div>
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
    && prevProps.selectedString == nextProps.selectedString
  );  
  return equalTest;
}
export default React.memo(RulesScreen, isEqual);
// export default RulesScreen;






