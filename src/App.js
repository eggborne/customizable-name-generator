import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import axios from 'axios';
import NameGenerator from './js/randomname.js';
import TitleBar from './components/TitleBar.jsx';
import NameDisplay from './components/NameDisplay.jsx';
import ButtonArea from './components/ButtonArea.jsx';
import HistoryScreen from './components/HistoryScreen.jsx';
import RulesScreen from './components/RulesScreen.jsx';
import RulesetSelect from './components/RulesetSelect.jsx';
import FeedbackWindow from './components/FeedbackWindow.jsx';

window.addEventListener('DOMContentLoaded', (event) => {
  console.log('DOM fully loaded and parsed in', window.performance.now() - initialLoad);
});

let initialLoad = window.performance.now();

const PROD = process.env.NODE_ENV === 'production';
let ROOT;
if (!PROD) {
  ROOT = 'https://eggborne.com/namegenerator/php'
} else {
  ROOT = `php/`;
}
const clickListeners = {
  onPointerDown: {
    lowerCase: {
      down: 'pointerdown',
      up: 'pointerup'
    },
    camelCase: {
      down: 'onPointerDown',
      up: 'onPointerUp'
    }
  },
  onTouchStart: {
    lowerCase: {
      down: 'touchstart',
      up: 'touchend'
    },
    camelCase: {
      down: 'onTouchStart',
      up: 'onTouchEnd'
    }
  },
  onMouseDown: {
    lowerCase: {
      down: 'mousedown',
      up: 'mouseup'
    },
    camelCase: {
      down: 'onMouseDown',
      up: 'onMouseUp'
    }
  },
}
const clickFunction = window.PointerEvent ? 'onPointerDown' : window.TouchEvent ? 'onTouchStart' : 'onMouseDown';
const clickListener = clickListeners[clickFunction];
console.log(clickListener)

export const swapSpeed = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--swap-speed'));

function getRules(creator) {
  console.log(`${PROD} to getRules from creator ${creator} from ${ROOT}`)
  return axios({
    method: 'get',
    url: `${ROOT}/getrules.php`,
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    },
    params: {
      dialect: 'Star Wars',
      creator: creator
    }
  });
}
function getAllRulesets() {
  console.log(`getting rulesets from ${ROOT}`);
  return axios({
    method: 'get',
    url: `${ROOT}/getrulesets.php`,
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    }
  });
}

function sendNewRules(rulesObj) {
  console.log('got',rulesObj)
  let changedRules = rulesObj.changed;
  for (let listType in rulesObj) {
    if (rulesObj[listType].map) {
      rulesObj[listType].map((str, i) => {
        if (str.includes && str.includes('q\'')) {
          rulesObj[listType][i] = str.replace('q\'', 'qapos');
        }
      });
    }
  };
  let lastRulesID = undefined;
  if (rulesObj.usingRuleset.includes('custom') && !rulesObj.usingRuleset.includes('mike')) {
    lastRulesID = rulesObj.usingRuleset;
  }
  let creatorName = rulesObj.rulesetSelected;
  console.info('RULES ----------------------', rulesObj);
  console.warn('sending new id', creatorName, 'and deleting', lastRulesID)
  return axios({
    method: 'post',
    url: `${ROOT}/sendnewrules.php`,
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    },
    params: {
      lastRulesID: lastRulesID,
      creator: creatorName,
      changed: JSON.stringify(changedRules),
      dialect: 'Star Wars',
      banned: JSON.stringify(rulesObj.banned),
      universal: JSON.stringify(rulesObj.universal),
      startWord: JSON.stringify(rulesObj.startWord),
      midWord: JSON.stringify(rulesObj.midWord),
      endWord: JSON.stringify(rulesObj.endWord),
      loneWord: JSON.stringify(rulesObj.loneWord),
    }
  });
}

class App extends Component {
  constructor(props) {
    super(props);    
    this.state = {
      currentNameStyle: 'random',
      username: 'mike',      
      scanMode: false,      
      bulkAmount: 50,
      scanning: false,
      generating: false,
      searching: false,
      userStopped: false,
      dirtyMode: false,
      blockMode: true,
      defaultSegmentSize: 90,
      segmentSize: 90,
      charactersGenerated: [],
      namesGenerated: 0,
      loop: 1,
      startScan: null,
      wordData: {},
      animationSpeed: 105,
      lastRequested: 0,
      lastChangedRules: null,
      customRules: [],
      changedRules: [],
      challengedStringIndexes: [],
      challengedStringValue: null,
      feedbackTypesSelected: [],
      ruleData: {
        // invalidStrings: {},
        // invalidCombinations: {},
        // simpleMode: false,
        // listInvalid: false,
        // rulesets: [],
        // rulesetSelected: 'mike',
        // usingRuleset: 'mike',

        banned: [],
        changed: [],
        consonantEnders: [],
        consonantStarters: [],
        creator: [],
        endWord: [],
        loneWord: [],
        midWord: [],
        startWord: [],
        universal: [],
        vowelUnits: [],
        invalidStrings: {},
        invalidFollowers: {},
        rulesets: [],
        rulesetSelected: 'mike',
        usingRuleset: 'mike',
      },
      productionData: {
        violations: [],
        namesList: [],
        usedKeys: [],
        bannedNamesGenerated: [],
        invalidNamesGenerated: [],
        displayedThisRun: 0,
        calledThisRun: 0,
        totalCalls: 0,
        redundancies: 0
      },
      bulkMode: false,
      simpleMode: false,        
      rejectedMode: false,
      listDirty: true,
      dataReady: false,
      lastUpdated: 0,
      hasNewRules: true,
      feedbackMode: false,
      nameEditing: {fullName: 'Bob'},
      selectedString: {
        string: '',
        id: '',
        indexes: []
      },
      statusText: 'Loading ruleset...',
      fingerData: {
        fingerDownAt: 0,
        fingerDown: false
      },
      loadingProgress: 0
    }
    this.generator = new NameGenerator();
    console.error('GENERATOR created.');
  }  
  componentDidMount() {
    if (PROD && (window.location.pathname.includes('history') || window.location.pathname.includes('rules'))) {
      window.location.pathname = '/namegenerator/';
    }    
    let startRules = window.performance.now();
    console.error('APP MOUNTED IN', (startRules - initialLoad));
    let mountTime = window.performance.now();
    this.refreshRules().then((newRuleData) => {
      let ruleTime = window.performance.now();
      // console.error('GOT RULES IN', (ruleTime - mountTime), (ruleTime - initialLoad));
      console.error('ON MOUNT TOOK', window.performance.now() - initialLoad)
      // this.displayNewName();
      getAllRulesets().then(response => {
        let rulesTime = window.performance.now();
        console.error('GOT RULESETS IN', (rulesTime - ruleTime));
        response.data.map(ruleset => {
          for (let listType in ruleset) {
            if (ruleset[listType][0] === '[' || listType === 'invalidFollowers') {
              ruleset[listType] = JSON.parse(ruleset[listType]);
            }
          }
        })
        let newRuleData = { ...this.state.ruleData };
        newRuleData.rulesets = response.data;
        this.setState({
          statusText: `Using ruleset '${newRuleData.dialect}' by ${newRuleData.creator.split('-')[0]}`,
          ruleData: newRuleData,
          lastUpdated: Date.now(),
        }, () => {
          document.body.addEventListener(clickListener.lowerCase.down, (event) => {
            this.setState({
              fingerData: { fingerDown: event, fingerDownAt: Date.now() }
            })
          });
          document.body.addEventListener(clickListener.lowerCase.up, () => {
            this.setState({
              fingerData: { fingerDown: false, fingerDownAt: 0 }
            })
          });
        });
      });
    });
  }

  handleClickGenerate = (event) => {
    // this.bounceButton(event);
    console.error('-------- generate')
    let rulesToSend;    
    if (this.state.hasNewRules) {
      rulesToSend = this.state.ruleData;
      this.setState({
        hasNewRules: false
      });
    }
    let currentSpecial;
    if (this.state.simpleMode) {
      currentSpecial = 'simple';
    }
    if (this.state.dirtyMode) {
      // let dirtyNameData;
      // console.log(this.state.productionData.calledThisRun, 'called');
      // let tries = 0;
      // while (!dirtyNameData && tries < 100) {
      //   let newName = this.generator.getName(false, this.state.currentNameStyle, currentSpecial);
      //   tries++;
      //   if (newName && newName.banned) {
      //     dirtyNameData = newName;
      //   }
      // }
      // if (dirtyNameData) {
      //   let newProductionData = { ...this.state.productionData };
      //   newProductionData.namesList.push(dirtyNameData);
      //   this.setState({
      //     productionData: newProductionData
      //   });
      // } else {
      //   this.setState({
      //     statusText: 'Too many tries.'
      //   });
      // }
    } else if (this.state.bulkMode) {
      for (let i = 0; i < this.state.bulkAmount; i++) {
        setTimeout(() => {
          this.displayNewName();
        }, (i * 20));
      }
    } else {
      this.displayNewName();
    }
    if (event) {
      event.preventDefault();
    }
  }
  displayNewName = (customRules) => {
    let startTime = window.performance.now();
    let rulesToSend;
    let currentSpecial;
    if (this.state.hasNewRules) {
      rulesToSend = this.state.ruleData;
      this.setState({
        hasNewRules: false
      });
    }
    if (customRules) {
      rulesToSend = customRules;
    }
    if (this.state.simpleMode) {
      currentSpecial = 'simple';
    }
    let newNameData = this.generator.getName(rulesToSend, this.state.currentNameStyle, currentSpecial);
    let newProductionData = { ...this.state.productionData };
    newProductionData.calledThisRun++;
    if (newNameData.redundant) {
      newProductionData.redundancies++;
      console.warn(`${newNameData.fullName} was REDUNDANT. Trying again...`);
      if (this.state.productionData.calledThisRun > 20) {
        newNameData.fullName = 'too many tries.'
      } else {
        // newProductionData.namesList.push(newNameData);
        this.setState({
          productionData: newProductionData
        }, () => {
          return this.displayNewName();
        });
      }
    } else if (newNameData.invalid || (newNameData.banned && this.state.blockMode)) {
      if (newNameData.invalid && this.state.rejectedMode) {
        newProductionData.violations.push(newNameData.violation);
        console.warn(`${newNameData.fullName} invalid: ${newNameData.violation.invalidString.value} at ${newNameData.violation.invalidString.index} violated rule  ${newNameData.violation.rule}. Trying again...`);
        if (this.state.productionData.calledThisRun > 20) {
          newNameData.fullName = 'too many tries.'
        } else {
          newProductionData.namesList.push(newNameData);
          this.setState({
            productionData: newProductionData
          }, () => {
            return this.displayNewName();
          });
        }
      }
    } else {
      let addendum = '';
      if (newProductionData.calledThisRun > 1) {
        addendum = ` (${newProductionData.calledThisRun} tries)`;
      }
      if (newNameData.banned) {
        console.error('-------------- banned got through!', newNameData)
      }
      // document.getElementById('tally-text').innerHTML = `got ${newNameData.fullName} in ${(window.performance.now() - startTime).toPrecision(3)}ms${addendum}`;
      let delay = 0;
      if (!this.state.bulkMode) {
        delay = swapSpeed * 1.5;
      } else {
        if (newProductionData.namesList.length % 6 === 0) {
          document.getElementById('history-list').scrollTop = document.getElementById('history-list').scrollHeight;
        }
      }
      setTimeout(() => {
        if (this.state.bulkMode && newProductionData.namesList.length > 200) {
          newProductionData.namesList = newProductionData.namesList.slice(newProductionData.namesList.length-200, newProductionData.namesList.length-1)
        }
        newProductionData.namesList.push(newNameData);
        newProductionData.calledThisRun = 0;
        newProductionData.displayedThisRun = 0;
        this.setState({
          // statusText: `got ${newNameData.fullName} (${newNameData.style}) in ${(window.performance.now() - startTime).toPrecision(3)}ms${addendum}`,
          productionData: newProductionData
        }, () => {
          if (this.state.bulkMode) {
            document.getElementById('history-list').scrollTop = document.getElementById('history-list').scrollHeight;
          }
        });
      }, delay);
      
      // newProductionData.namesList.push(newNameData);
      // newProductionData.calledThisRun = 0;
      // newProductionData.displayedThisRun = 0;
      // this.setState({
      //   statusText: `got ${newNameData.fullName} (${newNameData.style}) in ${(window.performance.now() - startTime).toPrecision(3)}ms${addendum}`,
      //   productionData: newProductionData
      // });
    }    
  }
  refreshRules = () => {
    let startTime = window.performance.now();
    return new Promise((resolve) => {
      getRules(this.state.ruleData.usingRuleset).then((response) => {
        let getTime = window.performance.now();
        console.error('GOT INITIAL RULES IN', getTime - startTime, response.data);
        let newData = {};
        for (let listName in response.data) {
          let list = response.data[listName];
          if (list[0] === '[') {
            list = JSON.parse(list);
            list.map((str, i) => {
              if (str.includes && str.includes('qapos')) {
                list[i] = str.replace('qapos', 'q\'');
              }
            });
            newData[listName] = list;
          } else {
            if (list[0] === '{') {
              list = JSON.parse(list);
              console.log('made', listName, list);
            }
            newData[listName] = list;
          }
        }
        console.log(newData)
        let newRuleData = { ...this.state.ruleData };
        newData.usingRuleset = newData.creator;
        newData.rulesetSelected = newRuleData.rulesetSelected;
        newData.rulesets = newRuleData.rulesets;
        console.error('INSIDE REFRESH TOOK', window.performance.now() - initialLoad)
        this.displayNewName(newData);
        // this.generator.cachedRules = newRuleData;
        // if (response.data.changed) {
        //   lastChangedRules = JSON.parse(response.data.changed);      
        // }
        // for (let type in newList) {
        //   if (type !== 'banned') {
        //     let listArr = newList[type];
        //     for (let i = 0; i < listArr.length; i++) {
        //       let item = listArr[i];
        //       if (type === 'universal') {
        //         // console.log('check', type, item)
        //       }
        //       if (newList.banned.indexOf(item) > -1) {
        //         newList[type].splice(i, 1);
        //         i--;
        //       }
        //     };
        //     newList[type] = JSON.parse(JSON.stringify(newList[type].sort()).split(',').join(', '));
        //   }
        // }
        // let wordLists = ['universal', 'start', 'mid', 'end', 'lone'];
        // for (let i = 0; i < 5; i++) {
        //   let el = document.getElementById(`${wordLists[i]}-word-list`);
        //   el.innerHTML = '';
        //   let listId = `${wordLists[i]}Word`;
        //   if (wordLists[i] === 'universal') {
        //     listId = 'universal'
        //   }
        //   newList[`${listId}`].map((invalidString, i) => {
        //     el.innerHTML += `<div onClick='selectInvalidString(event)' class='invalid-word'><div class='${listId}'>${invalidString}</div><div class='invalid-string-controls'>
        //     <button onClick='removeInvalidString(event)' class='remove-invalid-string-button'>REMOVE</button>
        //     </div></div>`;
        //     if (i === newList[`${listId}`].length - 1) {
        //       el.innerHTML += `<div onClick='createNewInvalidString(event)' class='invalid-word new-button'><div>+ ADD</div></div>`;
        //     }
        //   });
        // }       
        let stat = window.performance.now();
        this.setState({
          ruleData: newData,
          dataReady: true,
          hasNewRules: true
        }, () => {
            console.log('stat took', window.performance.now() - stat)
            resolve(newData); 
        });
      });
    });
  }
  handleChangeStyle = (event, styleClicked) => {
    this.setState({
      currentNameStyle: styleClicked
    });
    event.preventDefault();
  };
  handleChangeMode = (event, modeClicked) => {
    modeClicked = `${modeClicked.split('-')[0]}Mode`;
   
    console.log('clicked', modeClicked)
    let newMode = !this.state[modeClicked];
    console.log('newMode', newMode)
    if (modeClicked === 'bulkMode' || modeClicked === 'simpleMode') {     
      this.setState({
        [modeClicked]: !this.state[modeClicked]
      });
    } else {
      this.setState({
        [modeClicked]: newMode
      });
    }
    event.preventDefault();
  };
  handleClearList = (event) => {
    let newProductionData = { ...this.state.productionData };
    newProductionData.namesList.length = 0;
    this.setState({
      productionData: newProductionData
    });
    event.preventDefault();
  }
  handleClickBack = (event) => {
    console.log('back')
    if (this.state.feedbackMode) {
      this.setState({
        feedbackMode: false
      });
    }
    if (this.state.selectedString.string.length) {
      console.log('is selected')
      this.setState({
        selectedString: {
          string: '',
          id: ''
        }
      });
    }
    this.forceUpdate();
  }
  handleClickChangeRuleset = (event) => {
    console.log('get those rulesets')
    if ((Date.now() - this.state.lastUpdated > 500)) {
      getAllRulesets().then(response => {
        console.log('got those rulesets', response)
        response.data.map(ruleset => {
          for (let listType in ruleset) {
            if (ruleset[listType][0] === '[' || listType === 'invalidFollowers') {
              ruleset[listType] = JSON.parse(ruleset[listType]);
            }
          }
        })
        let newRuleData = { ...this.state.ruleData };
        newRuleData.rulesets = response.data;
        this.setState({
          ruleData: newRuleData,
          hasNewRules: true,
          lastUpdated: Date.now(),
        });
      });
    } else {
      // show the existing list      
    }
  }
  handleDismissRulesetSelect = (event) => {
    let newRuleData = { ...this.state.ruleData };      
    newRuleData.rulesetSelected = newRuleData.usingRuleset;
    this.setState({
      ruleData: newRuleData
    });    
  }
  handleSelectRuleset = (event) => {
    let ruleset = event.target.id;
    if (ruleset && this.state.ruleData.rulesetSelected !== ruleset) {
      let newRuleData = { ...this.state.ruleData };      
      newRuleData.rulesetSelected = ruleset;
      this.setState({
        ruleData: newRuleData
      });
    }
  }
  handleChooseNewRuleset = () => {
    let newRuleData = { ...this.state.ruleData };   
    newRuleData.usingRuleset = newRuleData.rulesetSelected;
    console.log('new rules?', newRuleData)
    this.setState({
      ruleData: newRuleData
    }, () => {
      this.refreshRules();
    });
  }
  handleClickName = (event, nameData) => {
    document.getElementById('feedback-panel').style.transformOrigin = `${event.clientX}px ${event.clientY}px`;
    this.setState({
      feedbackMode: true,
      nameEditing: nameData
    });
  }
  getNameData = (fullName) => {
    for (let nameEntry in this.state.productionData.namesList) {
      let nameData = this.state.productionData.namesList[nameEntry]
      console.log('checking if',nameData,'is',fullName)
      if (nameData.fullName == fullName) {
        console.log('it is')
        return nameData;
      }
    }
  }

  handleClickFeedback = (event) => {
    console.log(event.target);
    
  }

  handleClickEdit = (event) => {
    // testing sendNewRules!
    console.log(event.target);
    let newRuleData = { ...this.state.ruleData };
    let creatorName = `custom-${Date.now()}`;
    newRuleData.rulesetSelected = creatorName;
    console.warn('sending', newRuleData.rulesetSelected, 'rules. last:', newRuleData.creator);
    sendNewRules(newRuleData).then((response) => {
      let newRuleData = { ...this.state.ruleData };
      console.log('sendNewRules got', response);
      newRuleData.rulesetSelected = creatorName;
      newRuleData.usingRuleset = creatorName;
      newRuleData.creator = creatorName;
      this.setState({
        ruleData: newRuleData
      });
    });
  }

  handleClickWordPiece = (event, clear) => {
    let selected;
    if (event && !clear) {
      let el = event.target;
      let wordPiece = el.children[0].innerHTML;
      if (!clear && el.id !== this.state.selectedString.id && wordPiece !== this.state.selectedString.string) {
        // let offX = 50 - Math.round(((window.innerWidth / 2) - event.clientX) / (window.innerWidth / 2) * 40);
        // let offY = 50 - Math.round(((window.innerHeight / 2) - event.clientY) / (window.innerHeight / 2) * 50);
        // console.log(`${offX}% ${offY}%`)      
        // // el.style.transformOrigin = `${offX}% ${offY}%`;
        selected = {
          string: wordPiece,
          id: el.id
        };
      } else {
        selected = {
          string: '',
          id: ''
        };
      }
    } else {
      selected = {
        string: '',
        id: ''
      };
    }
    this.setState({
      selectedString: selected
    });
  }

  handleClickLetter = (event) => {
    let el = event.target;
    // console.log(event.target, event.target.innerHTML);
    let selectedString = { ...this.state.selectedString };

    if (!el.classList.contains('selected')) {
      
      el.classList.add('selected');
    } else {
      el.classList.remove('selected');
    }
  }
  handleClickAdd = (event) => {
    let el = event.target;
    let listId = event.target.parentElement.id;
    console.log(event.target, event.target.innerHTML, listId);
    

  }

  // selectFeedback = (event, type) => {
  //   if (feedbackTypesSelected.indexOf(type) === -1) {
  //     if (type === 'universal') {
  //       Array.from(document.getElementsByClassName('feedback-select-toggle')).map(type => {
  //         type.classList.remove('highlighted');
  //       });
  //       feedbackTypesSelected.length = 0;
  //     } else {
  //       if (feedbackTypesSelected.indexOf('universal') > -1) {
  //         document.getElementById(`universal-word-button`).classList.remove('highlighted');
  //         feedbackTypesSelected.splice(feedbackTypesSelected.indexOf('universal-word-button', 1));
  //       }
  //     }
  //     event.target.classList.add('highlighted');
  //     feedbackTypesSelected.push(type);
  //   } else {
  //     event.target.classList.remove('highlighted');
  //     feedbackTypesSelected.splice(feedbackTypesSelected.indexOf(type), 1);
  //   }
  //   document.getElementById('submit-feedback-button').disabled = !feedbackTypesSelected.length
  //   console.info(feedbackTypesSelected);  
  // }
  
  render() {
    let featuredName;
    let ruleData = this.state.ruleData;
    if (this.state.productionData.namesList.length) {
      featuredName = this.state.productionData.namesList[this.state.productionData.namesList.length - 1];
    }
    return (
    <div id='view-container'>
      <Router basename='/namegenerator'>
        <Route path="/" render={(location) => 
            <>
              {this.state.dataReady &&
                <>
                <RulesScreen location={location} onClickEdit={this.handleClickEdit} onClickAdd={this.handleClickAdd} selectedString={this.state.selectedString} onClickBack={this.handleClickBack} onClickWordPiece={this.handleClickWordPiece} onClickChangeRuleset={this.handleClickChangeRuleset} onClickBack={this.handleClickBack} ruleData={ruleData} />
                <HistoryScreen location={location} nameEditing={this.state.nameEditing} selectedString={this.state.selectedString} onClickName={this.handleClickName} namesList={this.state.productionData.namesList} onClickBack={this.handleClickBack} onClickGenerateMore={this.handleClickGenerate} onclickClearList={this.handleClearList} />
                  <Route path="/rules" render={() =>
                    <RulesetSelect location={location} onChooseNewRuleset={this.handleChooseNewRuleset} onSelectRuleset={this.handleSelectRuleset} onDismissRulesetSelect={this.handleDismissRulesetSelect} ruleData={this.state.ruleData} />
                  } />
                <FeedbackWindow showing={this.state.feedbackMode} location={location} onClickLetter={this.handleClickLetter} onClickFeedback={this.handleClickFeedback} onClickBack={this.handleClickBack} ruleData={this.state.ruleData} nameData={this.state.nameEditing} />
                </>
              }
              <NameDisplay location={location} progress={this.state.loadingProgress} dataReady={this.state.dataReady} fingerDown={this.state.fingerData.fingerDown} onClickName={this.handleClickName} nameData={featuredName} bulkMode={this.state.bulkMode} />
              <ButtonArea currentNameStyle={this.state.currentNameStyle} readyToGenerate={this.state.dataReady} blockMode={this.state.blockMode} bulkMode={this.state.bulkMode} simpleMode={this.state.simpleMode} rejectedMode={this.state.rejectedMode} onChangeStyle={this.handleChangeStyle} onChangeMode={this.handleChangeMode} onClickGenerate={this.handleClickGenerate} />
          </>
      } />
      </Router>
      <TitleBar titleText={'Name Generator'} statusText={this.state.statusText} totalCalls={this.generator.totalCalls} uniqueGenerated={this.state.productionData.namesList.length} />          
    </div>
    );
  }
}

export default App;