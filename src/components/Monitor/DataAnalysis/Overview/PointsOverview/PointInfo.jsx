
import React from 'react';
import PropTypes from 'prop-types';
import { dataFormats } from '@utils/utilFunc';
import styles from './point.scss';

const BaseInfo = ({ pointType, pointName, theoryCount, validCount, invalidCount, lostCount }) => {
  return (
    <section className={styles.pointBase}>
      <h3 className={styles.baseTitle}>
        <span className={styles.titlePointType}>{pointType}</span>
        <span className={styles.titlePointName}>{pointName}</span>
        <span className={styles.totleholder} />
      </h3>
      <div className={styles.baseBox}>
        <div className={styles.baseRate}>
          <span style={{flexBasis: `${validCount / theoryCount * 100}%`}} className={styles.valid}></span>
          <span style={{flexBasis: `${invalidCount / theoryCount * 100}%`}} className={styles.invalid}></span>
          <span style={{flexBasis: `${lostCount / theoryCount * 100}%`}} className={styles.lost}></span>
        </div>
        <div className={styles.baseDetail}>
          <span>理论数据值</span>
          <span className={styles.theoryCount}>{dataFormats(theoryCount, '--', 2, true)}</span>
        </div>
        <div className={styles.baseDetail}>
          <span>有效值数</span>
          <span className={styles.theoryCount}>{dataFormats(validCount, '--', 2, true)}</span>
        </div>
        <div className={styles.baseDetail}>
          <span>无效值数</span>
          <span className={styles.invalidCount}>{dataFormats(invalidCount, '--', 2, true)}</span>
        </div>
        <div className={styles.baseDetail}>
          <span>缺失值数</span>
          <span className={styles.lostCount}>{dataFormats(lostCount, '--', 2, true)}</span>
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
  minValue, lowerQuartile, medianValue, upperQuartile, maxValue, maxTheory, minTheory, averageValue, standardDeviation, pointType
}) => {
  const tmpValueArr = [
    { value: dataFormats(minValue, '--', 2, true), label: '最小值' },
    { value: dataFormats(lowerQuartile, '--', 2, true), label: '下四分位数' },
    { value: dataFormats(medianValue, '--', 2, true), label: '中位数' },
    { value: dataFormats(upperQuartile, '--', 2, true), label: '上四分位数' },
    { value: dataFormats(maxValue, '--', 2, true), label: '最大数' },
  ];
  const tmpTheoryArr = [
    { value: dataFormats(maxTheory, '--', 2, true), label: '理论最大值' },
    { value: dataFormats(minTheory, '--', 2, true), label: '理论最小值' },
  ];
  const tmpAvgArr = [
    { value: dataFormats(averageValue, '--', 2, true), label: '平均值' },
    { value: dataFormats(standardDeviation, '--', 2, true), label: '标准差' },
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
      {pointType === 'YC' && <div className={styles.valuePart}>
        {tmpTheoryArr.map(e => (
          <span key={e.label} className={styles.eachIndicate}>
            <span>{e.label}</span>
            <span>{e.value}</span>
          </span>
        ))}
      </div>}
      {pointType === 'YC' && <div className={styles.valuePart}>
        {tmpAvgArr.map(e => (
          <span key={e.label} className={styles.eachIndicate}>
            <span>{e.label}</span>
            <span>{e.value}</span>
          </span>
        ))}
      </div>}
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
  pointType: PropTypes.string,
};

export { BaseInfo, ValueInfo };
