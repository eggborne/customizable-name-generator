import React from 'react';
// eslint-disable-next-line
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Button from './Button';
import LoginStatusIndicator from './LoginStatusIndicator'

import '../css/Button.css';
import '../css/RulesScreen.css';

let ruleTypes = [
  [
    { title: 'Valid Syllable Units' },
    {
      lists: [
        { id: 'onsets', title: 'Onsets', description: 'Consonant units that can begin a syllable', list: [], },
        { id: 'nuclei', title: 'Nuclei', description: 'Vowel units in the middle of a syllable', list: [], },
        { id: 'codas', title: 'Codas', description: 'Consonant units that can end a syllable', list: [], },
      ]
    }
  ],
  [
    { title: 'Banned Unit Combinations' },
    {
      lists: [
        { title: 'Two-Unit Sequences', description: '', list: {}, id: 'invalidFollowers' },
        { title: 'Three-Unit Sequences', description: '', list: {}, id: 'invalidTriplets' }
      ]
    }
  ],
  [
    { title: 'Banned Unit Sequences' },
    {
      lists: [
        { title: 'Anywhere', description: '', list: [], id: 'universal' },
        { title: 'Beginning of word', description: '', list: [], id: 'startWord' },
        { title: 'Middle of word', description: '', list: [], id: 'midWord' },
        { title: 'End of word', description: '', list: [], id: 'endWord' },
        { title: 'Exact word only', description: '', list: [], id: 'loneWord' }
      ]
    }
  ],
  // [
  //   { title: 'Banned Unit Combinations' },
  //   {
  //     lists: [
  //       { title: 'Two-Unit Sequences', description: '', list: {}, id: 'invalidFollowers' },
  //       { title: 'Three-Unit Sequences', description: '', list: {}, id: 'invalidTriplets' }
  //     ]
  //   }
  // ]
];

class RulesScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sectionCollapsed: {
        onsets: true,
        codas: true,
        nuclei: true,
        universal: true,
        startWord: true,
        midWord: true,
        endWord: true,
        loneWord: true,
        invalidFollowers: true,
        invalidTriplets: true
      },
      editingSection: {
        listName: '',
        description: ''
      },
      loggingIn: false,
      registering: false
    };
  }

  shouldComponentUpdate = (prevProps, nextState) => {    
    let should = (Object.values(this.state.sectionCollapsed).filter(sec => sec).length !== Object.values(nextState.sectionCollapsed).filter(sec => sec).length
    || (prevProps.ruleData.index !== this.props.ruleData.index)
    || (prevProps.ruleData.usingRuleset !== this.props.ruleData.usingRuleset)
    || (prevProps.userID !== this.props.userID)
    || (prevProps.location.location.pathname !== '/rules' && this.props.location.location.pathname === '/rules')
      || (prevProps.location.location.pathname === '/rules' && this.props.location.location.pathname !== '/rules')
      || (prevProps.selectedString.string !== this.props.selectedString.string)
      || (prevProps.selectedString.sequence !== this.props.selectedString.sequence)
    );
    return should;
  }

  componentDidUpdate = (prevProps, nextState) => {
    let leaving = prevProps.location.location.pathname === '/rules' && !this.props.location.location.pathname.includes('rules');
    // let comingFromRulesetSelect = prevProps.location.location.pathname === '/rules/rulesetselect' && this.props.location.location.pathname.includes('rules');
    let comingFromRulesetSelect = false;
    if (leaving || comingFromRulesetSelect
        && prevProps.ruleData.usingRuleset !== this.props.ruleData.usingRuleset) {
      let newCollapsed = { ...this.state.sectionCollapsed };
      for (let sec in newCollapsed) {
        newCollapsed[sec] = true;
      }
      this.setState({
        sectionCollapsed: newCollapsed
      });
    }    
  }

  niceDate = (grossDate) => {
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

  toggleSectionOpen = (event, sectionType) => {
    let sectionEl = document.getElementById(sectionType);
    let newCollapsed = { ...this.state.sectionCollapsed };
    newCollapsed[sectionType] = !newCollapsed[sectionType];
    if (newCollapsed[sectionType]) {
      let selectedString = this.props.selectedString;
      if (selectedString.ruleType === sectionType) {
        this.props.onClickWordPiece(event, sectionType, true);
      }
      sectionEl.classList.add('hiding');
      setTimeout(() => {
        sectionEl.classList.add('closed');
        this.setState({
          sectionCollapsed: newCollapsed
        });
      }, 105);
    } else {
      this.setState({
        sectionCollapsed: newCollapsed
      }, () => {
        sectionEl.classList.remove('closed');
        sectionEl.style.height = '100%';
        setTimeout(() => {
          sectionEl.classList.remove('hiding');
        }, 105);          
      });
    }
  };
  handleClickAdd = (event, listName) => {
    let category;
    ruleTypes.forEach(type => {
      let listArr = type[1].lists;
      listArr.forEach((listObj) => {
        if (listObj.id === listName) {
          category = type[0].title;
        }
      });
    });
    this.setState({
      editingSection: {
        listName: listName,
        description: `${category}`
      }
    });
    this.props.setFeedbackMode('enter', listName, category)
  }

  render() {
    console.error('rendering RulesScreen!!', this.props);
    let unitTypes = [this.props.ruleData.onsets, this.props.ruleData.nuclei, this.props.ruleData.codas];
    let bannedTypes = [this.props.ruleData.universal, this.props.ruleData.startWord, this.props.ruleData.midWord, this.props.ruleData.endWord, this.props.ruleData.loneWord, this.props.ruleData.invalidFollowers];
    let followerTypes = [this.props.ruleData.invalidFollowers, this.props.ruleData.invalidTriplets];
    unitTypes.forEach((unitList, u) => {
      let maxLength = unitList.reduce((r, e) => (r.length < e.length ? e : r), '').length;
      let newListArrays = [];
      for (let i = 0; i < maxLength; i++) {
        newListArrays[i] = unitList.filter(unit => unit.length === i + 1);
      }
      unitTypes[u] = newListArrays;
    });
    let onsets = unitTypes[0];
    let nuclei = unitTypes[1];
    let codas = unitTypes[2];
    ruleTypes.forEach((section, s) => {
      section[1].lists.forEach((list, k) => {
        if (s === 0) { list.list = unitTypes[k]; }
        if (s === 1) { list.list = followerTypes[k]; }
        if (s === 2) { list.list = bannedTypes[k].sort(); }
      });
    });
    let allUnits = [...[...onsets, ...nuclei, ...codas]]
        .flat()
        .sort()
        .sort((a, b) => a.length - b.length)
        .filter(unit => unit)      
    allUnits = [...new Set(allUnits)];

    // console.warn('made allUnits', allUnits);
    let stringIsSelected = this.props.selectedString.string.length;
    let credit = '';
    if (this.props.ruleData.creator !== 'Default') {
      credit = ` by ${this.props.ruleData.creator}`;
    }
    console.error('patterns', this.props.patterns);
    let numberOfPatterns = Object.keys(this.props.patterns.filter(pattern => pattern.rulesetID == this.props.ruleData.usingRuleset)[0].patternObject).length || -22;
    return (
      <div className={this.props.location.location.pathname.includes('/rules') ? undefined : 'hidden'} id='rules-screen'>
        <div className='title-header' id='rules-title'>
          <div id='rules-title-text'>RULES</div>          
          <div id='login-header-area'>
              {this.props.userLoggedIn ?
              <>                
                <div className='logged-in' id='login-instructions'>
                <LoginStatusIndicator {...this.props} />
                </div>
                <Button onClick={(event) => this.props.onClickLogOut(event)} className='mini-button' label={'LOG OUT'} type='log-out' />
              </>
              :
              <>
              <div id='login-instructions'>Log in to save your changes</div>
              <Button onClick={(event) => this.props.onClickCallLogin(event)} className='mini-button' label={'LOG IN'} type='log-in' />
              <Button onClick={(event) => this.props.onClickRegister(event)} className='mini-button' label={'REGISTER'} type='register' />
              </>
            }  
            </div>
        </div>
        <div id='rules-list'>
          <div id='title-info'>
            <div>
              Ruleset #{this.props.ruleData.usingRuleset}
            </div>
            <div>
              '{this.props.ruleData.dialect}'
            </div>
            <div>
              {credit}
            </div>
            <div>Patterns: {numberOfPatterns}</div>
            <div>
              Total Rules: {this.props.ruleData.totalRules}
            </div>
            <div>
              Last edited: {this.niceDate(this.props.ruleData.lastEdited)}
            </div>
          </div>
          {ruleTypes.map((ruleArr, r) => {
            let ruleTitle = ruleArr[0].title;
            let listArr = ruleArr[1].lists;
            return (
              <div key={`rule-area-${r}`} id={`rule-area-${r}`} className='rule-area'>
                <div className='rule-header'>
                  <div>{ruleTitle}</div>
                </div>
                {listArr.map((list, s) => {
                  let stringList = list.list;
                  let listClass = !r ? 'valid' : 'invalid';
                  let collapsed = this.state.sectionCollapsed[list.id];
                  if (list.list.map) {
                    let numOfItems = stringList.flat().length;
                    return (
                      <div id={`${list.id}`} className='list-container closed hiding' key={`$list-container-${r}-${s}`}>
                        <h3 className={'rule-category-title'}>
                          <div>
                            <div id={list.id} className='outer-list-title'>{list.title}</div>                            
                            <div className='outer-list-description'>{list.description}</div>
                            <div className={'collapsed-list-info'}>
                            {collapsed ?
                              `Items: ${numOfItems}`
                              :
                              `Click a ${r ? 'sequence' : 'unit'} to edit/delete`                                                              
                            }
                            </div>                            
                          </div>
                          <div className='list-button-area'>
                            <div onClick={event => this.handleClickAdd(event, list.id)} className='list-title-button add-invalid-string-button clickable'>+</div>
                            <div onClick={event => this.toggleSectionOpen(event, list.id)} className={collapsed ? 'list-title-button expand-list-button clickable' : 'list-title-button expand-list-button clickable pressed'}>
                              <i className='material-icons'>arrow_drop_down</i>
                            </div>
                          </div>
                        </h3>
                          <>
                        <div className={`rule-word-list ${listClass}`}>
                          {!collapsed &&
                            stringList.map((str, i) => {
                              let elementID = `string-${r}-${s}-${i}`;
                              let pieceSelected = this.props.selectedString.string === str && this.props.selectedString.id === elementID;
                              if (typeof str === 'string') {
                                return (
                                  <div
                                    onClick={event => {
                                      this.props.onClickWordPiece(event, list.id);
                                    }}
                                    key={elementID}
                                    id={elementID}
                                    className={pieceSelected ? 'invalid-word selected' : 'invalid-word'}>
                                    {str}
                                  </div>
                                );
                              } else {
                                if (str.length) {
                                  return (
                                    <div key={`${r}-${s}-${i}`} className='valid-length-list'>
                                      {str.sort().map((piece, p) => {
                                        elementID = `string-${r}-${s}-${i}-${p}`;
                                        pieceSelected = this.props.selectedString.string === piece && this.props.selectedString.id === elementID;
                                        return (
                                          <div
                                            onClick={event => {
                                              this.props.onClickWordPiece(event, list.id);
                                            }}
                                            key={elementID}
                                            id={elementID}
                                            className={pieceSelected ? 'invalid-word selected' : 'invalid-word'}>
                                            {piece}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  );
                                }
                              }
                            })}
                            </div>
                          {/* <div style={{ width: '100vw', height: '1vh' }}>DIVIDER FOR LENGTHS?</div> */}
                        </>
                      </div>
                    );
                  } else {
                    return (
                      <div id={`${list.id}`} key={r} className='list-container closed hiding'>
                        <h3 className={'rule-category-title'}>
                          <div>
                            <div id={list.id} className='outer-list-title'>{list.title}</div>
                            <div className='outer-list-description'>{list.description}</div>
                            <div className={'collapsed-list-info'}>
                            {collapsed ?
                              `Initial Units: ${Object.keys(stringList).length} Items: ${[].concat.apply([], Object.values(stringList)).length}`
                              :
                              `Click a unit to edit/delete`                                                              
                            }
                            </div>
                          </div>
                          <div className='list-button-area'>
                            <div onClick={event => this.handleClickAdd(event, list.id)} className={'list-title-button add-invalid-string-button'}>+</div>
                            <div onClick={event => this.toggleSectionOpen(event, list.id)} className={collapsed ? 'list-title-button expand-list-button clickable' : 'list-title-button expand-list-button clickable pressed'}>
                              <i className='material-icons'>arrow_drop_down</i>                              
                            </div>                           
                          </div>
                        </h3>
                        <div className={`rule-word-list ${listClass}`} id='followers-word-list'>
                          {!collapsed && (
                            // allUnits.map((preceder, b) => {
                            allUnits.filter(preceder => stringList[preceder] && stringList[preceder].length).map((preceder, b) => {
                              // console.log('prec', preceder)
                              let innerList;
                              if (stringList[preceder]) {
                                innerList = stringList[preceder].sort();
                              } else {
                                innerList = [];
                              }
                              return (
                                <div key={`invalid-row-container-${r}-${s}-${b}`}>
                                  <div className='invalid-row'>
                                    <div className={'invalid-preceder'}>{preceder}</div>
                                    <div className='follower-area'>
                                      {innerList.length ? (
                                        innerList.map((wordPiece, w) => {
                                          let elementID = `followers-word-list-${preceder}-${wordPiece}-${w}`;
                                          let pieceSelected = this.props.selectedString.string === wordPiece && this.props.selectedString.id === elementID;
                                          return (
                                            <div
                                              key={elementID}
                                              id={elementID}
                                              onClick={event => {
                                                this.props.onClickWordPiece(event, [list.id, preceder]);
                                              }}
                                              className={pieceSelected ? 'invalid-word word-piece selected' : 'invalid-word word-piece'}>
                                              {wordPiece}
                                            </div>
                                          );
                                        })
                                      ) : (
                                        <div />
                                      )}
                                      {/* <div onClick={this.props.onClickAdd} className={'list-title-button add-invalid-string-button'}>
                                        +
                                      </div> */}
                                    </div>
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>
                    );
                  }
                })}
              </div>
            );
          })}
        </div>
        {stringIsSelected ? (
          <div className={stringIsSelected ? 'lower-nav-panel string-selected' : 'lower-nav-panel'}>
            <div>
              <div>
                <Button onClick={this.props.onClickBack} className='bottom-nav nav-link' label={'CANCEL'} type='rules-cancel' />
              </div>
            </div>
            <div>
              <div>
                <Button onClick={(event) => this.props.onClickEdit(event, this.props.selectedString.ruleType)} className='bottom-nav nav-link' label={`EDIT '${this.props.selectedString.string.toUpperCase()}'`} type='rules-edit-string' />
              </div>
            </div>
            <div>
              <div>
                <Button onClick={this.props.onClickDeleteString} className='bottom-nav nav-link' label={`DELETE '${this.props.selectedString.string.toUpperCase()}'`} type='rules-delete-string' />
              </div>
            </div>
          </div>
        ) : (
          <div className={stringIsSelected ? 'lower-nav-panel' : 'lower-nav-panel'}>
            <div>
              <Link to='/' replace>
                <Button onClick={this.props.onClickBack} className='bottom-nav back-button nav-link' label={'BACK'} type='rules-back' />
              </Link>
            </div>
            <div className='double-button'>
              <Link to='/rules/rulesetselect' replace>
                <Button onClick={this.props.onClickChangeRuleset} className='bottom-nav nav-link' label={'CHOOSE RULESET...'} type='change-ruleset' />
              </Link>
            </div>
          </div>
            )}
      </div>
    );
  }
}

export default RulesScreen;
