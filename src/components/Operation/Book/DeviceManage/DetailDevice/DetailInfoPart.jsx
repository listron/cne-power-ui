import React from 'react';
import { Button } from 'antd';
import styles from '../deviceSide.scss';

/*
  格式： infoArray: [{name: '', value: '', unit: ''}].
  handler: 点击按钮触发的事件.
  name必填，value/unit可不填
  hasBottomBorder默认true代表有底部border线。
*/

function DetailInfoPart({ title, infoArray, handler, noBottomBorder = false, extraInfo = null }) {
  const borderStyle = noBottomBorder ? { borderBottom: 'none' } : {};
  return (
    <div className={styles.infoBox} style={{ ...borderStyle }}>
      <div className={styles.infoPart}>
        {infoArray.map(e => {
          let value;
          if (e.value || e.value === 0) {
            value = e.value;
          } else {
            value = '--'
          }
          return (<div key={e.name} className={styles.eachInfo}>
            <div className={styles.infoName}>{e.name}</div>
            <div className={styles.infoValue}
              title={`${value}${e.unit || ''}`}
            >{`${value}${e.unit || ''}`}</div>
          </div>)
        })}
      </div>
    </div>
  )
}

export default DetailInfoPart;