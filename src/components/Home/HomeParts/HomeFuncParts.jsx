import React from 'react';
import { Progress } from 'antd';
import styles from './homeParts.scss';

export const CompleteRate = () => { // 计划完成
  return (
    <section className={styles.completeRate}>
      <h3>计划完成率</h3>
      <div className={styles.completeInfo}>
        <div className={styles.text}>
          <span className={styles.wind}>风电</span>
          <span className={styles.pv}>光伏</span>
        </div>
        <div className={styles.timeComplete}>
          <span className={styles.windPercent}>96%</span>
          <Progress percent={50} size="small" strokeColor="#48cf49" showInfo={false} />
          <span className={styles.planName}>月计划</span>
          <Progress percent={68} size="small" strokeColor="#06bdf4" showInfo={false} />
          <span className={styles.pvPercent}>98%</span>
        </div>
        <div className={styles.timeComplete}>
          <span className={styles.windPercent}>98%</span>
          <Progress percent={98} size="small" strokeColor="#48cf49" showInfo={false} />
          <span className={styles.planName}>年计划</span>
          <Progress percent={21} size="small" strokeColor="#06bdf4" showInfo={false} />
          <span className={styles.pvPercent}>91%</span>
        </div>
      </div>
    </section>
  )
}

export const OperationInfo = () => { // 运维情况
  return (
    <section className={styles.operationInfo}>
      <h3>运维情况</h3>
      <div className={styles.ticketDetail}>
        <div className={styles.ticketDone}>
          <h4>本月完成工单</h4>
          <span className={styles.doneData}>999</span>
        </div>
        <div className={styles.ticketDoing}>
          <h4>执行中工单</h4>
          <span className={styles.doingData}>12</span>
        </div>
      </div>
    </section>
  )
}

export const EnergySaving = () => { // 年累计节能减排
  return (
    <section className={styles.energySaving}>
      <h3>年累计节能减排</h3>
      <div className={styles.saveContent}>
        <div className={styles.eachSaving}>
          <img src="/img/co2.png" width="56px" height="40px" />
          <span className={styles.savedData}>
            <span className={styles.value}>8746</span>
            <span className={styles.unit}>kt</span>
          </span>
        </div>
        <div className={styles.eachSaving}>
          <img src="/img/hot.png" width="45px" height="45px" />
          <span className={styles.savedData}>
            <span className={styles.value}>1746</span>
            <span className={styles.unit}>kt</span>
          </span>
        </div>
      </div>
      
    </section>
  )
}

export const AlarmList = () => { // 告警列表
  const alarmArr = [
    {level: 1, stationName: '山东平原', info: '发电机组哈', time: '10天12小时'},
    {level: 2, stationName: '山海经', info: '就是不想转了', time: '8天12小时'},
    {level: 3, stationName: '极北之地', info: '同上', time: '0天7小时'},
    {level: 1, stationName: '南极激光', info: '今天有点不舒服，请假', time: '5天2小时'},
    {level: 4, stationName: '山东巨炮', info: '哈哈哈限电', time: '5天14小时'},
  ]
  return (
    <section className={styles.alarmList}>
      <h3>告警列表<span className={styles.total}>总数: 120个</span></h3>
      <div className={styles.alarmContent}>
        <div className={styles.alarmColumn}>
          <span className={styles.level}>等级</span>
          <span className={styles.stationName}>电站名称</span>
          <span className={styles.info}>告警描述</span>
          <span className={styles.time}>持续时间</span>
        </div>
        {alarmArr.map(e=>(<div key={e.stationName} className={styles.eachAlarm}>
          <span className={styles.level}>{e.level}</span>
          <span className={styles.stationName}>{e.stationName}</span>
          <span className={styles.info}>{e.info}</span>
          <span className={styles.time}>{e.time}</span>
        </div>))}
      </div>
    </section>
  )
}