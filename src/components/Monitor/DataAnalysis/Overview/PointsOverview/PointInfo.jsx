
import React from 'react';
import PropTypes from 'prop-types';
import styles from './point.scss';

const BaseInfo = ({ pointType, pointName, theoryCount, validCount, invalidCount, lostCount }) => {
  return (
    <section className={styles.pointBase}>
      <h3 className={styles.baseTitle}>
        <span>{pointType}</span>
        <span>{pointName}</span>
      </h3>
      <div className={styles.baseBox}>
        <div className={styles.baseRate}>
          <span style={{flexBasis: `${validCount / theoryCount * 100}%`}} className={styles.valid}></span>
          <span style={{flexBasis: `${invalidCount / theoryCount * 100}%`}} className={styles.invalid}></span>
          <span style={{flexBasis: `${lostCount / theoryCount * 100}%`}} className={styles.lost}></span>
        </div>
        <div className={styles.baseDetail}>
          <span>理论数据值</span>
          <span>{theoryCount}</span>
        </div>
        <div className={styles.baseDetail}>
          <span>有效值数</span>
          <span>{validCount}</span>
        </div>
        <div className={styles.baseDetail}>
          <span>无效值数</span>
          <span>{invalidCount}</span>
        </div>
        <div className={styles.baseDetail}>
          <span>缺失值数</span>
          <span>{lostCount}</span>
        </div>
      </div>
    </section>
  );
};

BaseInfo.propTypes = {
  pointType: PropTypes.string,
  pointName: PropTypes.string,
  theoryCount: PropTypes.number,
  validCount: PropTypes.number,
  invalidCount: PropTypes.number,
  lostCount: PropTypes.number,
};

const ValueInfo = ({
  minValue, lowerQuartile, medianValue, upperQuartile, maxValue, maxTheory, minTheory, averageValue, standardDeviation,
}) => {
  const tmpValueArr = [
    { value: minValue, label: '最小值' },
    { value: lowerQuartile, label: '下四分位数' },
    { value: medianValue, label: '中位数' },
    { value: upperQuartile, label: '上四分位数' },
    { value: maxValue, label: '最大数' },
  ];
  const tmpTheoryArr = [
    { value: maxTheory, label: '理论最大值' },
    { value: minTheory, label: '理论最小值' },
  ];
  const tmpAvgArr = [
    { value: averageValue, label: '平均值' },
    { value: standardDeviation, label: '标准差' },
  ];
  return (
    <div className={styles.valueInfo}>
      <div className={styles.valuePart}>
        {tmpValueArr.map(e => (
          <span key={e.label} className={styles.eachIndicate}>
            <span>{e.label}</span>
            <span>{e.value}</span>
          </span>
        ))}
      </div>
      <div className={styles.valuePart}>
        {tmpTheoryArr.map(e => (
          <span key={e.label} className={styles.eachIndicate}>
            <span>{e.label}</span>
            <span>{e.value}</span>
          </span>
        ))}
      </div>
      <div className={styles.valuePart}>
        {tmpAvgArr.map(e => (
          <span key={e.label} className={styles.eachIndicate}>
            <span>{e.label}</span>
            <span>{e.value}</span>
          </span>
        ))}
      </div>
    </div>
  );
};

ValueInfo.propTypes = {
  minValue: PropTypes.number,
  lowerQuartile: PropTypes.number,
  medianValue: PropTypes.number,
  upperQuartile: PropTypes.number,
  maxValue: PropTypes.number,
  maxTheory: PropTypes.number,
  minTheory: PropTypes.number,
  averageValue: PropTypes.number,
  standardDeviation: PropTypes.number,
};

export { BaseInfo, ValueInfo };
