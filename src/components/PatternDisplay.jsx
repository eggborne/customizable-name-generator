import React from 'react';

const units = {
  onsets: 'C',
  nuclei: 'V',
  codas: 'C'
}

function PatternDisplay(props) {
  let previousType;
  return (
    <div id='pattern-diagram'>
      {props.syllablePattern &&
        Object.values(props.syllablePattern).map((name, n) => (
          <div key={'name' + n} className='name-word'>
            {name.map((unit, u) => {
              console.log('first name unit', u, unit);
              let unitClass = unit.type;
              let actualClass = unitClass;
              if (unit.type === 'repeater') {
                console.log('reperater getting value', unit.value, 'of', name)
                actualClass = name[unit.value].type;
                console.log('actualClass', actualClass)
                unitClass = actualClass + ' repeater';
              }
              if (unit.type === 'literal') {
                if (unit.value === 'e') {
                  return <div className='literal-full'>the</div>
                } else if (unit.value === '-' || unit.value === ' ') {
                  if (u < name.length - 1) {
                    return <div className='literal value'>{unit.value}</div>
                  } else {
                    return <div className='literal-end value'>{unit.value}</div>
                  }
                } else {
                  return ''
                }
              }
              previousType = unit.type
              return (
                <div className={unitClass} key={unit.type + n + '-' + u}>
                  {unit.type === 'literal' ? <div>{unit.value}</div> : unit.type === 'repeater' ? units[actualClass] : units[unit.type]}
                </div>
              );
            })}
          </div>
        ))}
    </div>
  );
}
export default PatternDisplay;
