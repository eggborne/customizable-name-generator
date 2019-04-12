import React from 'react';
// eslint-disable-next-line
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Button from './Button';
import '../css/Button.css';
import '../css/ConfirmModal.css';

function ConfirmModal(props) {
  console.error('rendering ConfirmModal!!', props.mode);
  let confirmEffect;
  if (props.mode === 'logOut') {
    console.log('setting effect to log out!')
    confirmEffect = props.onConfirmLogOut;
  }
  if (props.mode !== null) {
    setTimeout(() => {
      if (document.getElementById('confirm-modal')) {
        document.getElementById('confirm-modal').classList.add('showing')
      }
    }, 1);
  }
  return (
    <div id='confirm-shade' className={props.mode !== null ? 'shade showing' : 'shade'}>
      <div id='confirm-modal'>
        <div id='confirm-title'>{props.titleText}</div>
        <div id='confirm-button-area'>
            <Button className={'confirm-button'} onClick={props.onConfirmLogOut} label={'DO IT'} type='confirm-logout' />
     
          <Button className={'confirm-button'} onClick={props.onClickCancelLogout} label={'NEVER MIND'} type='cancel-logout' />
        </div>
      </div>
    </div>
  );
}

function isEqual(prevProps, nextProps) {
  let equalTest = prevProps.mode === nextProps.mode;
  return equalTest;
}

export default React.memo(ConfirmModal, isEqual);
