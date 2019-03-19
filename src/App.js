import React, { Component } from 'react';
import TitleBar from './TitleBar.jsx';
import NameDisplay from './NameDisplay.jsx';
import Button from './Button.jsx';

const selectStyle = (event) => {
  console.log(`.${event.target.classList[0]}.selected`)
  let oldSelected = document.querySelector(`.${event.target.classList[0]}.selected`);
  if (event.target !== oldSelected) {
    let buttonElement = event.target;
    buttonElement.classList.add('selected');
    oldSelected.classList.remove('selected');
  }
  event.preventDefault();
};
const selectMode = (event) => {
  console.log(`.${event.target.classList[0]}.selected`)
  let oldSelected = document.querySelector(`.${event.target.classList[0]}.selected`);
  if (event.target !== oldSelected) {
    let buttonElement = event.target;
    buttonElement.classList.add('selected');
  }
  if (oldSelected) {
    oldSelected.classList.remove('selected')
  };
  event.preventDefault();
};

class App extends Component {
  render() {
    return (
    <div id='view-container'>
      <NameDisplay />
      <div id="main-container">
        <div id='style-select-area'>
          <Button onClick={selectStyle} label={'Random'} type='random' className='style-button' selected={true} />
          <Button onClick={selectStyle} label={'Basic'} type='basic' className='style-button' selected={false} />
          <Button onClick={selectStyle} label={'Qui-Gon'} type='qui-gon' className='style-button' selected={false} />
          <Button onClick={selectStyle} label={'Obi-Wan'} type='obi-wan' className='style-button' selected={false} />
          <Button onClick={selectStyle} label={'Jar Jar'} type='jar-jar' className='style-button' selected={false} />
          <Button onClick={selectStyle} label={'Jabba'} type='hutt' className='style-button' selected={false} />
          <Button onClick={selectStyle} label={'Yoda'} type='qui-gon' className='style-button' selected={false} />
        </div>
        <div id='mode-button-area'>
          <Button onClick={selectMode} label={'Dirty Only:'} type='dirty-toggle' className='mode-toggle-button' selected={false} />
          <Button onClick={selectMode} label={'Bulk Mode:'} type='bulk-toggle' className='mode-toggle-button' selected={false} />
          <Button onClick={selectMode} label={'Simple Mode:'} type='simple-toggle' className='mode-toggle-button' selected={false} />
          <Button onClick={selectMode} label={'Show Rejected:'} type='rejected-toggle' className='mode-toggle-button' selected={false} />
        
          {/* <div onClick='toggleDirtyOnly()' id='dirty-toggle' className='mode-toggle-button'>Dirty only: OFF</div> */}
          {/* <div onClick='toggleBulkMode()' id='bulk-toggle' className='mode-toggle-button'>Bulk mode:</div>
          <div onClick='toggleSimpleMode()' id='simple-toggle' className='mode-toggle-button'>Simple mode:</div>
          <div onClick='toggleRejectedMode()' id='rejected-toggle' className='mode-toggle-button'>Show rejected:</div> */}
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