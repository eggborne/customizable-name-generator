import React, { Component } from 'react';
import TitleBar from './TitleBar.jsx';
import NameDisplay from './NameDisplay.jsx';

class App extends Component {
  render() {
    return (
    <div id='view-container'>
      <NameDisplay />
      <div id="main-container">
        <div id='style-select-area'>
          <button id='random-button' onClick='selectStyle(event, "random")' class='style-button selected'>Random</button>
          <button id='basic-button' onClick='selectStyle(event, "basic")' class='style-button'>Basic</button>
          <button id='qui-gon-button' onClick='selectStyle(event, "qui-gon")' class='style-button'>Qui-Gon</button>
          <button id='obi-wan-button' onClick='selectStyle(event, "obi-wan")' class='style-button'>Obi-Wan</button>
          <button id='jar-jar-button' onClick='selectStyle(event, "jar-jar")' class='style-button'>Jar Jar</button>
          <button id='hutt-button' onClick='selectStyle(event, "hutt")' class='style-button'>Jabba</button>
          <button id='yoda-button' onClick='selectStyle(event, "yoda")' class='style-button'>Yoda</button>
        </div>
        <div id='mode-button-area'>
          <div onClick='toggleDirtyOnly()' id='dirty-toggle' class='mode-toggle-button'>Dirty only: OFF</div>
          <div onClick='toggleBulkMode()' id='bulk-toggle' class='mode-toggle-button'>Bulk mode: OFF</div>
          <div onClick='toggleSimpleMode()' id='simple-toggle' class='mode-toggle-button'>Simple mode: OFF</div>
          <div onClick='toggleRejectedMode()' id='rejected-toggle' class='mode-toggle-button'>Show rejected: OFF</div>
        </div>
        <button onClick="clickAction()" id="main-button">GENERATE NAME</button>
        <div id='lower-button-area'> 
          <button onClick="showHistory()" id="history-button">HISTORY</button>
          <button onClick="showRules()" id="rules-button">RULES</button>
        </div>
      </div>
      <TitleBar titleText={'Name Generator'} />
    </div>
    );
  }
}

export default App;