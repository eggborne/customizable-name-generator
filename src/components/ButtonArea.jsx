import React from 'react';
import { BrowserRouter as Route, Link } from "react-router-dom";
import Button from './Button.jsx';
import PatternDisplay from './PatternDisplay.jsx';

// import '../css/ButtonArea.css';

const units = {
  onsets: 'C',
  nuclei: 'V',
  codas: 'C'
}

function ButtonArea(props) {
  return (
    <div id='main-container'>
      <div id='pattern-label'>Pattern</div>
      <div id='style-select-area'>
        <PatternDisplay syllablePattern={props.syllablePattern} />
        <div>
          <Button onClick={props.onChangeStyle} label={'Random'} type='random' className='style-toggle-button' selected={props.currentNameStyle === 'random'} />
          <Button onClick={props.onChangeStyle} label={'Custom...'} type='custom' className='style-toggle-button' selected={props.currentNameStyle === 'custom'} />
        </div>
        <Button onClick={props.onChangeStyle} label={'Obi-Wan'} type='obi-wan' className='style-toggle-button' selected={props.currentNameStyle === 'obi-wan'} />
        <Button onClick={props.onChangeStyle} label={'Kylo'} type='kylo' className='style-toggle-button' selected={props.currentNameStyle === 'kylo'} />
        <Button onClick={props.onChangeStyle} label={'Mace'} type='mace' className='style-toggle-button' selected={props.currentNameStyle === 'mace'} />
        <Button onClick={props.onChangeStyle} label={'Han'} type='han' className='style-toggle-button' selected={props.currentNameStyle === 'han'} />
        <Button onClick={props.onChangeStyle} label={'Poe'} type='poe' className='style-toggle-button' selected={props.currentNameStyle === 'poe'} />
        <Button onClick={props.onChangeStyle} label={'Yoda'} type='yoda' className='style-toggle-button' selected={props.currentNameStyle === 'yoda'} />
        <Button onClick={props.onChangeStyle} label={'Jar Jar'} type='jar-jar' className='style-toggle-button' selected={props.currentNameStyle === 'jar-jar'} />
        <Button onClick={props.onChangeStyle} label={'Jabba'} type='jabba' className='style-toggle-button' selected={props.currentNameStyle === 'jabba'} />
        {/* <Button onClick={props.onChangeStyle} label={'Lando'} type='lando' className='style-toggle-button' selected={props.currentNameStyle === 'lando'} /> */}
      </div>
      <div id='mode-button-area'>
        {/* <div id='mode-label'>Mode</div> */}
        <Button onClick={props.onChangeMode} label={'Block NSFW:'} type='block-vulgar-toggle' className='mode-toggle-button' selected={props.blockMode} />
        {/* <Button onClick={props.onChangeMode} label={'Bulk Mode:'} type='bulk-toggle' className='mode-toggle-button' selected={props.bulkMode} /> */}
        <Button onClick={props.onChangeMode} label={'Simple Mode:'} type='simple-toggle' className='mode-toggle-button' selected={props.simpleMode} />
        {/* <Button onClick={props.onChangeMode} label={'Show Rejected:'} type='rejected-toggle' className='mode-toggle-button' selected={props.rejectedMode} /> */}
      </div>
      <div id='main-button-area'>
        <Button onClick={props.onClickGenerate} unavailable={!props.readyToGenerate} label={'GENERATE'} type='main' />
      </div>
      <div id='link-button-area'>
        <Link to='/history' replace>
          <Button onClick={() => null} className={'nav-link'} label={'HISTORY'} type='history' />
        </Link>
        <Link to='/rules' replace>
          <Button onClick={() => null} className={'nav-link'} label={'RULES'} type='rules' />
        </Link>
      </div>
    </div>
  );
}
const isEqual = (prevProps, nextProps) => {
    console.warn('rendering ButtonArea!!', nextProps.syllablePattern);

  let isEqual = prevProps.currentNameStyle === nextProps.currentNameStyle &&
    prevProps.blockMode === nextProps.blockMode &&
    // prevProps.bulkMode === nextProps.bulkMode &&
    prevProps.simpleMode === nextProps.simpleMode &&
    prevProps.rejectedMode === nextProps.rejectedMode &&
    prevProps.readyToGenerate === nextProps.readyToGenerate;
  return isEqual;
}
export default React.memo(ButtonArea, isEqual);
// export default ButtonArea;
