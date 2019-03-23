import React from 'react';
import '../css/NameDisplay.css';

function NameDisplay(props) {
  // console.error('NameDisplay rendering!!')
  let displayName;
  let nameFontStyle = { fontSize: 'var(--name-font-size)' };
  if (!props.bulkMode && document.getElementById('name-display')) {
    document.getElementById('name-display').style.transform = 'scale(0.9)';
    document.getElementById('name-display').style.opacity = 0;
    document.getElementById('name-display').classList.add('not-showing');
    setTimeout(() => {
      document.getElementById('name-display').classList.remove('not-showing');
      setTimeout(() => {
        document.getElementById('name-display').style.opacity = 1;
        document.getElementById('name-display').style.transform = 'none';
      }, 45);
    }, 1);
  }
  let className = props.bulkMode ? 'quick' : undefined;
    if (props.nameData) {      
    displayName = props.nameData.fullName;
    if (props.nameData.invalid) {
      className = 'purple-text'
    }
    if (props.nameData.banned) {
      className = 'green-text'
    }
    if (window.location.pathname !== '/namegenerator/') {
      className = 'not-showing';
      }
      if (window.innerWidth < window.innerHeight) {
        if (displayName.length > 12) {
          nameFontStyle.fontSize = (window.innerWidth / 10);
          if (displayName.length > 16) {
            nameFontStyle.fontSize = `${window.innerWidth / 12}px`;
          }
        }
        if (displayName.length < 8) {
          nameFontStyle.fontSize = `${window.innerWidth / 7}px`;
        }
      }
  }
  return (    
    <div id='name-area'>
      <div style={nameFontStyle} onPointerDown={() => props.onClickName(props.nameData)} id="name-display" className={className}>{displayName}</div>
      <div id="name-stats" className='hidden'></div>
    </div>
  );
}

const isEqual = (prevProps, nextProps) => {
  let equalTest = (
   (prevProps.nameData && nextProps.nameData && prevProps.nameData.fullName == nextProps.nameData.fullName)
   || (nextProps.location.location.pathname != '/')
  );
  return equalTest;
}
export default React.memo(NameDisplay, isEqual);