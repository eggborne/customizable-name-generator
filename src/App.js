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
import {v4 as uuid} from 'uuid';

window.addEventListener('DOMContentLoaded', event => {
  console.log('DOM fully loaded and parsed in', window.performance.now() - initialLoad);  
});

let initialLoad = window.performance.now();

const invalidRules = ['banned', 'universal', 'startWord', 'midWord', 'endWord', 'loneWord'];
const PROD = process.env.NODE_ENV === 'production';
let ROOT;
// if (!PROD) {
//   ROOT = 'https://api.eggborne.com/namegenerator/';
// } else {
//   // ROOT = `php/`;
//   ROOT = 'https://api.eggborne.com/namegenerator/';
// }
// if (!PROD) {
  ROOT = 'https://eggborne.com/namegenerator/php/';
// } else {
  // ROOT = `php/`;
// }
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

let cookieRecognized = false;


const clickFunction = window.PointerEvent ? 'onPointerDown' : window.TouchEvent ? 'onTouchStart' : 'onMouseDown';
const clickListener = clickListeners[clickFunction];
console.log(clickListener);

export const swapSpeed = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--swap-speed'));

function logUserIn(username, pass, cookieID) {
  console.warn('logging user');
  console.warn(username);
  console.warn(pass);
  console.warn(cookieID);
  let userData = {
    dbName:'eggbxhyo_language',
    username: username.toString(),
    pass: pass.toString(),
    cookieID: cookieID
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
function createNewUser(username, pass, cookieID) {
  console.warn('creating user');
  console.warn(username);
  console.warn(pass);
  console.warn(cookieID);
  let userData = {
    username: username.toString(),
    pass: pass.toString(),
    cookieID: cookieID
  };
  return axios({
    method: 'post',
    url: `${ROOT}createnewuser.php`,
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    },
    data: JSON.stringify(userData)
  });
}
function getDataForUser(username, pass) {
  
  return axios({
    method: 'post',
    url: `${ROOT}getuserdata.php`,
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    },
    data: {
      username: username,
      pass: pass
    }
  });
}
function getRulesets() {
  return axios({
    method: 'get',
    url: `${ROOT}getallrulesets.php`,
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    }
  });
}
function getRules(rulesIndex) {
  console.log(`${PROD} to getRules from ID ${rulesIndex} from ${ROOT}`);
  return axios({
    method: 'get',
    url: `${ROOT}getrules.php`,
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    },
    params: {
      rulesIndex: rulesIndex
    }
  });
}
function getAllRulesets() {
  console.log(`getting rulesets from ${ROOT}`);
  return axios({
    method: 'get',
    url: `${ROOT}getrulesets.php`,
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    }
  });
}


function sendFeedback(feedbackObj) {
  let ruleData = { ...this.state.ruleData };
  for (let listType in ruleData) {
    feedbackObj.rules.map(feedbackRuleType => {
      if (listType === feedbackRuleType) {
        ruleData[listType].push(feedbackObj.string);
        console.log('put', feedbackObj.string, 'into ruleData[',feedbackRuleType,']')
      }
      if (ruleData[listType].map) {
        feedbackObj[listType].map((str, i) => {
          if (str.includes && str.includes("q'")) {
            feedbackObj[listType][i] = str.replace("q'", 'qapos');
            console.log('made a q\' in', listType);
          }
        });
      }
    })
  }
  this.setState({
    ruleData: ruleData
  }, () => {
    console.log('SET local rules.')
  })
}

function updateRuleset(userID, rulesetID, newRuleObj) {
  console.warn('sending rules')
  console.warn(rulesetID, newRuleObj)
  let newStringList = [];
  return axios({
    method: 'post',
    url: `${ROOT}sendnewrules.php`,
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    },
    data: {
      list: 'startWord',
      userID: userID,
      rulesetID: rulesetID,
      newStringList: newStringList
    }
  });
}

function sendNewRules(rulesObj) {
  console.log('sendNewRule took in', rulesObj);
  let changedRules = rulesObj.changed;
  let lastRulesIndex = undefined;
  if (rulesObj.usingRuleset > 100) {
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
  let rawData = {
    lastRulesIndex: lastRulesIndex,
    creator: creatorName,
    changed: changedRules,
    dialect: "Star Wars",
    banned: rulesObj.banned,
    universal: rulesObj.universal,
    startWord: rulesObj.startWord,
    midWord: rulesObj.midWord,
    endWord: rulesObj.endWord,
    loneWord: rulesObj.loneWord,
    consonantStarters: rulesObj.consonantStarters,
    consonantEnders: rulesObj.consonantEnders,
    vowelUnits: rulesObj.vowelUnits,
    invalidFollowers: rulesObj.invalidFollowers
  };
  console.log('we sendin');
  console.table(rawData)
  return axios({
    method: 'post',
    url: `${ROOT}sendnewrules2.php`,
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    },
    data: JSON.stringify(rawData)
  });
}

const setCookie = (cookieName, cookieObj, daysToExpire) => {
  console.warn('called setCookie')
  cookieObj = JSON.stringify(cookieObj);
  console.log('cookieValue', cookieObj);
  let expirationDate = new Date();
  expirationDate.setTime(expirationDate.getTime() + (daysToExpire * 24 * 60 * 60 * 1000));
  let expires = 'expires=' + expirationDate.toUTCString();
  // document.cookie = `{${cookieName}: ${JSON.stringify(cookieObj)}};${expires};path=/}`;
  document.cookie = cookieName + '=' + cookieObj + ';' + expires + ';path=/';

};
const getCookie = (cookieName) => {
  console.warn('called getCookie')
  return new Promise((resolve, reject) => {
    let decodedCookie = decodeURIComponent(document.cookie);
    console.info('decodedCookie:', decodedCookie);
    if (decodedCookie) {
      let cookies = decodedCookie.split(';');
      console.log('cookies', cookies);
      let matchingCookie = cookies.filter(cookie => cookie.includes(cookieName));
      console.log('matching?', matchingCookie.length);
      if (matchingCookie.length) {
        matchingCookie = matchingCookie[0].split('=');
        console.log('PARSED?', matchingCookie);
        matchingCookie[1] = JSON.parse(matchingCookie[1]);
        let cookieName = matchingCookie[1].username;
        let cookieID = matchingCookie[1].sessionID;
        if (!cookieID) {
          console.error('-------------------------------------------- DELETING COOKIE THAT HAS NO ASSOCIATED SESSION ID <<<<<<<<<<<<<<<<<<<<<<<<<<')
          setCookie('namecreator', null, 0);
          requestAnimationFrame(getCookie('namecreator'));
        }
        console.log(cookieName);
        console.log(cookieID);
        if (matchingCookie[0] === 'namecreator') {
          resolve({
            username: cookieName,
            sessionID: cookieID
          });
        }
      }
    } else {
      resolve(false);
      console.error('--------------------------------- NO COOKIE ==========>')
    }
  });
};
async function checkCookie() {
  console.warn('called checkCookie')
  let startTime = window.performance.now();

  let checkResult = await getCookie('namecreator');

  console.log('checkResult', checkResult)

  return checkResult;

  // getCookie('namecreator').then((response) => {
  //   console.log('cehckCookie > getCookie.then gave repsosen', response)
  //   if (response) {
  //     console.warn('checked cookie in', window.performance.now() - startTime);
  //     console.log('got a cookie response!', response);
  //     return response;
  //   }
  //   if (reject) {
  //     console.log('reject', reject)
  //   }
  // })
};
const destroyCookie = () => {
  checkCookie().then(response => {
    if (response) {
      setCookie('namecreator', response, 0);
      console.error('DELETED COOKIE!');
    } else {
      console.error('NO COOKIE TO DELETE!');
    }
  })
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
        rulesetSelected: '1',
        usingRuleset: '1'
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
        elementIds: [],
        indexes: [],
        id: '',
        ruleType: '',
        preceder: '',
        follower: ''
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
      passwordsMatch: false
    };
    this.generator = new NameGenerator();
    
    console.error('GENERATOR created.');
    if (PROD && (window.location.pathname.includes('history') || window.location.pathname.includes('rules'))) {
      window.location.pathname = '/namegenerator/';
    } else if (!PROD && window.location.pathname === '/') {
      window.location.pathname = '/namegenerator/';
    }
    
      // .then(cookie => {
      //   console.warn('got then from checkCookie:', cookie)
        // if (cookie) {
          // cookieRecognized = true;
          // console.warn('GOT A GODDAMNED COOKIE !!!!!!!!!!!!!!', cookie);
          // this.setState({
          //   username: cookie.username,
          //   cookieID: cookie.cookieID
          // }, () => {
          //   console.warn('LOG THAT SUCKER IN +++++++++++')
          //   this.attemptLogin(this.state.username, 'abc', this.state.cookieID);
              
            // logUserIn(this.state.username, 'aa', this.state.cookieID).then(response => {
            //   console.log('suck my balls', response);
            // });
          // });
        // } else {
        //   console.error('no cookie in initial checkcookie.then')
        // }
      
      // getRulesets().then(allRulesets => {
      //   console.info('rulesets?', allRulesets);
      //   allRulesets.data.map(ruleset => {
      //     for (let listType in ruleset) {
      //       if (ruleset[listType][0] === '[' || listType === 'invalidFollowers') {
      //         ruleset[listType] = JSON.parse(ruleset[listType]);
      //       }
      //     }
      //   });
      //   let userID = this.state.userID || 0;
      //   let rulesIndex = 3;
      //   let newRuleData =  allRulesets.data.filter(ruleset => ruleset.index === 3)[0];
      //   if (userID) {
      //     console.log('only creator with ID', userID)
      //     let userOnlyRulesets = allRulesets.data.filter(ruleset => ruleset.creatorID === userID);
      //     rulesIndex = userOnlyRulesets[0].index;
      //     newRuleData = userOnlyRulesets[0];
      //   }
      //   newRuleData.usingRuleset = rulesIndex;
      //   newRuleData.rulesetSelected = rulesIndex;
      //   newRuleData.rulesets = [];
      //   newRuleData.rulesIndex = rulesIndex
      //   // newRuleData.creator = ;
      //   console.info('newRuleData',newRuleData)
      //   this.displayNewName(newRuleData);
      //   this.setState({
      //     ruleData: newRuleData,
      //     username: this.state.username,
      //     userID: this.state.userID,
      //     dataReady: true,
      //     hasNewRules: true,
      //     statusText: `Using ruleset #${newRuleData.index} '${newRuleData.dialect}' by Default`,
      //     titleText: `not logged in`,
      //     userLoggedIn: loggedIn
      //   });
      // });

    // });

    // try to get cookie and then...

    // if (!cookieRecognized) {
    
      // getRulesets().then(allRulesets => {
      //   console.info('rulesets?', allRulesets);
      //   allRulesets.data.map(ruleset => {
      //     for (let listType in ruleset) {
      //       if (ruleset[listType][0] === '[' || listType === 'invalidFollowers') {
      //         ruleset[listType] = JSON.parse(ruleset[listType]);
      //       }
      //     }
      //   });
      //   let userOnlyRulesets = allRulesets.data.filter(ruleset => ruleset.creatorID === '2');
      //   let lastEditedRuleset = userOnlyRulesets[0];
      //   let rulesIndex = lastEditedRuleset.index;
      //   let newRuleData = lastEditedRuleset;
      //   newRuleData.usingRuleset = rulesIndex;
      //   newRuleData.rulesetSelected = rulesIndex;
      //   newRuleData.rulesets = [];
      //   newRuleData.rulesIndex = rulesIndex
      //   // newRuleData.creator = ;
      //   console.info('newRuleData',newRuleData)
      //   this.displayNewName(newRuleData);
      //   this.setState({
      //     statusText: `Using ruleset #${newRuleData.index} '${newRuleData.dialect}' by Default`,
      //     titleText: `not logged in`,
      //     ruleData: newRuleData,
      //     username: this.state.username,
      //     userID: this.state.userID,
      //     dataReady: true,
      //     hasNewRules: true,
      //     userLoggedIn: loggedIn
      //   });
      // });
    
    // } else {
      // let user = this.state.username;
      // let pass = null;
      // let cookieID = this.state.cookieID;
      // getDataForUser(user, pass).then(userData => {
      //   if (userData.data) {
      //     console.info(userData.data)
      //     let userID = userData.data.id;
      //     let username = userData.data.username;
      //     let rulesetIndexes = JSON.parse(userData.data.rulesets);
      //     loggedIn = true;
      //     console.log('logged in!');
      //     console.log('userId', userID);
      //     console.log('username', username);
      //     console.log('rulesetIndexes', rulesetIndexes);
      //     getRulesets().then(allRulesets => {
      //       console.info('rulesets?', allRulesets);
      //       allRulesets.data.map(ruleset => {
      //         for (let listType in ruleset) {
      //           if (ruleset[listType][0] === '[' || listType === 'invalidFollowers') {
      //             ruleset[listType] = JSON.parse(ruleset[listType]);
      //           }
      //         }
      //       });
      //       console.info('now', allRulesets.data);
      //       let userOnlyRulesets = allRulesets.data.filter(ruleset => ruleset.creatorID === userID);
      //       console.log('userOnlyRulesets', userOnlyRulesets);
      //       let lastEditedRuleset = userOnlyRulesets[userOnlyRulesets.length - 1];
      //       console.log('lastEditedRuleset', lastEditedRuleset);
      //       let rulesIndex = lastEditedRuleset.index;
      //       let newRuleData = lastEditedRuleset;
      //       newRuleData.usingRuleset = rulesIndex;
      //       newRuleData.rulesetSelected = rulesIndex;
      //       newRuleData.rulesets = allRulesets.data;
      //       newRuleData.rulesIndex = rulesIndex;
      //       newRuleData.creator = username;
      //       console.info('newRuleData', newRuleData)
      //       this.displayNewName(newRuleData);
      //       this.setState({
      //         statusText: `Using ruleset #${newRuleData.index} '${newRuleData.dialect}' by ${username}`,
      //         titleText: `Logged in as ${username}`,
      //         ruleData: newRuleData,
      //         username: username,
      //         createdRulesets: rulesetIndexes,
      //         userID: userID,
      //         dataReady: true,
      //         hasNewRules: true,
      //         userLoggedIn: loggedIn
      //       });
      //     });
      //   }
      // });
    // }




    // this.refreshRules().then(newRuleData => {
    //   let ruleTime = window.performance.now();
    //   console.error('APP CONSTRUCTOR TOOK', window.performance.now() - initialLoad);
    //   getAllRulesets().then(response => {
    //     let rulesTime = window.performance.now();
    //     console.error('GOT RULESETS IN', rulesTime - ruleTime);
    //     response.data.map(ruleset => {
    //       for (let listType in ruleset) {
    //         if (ruleset[listType][0] === '[' || listType === 'invalidFollowers') {
    //           ruleset[listType] = JSON.parse(ruleset[listType]);
    //         }
    //       }
    //     });
    //     let newRuleData = { ...this.state.ruleData };
    //     newRuleData.rulesets = response.data;
    //     this.setState(
    //       {
    //         statusText: `Using ruleset '${newRuleData.dialect}' by ${newRuleData.creator.split('-')[0]}`,
    //         ruleData: newRuleData,
    //         lastUpdated: Date.now()
    //       },
    //       () => {
    //         // document.body.addEventListener(clickListener.lowerCase.down, this.bodyFingerDown);
    //         // document.body.addEventListener(clickListener.lowerCase.up, this.bodyFingerUp);
    //       }
    //     );
    //   });
    // });
  }

  logUserInIfCookieOK = async () => {
    let loggedIn = false;
    console.warn('calling initial checkCookie');
    let cookieResult = await checkCookie('namecreator');  
    console.log('cookieResult', cookieResult);
    let username = 'Guest';
    let sessionID = null;
    let loginInfo;
    if (cookieResult) {
      cookieRecognized = true;
      username = cookieResult.username;
      sessionID = cookieResult.sessionID
      console.warn('GOT A GODDAMNED COOKIE !!!!!!!!!!!!!!', cookieResult);
      this.setState({
        username: username,
        cookieID: sessionID
      }, () => {
        console.warn('LOG THAT SUCKER IN +++++++++++', this.state)
      });
      loginInfo = await this.attemptLogin(username, 'abc', sessionID);
    }
    console.log('loginInfo...', loginInfo);
    console.log('state now?', this.state.userID)
    getRulesets().then(allRulesets => {
      console.info('rulesets?', allRulesets);
      allRulesets.data.map(ruleset => {
        for (let listType in ruleset) {
          if (ruleset[listType][0] === '[' || listType === 'invalidFollowers') {
            ruleset[listType] = JSON.parse(ruleset[listType]);
          }
        }
      });
      console.log('established userID as', this.state.userID)
      let userOnlyRulesets = allRulesets.data.filter(ruleset => ruleset.creatorID == this.state.userID);
      console.info('userCreated', userOnlyRulesets)
      let lastEditedRuleset = userOnlyRulesets[0] || allRulesets.data.filter(ruleset => ruleset.index == 42)[0];
      let rulesIndex = lastEditedRuleset.index;
      let newRuleData = lastEditedRuleset;
      newRuleData.usingRuleset = rulesIndex;
      newRuleData.rulesetSelected = rulesIndex;
      newRuleData.rulesets = [];
      newRuleData.rulesIndex = rulesIndex      
      this.displayNewName(newRuleData);
      let credit = '';
      if (newRuleData.creator !== 'Default') {
        credit = ` by ${newRuleData.creator}`;
      }
      let titleText = this.state.titleText;
      if (!this.state.userLoggedIn) {
        titleText = 'not logged in'
      }
      this.setState({
        statusText: `Using ruleset #${newRuleData.index} '${newRuleData.dialect}'${credit}`,
        titleText: titleText,
        ruleData: newRuleData,
        username: this.state.username,
        userID: this.state.userID,
        dataReady: true,
        hasNewRules: true,
        username: username,
        cookieID: sessionID
      });
    });
  }

  bodyFingerDown = event => {
    this.setState({
      fingerData: { fingerDown: event, fingerDownAt: Date.now() }
    });
  }
  bodyFingerUp = () => {
    this.setState({
      fingerData: { fingerDown: false, fingerDownAt: 0 }
    });
  }
  componentDidMount = () => {
    console.error('mount took', window.performance.now() - initialLoad);
    this.logUserInIfCookieOK();
    document.body.addEventListener(clickListener.lowerCase.down, this.bodyFingerDown);
    document.body.addEventListener(clickListener.lowerCase.up, this.bodyFingerUp);
  }
  componentDidUpdate = (prevProps, nextState) => {
    if (prevProps.location.location.pathname === '/' && this.props.location.location.pathname !== '/') {
      console.error('MOVED OFF!', prevProps.location.location.pathname);
      document.body.removeEventListener(clickListener.lowerCase.down, this.bodyFingerDown);
      document.body.removeEventListener(clickListener.lowerCase.up, this.bodyFingerUp);
    } else if (prevProps.location.location.pathname !== '/' && this.props.location.location.pathname === '/') {
      document.body.addEventListener(clickListener.lowerCase.down, this.bodyFingerDown);
      document.body.addEventListener(clickListener.lowerCase.up, this.bodyFingerUp);
    }
  }

  showMessage = (message, duration) => {
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
    console.error('------- generate');
    // this.bounceButton(event);
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
        }, i * 20);
      }
    } else {
      this.displayNewName();
    }
    if (event) {
      event.preventDefault();
    }
  };
  displayNewName = customRules => {
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
    let retrieveTime = window.performance.now();
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
            console.error('GOT INVALID. TRYING AGAIN >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
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
        console.error('GOT INVALID. TRYING AGAIN >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
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
      if (!this.state.bulkMode) {
        delay = swapSpeed * 1.5;
      } else {
        if (newProductionData.namesList.length % 6 === 0) {
          document.getElementById('history-list').scrollTop = document.getElementById('history-list').scrollHeight;
        }
      }
      setTimeout(() => {
        if (this.state.bulkMode && newProductionData.namesList.length > 200) {
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
            if (this.state.bulkMode) {
              document.getElementById('history-list').scrollTop = document.getElementById('history-list').scrollHeight;
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
  refreshRules = () => {
    let startTime = window.performance.now();
    return new Promise(resolve => {
      getRules(this.state.ruleData.usingRuleset).then(response => {
        if (response) {
          setTimeout(() => { this.showMessage('Got ruleset #' + response.data.index, 1600) }, 1);
        }
        let getTime = window.performance.now();
        console.error('GOT INITIAL RULES IN', getTime - startTime, response.data);        
        let rulesIndex = response.data.index;
        let newData = {};
        for (let listName in response.data) {
          let list = response.data[listName];
          if (list[0] === '[') {
            list = JSON.parse(list);
            list.map((str, i) => {
              if (str.includes && str.includes('qapos')) {
                list[i] = str.replace('qapos', "q'");
              }
            });
            newData[listName] = list;
          } else {
            if (list[0] === '{') {
              list = JSON.parse(list);
              console.warn('parsed list', list)           
              console.log('made', listName, list);
            }
            newData[listName] = list;
          }
        }
        let newRuleData = { ...this.state.ruleData };
        newData.usingRuleset = rulesIndex;
        newData.rulesetSelected = rulesIndex;
        newData.rulesets = newRuleData.rulesets;
        newData.rulesIndex = rulesIndex;
        console.error('PARSE INSIDE REFRESH TOOK', window.performance.now() - getTime);
        console.info(newData)
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
        this.setState(
          {
            ruleData: newData,
            dataReady: true,
            hasNewRules: true
          },
          () => {
            console.log('stat took', window.performance.now() - stat);
            resolve(newData);
          }
        );
      });
    });
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
    console.log('get those rulesets');
    let sinceUpdated = Date.now() - this.state.lastUpdated;
    console.error('SINCE ---------------------', sinceUpdated)
    getAllRulesets().then(response => {        
      console.log('got those rulesets', response);
      response.data.map(ruleset => {
        for (let listType in ruleset) {
          if (ruleset[listType][0] === '[' || listType === 'invalidFollowers') {
            ruleset[listType] = JSON.parse(ruleset[listType]);
          }
        }
      });
      let newRuleData = { ...this.state.ruleData };
      newRuleData.rulesets = response.data;
      this.setState({
        ruleData: newRuleData,
        hasNewRules: true,
        lastUpdated: Date.now()
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
    let newRuleset = newRuleData.rulesets.filter(ruleset => ruleset.index.toString() === newRuleData.usingRuleset.toString())[0];
    console.log('newRuleset', newRuleset);
    // newRuleData = newRuleset;
    newRuleset.rulesets = newRuleData.rulesets;
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
      },
      () => {
        
        // getRulesets().then((allRulesets) => {
          setTimeout(() => { this.showMessage('Changed ruleset to #' + newRuleData.usingRuleset, 1600) }, 1);
        // });
        // this.refreshRules().then(() => {
        //   setTimeout(() => { this.showMessage('Changed ruleset to #' + newRuleData.usingRuleset, 1600) }, 1);
        // });
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
    this.setState({
      feedbackMode: newMode,
      currentEditType: currentEditType,
      feedbackTypesSelected: feedbackTypesSelected
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
    if (event && !clear) {
      let el = event.target;
      let wordPiece = el.innerHTML;
      console.log(el.id);
      if (!clear && el.id !== this.state.selectedString.id && wordPiece !== this.state.selectedString.string) {
        // let offX = 50 - Math.round(((window.innerWidth / 2) - event.clientX) / (window.innerWidth / 2) * 40);
        // let offY = 50 - Math.round(((window.innerHeight / 2) - event.clientY) / (window.innerHeight / 2) * 50);
        // console.log(`${offX}% ${offY}%`)
        // // el.style.transformOrigin = `${offX}% ${offY}%`;
        selected = {
          string: wordPiece,
          id: el.id,
          ruleType: ruleType
        };
      } else {
        selected = {
          string: '',
          id: '',
          ruleType: ''
        };
      }
    } else {
      selected = {
        string: '',
        id: '',
        ruleType: ''
      };
    }
    this.setState({
      selectedString: selected,
    });
  };

  handleEnterLetter = (event) => {
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
    console.log('APP submitFeedback got', feedbackObj)
    let ruleData = { ...this.state.ruleData };
    console.log(ruleData);
    ruleData.changed.push(feedbackObj);
    for (let listType in ruleData) {
      feedbackObj.rules.map(feedbackRuleType => {
        if (listType === feedbackRuleType) {
          ruleData[listType].push(feedbackObj.string);
          console.log('> > > put', feedbackObj.string, 'into ruleData[', feedbackRuleType, ']')
        }
      });
      
    }
    this.setState({
      ruleData: ruleData
    }, () => {
      console.log('SET local rules.');
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
      newRuleData.rulesetSelected = newRuleData.creator;
      console.warn('sending', newRuleData.rulesetSelected, 'rules. last:', newRuleData.creator);
      sendNewRules(newRuleData).then(response => {
        if (response) {
          setTimeout(() => { this.showMessage(`Rule for '${feedbackObj.string.toUpperCase()}' saved.`, 1600) }, 1);
        }
        let newRuleData = { ...this.state.ruleData };
        // let creatorName = `${this.state.username}-${Date.now()}`;
        newRuleData.rulesetSelected = response.data;
        newRuleData.usingRuleset = response.data;
        this.setState({
          ruleData: newRuleData
        }, () => {
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
        });
      });
    });
  }

  handleClickSendFeedback = (event) => {
    let selectedString = '';
    let feedback;
    this.state.selectedLetters.map(letterObj => {
      selectedString += letterObj.char;
    })
    feedback = {
      string: selectedString.toLowerCase(),
      rules: this.state.feedbackTypesSelected
    };
    console.info('sending feedback', feedback)
    if (this.state.userLoggedIn) {
      this.submitFeedback(feedback);
    } else {

    }
      // .then(response => {
      //   console.log('response', response)
      // });
    event.preventDefault();
  }

  handleClickDeleteString = (event) => {
    let doomedString = { ...this.state.selectedString }.string;
    let ruleData = { ...this.state.ruleData };
    console.log('ruleArr', ruleData[this.state.selectedString.ruleType]);
    ruleData[this.state.selectedString.ruleType].splice(ruleData[this.state.selectedString.ruleType].indexOf(doomedString), 1);

    console.log('now ruleArr', ruleData[this.state.selectedString.ruleType]);

    sendNewRules(ruleData).then(response => {
      if (response) {
        setTimeout(() => { this.showMessage(`Rule for '${doomedString.toUpperCase()}' deleted.`, 1600) }, 1);
      }
      let newRuleData = { ...this.state.ruleData };
      // let creatorName = `${this.state.username}-${Date.now()}`;
      newRuleData.rulesetSelected = response.data;
      newRuleData.usingRuleset = response.data;
      this.setState({
        ruleData: newRuleData,
        selectedString: {
          string: '',
          id: '',
          ruleType: ''
        }
      });
    });
    
    // this.setState({
    //   ruleData: ruleData,
    //   selectedString: {
    //     string: '',
    //     id: '',
    //     ruleType: ''
    //   }
    // });

  }

  handleClickInput = (event) => {
    if (this.state.feedbackMode === 'editName') {
      event.target.value = '';
    };
    console.log('setting',event.target.id)
    this.setState({
      inputFocused: event.target.id
    })
  }

  handleClickWordUnit = (event) => {
    let unit = event.target.innerHTML;
    console.log(unit)
    console.log(this.state.inputFocused)
    if (!this.state.inputFocused) {
      let precederInput = document.getElementById('submit-preceder-input');
      let followerInput = document.getElementById('submit-follower-input');
      if (!precederInput.value) {
        precederInput.value = unit;
        followerInput.focus();
        this.setState({
          inputFocused: 'submit-follower-input'
        })
      }
    } else {
      document.getElementById(this.state.inputFocused).value = unit;
    }
  }
  handleClickRegister = (event) => {
    this.setState({
      loginAction: 'registering'
    });
  }
  handleClickLogOut = (event) => {
    
  }
  handleLoginUsernameInputChange = (event) => {
    let value = event.target.value;
    this.setState({
      usernameOk: value.length >= 3
    });
    console.log('handleLoginUsernameInputChange value', value.length)
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
    console.log('value', value)
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
  attemptLogin = (userValue, passValue, sessionID) => {
    return new Promise((resolve, reject) => {
      let userField = document.getElementById('login-username-input');
      let passField = document.getElementById('login-password-input');
      logUserIn(userValue, passValue, sessionID).then(response => {
        console.log('attemptLogin > logUserIn responded', response)
        if (response.data) {
          if (response.data.username) {
            let newRuleData = { ...this.state.ruleData };
            newRuleData.rulesetIndexes = JSON.parse(response.data.rulesets);
            console.log('got', response.data);
            if (!sessionID) {
              sessionID = response.data.sessionID
            }
            if (this.state.saveCookie) {
              let localData = {
                username: response.data.username,
                sessionID: sessionID
              };
              console.log('locaData prepared as', localData)
              setCookie('namecreator', localData, 365);
            }
            this.setState({
              loginAction: null,
              userLoggedIn: true,
              username: response.data.username,
              userID: parseInt(response.data.id),
              ruleData: newRuleData,
              titleText: `Logged in as ${response.data.username}`,
            }, () => {
                this.showMessage(`Logged in as ${response.data.username}`, 1600)
                resolve('shitballs');
            });
            console.log('newRuleData',newRuleData)
          } else if (response.data === 'badUsername') {
            userField.style.color = 'red';
            userField.value = 'USER NOT FOUND';
            setTimeout(() => {
              userField.style.color = 'black';
              userField.value = '';
            }, 1600);
          } else if (response.data === 'badPassword') {
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
    createNewUser(username, pass, sessionID).then(response => {
      console.warn('createNewUser response.data:', response.data);
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
            sessionID: sessionID
          };
          console.log('locaData prepared at handleClickRegisterLogin as', localData)
          setCookie('namecreator', localData, 365);
        }
        this.setState({
          loginAction: null,
          userLoggedIn: true,
          username: username,
          userID: response.data,
          
        });
      }
    });
    event.preventDefault();
  }
  handleClickSubmitLogin = (event) => {    
    console.info(this.state);
    let field1 = document.getElementById('login-username-input');
    let field2 = document.getElementById('login-password-input');
    let sessionID = null;
    if (this.state.cookieID) {
      sessionID = this.state.cookieID;
    }
    this.attemptLogin(field1.value, field2.value, sessionID);
    event.preventDefault();
  }
  handleClickLogOut = (event) => {
    this.setState({
      statusText: 'not logged in',
      userLoggedIn: false,
      cookieRecognized: false,
      cookieID: null,
      loginAction: null,
      username: 'Guest',
      userID: null
    });
    destroyCookie();
  }
  handleToggleSaveCookie = (event) => {
    this.setState({
      saveCookie: !this.state.saveCookie
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
                <RulesScreen location={location} userLoggedIn={this.state.userLoggedIn} username={this.state.username} userID={this.state.userID} onClickEdit={this.handleClickEdit} onClickDeleteString={this.handleClickDeleteString} onClickAdd={this.handleClickAdd} selectedString={this.state.selectedString} onClickBack={this.handleClickBack} onClickWordPiece={this.handleClickWordPiece} onClickChangeRuleset={this.handleClickChangeRuleset} onClickBack={this.handleClickBack} ruleData={this.state.ruleData}
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
                />
                <HistoryScreen location={location} nameEditing={this.state.nameEditing} selectedString={this.state.selectedString} onClickName={this.handleClickName} namesList={this.state.productionData.namesList} onClickBack={this.handleClickBack} onClickGenerateMore={this.handleClickGenerate} onclickClearList={this.handleClearList} />
                <Route path='/rules' render={() =>
                  <>
                    <RulesetSelect
                      location={location}
                      onChooseNewRuleset={this.handleChooseNewRuleset}
                      onSelectRuleset={this.handleSelectRuleset}
                      onDismissRulesetSelect={this.handleDismissRulesetSelect}
                      rulesets={this.state.ruleData.rulesets}
                      usingRuleset={this.state.ruleData.usingRuleset}
                      rulesetSelected={this.state.ruleData.rulesetSelected}
                      userID={this.state.userID}
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
                  onClickWordUnit={this.handleClickWordUnit}
                  onEnterLetter={this.handleEnterLetter}
                  onClickSendFeedback={this.handleClickSendFeedback}
                  onClickBack={this.handleClickBack}
                  onClickLogOut={this.handleClickLogOut}
                  ruleData={this.state.ruleData}
                  nameData={this.state.nameEditing}                  
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
            <ButtonArea currentNameStyle={this.state.currentNameStyle} readyToGenerate={this.state.dataReady} blockMode={this.state.blockMode} bulkMode={this.state.bulkMode} simpleMode={this.state.simpleMode} rejectedMode={this.state.rejectedMode} onChangeStyle={this.handleChangeStyle} onChangeMode={this.handleChangeMode} onClickGenerate={this.handleClickGenerate} />
            <TitleBar userLoggedIn={this.state.userLoggedIn} titleText={this.state.titleText} statusText={this.state.statusText} totalCalls={this.generator.totalCalls} uniqueGenerated={this.state.productionData.namesList.length} />
          </div>
        )}
        />
      </>
    );
  }
}

export default App;
