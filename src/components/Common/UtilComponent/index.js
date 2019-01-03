

import React, { Component } from 'react';
import styles from './style.scss';

export const ValueFormat = ({ value, points, valueunit }) => { // value必为数值 或 '--'。
  let initUnit = [value, 'MW', 1];
  let type1 = [value, 'kW', 1000];
  let type2 = [value, 'kWh', 10000];
  let initPowerType = [value, '万kWh', 1];
  let filterValueUnit = [initUnit, type1, type2, initPowerType].filter((e, i) => {
    if (e.includes(valueunit)) { return e }
  })
  let unitType=filterValueUnit.length>0?filterValueUnit[0]:initUnit;
  if (value === '--' || (!points && points === 0)) { // value无值，或不需对数据进行浮点处理
    return <span>{value}</span>;
  } else { // value为数值且有浮点数展示要求
    let stringValue = (value * unitType[2]).toFixed(points);
    const valueArr = stringValue.split('.');
    return (
      <span className={styles.valueFormat}>
        <span className={styles.int}>{valueArr[0]}</span>
        {valueArr[1] && <span className={styles.decimal}>.{valueArr[1]}</span>}
      </span>
    )
  }
}


export const DeviceValueFormat = ({ value, points }) => { // value必为数值 或 '--'。
  if (value === '--' ) { // value无值，或不需对数据进行浮点处理
    return <span>{value}</span>;
  } else { // value为数值且有浮点数展示要求
    let stringValue =`${value}`;
    const valueArr = stringValue.split('.');
    return (
      <span className={styles.valueFormat}>
        <span className={styles.int}>{valueArr[0]}</span>
        {valueArr[1] && <span className={styles.decimal}>.{valueArr[1]}</span>}
      </span>
    )
  }
}

// export const ValueFormat = ({ value, points }) => { // value必为数值 或 '--'。
//   if (value === '--' || (!points && points === 0)) { // value无值，或不需对数据进行浮点处理
//     return <span>{value}</span>;
//   } else { // value为数值且有浮点数展示要求
//     let stringValue = value.toFixed(points);
//     const valueArr = stringValue.split('.');
//     return (
//       <span className={styles.valueFormat}>
//         <span className={styles.int}>{valueArr[0]}</span>
//         {valueArr[1] && <span className={styles.decimal}>.{valueArr[1]}</span>}
//       </span>
//     )
//   }
// }