import React from 'react';
import { dataFormats, numWithComma } from '../../../../utils/utilFunc';
import styles from './windCommon.scss';

const DeviceValueFormat = (data, placeholder = '--', pointLength, special = false) => {
    let point = pointLength;
    if (special) { // 特殊的设置 只针对风电
      if (data > 100) point = 0;
      if (data > 0.01 && data <= 100) point = 2;
      if (data <= 0.01) point = 4;
    }
    let showData = dataFormats(data, placeholder, point, true)
    if (showData !== '--') {
      const valueArr = showData.split('.');
      const intNum = valueArr[0];
      const pointNum = valueArr[1];
      return (
        <span className={styles.valueFormat}>
          <span className={styles.int} style={{ fontSize: 24 }}>{numWithComma(intNum)}</span>
          {pointNum && <span className={styles.decimal} style={{ fontSize: 18 }}>.{pointNum}</span>}
        </span>
      )
    } else {
      return showData
    }
  }

  export {DeviceValueFormat}