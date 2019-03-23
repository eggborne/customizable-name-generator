import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Button from './Button.jsx';

// import '../css/ButtonArea.css';

function ButtonArea(props) {
  // console.error('rendering ButtonArea!!')
  return (    
    <div id='main-container'>
      <div id='style-select-area'>
        <Button onClick={props.onChangeStyle} label={'Random'} type='random' className='style-toggle-button' selected={props.currentNameStyle === 'random'} />
        <Button onClick={props.onChangeStyle} label={'Basic'} type='basic' className='style-toggle-button' selected={props.currentNameStyle === 'basic'} />
        <Button onClick={props.onChangeStyle} label={'Qui-Gon'} type='qui-gon' className='style-toggle-button' selected={props.currentNameStyle === 'qui-gon'} />
        <Button onClick={props.onChangeStyle} label={'Obi-Wan'} type='obi-wan' className='style-toggle-button' selected={props.currentNameStyle === 'obi-wan'} />
        <Button onClick={props.onChangeStyle} label={'Jar Jar'} type='jar-jar' className='style-toggle-button' selected={props.currentNameStyle === 'jar-jar'} />
        <Button onClick={props.onChangeStyle} label={'Jabba'} type='hutt' className='style-toggle-button' selected={props.currentNameStyle === 'hutt'} />
        <Button onClick={props.onChangeStyle} label={'Yoda'} type='yoda' className='style-toggle-button' selected={props.currentNameStyle === 'yoda'} />
      </div>
      <div id='mode-button-area'>
        <Button onClick={props.onChangeMode} label={'Dirty Only:'} type='dirty-toggle' className='mode-toggle-button' selected={props.dirtyMode} />
        <Button onClick={props.onChangeMode} label={'Bulk Mode:'} type='bulk-toggle' className='mode-toggle-button' selected={props.bulkMode} />
        <Button onClick={props.onChangeMode} label={'Simple Mode:'} type='simple-toggle' className='mode-toggle-button' selected={props.simpleMode} />
        <Button onClick={props.onChangeMode} label={'Show Rejected:'} type='rejected-toggle' className='mode-toggle-button' selected={props.rejectedMode} />
      </div>
      <div id='main-button-area'>
        <Button onClick={props.onClickGenerate} label={'GENERATE NAME'} type='main' />
      </div>
      <div id='link-button-area'>
        <Link to="/history" replace><Button onClick={() => null} className={'nav-link'} label={'HISTORY'} type='history' /></Link>
        <Link to="/rules" replace><Button onClick={() => null} className={'nav-link'} label={'RULES'} type='rules' /></Link>
      </div>
    </div>
  );
}
const isEqual = (prevProps, nextProps) => {
  return prevProps.currentNameStyle == nextProps.currentNameStyle &&
    prevProps.dirtyMode === nextProps.dirtyMode &&
    prevProps.bulkMode === nextProps.bulkMode &&
    prevProps.simpleMode === nextProps.simpleMode &&
    prevProps.rejectedMode === nextProps.rejectedMode;
}
export default React.memo(ButtonArea, isEqual);
// export default ButtonArea;