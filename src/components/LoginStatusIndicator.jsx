import React from 'react';
import '../css/LoginStatusIndicator.css';

function LoginStatusIndicator(props) {
  return (    
    <div id='login-status' className={props.userLoggedIn ? 'logged-in' : undefined}>
      {props.userLoggedIn ? props.titleText : 'not logged in'}
    </div>    
  );
}

export default LoginStatusIndicator;