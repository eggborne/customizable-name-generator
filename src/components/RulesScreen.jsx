import React from 'react';
// eslint-disable-next-line
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Button from './Button';
import AddStringScreen from './AddStringScreen';
import FeedbackButtonSelection from './FeedbackButtonSelection';

import '../css/Button.css';
import '../css/RulesScreen.css';

let ruleTypes = [
  [
    { title: 'Valid Word Units' },
    {
      lists: [{ title: 'Consonants that can begin a syllable', list: [], id: 'consonantStarters' }, { title: 'Consonants that can end a syllable', list: [], id: 'consonantEnders' }, { title: 'Vowel Units', list: [], id: 'vowelUnits' }]
    }
  ],
  [
    { title: 'Banned Letter Sequences' },
    {
      lists: [{ title: 'Anywhere', list: [], id: 'universal' }, { title: 'Beginning of word', list: [], id: 'startWord' }, { title: 'Middle of word', list: [], id: 'midWord' }, { title: 'End of word', list: [], id: 'endWord' }, { title: 'Exact word only', list: [], id: 'loneWord' }]
    }
  ],
  [
    { title: 'Banned Unit Combinations' },
    {
      lists: [{ title: 'Unit on left can never be followed by unit(s) on right', list: {}, id: 'invalidFollowers' }]
    }
  ]
];

class RulesScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sectionCollapsed: {
        consonantStarters: true,
        consonantEnders: true,
        vowelUnits: true,
        universal: true,
        startWord: true,
        midWord: true,
        endWord: true,
        loneWord: true,
        invalidFollowers: true
      },
      editingSection: {
        listName: '',
        description: ''
      }
    };
  }

  // componentDidMount = () => {

  // }

  // shouldComponentUpdate = (prevProps, nextState) => {
  //   return (Object.values(this.state.sectionCollapsed).filter(sec => sec) !== Object.values(nextState.sectionCollapsed).filter(sec => sec)
  //     || (prevProps.ruleData.index !== this.props.ruleData.index)
  //     || (prevProps.ruleData.usingRuleset !== this.props.ruleData.usingRuleset)
  //   );
  // }

  componentDidUpdate = (prevProps, nextState) => {
    if ((prevProps.location.location.pathname === '/rules' && !this.props.location.location.pathname.includes('rules')
        || prevProps.location.location.pathname === '/rules/rulesetselect' && this.props.location.location.pathname.includes('rules')
        && prevProps.ruleData.usingRuleset !== this.props.ruleData.usingRuleset)) {
      let newCollapsed = { ...this.state.sectionCollapsed };
      for (let sec in newCollapsed) {
        newCollapsed[sec] = true;
      }
      console.log(newCollapsed)
      this.setState({
        sectionCollapsed: newCollapsed
      });
    }
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
        // sectionEl.style.height = '8vh';
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
        // if (sectionType === 'invalidFollowers') {
          sectionEl.style.height = '100%';
        // } else {
          // sectionEl.style.height = '100vh';
        // }
        setTimeout(() => {
          sectionEl.classList.remove('hiding');
        }, 105);          
      });
    }
  };

  handleClickAdd = (event, listName) => {
    // let category = event.target.parentElement.parentElement.parentElement.children[0].children[0].innerHTML)
    let category;
    let subCategory;
    ruleTypes.forEach(type => {
      let listArr = type[1].lists;
      listArr.forEach((listObj) => {
        if (listObj.id === listName) {
          category = type[0].title;
          subCategory = listObj.title;
        }
      });
    });

    // document.getElementById('rule-description').innerHTML = `${category} - ${subCategory}`;
  
    console.log('adding to', listName);
    this.setState({
      editingSection: {
        listName: listName,
        description: `${category}`
      }
    });

  }
  handleClickCancelAdd = (event, listName) => {
    
  }

  render() {
    console.error('rendering RulesScreen!!', this.props.ruleData);
    let creatorName = this.props.ruleData.creator.split('-')[0];
    let unitTypes = [this.props.ruleData.consonantStarters, this.props.ruleData.consonantEnders, this.props.ruleData.vowelUnits];
    let bannedTypes = [this.props.ruleData.universal, this.props.ruleData.startWord, this.props.ruleData.midWord, this.props.ruleData.endWord, this.props.ruleData.loneWord, this.props.ruleData.invalidFollowers];
    let followerTypes = [this.props.ruleData.invalidFollowers];
    unitTypes.forEach((unitList, u) => {
      let maxLength = unitList.reduce((r, e) => (r.length < e.length ? e : r), '').length;
      let newListArrays = [];
      for (let i = 0; i < maxLength; i++) {
        newListArrays[i] = unitList.filter(unit => unit.length === i + 1);
      }
      unitTypes[u] = newListArrays;
      // console.log('made list', unitList);
    });

    let consonantStarters = unitTypes[0];
    let consonantEnders = unitTypes[1];
    let vowelUnits = unitTypes[2];

    ruleTypes.forEach((section, s) => {
      let lists = section[1].lists;
      lists.forEach((list, k) => {
        if (s === 0) {
          list.list = unitTypes[k];
        }
        if (s === 1) {
          list.list = bannedTypes[k].sort();
        }
        if (s === 2) {
          list.list = followerTypes[k];
        }
      });
    });
    let allUnits = (consonantStarters + consonantEnders + vowelUnits)
      .split(',')
      .filter(unit => unit)
      .sort()
      .sort((a, b) => a.length - b.length);
    allUnits = [...new Set(allUnits)];
    let stringIsSelected = this.props.selectedString.string.length;
    return (
      <div className={this.props.location.location.pathname.includes('/rules') ? undefined : 'hidden'} id='rules-screen'>
        <Router basename='/namegenerator/rules'>
          <Route path='/' render={location =>
            <AddStringScreen
              location={location}
              feedbackTypesSelected={this.props.feedbackTypesSelected}
              feedbackTypesDiscovered={this.props.feedbackTypesDiscovered}
              render={                
                <>
                  <div className='title-header' id='string-screen-title'>
                    <div>ADD RULE</div>
                    <div id='rule-description'>{this.state.editingSection.description}</div>
                  </div>
                  <div id='add-string-body'>
                    <input onChange={(event) => this.props.onEnterLetter(event)} maxLength='5' placeholder='enter letters' type='text' id='submit-string-input'></input>
                    <FeedbackButtonSelection
                      feedbackTypesSelected={this.props.feedbackTypesSelected}
                      feedbackTypesDiscovered={this.props.feedbackTypesDiscovered}
                      onClickFeedback={this.props.onClickFeedback} />
                  </div>
                  <div className='lower-nav-panel floating'>
                    <Link to='/' replace>
                      <Button onClick={() => this.props.onClickCancelAdd} className='bottom-nav nav-link cancel-button' label={'CANCEL'} />
                    </Link>
                    <Link to={`/`} replace>
                      <Button onClick={this.props.onClickSendFeedback} className='bottom-nav nav-link' label={'SUBMIT'} type='submit-string' />
                    </Link>
                  </div>
                </>
              }
            />
          } />
        <div className='title-header' id='rules-title'>
          RULES
          <div className='title-info' id='rules-info-display'>
            Using ruleset #{this.props.ruleData.usingRuleset} '{this.props.ruleData.dialect}' by {creatorName}
          </div>
        </div>
        <div id='rules-list'>
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
                    return (
                      <div id={`${list.id}`} className='list-container closed hiding' key={`$list-container-${r}-${s}`}>
                        <h3 className={'rule-category-title'}>
                          <div>
                            <div>{list.title}</div>
                            
                            <div className={'collapsed-list-info'}>
                            {collapsed ?
                              `Items: ${stringList.length}`
                              :
                              `Click a sequence to edit/delete`                                                              
                            }
                            </div>                            
                          </div>
                          <div className='list-button-area'>
                            <Link to='/addrule'>
                              <div onClick={event => this.handleClickAdd(event, list.id)} className='list-title-button add-invalid-string-button clickable'>+</div>
                            </Link>
                            <div onClick={event => this.toggleSectionOpen(event, list.id)} className={collapsed ? 'list-title-button expand-list-button clickable' : 'list-title-button expand-list-button clickable pressed'}>
                              <i className='material-icons'>arrow_drop_down</i>
                            </div>
                          </div>
                        </h3>
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
                                      {str.map((piece, p) => {
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
                      </div>
                    );
                  } else {
                    return (
                      <div id={`${list.id}`} key={r} className='list-container closed hiding'>
                        <h3 className={'rule-category-title'}>
                          <div>
                            <div>{list.title}</div>
                            <div className={'collapsed-list-info'}>
                            {collapsed ?
                              `Initial Units: ${Object.keys(stringList).length} Items: ${[].concat.apply([], Object.values(stringList)).length}`
                              :
                              `Click a unit to edit/delete`                                                              
                            }
                            </div>
                          </div>
                          <div className='list-button-area'>
                            <Link to='/addrule'>
                              <div onClick={event => this.handleClickAdd(event, list.id)} className={'list-title-button add-invalid-string-button'}>+</div>
                            </Link>
                            <div onClick={event => this.toggleSectionOpen(event, list.id)} className={collapsed ? 'list-title-button expand-list-button clickable' : 'list-title-button expand-list-button clickable pressed'}>
                              <i className='material-icons'>arrow_drop_down</i>                              
                            </div>                           
                          </div>
                        </h3>
                        <div className={`rule-word-list ${listClass}`} id='followers-word-list'>
                          {!collapsed && (
                            allUnits.map((preceder, b) => {
                              let list;
                              if (stringList[preceder]) {
                                list = stringList[preceder].sort();
                              } else {
                                list = [];
                              }
                              return (
                                <div key={`invalid-row-container-${r}-${s}-${b}`}>
                                  <div className='invalid-row'>
                                    <div className={'invalid-preceder'}>{preceder}</div>
                                    <div className='follower-area'>
                                      {list.length ? (
                                        list.map((wordPiece, w) => {
                                          let elementID = `followers-word-list-${preceder}-${wordPiece}-${w}`;
                                          let pieceSelected = this.props.selectedString.string === wordPiece && this.props.selectedString.id === elementID;
                                          return (
                                            <div
                                              key={elementID}
                                              id={elementID}
                                              onClick={event => {
                                                this.props.onClickWordPiece(event, list.id);
                                              }}
                                              className={pieceSelected ? 'invalid-word word-piece selected' : 'invalid-word word-piece'}>
                                              {wordPiece}
                                            </div>
                                          );
                                        })
                                      ) : (
                                        <div />
                                      )}
                                      <div onClick={this.props.onClickAdd} className={'list-title-button add-invalid-string-button'}>
                                        +
                                      </div>
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
        </Router>
        {stringIsSelected ? (
          <div className={stringIsSelected ? 'lower-nav-panel string-selected' : 'lower-nav-panel'}>
            <div>
              <div>
                <Button onClick={this.props.onClickBack} className='bottom-nav nav-link' label={'CANCEL'} type='rules-cancel' />
              </div>
            </div>
            <div>
              <div>
                <Button onClick={() => null} className='bottom-nav nav-link' label={`EDIT '${this.props.selectedString.string.toUpperCase()}'`} type='rules-edit-string' />
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
