import React from 'react';
import { Button } from 'antd';
import styles from './stationSide.scss';

/*
  格式： infoArray: [{name: '', value: '', unit: ''}].
  handler: 点击按钮触发的事件.
  name必填，value/unit可不填
  hasBottomBorder默认true代表有底部border线。
*/

function DetailInfoPart({ title, infoArray,  handler, noBottomBorder=false }){
  const borderStyle = noBottomBorder?{borderBottom: 'none'}:{};
  return (
    <div className={styles.infoBox} style={{...borderStyle}}>
      <div className={styles.infoTitle}>
        <span className={styles.titleText}>{title}</span>
        {handler?<Button onClick={handler} className={styles.button} >编辑</Button>:null}
      </div>
      <div className={styles.infoPart}>
        {infoArray.map(e=>{
          let value;
          if(e.value || parseFloat(e.value) === 0){
            value = e.value;
          }else{
            value = '--'
          }
          return (<span key={e.name} className={styles.eachInfo}>
            <span className={styles.infoName}>{e.name}</span>
            <span className={styles.infoValue}>{e.name==='电站主线图'? <a href={value} target="_blank" style={{color: '#199475;'}} >查看</a> : `${value}${e.unit || ''}`}</span>
          </span>)
        })}
      </div>
    </div>
  )
}

export default DetailInfoPart;