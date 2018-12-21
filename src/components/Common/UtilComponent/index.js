

import React,{ Component } from 'react';
import styles from './style.scss';

export const ValueFormat = ({ value,  points }) => { // value必为数值 或 '--'。
if (value === '--' || (!points && points === 0)) { // value无值，或不需对数据进行浮点处理
  return <span>{value}</span>;
} else { // value为数值且有浮点数展示要求
  let stringValue = value.toFixed(points);
  const valueArr = stringValue.split('.');
  return (
    <span className={styles.valueFormat}>
      <span className={styles.int}>{valueArr[0]}</span>
      {valueArr[1] && <span className={styles.decimal}>.{valueArr[1]}</span>}
    </span>
  )
}
}