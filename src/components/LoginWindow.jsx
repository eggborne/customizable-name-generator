import React from 'react';
// eslint-disable-next-line
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Button from './Button';
import '../css/Button.css';
import '../css/LoginWindow.css';

function LoginWindow(props) {
  // console.error('rendering LoginWindow!!', props);
  if (props.mode !== null) {
    setTimeout(() => {
      if (document.getElementById('login-window')) {
        document.getElementById('login-window').classList.add('showing')
      }
    }, 1);
  }
  let fieldsOk = (props.usernameOk && props.passwordOk && props.passwordsMatch);
  if (props.mode === 'loggingIn') {
    fieldsOk = (props.usernameOk && props.passwordOk);
  }
  let buttonClass = 'balls';
  if (!fieldsOk) {
    buttonClass = 'disabled';
  } else {
    buttonClass = undefined;
  }
  return (
    <div id='login-shade' className={props.mode !== null ? 'shade showing' : 'shade'}>
      {props.mode === 'registering' &&
        <div id='login-window'>
          <div id='login-title'>REGISTER</div>          
          <form onSubmit={(event) => props.onClickRegisterLogin(event)}>
            <div className='medium-input-label'>Username:</div>
            <input type='text' onChange={(event) => props.onRegisterUsernameInputChange(event)} minLength='3' maxLength='18' id='register-username-input' className='medium-input' placeholder='username'></input>
            <div className='medium-input-label'>Password (6-24 characters):</div>
            <input autoComplete='current-password' id='register-password-input' type='password' onChange={(event) => props.onRegisterPasswordInputChange(event)} minLength='3' maxLength='24' className='medium-input' placeholder='password'></input>
            <input autoComplete='current-password' id='repeat-password-input' type='password' onChange={(event) => props.onRepeatPasswordInputChange(event)} minLength='6' maxLength='24' className='medium-input' placeholder='repeat password'></input>
            <div id='stay-logged-in-toggle'>
              <div onClick={props.onToggleSaveCookie} className={props.saveCookie ? 'selected' : ''}>Remember me (uses cookie): {props.saveCookie ? 'YES' : 'NO'}</div>
            </div>
            <Button className={buttonClass} onClick={() => null} label={'REGISTER'} type='send-register' />
          </form>
          <div className='x-button' onClick={props.onClickCloseRegister} id='close-register-button' ><i className='material-icons'>close</i></div>
        </div>
      }
      {props.mode === 'loggingIn' &&
        <div id='login-window'>
          <div id='login-title'>LOG IN</div>
          <form onSubmit={(event) => props.onClickSubmitLogin(event)}>
            <div className='medium-input-label'>Username:</div>
            <input type='text' minLength='3' maxLength='18' onChange={(event) => props.onLoginUsernameInputChange(event)} id='login-username-input' className='medium-input' placeholder='username'></input>
            <div className='medium-input-label'>Password:</div>
            <input autoComplete='current-password' id='login-password-input' type='password' onChange={(event) => props.onLoginPasswordInputChange(event)} minLength='3' maxLength='24' className='medium-input' placeholder='password'></input>
            <div id='stay-logged-in-toggle'>
              <div onClick={props.onToggleSaveCookie} className={props.saveCookie ? 'selected' : ''}>Remember me (uses cookie): {props.saveCookie ? 'YES' : 'NO'}</div>
            </div>
          <Button className={buttonClass} onClick={() => null} label={'LOG IN'} type='send-login' />
          </form>
          <div className='x-button' onClick={props.onClickCloseRegister} id='close-login-button' ><i className='material-icons'>close</i></div>
        </div>
      }
    </div>
  );
}

export default React.memo(LoginWindow);
