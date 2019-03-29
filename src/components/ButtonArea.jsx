import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Button from './Button.jsx';

// import '../css/ButtonArea.css';

function ButtonArea(props) {
  console.error('rendering ButtonArea!!', props.readyToGenerate)
  return (    
    <div id='main-container'>
      <div id='style-select-area'>
        <div id='style-label'>Pattern</div>
        <div>
          <Button onClick={props.onChangeStyle} label={'Random'} type='random' className='style-toggle-button' selected={props.currentNameStyle === 'random'} />
          <Button onClick={props.onChangeStyle} label={'Custom...'} type='custom' className='style-toggle-button' selected={props.currentNameStyle === 'custom'} />
        </div>
        <Button onClick={props.onChangeStyle} label={'Basic'} type='basic' className='style-toggle-button' selected={props.currentNameStyle === 'basic'} />
        <Button onClick={props.onChangeStyle} label={'Qui-Gon'} type='qui-gon' className='style-toggle-button' selected={props.currentNameStyle === 'qui-gon'} />
        <Button onClick={props.onChangeStyle} label={'Obi-Wan'} type='obi-wan' className='style-toggle-button' selected={props.currentNameStyle === 'obi-wan'} />
        <Button onClick={props.onChangeStyle} label={'Jar Jar'} type='jar-jar' className='style-toggle-button' selected={props.currentNameStyle === 'jar-jar'} />
        <Button onClick={props.onChangeStyle} label={'Jabba'} type='jabba' className='style-toggle-button' selected={props.currentNameStyle === 'jabba'} />
        <Button onClick={props.onChangeStyle} label={'Yoda'} type='yoda' className='style-toggle-button' selected={props.currentNameStyle === 'yoda'} />
      </div>
      <div id='mode-button-area'>
      {/* <div id='mode-label'>Mode</div> */}
        <Button onClick={props.onChangeMode} label={'Block NSFW:'} type='block-vulgar-toggle' className='mode-toggle-button' selected={props.blockMode} />
        <Button onClick={props.onChangeMode} label={'Bulk Mode:'} type='bulk-toggle' className='mode-toggle-button' selected={props.bulkMode} />
        <Button onClick={props.onChangeMode} label={'Simple Mode:'} type='simple-toggle' className='mode-toggle-button' selected={props.simpleMode} />
        <Button onClick={props.onChangeMode} label={'Show Rejected:'} type='rejected-toggle' className='mode-toggle-button' selected={props.rejectedMode} />
      </div>
      <div id='main-button-area'>
        <Button onClick={props.onClickGenerate} unavailable={!props.readyToGenerate} label={'GENERATE'} type='main' />
      </div>
      <div id='link-button-area'>
        <Link to="/history" replace><Button onClick={() => null} className={'nav-link'} label={'HISTORY'} type='history' /></Link>
        <Link to="/rules" replace><Button onClick={() => null} className={'nav-link'} label={'RULES'} type='rules' /></Link>
      </div>
    </div>
  );
}
const isEqual = (prevProps, nextProps) => {
  let isEqual = prevProps.currentNameStyle == nextProps.currentNameStyle &&
    prevProps.blockMode === nextProps.blockMode &&
    prevProps.bulkMode === nextProps.bulkMode &&
    prevProps.simpleMode === nextProps.simpleMode &&
    prevProps.rejectedMode === nextProps.rejectedMode &&
    prevProps.readyToGenerate === nextProps.readyToGenerate;
  console.warn('isEqual?', isEqual)
  return isEqual;
}
export default React.memo(ButtonArea, isEqual);
// export default ButtonArea;