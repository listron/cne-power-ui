import React from 'react';
import styles from './stationSide.scss';

/*
  props格式： eachInfo: {name: '', value: '', unit: ''}. 属性中：name必填，vlaue，unit可不填。
*/

function EditInfoPart({ eachInfo }){
  let value;
  if(eachInfo.value || parseFloat(eachInfo.value) === 0){
    value = eachInfo.value;
  }else{
    value = '--'
  }
  return (
    <span className={styles.eachInfo}>
      <span className={styles.infoName}>{eachInfo.name}</span>
      <span className={styles.infoValue}>{value}{eachInfo.unit || ''}</span>
    </span>
  )
}

export default EditInfoPart;