
import React from 'react';
import PropTypes from 'prop-types';
import { dataFormat } from '../../../../../utils/utilFunc';
import styles from './manageCommon.scss';

export const ReserveDetail = ({ reserveDetail, tabName }) => {
  const leftTmpArr = [
    { label: '仓库名称', key: 'warehouseName' },
    { label: '物品类型', key: 'goodsType' },
    { label: '物品名称', key: 'goodsName' },
    { label: '厂家', key: 'manufactorName' },
    { label: '型号', key: 'modeName' },
    { label: '对应资产', key: 'assets' },
  ];
  let leftArr = [];
  if (tabName === 'spares') { // 备品备件时，无物品类型有对应资产, 
    leftArr = leftTmpArr.filter(e => e.label !== '物品类型');
  } else { // 工器具及物资时,有物品类型时无对应资产有物品类型
    leftArr = leftTmpArr.filter(e => e.label !== '对应资产');
  }
  
  const rightArr = [
    { label: '入库总数', key: 'entryNum' },
    { label: '出库总数', key: 'outNum' },
    { label: '在库总数', key: 'currentNum' },
  ]

  return (
    <div className={styles.reserveDetail}>
      <div className={styles.reserveLeft}>
        {leftArr.map(e => (
          <p key={e.label} className={styles.eachInfo}>
            <span className={styles.name}>{e.label}</span>
            <span className={styles.value} title={reserveDetail[e.key] || ''}>{reserveDetail[e.key] || '--'}</span>
          </p>
        ))}
      </div>
      <div className={styles.reserveRight}>
        {rightArr.map(e => (
          <p key={e.label} className={styles.eachInfo}>
            <span className={styles.name}>{e.label}</span>
            <span className={styles.value}>{dataFormat(reserveDetail[e.key])}</span>
          </p>
        ))}
      </div>
    </div>
  )
}

ReserveDetail.propTypes = {
  reserveDetail: PropTypes.object,
  tabName: PropTypes.string,
}

