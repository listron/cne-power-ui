
import React from 'react';
import PropTypes from 'prop-types';
import { dataFormat } from '../../../../../utils/utilFunc';
import styles from './manageCommon.scss';

export const ReserveDetail = ({ reserveDetail, tabName }) => {
  const goodsBaseInfo = {
    101: '备品备件',
    201: '安全工器具',
    202: '检修工器具',
    203: '仪器仪表',
    301: '生活物资',
    302: '办公物资',
    303: '其他'
  }
  const leftTmpArr = [
    { label: '仓库名称', key: 'warehouseName', value: reserveDetail.warehouseName },
    { label: '物品类型', key: 'goodsType', value: goodsBaseInfo[reserveDetail.goodsType] },
    { label: '物品名称', key: 'goodsName', value: reserveDetail.goodsName },
    { label: '厂家', key: 'manufactorName', value: reserveDetail.manufactorName },
    { label: '型号', key: 'modeName', value: reserveDetail.modeName },
    { label: '对应资产', key: 'assets', value: reserveDetail.assets },
  ];
  let leftArr = [];
  if (tabName === 'spares') { // 备品备件时，无物品类型有对应资产, 
    leftArr = leftTmpArr.filter(e => e.label !== '物品类型');
  } else { // 工器具及物资时,有物品类型时无对应资产有物品类型
    leftArr = leftTmpArr.filter(e => e.label !== '对应资产');
  }
  
  const rightArr = [
    { label: '入库总数', value: reserveDetail.entryNum },
    { label: tabName === 'tools' ? '损耗总数' : '出库总数', value: reserveDetail.outNum },
    { label: '在库总数', value: reserveDetail.currentNum },
  ]

  return (
    <div className={styles.reserveDetail}>
      <div className={styles.reserveLeft}>
        {leftArr.map(e => (
          <p key={e.label} className={styles.eachInfo}>
            <span className={styles.name}>{e.label}</span>
            <span className={styles.value} title={e.value || ''}>{e.value || '--'}</span>
          </p>
        ))}
      </div>
      <div className={styles.reserveRight}>
        {rightArr.map(e => (
          <p key={e.label} className={styles.eachInfo}>
            <span className={styles.name}>{e.label}</span>
            <span className={styles.value}>{dataFormat(e.value)}</span>
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

