import React from 'react';
import styles from './deviceMonitor.scss';
import { dataFormat } from '../../../../../utils/utilFunc';

export const YcPoints = ({ ycData = [] }) => {
  return (
    <section className={styles.ycInfo}>
      <h3>YC/遥测量</h3>
      <div className={styles.ycList}>
        <div className={styles.top}>
          <span>名称</span>
          <span>测量值</span>
          <span>单位</span>
        </div>
        {ycData.map(e => (
          <div className={styles.eachYc}>
            <span>{e.pointName}</span>
            <span>{dataFormat(e.pointValue, '--', 2)}</span>
            <span>{e.pointUnit}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

export const YxPoints = ({ yxData = [] }) => {
  return (
    <section className={styles.yxInfo}>
      <h3>YX</h3>
      <div className={styles.yxList}>
        {yxData.map(e => (
          <span className={styles.eachYx}>
            <span>{e.pointValue}</span>
            <span>{e.pointName}</span>
          </span>
        ))}
      </div>
    </section>
  )
}

export const YmPoints = ({ ymData = [] }) => {
  return (
    <section className={styles.ymInfo}>
      <h3>YM</h3>
      <div className={styles.ymList}>
        {ymData.map(e => (
          <span className={styles.eachYm}>
            <span>{e.pointName}</span>
            <span>{e.pointValue}</span>
            <span>{e.pointUnit || ''}</span>
          </span>
        ))}
      </div>
    </section>
  )
}