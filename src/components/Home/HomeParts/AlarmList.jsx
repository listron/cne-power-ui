import React, { Component } from 'react';
import styles from './homeParts.scss';
import PropTypes from 'prop-types';
import { dataFormat } from '../../../utils/utilFunc';

class AlarmList extends Component{
  static propTypes = {
    eqpHour: PropTypes.object,
    
  }

  constructor(props){
    super(props);
    this.state = {

    }
  }

  render(){
    const alarmArr = [
      {level: 1, stationName: '山东平原', info: '发电机组哈', durationHours: '88'},
      {level: 2, stationName: '山海经', info: '就是不想转了', durationHours: '74'},
      {level: 3, stationName: '极北之地', info: '同上', durationHours: '67'},
      {level: 1, stationName: '南极激光', info: '今天有点不舒服，请假', durationHours: '57'},
      {level: 4, stationName: '山东巨炮', info: '哈哈哈限电', durationHours: '12'},
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
        {alarmArr.map(e=>{
          const durationDay = dataFormat(e.durationHours/24,'--',0);
          const restHours = dataFormat(e.durationHours % 24,'--',0);
          return (
            <div key={e.stationName} className={styles.eachAlarm} >
              <span className={styles.level}>
                <span className={styles.round}>{e.level}</span>
              </span>
              <span className={styles.stationName} title={e.stationName}>{e.stationName}</span>
              <span className={styles.info} title={e.info}>{e.info}</span>
              <span className={styles.time} title={`${durationDay}天${restHours}小时`}>
                <span className={styles.day}>{durationDay}</span>
                <span>天</span>
                <span className={styles.hour}>{restHours}</span>
                <span>小时</span>
              </span>
            </div>
          )
        })}
      </div>
    </section>
    )
  }
}

export default AlarmList;
