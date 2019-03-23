import React from 'react';
 // eslint-disable-next-line
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Button from './Button';
import Name from './Name';
import '../css/Button.css';
import '../css/HistoryScreen.css';

function HistoryScreen(props) {
  // console.error('rendering HistoryScreen!!');
  return (
    <div className={props.location.location.pathname.includes('/history') ? undefined : 'hidden'} id='history-screen'>
      <div id='history-title'>HISTORY</div>
      <div id='history-count-display'>{props.namesList.length} items</div>
      <div id='history-list'>
        {props.namesList.map((nameData) => {
          let className = '';
          if (nameData.banned) { className = 'green-text'; }
          if (nameData.invalid) { className = 'purple-text'; }
          // return <div key={nameData.fullName} onPointerDown={() => { console.log('cock') }} className={className}>{nameData.fullName}</div>;
          return <Name key={nameData.fullName} onClickName={props.onClickName} className={className} nameData={nameData} />;
        })}
      </div>
      <div className='lower-nav-panel'>
        <div><Link to='/' replace><Button className='bottom-nav back-button nav-link' onClick={props.onClickBack} label={'BACK'} type='history-back' /></Link></div>
        <div><Button className='bottom-nav' onClick={props.onClickGenerateMore} label={'GENERATE MORE'} type='generate-more' /></div> 
        <div><Button disabled={!props.namesList.length} className='bottom-nav' onClick={props.onclickClearList} label={'CLEAR'} type='clear' /></div> 
      </div>
    </div>    
  );
}

function isEqual(prevProps, nextProps) {
  // let leaving = prevProps.location.location.pathname === '/history' && nextProps.location.location.pathname === '/';
  let equalTest = (!prevProps.location.location.pathname.includes('history')  && !nextProps.location.location.pathname.includes('history')) && 
    prevProps.namesList == nextProps.namesList;
  return equalTest;
}
export default React.memo(HistoryScreen, isEqual);