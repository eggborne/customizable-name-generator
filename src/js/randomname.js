function randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; };

export default class NameGenerator {
  constructor() {    
    this.nameStyles = ['basic', 'qui-gon', 'obi-wan', 'jar-jar', 'jabba', 'yoda'];
    this.esPlurals = ['h', 'sh', 'sch', 'v', 'x', 'z'];
    this.usedKeys = [];
    this.totalCalls = 0;
    this.special = undefined;
    this.produceRandomNextPiece = (firstPiece, ruleData, typeArr) => {
      let followerArray = typeArr;
      if (this.cachedRules.invalidFollowers[firstPiece]) {
        followerArray = followerArray.filter(letter => this.cachedRules.invalidFollowers[firstPiece].indexOf(letter) === -1);
        if (ruleData.consonantEnders.indexOf(firstPiece) > -1) {
          console.warn('only searchiing limited array for firstPiece', firstPiece);
          console.info(followerArray);
        }
      } else {
        console.log(firstPiece, 'has no list of invalid followers.')
      }
      return this.randomType(ruleData, followerArray);
    }
    this.randomType = (ruleData, typeArr) => {
      if (typeArr.filter && this.special === 'simple') {
        typeArr = typeArr.filter(segment => segment.length === 1);    
      }
      return typeArr[randomInt(0, typeArr.length - 1)];
    }
    this.randomVowel = (ruleData) => {
      let vowels = ruleData.vowelUnits;
      if (this.special === 'simple') {
        vowels = ruleData.vowelUnits.filter(segment => segment.length === 1);
      }
      let rando = vowels[randomInt(0, vowels.length - 1)];
      if (!randomInt(0, 1000)) {
        rando = 'y'
      }
      return rando;
    };
    this.characterNames = [
      'Jar Jar Binks',
      'Qui-Gon Jinn',
      'Obi-Wan Kenobi',
      'Poe Dameron',
      'Mace Windu',
      'Chewbacca',
      'Jabba the Hutt',
      'Yoda',
      'Leia Organa',
      'Han Solo',
      'Padme Amidala',
      'Kylo Ren',
    ];
    this.defaultLengthRange = [1, -1];
    this.namePatterns = {
      'han': [
        [
          { type: 'cs', lengthRange: this.defaultLengthRange },
          { type: 'v', lengthRange: this.defaultLengthRange },
          { type: 'ce', lengthRange: this.defaultLengthRange }
        ],
        [
          { type: 'cs', lengthRange: this.defaultLengthRange },
          { type: 'v', lengthRange: this.defaultLengthRange },
          { type: 'ce', lengthRange: this.defaultLengthRange },
          { type: 'v', lengthRange: this.defaultLengthRange }
        ],
      ],
      'obi-wan': [
        [
          { type: 'cs', lengthRange: this.defaultLengthRange },
          { type: 'ce', lengthRange: this.defaultLengthRange },
          { type: 'v', lengthRange: this.defaultLengthRange },
          '-',
          { type: 'cs', lengthRange: this.defaultLengthRange },
          { type: 'v', lengthRange: this.defaultLengthRange },
          { type: 'ce', lengthRange: this.defaultLengthRange },
        ],
        [
          { type: 'cs', lengthRange: this.defaultLengthRange },
          { type: 'v', lengthRange: this.defaultLengthRange },
          { type: 'ce', lengthRange: this.defaultLengthRange },
          { type: 'v', lengthRange: this.defaultLengthRange },
          { type: 'ce', lengthRange: this.defaultLengthRange },
          { type: 'v', lengthRange: this.defaultLengthRange }
        ],
      ],
    }
    this.cachedRules = undefined;
    this.getName = (ruleData, style, special) => {
      this.special = special;
      if (ruleData) {
        this.cachedRules = ruleData;
        console.log('cacheing rules!', ruleData);        
      } else {
        ruleData = this.cachedRules;
      }
      this.totalCalls++; 
      let violation;
      let invalidStrings = {
        banned: ruleData.banned,
        universal: ruleData.universal,
        startWord: ruleData.startWord,
        midWord: ruleData.midWord,
        endWord: ruleData.endWord,
        loneWord: ruleData.loneWord,        
      }
      let consonantStarters = ruleData.consonantStarters;
      let consonantEnders = ruleData.consonantEnders;
      let invalidFollowers = ruleData.invalidFollowers;
      // let namePattern = this.namePatterns[style];  
      let syllableList = [];
      let firstName;
      let lastName;
      let banned = false;
      let invalid = false;
      let mode = style;
      if (style === 'random') {    
        randomInt(0, 1) ? mode = 'shortLong' : mode = 'longShort';
        if (!randomInt(0, 6)) {
          let rand = randomInt(0, 3);
          if (rand === 0) { mode = 'hutt' }
          if (rand === 1) { mode = 'jar-jar' }
          if (rand === 2) { mode = 'qui-gon' }
          if (rand === 3) { mode = 'obi-wan' }
        }
        if (!randomInt(0, 16)) { mode = 'yoda' }
      } else {
        if (style === 'basic') {
          randomInt(0, 1) ? mode = 'shortLong' : mode = 'longShort';
        }
      }
      if (mode === 'shortLong' || mode === 'yoda') {
        let firstName0 = this.randomType(ruleData, consonantStarters);
        let firstName1 = this.randomVowel(ruleData);
        let firstName2 = this.produceRandomNextPiece(firstName1, ruleData, consonantEnders);
        // let firstName2 = this.randomType(ruleData, consonantEnders.filter(letter => invalidFollowers[firstName1].indexOf(letter) === -1));
        let lastName0 = this.randomType(ruleData, consonantStarters);
        let lastName1 = this.randomVowel(ruleData);
        let lastName2 = this.produceRandomNextPiece(lastName1, ruleData, consonantEnders);
        // let lastName2 = this.randomType(ruleData, consonantEnders.filter(letter => invalidFollowers[lastName1].indexOf(letter) === -1));
        let lastName3 = this.produceRandomNextPiece(lastName2, ruleData, consonantStarters);
        // let lastName3 = this.randomType(ruleData, filteredLastName2);
        let lastName4 = this.randomVowel(ruleData);
        let lastName5 = this.produceRandomNextPiece(lastName4, ruleData, consonantEnders);
        // let lastName5 = this.randomType(ruleData, consonantEnders.filter( letter => invalidFollowers[lastName4].indexOf(letter) === -1 ));
        if (lastName1.length > 1 && lastName2.length > 1) {
          lastName2 = lastName2[0];
        }
        if (lastName4.length > 1 && lastName5.length > 1) {
          lastName5 = lastName5[0];
        }
        if (firstName0.length > 1) {
          firstName0 = firstName0[0].toUpperCase() + firstName0.slice(1, firstName0.length);
        } else {
          firstName0 = firstName0.toUpperCase();
        }
        if (lastName0.length > 1) {
          lastName0 = lastName0[0].toUpperCase() + lastName0.slice(1, lastName0.length);
        } else {
          lastName0 = lastName0.toUpperCase();
        }
        firstName = `${firstName0}${firstName1}${firstName2}`;
        lastName = ` ${lastName0}${lastName1}${lastName2}${lastName3}${lastName4}${lastName5}`;
        if (mode === 'shortLong') {
          syllableList = [
            firstName0, firstName1, firstName2, lastName0, lastName1, lastName2, lastName3, lastName4, lastName5
          ];
        } else if (mode === 'yoda') {
          firstName1 = firstName1[0];
          lastName0 = lastName0.toLowerCase();   
          lastName1 = lastName1[0];
          firstName = `${firstName0}${firstName1}${lastName0}${lastName1}`;
          lastName = '';
          syllableList = [
            firstName0, firstName1, lastName0, lastName1
          ];
        }    
      } else if (mode === 'longShort' || mode === 'hutt' || mode === 'jar-jar' || mode === 'qui-gon' || mode === 'obi-wan') {
        let firstName0 = this.randomType(ruleData, consonantStarters);
        let firstName1 = this.randomVowel(ruleData);
        let firstName2 = this.randomType(ruleData, consonantStarters);
        let firstName3 = this.randomVowel(ruleData);
        let firstName4 = this.produceRandomNextPiece(firstName3, ruleData, consonantEnders);
        // let firstName4 = this.randomType(ruleData, consonantEnders.filter(letter => invalidFollowers[firstName3].indexOf(letter) === -1));
        let lastName0 = this.randomType(ruleData, consonantStarters);
        let lastName1 = this.randomVowel(ruleData);
        let lastName2 = this.produceRandomNextPiece(lastName1, ruleData, consonantEnders);
        // let lastName2 = this.randomType(ruleData, consonantEnders.filter(letter => invalidFollowers[lastName1].indexOf(letter) === -1));
        if (firstName0.length > 1) {
          firstName0 = firstName0[0].toUpperCase() + firstName0.slice(1, firstName0.length);
        } else {
          firstName0 = firstName0.toUpperCase();
        }
        if (lastName0.length > 1) {
          lastName0 = lastName0[0].toUpperCase() + lastName0.slice(1, lastName0.length);
        } else {
          lastName0 = lastName0.toUpperCase();
        }
        if (lastName1.length > 1 && lastName2.length > 1) {
          // lastName2 = lastName2[0];
        }
        if (mode === 'hutt') {
          firstName3 = firstName3[0];
          firstName3 += ' the';
        }
        firstName = `${firstName0}${firstName1}${firstName2}${firstName3}`;
        lastName = ` ${lastName0}${lastName1}${lastName2}`;    
        if (mode === 'qui-gon') {
          if (firstName2.length > 1) {
            firstName2 = firstName2[0].toUpperCase() + firstName2.slice(1, firstName2.length);
          } else {
            firstName2 = firstName2.toUpperCase();
          }
          if (firstName3.length > 1) {
            firstName3 = firstName3.slice(1, firstName3.length);
          }
          if (firstName4.length > 1) {
            firstName4 = firstName4.slice(1, firstName4.length);
          }
          firstName = `${firstName0}${firstName1}-${firstName2}${firstName3}${firstName4}`;      
        }
        if (mode === 'obi-wan') {
          firstName0 = this.randomVowel(ruleData)[0];
          firstName1 = this.produceRandomNextPiece(firstName0, ruleData, consonantEnders)[0];
          // firstName1 = this.randomType(ruleData, consonantEnders.filter(letter => invalidFollowers[firstName0].indexOf(letter) === -1)[0]);
          firstName2 = this.randomVowel(ruleData)[0];
          firstName3 = this.produceRandomNextPiece(firstName2, ruleData, consonantEnders)[0];
          // firstName3 = this.randomType(ruleData, consonantEnders.filter(letter => invalidFollowers[firstName2].indexOf(letter) === -1))[0];
          firstName4 = this.randomVowel(ruleData)[0];
          let firstName5 = this.produceRandomNextPiece(firstName4, ruleData, consonantEnders);
          // let firstName5 = this.randomType(ruleData, consonantEnders.filter(letter => invalidFollowers[firstName4].indexOf(letter) === -1));
          lastName0 = this.randomType(ruleData, consonantStarters)[0];
          lastName1 = this.randomVowel(ruleData)[0];
          lastName2 = this.produceRandomNextPiece(lastName1, ruleData, consonantEnders);
          // lastName2 = this.randomType(ruleData, consonantEnders.filter(letter => invalidFollowers[lastName1].indexOf(letter) === -1));
          let lastName3 = this.randomVowel(ruleData);
          let lastName4 = this.produceRandomNextPiece(lastName3, ruleData, consonantEnders);
          // let lastName4 = this.randomType(ruleData, consonantEnders.filter(letter => invalidFollowers[lastName3].indexOf(letter) === -1));
          let lastName5 = this.randomVowel(ruleData)[0];
          firstName0 = firstName0.toUpperCase();
          lastName0 = lastName0.toUpperCase();
          firstName3 = firstName3.toUpperCase();
          
          firstName = `${firstName0}${firstName1}${firstName2}-${firstName3}${firstName4}${firstName5}`;
          lastName = ` ${lastName0}${lastName1}${lastName2}${lastName3}${lastName4}${lastName5}`;
          // console.info('F-N says', firstName+lastName)
          syllableList = [
            firstName0, firstName1, firstName2, firstName3, firstName4, firstName5, lastName0, lastName1, lastName2, lastName3, lastName4, lastName5
          ];
        }
        if (mode === 'jar-jar') {
          firstName = `${firstName0}${firstName1} ${firstName0}${firstName1}`;
          if (lastName2[lastName2.length - 1] !== 's') {
            if (this.esPlurals.indexOf(lastName2) > -1) {
              lastName += 'es';
            } else if (lastName2[0] !== 'z') {
              lastName += 's';
            }
          }
          syllableList = [
            firstName0, firstName1, firstName0, firstName1, lastName0, lastName1, lastName2
          ];
        }
        if (mode === 'qui-gon') {
          // syllableList = [
          //   firstName0, firstName1, firstName2, firstName3, firstName4, lastName0, lastName1, lastName2
          // ];
        } else {
          // syllableList = [
          //   firstName0, firstName1, firstName2, firstName3, lastName0, lastName1, lastName2
          // ];
        }
      }
      if (invalidStrings.banned.indexOf(firstName.toLowerCase()) > -1) {
        banned = true;
      }
      let actualLastName = lastName;
      if (actualLastName[0] === ' ') {
        actualLastName = actualLastName.slice(1, lastName.length);
      }
      if (invalidStrings.banned.indexOf(actualLastName.toLowerCase()) > -1) {
        banned = true;
      }
      let nameString = `${firstName}${lastName}`;
      let newKey = nameString;
      if (this.usedKeys.indexOf(newKey) === -1) {
        this.usedKeys.push(newKey);
        let wordArray = newKey.split(' ');
        if (wordArray.length === 3) {
          wordArray = [
            wordArray[0],
            wordArray[2]
          ];
        }
        if (wordArray[0].indexOf('-') > -1) {
          wordArray = [
            wordArray[0].split('-')[0],
            wordArray[0].split('-')[1],
            wordArray[1],
          ];
        }
        for (let i = 0; i < wordArray.length; i++) {
          let word = wordArray[i].toLowerCase();
          for (let ruleType in invalidStrings) {
            let invalidArr = invalidStrings[ruleType];
            for (let s = 0; s < invalidArr.length; s++) {
              let invalidString = invalidArr[s];
              // console.log('checking',word,'for',invalidString,'using',ruleType)

              if (word.toLowerCase().includes(invalidString)) {
                console.log(word,'has',invalidString)

                let violating;
                // let stringIndex = s;
                let stringIndex = word.indexOf(invalidString);
                if (ruleType === 'universal') {
                  violating = true;
                  console.log(word,'violated',ruleType,violating)
                } else if (ruleType === 'startWord') {
                  violating = stringIndex === 0;
                  console.log(word,'violated',ruleType,violating)
                } else if (ruleType === 'midWord') {
                  violating = (stringIndex !== 0 && stringIndex !== word.length - invalidString.length);
                  console.log(word,'violated',ruleType,violating)
                } else if (ruleType === 'endWord') {
                  violating = stringIndex === word.length - invalidString.length;
                  console.log(word,'violated',ruleType,violating)
                } else if (ruleType === 'loneWord') {
                  violating = word === invalidString;
                  console.log(word,'violated',ruleType,violating)
                }

                if (violating) {                  
                  if (invalidStrings.banned.indexOf(invalidString) > -1) {
                    banned = true;
                  } else {
                    invalid = true;
                    violation = {
                      rule: ruleType,
                      invalidString: {
                        value: invalidString,
                        index: nameString.toLowerCase().indexOf(invalidString)
                      }
                    };
                  }
                  break;
                }
              } else {
                // console.log(word,'DOES NOT HAVE',invalidString)
              }
            };
          }
        };    
        let nameData = {
          style: mode,
          fullName: nameString,
          wordArray: wordArray,
          syllableList: syllableList,
          banned: banned,
          invalid: invalid,
          violation: violation
        }
        // console.log('made', wordArray, 'from', nameString)
        return nameData;
      } else {
        return { fullName: nameString, redundant: true }
      }
    };
  }
}