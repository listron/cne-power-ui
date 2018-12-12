import React from 'react';
import PropTypes from 'prop-types';
import styles from './deviceMonitor.scss';
import { dataFormat } from '../../../../../utils/utilFunc';

export const YcPoints = ({ ycData = [] }) => {
  return (
    <section className={styles.ycInfo}>
      <h3>YC/遥测量</h3>
      <div className={styles.ycList}>
        <div className={styles.top}>
          <span className={styles.name}>名称</span>
          <span className={styles.value}>测量值</span>
          <span className={styles.unit}>单位</span>
        </div>
        <div className={styles.ycContent}>
          {ycData.map(e => (
            <div key={e.pointName} className={styles.eachYc}>
              <span className={styles.name}>{e.pointName}</span>
              <span className={styles.value}>{dataFormat(e.pointValue, '--', 2)}</span>
              <span className={styles.unit}>{e.pointUnit}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

YcPoints.propTypes = {
  ycData: PropTypes.array,
}

export const YxPoints = ({ yxData = [] }) => {
  return (
    <section className={styles.yxInfo}>
      <h3>YX</h3>
      <div className={styles.yxList}>
        {yxData.map(e => (
          <span key={e.pointName} className={styles.eachYx}>
            <span
              className={styles.round}
              style={{ backgroundColor: e.pointValue > 0 ? '#7ed321': '#d0021b' }}
            />
            <span className={styles.name}>{e.pointName}</span>
          </span>
        ))}
      </div>
    </section>
  )
}

YxPoints.propTypes = {
  yxData: PropTypes.array,
}

export const YmPoints = ({ ymData = [] }) => {
  return (
    ymData.length > 0 ? <section className={styles.ymInfo}>
      <h3>YM</h3>
      <div className={styles.ymList}>
        {ymData.map(e => (
          <span key={e.pointName} className={styles.eachYm}>
            <span>{e.pointName}</span>
            <span>{e.pointValue}</span>
            <span>{e.pointUnit || ''}</span>
          </span>
        ))}
      </div>
    </section>: null
  )
}

YmPoints.propTypes = {
  ymData: PropTypes.array,
}