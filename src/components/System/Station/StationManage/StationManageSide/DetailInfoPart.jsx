import React from 'react';
import { Button } from 'antd';
import styles from './stationSide.scss';

/*
  格式： infoArray: [{name: '', value: '', unit: ''}].
  handler: 点击按钮触发的事件.
  name必填，value/unit可不填
*/

function DetailInfoPart({ title, infoArray,  handler }){
  return (
    <div className={styles.infoBox}>
      <div className={styles.infoTitle}>
        <span>{title}</span>
        {handler?<Button onClick={handler}>编辑</Button>:null}
      </div>
      <div className={styles.eachInfo}>
        {infoArray.map(e=>{
          let value;
          if(e.value || parseFloat(e.value) === 0){
            value = e.value;
          }else{
            value = '--'
          }
          return (<span key={e.name}>
            <span>{e.name}</span>
            <span>{value}</span>
            <span>{e.unit || ''}</span>
          </span>)
        })}
      </div>
    </div>
  )
}

export default DetailInfoPart;