import React from 'react';
import { Progress } from 'antd';
import styles from './homeParts.scss';
import { dataFormat } from '../../../../utils/utilFunc';

export const CompleteRate = ({ mapStation = [], completeRate = 0 }) => { // 计划完成
  const hasPv = mapStation.some(e => e.stationType === 1);
  const hasWind = mapStation.some(e => e.stationType === 0);
  const windYearRate = dataFormat(completeRate.windYearRate);
  const windMonthRate = dataFormat(completeRate.windMonthRate);
  const PVYearRate = dataFormat(completeRate.PVYearRate);
  const PVMonthRate = dataFormat(completeRate.PVMonthRate);
  return (
    <section className={styles.completeRate}>
      <h3>计划完成率</h3>
      <div className={styles.completeInfo}>
        {hasWind && <div className={styles.windCol}>
          <span className={styles.typeText}>风电</span>
          <span>{windMonthRate}%</span>
          <span>{windYearRate}%</span>
        </div>}
        {hasWind && <div className={styles.windProgress}>
          <Progress percent={windMonthRate >=0 ? windMonthRate : 0} size="small" strokeColor="#48cf49" showInfo={false} />
          <Progress percent={windYearRate >=0 ? windYearRate : 0} size="small" strokeColor="#48cf49" showInfo={false} />
        </div>}
        <div className={styles.middleText}>
          <span>月计划</span>
          <span>年计划</span>
        </div>
        {hasPv && <div className={styles.pvProgress}>
          <Progress percent={PVMonthRate >=0 ? PVMonthRate : 0} size="small" strokeColor="#06bdf4" showInfo={false} />
          <Progress percent={PVYearRate >=0 ? PVYearRate : 0} size="small" strokeColor="#06bdf4" showInfo={false} />
        </div>}
        {hasPv && <div className={styles.pvCol}>
          <span className={styles.typeText}>光伏</span>
          <span>{PVMonthRate}%</span>
          <span>{PVYearRate}%</span>
        </div>}
      </div>
    </section>
  )
}

export const OperationInfo = ({ operationInfo }) => { // 运维情况
  const completeNum = dataFormat(operationInfo.completeNum);
  const handleNum = dataFormat(operationInfo.handleNum);
  return (
    <section className={styles.operationInfo}>
      <h3>运维情况</h3>
      <div className={styles.ticketDetail}>
        <div className={styles.ticketDone}>
          <h4>本月完成工单</h4>
          <div className={styles.animationOperation}>
            <span className={styles.value}>{completeNum}</span>
            <span className={styles.circle} />
          </div>
        </div>
        <div className={styles.ticketDoing}>
          <h4>执行中工单</h4>
          <div className={styles.animationOperation}>
            <span className={styles.value}>{handleNum}</span>
            <span className={styles.circle} />
          </div>
        </div>
      </div>
    </section>
  )
}
