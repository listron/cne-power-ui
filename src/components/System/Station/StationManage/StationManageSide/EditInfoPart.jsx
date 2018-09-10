import React from 'react';
import styles from './stationSide.scss';

/*
  格式： eachInfo: {name: '', value: '', unit: ''}.
*/

function EditInfoPart({ eachInfo }){
  return (
    <span>
      <span>{eachInfo.name}</span>
      <span>{eachInfo.value}</span>
      <span>{eachInfo.unit}</span>
    </span>
  )
}

export default EditInfoPart;