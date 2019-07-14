import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import axios from 'axios';
import NameGenerator from './js/namegenerator.js';
// import *  as NameGenerator from 'https://eggborne.com/scripts/namegen/namegenerator.js';
import TitleBar from './components/TitleBar.jsx';
import NameDisplay from './components/NameDisplay.jsx';
import ButtonArea from './components/ButtonArea.jsx';
import HistoryScreen from './components/HistoryScreen.jsx';
import RulesScreen from './components/RulesScreen.jsx';
import RulesetSelect from './components/RulesetSelect.jsx';
import FeedbackWindow from './components/FeedbackWindow.jsx';
import LoginWindow from './components/LoginWindow.jsx';
import ConfirmModal from './components/ConfirmModal.jsx';
import { namePatterns } from './js/namegenerator.js';
import { v4 as uuid } from 'uuid';

window.addEventListener('DOMContentLoaded', event => {
  console.log('DOM fully loaded and parsed in', window.performance.now() - initialLoad);  
});

let updateTimer;
let rapidTimer;
let buttonCheck;

let initialLoad = window.performance.now();

const invalidRules = ['banned', 'universal', 'startWord', 'midWord', 'endWord', 'loneWord'];
const PROD = process.env.NODE_ENV === 'production';
let ROOT = '/namegenerator/php/';
if (!PROD) {
  ROOT = 'https://eggborne.com/namegenerator/php/';
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
  }
};

const clickFunction = window.PointerEvent ? 'onPointerDown' : window.TouchEvent ? 'onTouchStart' : 'onMouseDown';
const clickListener = clickListeners[clickFunction];
console.log('clickListener', clickListener);

export const swapSpeed = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--swap-speed'));

function logUserIn(username, pass, token) {
  let userData = {
    username: username.toString(),
    pass: pass.toString(),
    token: token
  };
  return axios({
    method: 'post',
    url: `${ROOT}loguserin.php`,
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    },
    data: JSON.stringify(userData)
  });
}
function createNewUser(username, pass, getToken) {
  let userData = {
    username: username.toString(),
    pass: pass.toString(),
    getToken: getToken,
    patterns: JSON.stringify(namePatterns)
  };
  console.warn('sending UUUUUUUUUUUU >>>>>>>>>>>>>>>>>>>>', userData)
  return axios({
    method: 'post',
    url: `${ROOT}createnewuser.php`,
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    },
    data: JSON.stringify(userData)
  });
}
function getAllRulesets() {
  return axios({
    method: 'get',
    url: `${ROOT}getallrulesets.php`,
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    }
  });
}
function refreshCurrentRuleset(rulesetID) {
  return axios({
    method: 'get',
    url: `${ROOT}refreshruleset.php`,
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    },
    params: {
      rulesetID: rulesetID
    }
  });
}
// function sendNewRules33(userID, rulesObj) {
//   // console.log('sendNewRule took in', arguments);
//   // let changedRules = rulesObj.lastChanged;
//   console.log('rulesObj.lastChanged!', rulesObj.lastChanged)
//   let lastRulesIndex = undefined;
//   if (rulesObj.usingRuleset > 99) {
//     lastRulesIndex = parseInt(rulesObj.usingRuleset);
//   }
//   for (let preceder in rulesObj.invalidFollowers) {
//     let followerArr = rulesObj.invalidFollowers[preceder];
//     followerArr.map((unit, i) => {
//       if (unit.includes("q'")) {
//         followerArr[i] = unit.replace("q'", 'qapos');
//         console.log('made a q\' in', preceder);
//       }
//     })
//   }
//   let changedRules = [];
//   rulesObj.lastChanged.listTypes.forEach((listType, i, arr) => {
//     changedRules[i] = {};
//     changedRules[i].listName = listType;
//     changedRules[i].listBody = rulesObj[listType];
//   });
//   console.info(changedRules)
//   let rawData = {
//     userID: userID,
//     rulesetID: rulesObj.index,
//     changedRules: changedRules
//   };
//   console.info('raw',rawData)
//   return axios({
//     method: 'post',
//     url: `${ROOT}sendnewrules3.php`,
//     headers: {
//       'Content-type': 'application/x-www-form-urlencoded'
//     },
//     data: JSON.stringify(rawData)
//   });
// }
function sendNewRules(userID, rulesObj) {
  // let changedRules = rulesObj.lastChanged;  
  let lastRulesIndex = undefined;
  if (rulesObj.usingRuleset > 99) {
    lastRulesIndex = parseInt(rulesObj.usingRuleset);
  }
  let creatorName = rulesObj.creator;
  for (let preceder in rulesObj.invalidFollowers) {
    let followerArr = rulesObj.invalidFollowers[preceder];
    followerArr.map((unit, i) => {
      if (unit.includes("q'")) {
        followerArr[i] = unit.replace("q'", 'qapos');
        console.log('made a q\' in', preceder);
      }
    })
  }
  let changedRules = [];
  rulesObj.lastChanged.listTypes.forEach((listType, i, arr) => {
    changedRules[i] = {};
    changedRules[i].listName = listType;
    changedRules[i].listBody = rulesObj[listType];
    changedRules[i].index = rulesObj.index;
  });
  let ruleEntry = changedRules[0];
  // changedRules.forEach(ruleEntry => {
    // console.log('ruleentry?', ruleEntry)
    // console.log('rulesObj?', rulesObj)
    let rawData = {
      userID: userID,
      rulesetID: ruleEntry.index,
      ruleType: ruleEntry.listName,
      newList: ruleEntry.listBody
    };
    // console.info('raw for', rawData);
    // console.info('stringified',JSON.stringify(rawData))
    return axios({
      method: 'post',
      url: `${ROOT}sendnewrules.php`,
      headers: {
        'Content-type': 'application/x-www-form-urlencoded'
      },
      data: JSON.stringify(rawData)
    });
  // });
}
function sendNewPatterns(userID, token, rulesetID, newPatterns) {
  let rawData = {
    userID: userID,
    token: token,
    rulesetID: parseInt(rulesetID),
    newPatterns: newPatterns
  };
  // console.info('raw for sendNewPatterns is', rawData);
  // console.info('stringified',JSON.stringify(rawData))
  return axios({
    method: 'post',
    url: `${ROOT}sendnewpatterns.php`,
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    },
    data: JSON.stringify(rawData)
  });
}
const setCookie = (cookieName, cookieObj, daysToExpire) => {
  console.log('expir', cookieObj)
  cookieObj = JSON.stringify(cookieObj);
  let expirationDate = new Date();
  expirationDate.setTime(expirationDate.getTime() + (daysToExpire * 24 * 60 * 60 * 1000));
  let expires = 'expires=' + expirationDate.toUTCString();
  document.cookie = cookieName + '=' + cookieObj + ';' + expires + ';path=/';
};
const getCookie = (cookieName) => {
  return new Promise((resolve, reject) => {
    let decodedCookie = decodeURIComponent(document.cookie);
    if (decodedCookie) {
      let cookies = decodedCookie.split(';');
      let matchingCookie = cookies.filter(cookie => cookie.includes(cookieName));
      if (matchingCookie.length) {
        matchingCookie = matchingCookie[0].split('=');
        matchingCookie[0] = matchingCookie[0].replace(/\s/g, '');
        matchingCookie[1] = JSON.parse(matchingCookie[1]);
        let cookieName = matchingCookie[1].username;
        let token = matchingCookie[1].token;
        if (!token) {
          console.error('-------------------------------------------- DELETING COOKIE THAT HAS NO ASSOCIATED SESSION ID <<<<<<<<<<<<<<<<<<<<<<<<<<')
          destroyCookie();
          window.location.reload();
          // requestAnimationFrame(getCookie('namecreator'));
        }
        if (matchingCookie[0] === 'namecreator') {
          resolve({
            username: cookieName,
            token: token
          });
        }
      } else {
        resolve(false);
      }
    } else {
      resolve(false);
      console.error('--------------------------------- NO COOKIE ==========>')
    }
  });
};
const checkCookie = () => getCookie('namecreator');
const destroyCookie = () => {
  setCookie('namecreator', null, 0);
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentNameStyle: 'random',
      checkedCookie: false,
      username: null,
      userID: null,
      userLoggedIn: false,
      saveCookie: true,
      titleText: 'searching for user...',
      bulkAmount: 50,
      dirtyMode: false,
      blockMode: true,      
      wordData: {},
      animationSpeed: 105,
      lastRequested: 0,
      lastChangedRules: null,
      customRules: [],
      changedRules: [],
      challengedStringIndexes: [],
      challengedStringValue: null,
      feedbackTypesSelected: [],
      feedbackTypesDiscovered: [],
      ruleData: {
        banned: [],
        changed: [],
        codas: [],
        onsets: [],
        creator: [],
        endWord: [],
        loneWord: [],
        midWord: [],
        startWord: [],
        universal: [],
        nuclei: [],
        invalidStrings: {},
        invalidFollowers: {},
        rulesets: [],
        rulesetSelected: '1',
        usingRuleset: '1',
        namePatterns: {}
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
      nameEditing: { fullName: null },
      currentEditType: null,
      selectedString: {        
        string: '',
        sequence: [],
        elementIds: [],
        indexes: [],
        id: '',
        ruleType: ''        
      },
      inputFocused: null,
      selectedLetters: [],
      statusText: 'Loading ruleset...',
      fingerData: {
        fingerDownAt: 0,
        fingerDown: false
      },
      loadingProgress: 0,
      loginAction: null,
      usernameOk: false,
      passwordOk: false,
      passwordsMatch: false,
      rulesets: [],
      patterns: [],
      confirmMode: null,
      confirmText: null,
      confirmEffect: null
    };
    console.log(this.state.ruleData)
    this.generator = new NameGenerator();    
    console.error('GENERATOR created.');
    if (PROD && (window.location.pathname.includes('history') || window.location.pathname.includes('rules'))) {
      window.location.pathname = '/namegenerator/';
    } else if (!PROD && window.location.pathname === '/') {
      window.location.pathname = '/namegenerator/';
    }
  }

  componentDidMount = () => {
    console.error('mount took', window.performance.now() - initialLoad);
    this.logUserInIfCookieOK();
    document.body.addEventListener(clickListener.lowerCase.down, this.bodyFingerDown);
    document.body.addEventListener(clickListener.lowerCase.up, this.bodyFingerUp);
  }
  componentDidUpdate = (prevProps, nextState) => {
    let leaving = prevProps.location.location.pathname === '/' && this.props.location.location.pathname !== '/';
    let entering = prevProps.location.location.pathname !== '/' && this.props.location.location.pathname === '/';
    let rulesEntering = prevProps.location.location.pathname !== '/' && this.props.location.location.pathname === '/rules';
    let rulesLeaving = prevProps.location.location.pathname === '/rules' && this.props.location.location.pathname === '/';
    let historyEntering = prevProps.location.location.pathname === '/' && this.props.location.location.pathname === '/history';
    let historyLeaving = prevProps.location.location.pathname === '/history' && this.props.location.location.pathname === '/';
    if (leaving && !historyEntering) {
      document.body.removeEventListener(clickListener.lowerCase.down, this.bodyFingerDown);
      document.body.removeEventListener(clickListener.lowerCase.up, this.bodyFingerUp);
    } else if (entering && !historyLeaving) {
      document.body.addEventListener(clickListener.lowerCase.down, this.bodyFingerDown);
      document.body.addEventListener(clickListener.lowerCase.up, this.bodyFingerUp);
    }
    if (rulesEntering && !updateTimer) {
      // updateTimer = setInterval(() => {
      //   console.warn('updating :)');
      //   refreshCurrentRuleset(this.state.ruleData.index).then(response => {
      //     console.log('response?----------->', response);
      //     let newRules = response.data.rules[0];
      //     let patterns = response.data.patterns[0];
      //     console.info(newRules, patterns);
      //     for (let list in newRules) {
      //       if (newRules[list][0] === '[' || newRules[list][0] === '{') {
      //         newRules[list] = JSON.parse(newRules[list]);
      //       }
      //     }
      //     for (let list in patterns) {
      //       if (patterns[list][0] === '[' || patterns[list][0] === '{') {
      //         patterns[list] = JSON.parse(patterns[list]);
      //       } else {
      //         patterns[list] = parseInt(patterns[list]);
      //       }
      //     }
      //     console.info(newRules, patterns);
      //     let ruleDataCopy = { ...this.state.ruleData, ... newRules, patterns};
      //     console.info(ruleDataCopy);
      //     this.setState({
      //       ruleData: ruleDataCopy
      //     })
      //   });
      // }, 3000)
    }
  }

  getTotalRulesInList = (ruleset, listType) => {
    let numberOfRules = 0;
    if (ruleset[listType].length) {
      if (listType !== 'changed' && listType !== 'onsets' && listType !== 'codas' && listType !== 'nuclei') {
        // console.log('adding?',ruleset[listType].length,'of',ruleset)
        numberOfRules += ruleset[listType].length;
      }
    } else {
      let followerListArray = Object.values(ruleset[listType]);
      followerListArray.forEach(list => {
        numberOfRules += list.length
        // console.log('adding', list.length, 'for', list)
      });
    }
    return numberOfRules;
  }

  logUserInIfCookieOK = async () => {
    console.error('logUserInIfCookieOK...')
    let loggedIn = false;
    let cookieResult = await checkCookie('namecreator');  
    console.log('cookie result?', cookieResult)
    let username = 'Guest';
    let token = null;
    let loginInfo;
    if (cookieResult) {
      console.error('namecreator FOUND!')
      username = cookieResult.username;
      token = cookieResult.token
      this.setState({
        username: username,
        cookieID: token
      });
      loginInfo = await this.attemptLogin(username, 'abc', token);
    } else {
      console.error('namecreator ookie NOT FOUND')
    }
    getAllRulesets().then(allRulesets => {
      console.log('allRulesets', allRulesets)
      let rulesetList = allRulesets.data[0];
      let patterns = allRulesets.data[1];
      rulesetList.map(ruleset => {
        let totalRules = 0;
        for (let listType in ruleset) {
          if (ruleset[listType][0] === '[' || listType === 'invalidFollowers') {
            
            ruleset[listType] = JSON.parse(ruleset[listType]);
            totalRules += this.getTotalRulesInList(ruleset, listType);
          }
        }
        ruleset.totalRules = totalRules;
      });
      let userOnlyRulesets = rulesetList.filter(ruleset => ruleset.creatorID == this.state.userID);
      let lastEditedRuleset = userOnlyRulesets[0] || rulesetList.filter(ruleset => ruleset.index == 100)[0];
      let rulesIndex = lastEditedRuleset.index;
      let newRuleData = lastEditedRuleset;
      newRuleData.usingRuleset = rulesIndex;
      newRuleData.rulesetSelected = rulesIndex;
      newRuleData.rulesets = [];
      newRuleData.rulesIndex = rulesIndex;
      this.displayNewName(newRuleData);
      let credit = '';
      if (newRuleData.creator !== 'Default') {
        credit = ` by ${newRuleData.creator}`;
      }
      let titleText = this.state.titleText;
      if (!this.state.userLoggedIn) {
        titleText = 'not logged in'
      }      
      patterns.forEach(pattern => { pattern.patternObject = JSON.parse(pattern.patternObject) });
      this.setState({
        statusText: `Using ruleset #${newRuleData.index} '${newRuleData.dialect}'${credit}`,
        titleText: titleText,
        ruleData: newRuleData,
        username: this.state.username,
        userID: this.state.userID,
        dataReady: true,
        hasNewRules: true,
        username: username,
        cookieID: token,
        rulesets: rulesetList,
        patterns: patterns
      });
    });
  }

  bodyFingerDown = event => {
    if (event.target.id === 'generate-more-button' && !rapidTimer) {
      this.displayNewName();
      rapidTimer = setInterval(() => {
        this.displayNewName();
        if (Date.now() - this.state.fingerData.fingerDownAt > 2000) {
          clearInterval(rapidTimer); 
          rapidTimer = undefined;
          event.target.classList.remove('pressed');
          let newFingerData = {
            fingerDown: false,
            fingerDownAt: 0
          };
          this.setState({
            fingerData: newFingerData
          }, () => {
            document.getElementById('history-list').scrollTop = document.getElementById('history-list').scrollHeight;              
          });
        }
      }, 20);
    }    
    setTimeout(() => {
      if (event.target.id === 'main-button') {
        if (Date.now() - this.state.fingerData.fingerDownAt > 200) {
          event.target.classList.remove('pressed');
          let newFingerData = {
            fingerDown: false,
            fingerDownAt: 0
          };
          this.setState({
            fingerData: newFingerData
          });
        }
      }
    }, 210);
    let newFingerData = {
      fingerDown: event,
      fingerDownAt: Date.now()
    };
    this.setState({
      fingerData: newFingerData
    });
  }
  bodyFingerUp = (event) => {
    if (event.target.id === 'generate-more-button' && rapidTimer) {
      clearInterval(rapidTimer);
      rapidTimer = undefined;
      document.getElementById('history-list').scrollTop = document.getElementById('history-list').scrollHeight;
    }
    let newFingerData = {
      fingerDown: false,
      fingerDownAt: 0
    };
    this.setState({
      fingerData: newFingerData
    });    
  }

  showMessage = (message, duration) => {
    clearTimeout(this.messageTimeout);
    let messageEl = document.getElementById('save-indicator');
    if (messageEl) {
      messageEl.innerHTML = message;
      messageEl.classList.add('showing');
      this.messageTimeout = setTimeout(() => {
        messageEl.classList.remove('showing');
      }, duration);
    }
  }

  handleClickGenerate = event => {
    // console.log('state patterns', this.state.patterns);
    // let newPattern = [...this.state.patterns].filter(pattern => pattern.rulesetID !== this.state.ruleData.usingRuleset)[0].patternObject;
    // console.log('newpattern?', newPattern);
    // sendNewPatterns(this.state.userID, this.state.cookieID, this.state.ruleData.usingRuleset, newPattern);

    if (this.props.location.location.pathname === '/history') {
      if (this.state.fingerData.fingerDown) {
        // setTimeout(() => {
        //   this.displayNewName();
        // }, i * 20);
      }
      
      // for (let i = 0; i < this.state.bulkAmount; i++) {
      //   setTimeout(() => {
      //     this.displayNewName();
      //   }, i * 20);
      // }
      // setTimeout(() => {
      //   document.getElementById('history-list').scrollTop = document.getElementById('history-list').scrollHeight;
      // }, ((this.state.bulkAmount+10) * 20))
    } else {
      let startTime = window.performance.now();
      this.displayNewName();
    }



    if (event) {
      event.preventDefault();
    }
  };


  displayNewName = customRules => {
    let historyShowing = this.props.location.location.pathname === '/history';
    let currentSpecial;
    let rulesToSend;
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
    // let newNameData = this.generator.getName(rulesToSend, this.state.currentNameStyle, currentSpecial);
    let newNameData;
    newNameData = this.generator.getName(rulesToSend, this.state.currentNameStyle, currentSpecial);
    let newProductionData = { ...this.state.productionData };
    newProductionData.calledThisRun++;
    if (newNameData.redundant) {
      newProductionData.redundancies++;
      console.warn(`${newNameData.fullName} was REDUNDANT. Trying again...`);
      if (this.state.productionData.calledThisRun > 20) {
        newNameData.fullName = 'too many tries.';
      } else {
        // newProductionData.namesList.push(newNameData);
        this.setState(
          {
            productionData: newProductionData
          },
          () => {
            console.error('GOT REDUNDANT. TRYING AGAIN >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
            return this.displayNewName();
          }
        );
      }
    } else if (newNameData.invalid || (newNameData.banned && this.state.blockMode)) {
      if (newNameData.invalid && this.state.rejectedMode) {
        newProductionData.violations.push(newNameData.violation);
        console.warn(`${newNameData.fullName} invalid: ${newNameData.violation.invalidString.value} at ${newNameData.violation.invalidString.index} violated rule  ${newNameData.violation.rule}. Trying again...`);
        if (this.state.productionData.calledThisRun > 20) {
          newNameData.fullName = 'too many tries.';
        } else {
          newProductionData.namesList.push(newNameData);
          this.setState(
            {
              productionData: newProductionData
            },
            () => {
              // console.error('GOT INVALID. TRYING AGAIN >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
              // return this.displayNewName();
            }
          );
        }
      } else if (newNameData.invalid && !this.state.rejectedMode) {
        console.error('GOT INVALID. TRY AGAIN >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', newNameData.fullName, newNameData.violation.rule, newNameData.violation.invalidString);
        return this.displayNewName();
      }
    } else {
      let addendum = '';
      if (newProductionData.calledThisRun > 1) {
        addendum = ` (${newProductionData.calledThisRun} tries)`;
      }
      if (newNameData.banned) {
        console.error('-------------- banned got through!', newNameData);
      }
      // document.getElementById('tally-text').innerHTML = `got ${newNameData.fullName} in ${(window.performance.now() - startTime).toPrecision(3)}ms${addendum}`;
      let delay = 0;
      if (!historyShowing) {
        delay = swapSpeed * 1.5;
      } else {
        if (document.getElementById('history-list')
          && (newProductionData.calledThisRun === 0 || newProductionData.namesList.length % 6 === 0))
        {
          document.getElementById('history-list').scrollTop = document.getElementById('history-list').scrollHeight;
        }
      }
      if (this.props.location.location.pathname == '/history') {
        delay = 0;
      }
      setTimeout(() => {
        if (historyShowing && newProductionData.namesList.length > 200) {
          newProductionData.namesList = newProductionData.namesList.slice(newProductionData.namesList.length - 200, newProductionData.namesList.length - 1);
        }
        newProductionData.namesList.push(newNameData);
        newProductionData.calledThisRun = 0;
        newProductionData.displayedThisRun = 0;
        this.setState(
          {
            // statusText: `got ${newNameData.fullName} (${newNameData.style}) in ${(retrieveTime - startTime).toPrecision(3)}ms${addendum}`,
            productionData: newProductionData
          },
          () => {
            if (historyShowing) {
              // document.getElementById('history-list').scrollTop = document.getElementById('history-list').scrollHeight;
            }
          }
        );
      }, delay);

      // newProductionData.namesList.push(newNameData);
      // newProductionData.calledThisRun = 0;
      // newProductionData.displayedThisRun = 0;
      // this.setState({
      //   statusText: `got ${newNameData.fullName} (${newNameData.style}) in ${(window.performance.now() - startTime).toPrecision(3)}ms${addendum}`,
      //   productionData: newProductionData
      // });
    }
  };
  handleChangeStyle = (event, styleClicked) => {
    this.setState({
      currentNameStyle: styleClicked
    });
    event.preventDefault();
  };
  handleChangeMode = (event, modeClicked) => {
    modeClicked = `${modeClicked.split('-')[0]}Mode`;

    console.log('clicked', modeClicked);
    let newMode = !this.state[modeClicked];
    console.log('newMode', newMode);
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
  handleClearList = event => {
    let newProductionData = { ...this.state.productionData };
    newProductionData.namesList.length = 0;
    this.setState({
      productionData: newProductionData
    });
    event.preventDefault();
  };
  handleClickBack = event => {
    console.log('back');
    if (this.state.feedbackMode) {
      this.setState({
        feedbackMode: false
      });
    }
    if (this.state.currentEditType) {
      this.setState({
        currentEditType: null
      });
    }
    if (this.state.selectedString.string.length) {
      console.log('is selected');
      this.setState({
        selectedString: {
          string: '',
          id: ''
        }
      });
    }
    if (this.state.selectedLetters.length) {
      this.setState({
        selectedLetters: []
      });
    }
    if (this.state.feedbackTypesSelected.length) {
      this.setState({
        feedbackTypesSelected: []
      });
    }
    if (this.state.feedbackTypesDiscovered.length) {
      this.setState({
        feedbackTypesDiscovered: []
      });
    }
    this.forceUpdate();
  };
  handleClickChangeRuleset = event => {
    getAllRulesets().then(response => {        
      response.data[0].map(ruleset => {
        let totalRules = 0;
        for (let listType in ruleset) {
          if (ruleset[listType][0] === '[' || listType === 'invalidFollowers') {
            ruleset[listType] = JSON.parse(ruleset[listType]);
            if (ruleset[listType].length) {
              if (listType !== 'changed' && listType !== 'onsets' && listType !== 'codas' && listType !== 'nuclei') {
                totalRules += ruleset[listType].length;
              }
            } else {
              Object.values(ruleset[listType]).forEach(list => {
                totalRules += list.length
              });
            }
          }
        }
        ruleset.totalRules = totalRules;
      });
      let newRuleData = { ...this.state.ruleData };
      newRuleData.rulesets = response.data[0];
      let patterns = response.data[1];
      // patterns.forEach(pattern => {pattern.patternObj = JSON.parse(pattern.patternObj)});
      this.setState({
        ruleData: newRuleData,
        hasNewRules: true,
        lastUpdated: Date.now(),
        rulesets: response.data[0],
        patterns: patterns
      }, () => {
        setTimeout(() => { this.showMessage('Got ruleset list.', 1600) }, 1);          
      });
    });
  };
  handleDismissRulesetSelect = event => {
    let newRuleData = { ...this.state.ruleData };
    newRuleData.rulesetSelected = newRuleData.usingRuleset;
    this.setState({
      ruleData: newRuleData
    });
  };
  handleSelectRuleset = event => {
    let rulesetIndex = parseInt(event.target.id.split('-')[1]);
    console.log('clicked rulseset', rulesetIndex)
    if (rulesetIndex !== undefined && this.state.ruleData.rulesetSelected !== rulesetIndex) {
      let newRuleData = { ...this.state.ruleData };
      newRuleData.rulesetSelected = rulesetIndex;
      console.log('set new to', newRuleData.rulesetSelected)
      this.setState({
        ruleData: newRuleData
      });
    }
  };
  handleChooseNewRuleset = () => {
    let newRuleData = { ...this.state.ruleData };
    console.log('clicked change to', newRuleData.rulesetSelected, 'from', newRuleData.usingRuleset)
    newRuleData.usingRuleset = newRuleData.rulesetSelected;
    console.log('rulesets', newRuleData.rulesets);
    let newRuleset = this.state.rulesets.filter(ruleset => ruleset.index.toString() === newRuleData.usingRuleset.toString())[0];
    // let newRuleset = newRuleData.rulesets.filter(ruleset => ruleset.index.toString() === newRuleData.usingRuleset.toString())[0];
    console.log('newRuleset', newRuleset);
    // newRuleData = newRuleset;
    newRuleset.rulesets = this.state.rulesets;
    // newRuleset.rulesets = newRuleData.rulesets;
    newRuleset.usingRuleset = newRuleData.rulesetSelected;
    newRuleset.rulesetSelected = newRuleData.rulesetSelected;
    console.log('usingRuleset', newRuleData.usingRuleset);
    console.log('newRuleData.rulesetSelected',newRuleData.rulesetSelected)
    console.log('switched')
    console.info(newRuleset)
    this.setState(
      {
        ruleData: newRuleset,
        statusText: `Using ruleset '${newRuleset.dialect}' by ${newRuleset.creator}`,
        hasNewRules: true,        
      },
      () => {
        setTimeout(() => { this.showMessage('Changed ruleset to #' + newRuleData.usingRuleset, 1600) }, 1);
      }
    );
  };
  handleClickName = (event, nameData) => {
    document.getElementById('feedback-panel').style.transformOrigin = `${event.clientX}px ${event.clientY}px`;
    this.setState({
      feedbackMode: 'editName',
      nameEditing: nameData
    });
  };
  setFeedbackMode = (newMode, listName, category) => {
    let feedbackTypesSelected = [...this.state.feedbackTypesSelected];
    let currentEditType = this.state.currentEditType;
    if (newMode === 'enter' || newMode === 'editString') {
      feedbackTypesSelected.push(listName);
      currentEditType = listName;
    }
    let inputFocused = this.state.inputFocused;
    if (currentEditType === 'invalidFollowers') {
      inputFocused = 'submit-preceder-input';
      console.log('SET TO inputfofcuerds', inputFocused)
    }
    this.setState({
      feedbackMode: newMode,
      currentEditType: currentEditType,
      feedbackTypesSelected: feedbackTypesSelected,
      inputFocused: inputFocused
    });
  }
  getNameData = fullName => {
    for (let nameEntry in this.state.productionData.namesList) {
      let nameData = this.state.productionData.namesList[nameEntry];
      console.log('checking if', nameData, 'is', fullName);
      if (nameData.fullName == fullName) {
        console.log('it is');
        return nameData;
      }
    }
  };

  handleClickFeedback = (event, type) => {
    console.log(event.target);
    let feedbackTypesSelected = [...this.state.feedbackTypesSelected];
    if (!feedbackTypesSelected.includes(type)) {
      feedbackTypesSelected.push(type);
      this.setState({
        feedbackTypesSelected: feedbackTypesSelected
      });
    } else {
      feedbackTypesSelected.splice(feedbackTypesSelected.indexOf(type), 1);
      this.setState({
        feedbackTypesSelected: feedbackTypesSelected
      });
    }
  };

  handleClickEdit = (event, type) => {
    console.log(event.target.innerHTML, type)
    this.setFeedbackMode('editString', type);
  };

  handleClickWordPiece = (event, ruleType, clear) => {    
    let selected;
    console.log('word piece args', event, ruleType, clear)
    if (event && !clear) {
      let el = event.target;
      let wordPiece = el.innerHTML;
      console.log('el',el)
      console.log('wordPiece',wordPiece)
      console.log(el.id);
      if (!clear && el.id !== this.state.selectedString.id && wordPiece !== this.state.selectedString.string) {
        console.log('NOT already selected')
        if (typeof ruleType === 'string') {
          console.warn('setting a selected string')
          selected = {
            string: wordPiece,
            sequence: [wordPiece],
            id: el.id,
            ruleType: ruleType
          };
        } else {
          console.warn('setting a selected sequence');
          if (ruleType[0] === 'invalidFollowers') {
            let preceder = ruleType[1];
            selected = {
              string: wordPiece,
              sequence: [preceder, wordPiece],
              id: el.id,
              ruleType: ruleType
            };
          }
        }
      } else {
        selected = {
          string: '',
          sequence: [],
          id: '',
          ruleType: ''
        };
      }
    } else {
      selected = {
        string: '',
        sequence: [],
        id: '',
        ruleType: ''
      };
    }
    console.log('setting selstring to', selected)
    this.setState({
      selectedString: selected,
    });
  };

  handleEnterLetter = (event, special) => {
    event.target.value = event.target.value.toLowerCase();
    let selectedLetters = [];
    let newString = '';
    event.target.value.split('').forEach(letter => {
      newString += letter;
      selectedLetters.push({
        char: letter
      });
    })
    this.setState({      
      selectedLetters: selectedLetters
    }, () => {
      let rulesArr = this.findRulesForString(newString);
      let feedbackTypesDiscovered = [...this.state.feedbackTypesDiscovered];
      if (rulesArr.length) {
        rulesArr.map(ruleType => {
          feedbackTypesDiscovered.push(ruleType);
        });
      } else {
        feedbackTypesDiscovered = [];
      }
      this.setState({
        feedbackTypesDiscovered: feedbackTypesDiscovered
      });
    });
  }
  handleEnterSequenceUnit = (unit, position) => {
    console.log('uinuit?', unit);
    let selected = { ...this.state.selectedString };
    selected.sequence[position] = unit;
    this.setState({      
      selectedString: selected
    }, () => {
      console.log('selected now', selected)
    });
  }

  handleClickLetter = (event) => {
    let el = event.target;
    let char = event.target.innerHTML
    let elIndex = [...document.querySelectorAll('.name-letter')].indexOf(el);
    let selectedLetters = [...this.state.selectedLetters];
    let foundIndex = -1;
    selectedLetters.map((letter, i) => {
      if (letter.id === el.id) {
        foundIndex = i;
      }
    });
    if (foundIndex == -1) {
      let newLetterObj = {};
      selectedLetters.push(newLetterObj);
      newLetterObj.char = char;
      newLetterObj.index = elIndex;
      newLetterObj.id = el.id;          
    } else {
      selectedLetters.splice(foundIndex, 1);     
    }
    selectedLetters.sort((a, b) => {
      return a.index - b.index;
    })
    let selectedString = '';
    selectedLetters.map(letterObj => {
      selectedString += letterObj.char;
    })
    let rulesArr = this.findRulesForString(selectedString);
    let feedbackTypesDiscovered = [...this.state.feedbackTypesDiscovered];
    if (rulesArr.length) {
      rulesArr.map(ruleType => {
        feedbackTypesDiscovered.push(ruleType);
      });
    } else {
      feedbackTypesDiscovered = [];
    }
    if (selectedLetters.length === 0) {
      if (this.state.feedbackTypesSelected.length) {
        this.setState({
          feedbackTypesSelected: []
        });
      }      
    }
    this.setState({      
      feedbackTypesDiscovered: feedbackTypesDiscovered,
      selectedLetters: selectedLetters
    });
  };
  handleClickAdd = event => {
    let el = event.target;
    let listId = event.target.parentElement.id;
    console.log(event.target, event.target.innerHTML, listId);
  };
  findRulesForString = (str) => {
    str = str.toLowerCase();
    let rulesArr = [];
    let ruleData = { ...this.state.ruleData };    
    for (let entry in ruleData) {
      if (invalidRules.includes(entry)) {
        ruleData[entry].map(invalidString => {
          if (invalidString === str) {
            console.log('!---------', str, 'is in the', entry, 'list!');            
            rulesArr.push(entry);
          }
        });
      }
    }
    return rulesArr;
  }
  submitFeedback = (feedbackObj) => {
    console.warn('submitFeedback got obj', feedbackObj)
    let ruleData = { ...this.state.ruleData };
    let ruleDescription;
    if (ruleData[feedbackObj.listTypes[0]].push) {
      ruleDescription = feedbackObj.string.toUpperCase();
      ruleData[feedbackObj.listTypes[0]].push(feedbackObj.string);
    } else {      
      if (feedbackObj.listTypes[0] === 'invalidFollowers') {
        if (!ruleData[feedbackObj.listTypes[0]][feedbackObj.units[0]]) {

          ruleData[feedbackObj.listTypes[0]][feedbackObj.units[0]] = [];
        }
        ruleData[feedbackObj.listTypes[0]][feedbackObj.units[0]].push(feedbackObj.units[1])
        console.log('changed ruleData!')
        console.log(ruleData[feedbackObj.listTypes[0]])
      }
      ruleDescription = feedbackObj.units.join('-').toUpperCase();
    }
    ruleData.lastChanged = feedbackObj;    
    this.setState({
      ruleData: ruleData
    }, () => {
        for (let listType in ruleData) {
          if (ruleData[listType].map) {
            ruleData[listType].map((str, i) => {
              if (str.includes && str.includes("q'")) {
                ruleData[listType][i] = str.replace("q'", 'qapos');
                console.log('made a q\' in', listType);
              }
            });
          }
        }
        let newRuleData = { ...this.state.ruleData };
        
        sendNewRules(this.state.userID, newRuleData).then(response => {
          if (response) {
            setTimeout(() => { this.showMessage(`Rule for '${ruleDescription}' saved.`, 1600) }, 1);
          }
          let newRuleData = { ...this.state.ruleData };
          // let creatorName = `${this.state.username}-${Date.now()}`;
          newRuleData.rulesetSelected = response.data;
          newRuleData.usingRuleset = response.data;   
          console.log('usingrulesdet st as', newRuleData.usingRuleset);
          this.setState({
            ruleData: newRuleData,
            feedbackTypesSelected: []
          }, () => {
            if (feedbackObj.string) {
              let rulesArr = this.findRulesForString(feedbackObj.string);
              let feedbackTypesDiscovered = [...this.state.feedbackTypesDiscovered];
              if (rulesArr.length) {
                rulesArr.map(ruleType => {
                  feedbackTypesDiscovered.push(ruleType);
                });
              } else {
                feedbackTypesDiscovered = [];
              }
              this.setState({
                feedbackTypesDiscovered: feedbackTypesDiscovered
              });
            }
        });
      });
    });
  }

  handleClickSendFeedback = (event) => {
    let selectedString = '';
    let feedback;
    if (this.state.currentEditType !== 'invalidFollowers' && this.state.currentEditType !== 'invalidTriplets') {
      this.state.selectedLetters.map(letterObj => {
        selectedString += letterObj.char;
      })
      feedback = {
        string: selectedString.toLowerCase(),
        listTypes: this.state.feedbackTypesSelected
      };
    } else {
      // let preceder = document.querySelector('.large-input.sequence0').value;
      // let follower = document.querySelector('.large-input.sequence1').value;
      let preceder = this.state.selectedString.sequence[0];
      let follower = this.state.selectedString.sequence[1];
      console.log('----------------- preceder', preceder);
      console.log('----------------- follower', follower);
      feedback = {
        units: this.state.selectedString.sequence,
        listTypes: this.state.feedbackTypesSelected
      }
    }
    if (this.state.userLoggedIn) {
      this.submitFeedback(feedback);
    } else {
      console.error('Not saving because not logged in.')
    }
    event.preventDefault();
  }

  handleClickDeleteString = (event) => {
    console.log('deleting while state is', this.state)
    let successMessage;
    let doomedString = { ...this.state.selectedString }.string;
    let doomed;
    let ruleData = { ...this.state.ruleData };
    let listName;
    if (this.state.selectedString.ruleType.splice) {
      listName = this.state.selectedString.ruleType[0];
    } else {
      listName = this.state.selectedString.ruleType;
    }
    if (ruleData[listName].splice) { // list is an array
      doomed = { ...this.state.selectedString }.string;
      ruleData[listName].splice(ruleData[listName].indexOf(doomedString), 1);
      successMessage = `Rule for '${doomed.toUpperCase()}' deleted.`;
    } else { // list is an object
      doomed = { ...this.state.selectedString }.sequence;
      successMessage = `Rule for '${doomed[0].toUpperCase()}-${doomed[1].toUpperCase()}' deleted.`
      let followerList = ruleData[listName][doomed[0]];
      console.log('delete from follower list?', followerList, doomed[1])
      followerList.splice(followerList.indexOf(doomed[1]), 1);
      console.log('new list?', followerList);

    }
    ruleData.lastChanged = {
      listTypes: [listName],
      value: doomed
    };
    console.log('sending ruleData', ruleData)
    sendNewRules(this.state.userID, ruleData).then(response => {
      if (response) {
        setTimeout(() => { this.showMessage(successMessage, 1600) }, 1);
      }
      let newRuleData = { ...this.state.ruleData };
      newRuleData.rulesetSelected = response.data;
      newRuleData.usingRuleset = response.data;
      this.setState({
        ruleData: newRuleData,
        selectedString: {
          sequence: [],
          string: '',
          id: '',
          ruleType: ''
        }
      });
    });
  }

  handleClickInput = (event) => {
    if (this.state.feedbackMode === 'editName') {
      event.target.value = '';
    };
    this.setState({
      inputFocused: event.target.id
    })
  }

  handleClickSequenceUnit = (event) => {
    // // console.log('focus', this.props.inputFocused)
    // let unit = event.target.innerHTML;
    // if (event.target.classList.contains('followers-selection')) {
    //   console.log('clicked a sequence selectable!', unit);

    // }
    // console.log(event.target.classList)
    // if (!this.state.inputFocused) {
    //   let precederInput = document.getElementById('submit-preceder-input');
    //   let followerInput = document.getElementById('submit-follower-input');
    //   if (!precederInput.value) {
    //     precederInput.value = unit;
    //     followerInput.focus();
    //     this.setState({
    //       inputFocused: 'submit-follower-input'
    //     })
    //   }
    // } else {
    //   document.getElementById(this.state.inputFocused).value = unit;
    // }
  }
  handleClickRegister = (event) => {
    this.setState({
      loginAction: 'registering'
    });
  }
  handleLoginUsernameInputChange = (event) => {
    let value = event.target.value;
    this.setState({
      usernameOk: value.length >= 3
    });
  }
  handleLoginPasswordInputChange = (event) => {
    let value = event.target.value;
    this.setState({
      passwordOk: value.length >= 6
    });
  }

  handleRegisterPasswordInputChange = (event) => {
    let value = event.target.value;
    let passEl = document.getElementById('register-password-input');
    this.setState({
      passwordOk: value >= 3,
      passwordsMatch: value === passEl.value
    });
  }
  handleRepeatPasswordInputChange = (event) => {
    let value = event.target.value;
    let passEl = event.target.previousSibling;
    this.setState({
      passwordOk: passEl.value.length >= 6,
      passwordsMatch: value === passEl.value
    });
  }
  handleRegisterUsernameInputChange = (event) => {
    let value = event.target.value;
    this.setState({
      usernameOk: value.length >= 3
    });
  }
  handleClickCloseRegister = (event) => {
    // document.getElementById('login-shade').classList.remove('showing');
    this.setState({
      loginAction: null
    });
  }
  handleClickCallLogin = (event) => {
    this.setState({
      loginAction: 'loggingIn'
    });
  }
  attemptLogin = (userValue, passValue, getToken) => {
    return new Promise((resolve, reject) => {      
      logUserIn(userValue, passValue, getToken).then(response => {
        if (response.data) {
          if (response.data.username) {
            let newRuleData = { ...this.state.ruleData };
            newRuleData.rulesetIndexes = JSON.parse(response.data.rulesets);
            let token = response.data.token;
            
            if (this.state.saveCookie) {
              let localData = {
                username: response.data.username,
                token: token
              };
              setCookie('namecreator', localData, 365);
            }
            setTimeout(() => { this.showMessage(`Logged in as ${response.data.username}`, 1600) }, 200);
            this.setState({
              loginAction: null,
              userLoggedIn: true,
              username: response.data.username,
              userID: parseInt(response.data.id),
              ruleData: newRuleData,
              titleText: `Logged in as ${response.data.username}`,
            }, () => {
              resolve();
            });
          } else if (response.data === 'badUsername') {
            let userField = document.getElementById('login-username-input');
            userField.style.color = 'red';
            userField.value = 'USER NOT FOUND';
            setTimeout(() => {
              userField.style.color = 'black';
              userField.value = '';
            }, 1600);
          } else if (response.data === 'badPassword') {
            let passField = document.getElementById('login-password-input');
            passField.style.color = 'red';
            passField.style.fontSize = 'var(--medium-font-size)';
            passField.type = 'text';
            passField.value = 'INCORRECT PASSWORD';
            setTimeout(() => {
              passField.type = 'password';
              passField.style.fontSize = 'initial';
    
              passField.style.color = 'black';
              passField.value = '';
            }, 1600);
          }
        }
      });
    });
  }
  handleClickRegisterLogin = (event) => {
    let username = document.getElementById('register-username-input').value;
    let pass = document.getElementById('register-password-input').value;
    let sessionID = null;
    if (this.state.saveCookie) {
      sessionID = uuid();
    }
    createNewUser(username, pass, this.state.saveCookie).then(response => {
      if (response.data === 'nameTaken') {
        let field1 = document.getElementById('register-username-input');
        field1.style.color = 'red';
        field1.value = 'NAME UNAVAILABLE';
        setTimeout(() => {
          field1.style.color = 'black';
          field1.value = '';
        }, 1600);
      } else {
        if (this.state.saveCookie) {
          let localData = {
            username: username,
            token: response.data[1]
          };
          setCookie('namecreator', localData, 365);
        }
        this.setState({
          titleText: `Logged in as ${username}`,
          loginAction: null,
          userLoggedIn: true,
          username: username,
          userID: response.data[0],          
        }, () => {
            this.showMessage(`User ${username} created!`, 1600);
        });
      }
    });
    event.preventDefault();
  }
  handleClickSubmitLogin = (event) => {    
    let field1 = document.getElementById('login-username-input');
    let field2 = document.getElementById('login-password-input');
    let sessionID = null;
    if (this.state.cookieID) {
      sessionID = this.state.cookieID;
    }
    this.attemptLogin(field1.value, field2.value, this.state.cookieID);
    event.preventDefault();
  }
  logUserOut = (event) => {
    console.log('logging user out!!')
    this.setState({
      // titleText: 'not logged in',
      confirmMode: null,
      userLoggedIn: false,
      cookieRecognized: false,
      cookieID: null,
      loginAction: null,
      username: 'Guest',
      userID: null
    });
    destroyCookie();
  }
  handleClickLogOut = (event) => {
    this.setState({
      confirmMode: 'logOut',
      confirmText: 'LOG OUT?',
    })
    // this.logUserOut();
  }
  handleToggleSaveCookie = (event) => {
    this.setState({
      saveCookie: !this.state.saveCookie
    })
  }
  handleClickCancelConfirm = () => {
    document.getElementById('confirm-modal').classList.remove('showing');
    this.setState({
      confirmMode: null,
      // confirmText: null,
      // confirmEffect: null
    })
  }

  render() {
    let featuredName;
    let ruleData = this.state.ruleData;
    if (this.state.productionData.namesList.length) {
      featuredName = this.state.productionData.namesList[this.state.productionData.namesList.length - 1];
    }
    return (
        <>
          <Route path='/' render={location => (
            <div id='view-container'>
              {this.state.dataReady && (
              <>
                <div id='indicator-container'><div id='save-indicator'></div></div>
                <ConfirmModal
                  mode={this.state.confirmMode}
                  titleText={this.state.confirmText}
                  onConfirmLogOut={this.logUserOut}
                  onClickCancelLogout={this.handleClickCancelConfirm}
                />
                <RulesScreen location={location} userLoggedIn={this.state.userLoggedIn} username={this.state.username} userID={this.state.userID} onClickEdit={this.handleClickEdit} onClickDeleteString={this.handleClickDeleteString} onClickAdd={this.handleClickAdd} selectedString={this.state.selectedString} onClickBack={this.handleClickBack} onClickWordPiece={this.handleClickWordPiece} onClickChangeRuleset={this.handleClickChangeRuleset} onClickBack={this.handleClickBack} ruleData={this.state.ruleData}
                  titleText={this.state.titleText}
                  feedbackTypesSelected={this.state.feedbackTypesSelected}
                  feedbackTypesDiscovered={this.state.feedbackTypesDiscovered}
                  setFeedbackMode={this.setFeedbackMode}
                  onClickFeedback={this.handleClickFeedback}
                  onClickSendFeedback={this.handleClickSendFeedback}
                  onClickLogIn={this.handleClickLogIn}
                  onClickRegister={this.handleClickRegister}
                  onClickLogOut={this.handleClickLogOut}
                  saveCookie={this.state.saveCookie}
                  onClickCallLogin={this.handleClickCallLogin}
                  onClickCallRegister={this.handleClickCallRegister}
                  patterns={this.state.patterns}
                />
                <HistoryScreen location={location} nameEditing={this.state.nameEditing} selectedString={this.state.selectedString} rejectedMode={this.state.rejectedMode} onChangeMode={this.handleChangeMode} onClickName={this.handleClickName} namesList={this.state.productionData.namesList} onClickBack={this.handleClickBack} onClickGenerateMore={this.handleClickGenerate} onclickClearList={this.handleClearList} />
                <Route path='/rules' render={() =>
                  <>
                    <RulesetSelect
                      location={location}
                      onChooseNewRuleset={this.handleChooseNewRuleset}
                      onSelectRuleset={this.handleSelectRuleset}
                      onDismissRulesetSelect={this.handleDismissRulesetSelect}
                      rulesets={this.state.rulesets}
                      patterns={this.state.patterns}
                      // rulesets={this.state.ruleData.rulesets}
                      usingRuleset={this.state.ruleData.usingRuleset}
                      rulesetSelected={this.state.ruleData.rulesetSelected}
                      userID={this.state.userID}
                      username={this.state.username}
                    />                  
                  </>
                } />
                <FeedbackWindow
                  showing={this.state.feedbackMode}
                  location={location}
                  selectedLetters={this.state.selectedLetters}
                  selectedString={this.state.selectedString}
                  onClickLetter={this.handleClickLetter}
                  feedbackTypesSelected={this.state.feedbackTypesSelected}
                  feedbackTypesDiscovered={this.state.feedbackTypesDiscovered}
                  currentEditType={this.state.currentEditType}
                  onClickFeedback={this.handleClickFeedback}
                  onClickInput={this.handleClickInput}
                  onClickSequenceUnit={this.handleClickSequenceUnit}
                  onEnterLetter={this.handleEnterLetter}
                  onEnterSequenceUnit={this.handleEnterSequenceUnit}
                  onClickSendFeedback={this.handleClickSendFeedback}
                  onClickBack={this.handleClickBack}
                  onClickLogOut={this.handleClickLogOut}
                  ruleData={this.state.ruleData}
                  nameData={this.state.nameEditing}
                  inputFocused={this.state.inputFocused}
                />
                <LoginWindow
                    location={location}
                    mode={this.state.loginAction}
                    onRegisterUsernameInputChange={this.handleRegisterUsernameInputChange}
                    onRegisterPasswordInputChange={this.handleRegisterPasswordInputChange}
                    onRepeatPasswordInputChange={this.handleRepeatPasswordInputChange}
                    onLoginUsernameInputChange={this.handleLoginUsernameInputChange}
                    onLoginPasswordInputChange={this.handleLoginPasswordInputChange}
                    onClickRegisterLogin={this.handleClickRegisterLogin}
                    onClickSubmitLogin={this.handleClickSubmitLogin}
                    onToggleSaveCookie={this.handleToggleSaveCookie}
                    saveCookie={this.state.saveCookie}
                    onClickCloseRegister={this.handleClickCloseRegister}
                    usernameOk={this.state.usernameOk}
                    passwordOk={this.state.passwordOk}
                    passwordsMatch={this.state.passwordsMatch}
                  />
              </>
            )}
            <NameDisplay location={location} progress={this.state.loadingProgress} dataReady={this.state.dataReady} fingerDown={this.state.fingerData.fingerDown} onClickName={this.handleClickName} nameData={featuredName} bulkMode={this.state.bulkMode} />
            <ButtonArea currentNameStyle={this.state.currentNameStyle} readyToGenerate={this.state.dataReady} blockMode={this.state.blockMode} simpleMode={this.state.simpleMode} rejectedMode={this.state.rejectedMode} onChangeStyle={this.handleChangeStyle} onChangeMode={this.handleChangeMode} onClickGenerate={this.handleClickGenerate} />
            <TitleBar userLoggedIn={this.state.userLoggedIn} titleText={this.state.titleText} statusText={this.state.statusText} totalCalls={this.generator.totalCalls} uniqueGenerated={this.state.productionData.namesList.length} />
          </div>
        )}
        />
      </>
    );
  }
}

export default App;
