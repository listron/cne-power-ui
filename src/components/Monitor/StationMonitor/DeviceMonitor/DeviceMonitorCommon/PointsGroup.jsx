import React from 'react';
import PropTypes from 'prop-types';
import styles from './deviceMonitor.scss';
import { dataFormat } from '../../../../../utils/utilFunc';

export const YcPoints = ({ ycData = [] }) => {
  return (
    <section className={styles.ycInfo}>
      <h3>遥测量(YC)</h3>
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
              <span className={styles.unit}>{e.pointUnit || '--'}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

YcPoints.propTypes = {
  ycData: PropTypes.array,
};

export const YxPoints = ({ yxData = [] }) => {
  const valueColor = value => {
    if (value === '1') {
      return { backgroundColor: '#7ed321' };
    } else if (value === '0') {
      return { backgroundColor: '#d0021b' };
    }
    return { backgroundColor: '#dfdfdf' };
  };
  return (
    <section className={styles.yxInfo}>
      <h3>遥信量(YX)</h3>
      <div className={styles.yxList}>
        {yxData.map(e => (
          <span key={e.pointName} className={styles.eachYx}>
            <span
              className={styles.round}
              style={valueColor(e.pointValue)}
            />
            <span className={styles.name} title={e.pointName}>{e.pointName}</span>
          </span>
        ))}
      </div>
    </section>
  );
};

YxPoints.propTypes = {
  yxData: PropTypes.array,
};

export const YmPoints = ({ data = [], name = 'YM' }) => { //  遥脉测点或ycs展示。
  const groupMax = 10;
  const groupedData = [];
  data.forEach((e, i) => {
    const groupIndex = parseInt(i / groupMax, 10);
    if(!groupedData[groupIndex]){
      groupedData[groupIndex] = [e];
    }else{
      groupedData[groupIndex].push(e);
    }
  });
  return (
    data.length > 0 ? <section className={styles.ymInfo}>
      <h3>{name}</h3>
      <div className={styles.ymList}>
        {groupedData.map((e, groupIndex) => (
          <div key={e.groupIndex} className={styles.ymColumn}>
            {e.map(ym => (
              <span key={ym.pointName} className={styles.eachYm}>
                <span>{ym.pointName}</span>
                <span>{ym.pointValue}{ym.pointUnit || ''}</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>: null
  );
};

YmPoints.propTypes = {
  data: PropTypes.array,
  name: PropTypes.string,
};
