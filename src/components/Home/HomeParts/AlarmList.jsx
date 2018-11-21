import React, { Component } from 'react';
import styles from './homeParts.scss';
import PropTypes from 'prop-types';
import { dataFormat } from '../../../utils/utilFunc';

class AlarmList extends Component{
  static propTypes = {
    alarmList: PropTypes.array,
    getAlarmList: PropTypes.func,
  }


  constructor(props){
    super(props);
    this.state = {
      activeIndex: 0,
    }
  }

  componentWillReceiveProps(nextProps){
    const { alarmList } = nextProps;
    if(alarmList.length > 0){
      clearTimeout(this.clocker);
      this.startShowAlarm(0, alarmList);
    }
  }

  startShowAlarm = (activeIndex, alarmList) => {
    if(alarmList.length === 0 || activeIndex + 1 === alarmList.length){ // 无告警 或者已到最后一行=> 10s后重新请求
      clearTimeout(this.clocker);
      setTimeout(this.props.getAlarmList(), 10000);
    }else{
      let scrollHeight;
      const totalCount = alarmList.length;
      if(totalCount <= 5 || activeIndex === 0){ // 数量小于5条或激活第一条，不上滚
        scrollHeight = 0;
      }else if(activeIndex + 1 > totalCount - 5){// 当前条数
        scrollHeight = 22*(5 - totalCount); // 最大滚动高度，余下五条盒子不滚动
      }else if(activeIndex + 1 <= totalCount - 5){ // 正常滚动
        scrollHeight = activeIndex*(-22);
      }
      this.setState({ activeIndex, scrollHeight });
      this.clocker = setTimeout(()=>{
        this.startShowAlarm(activeIndex+1,alarmList)
      }, 10000);
    }
  }

  render(){
    const { alarmList } = this.props;
    const { activeIndex, scrollHeight } = this.state;
    const totalCount = alarmList.length;
    return (
      <section className={styles.alarmList}>
      <h3>告警列表<span className={styles.total}>总数: {totalCount}个</span></h3>
      <div className={styles.alarmContent}>
        <div className={styles.alarmColumn}>
          <span className={styles.level}>等级</span>
          <span className={styles.stationName}>电站名称</span>
          <span className={styles.info}>告警描述</span>
          <span className={styles.time}>持续时间</span>
        </div>
        <div className={styles.alarmBox}>
          <div className={styles.scrollAlarm} style={{ transform: `translateY(${scrollHeight}px)`}}>
            {alarmList.map((e,index)=>{
              const durationDay = dataFormat(e.durationHours/24,'--',0);
              const restHours = dataFormat(e.durationHours % 24,'--',0);
              return (
                <div 
                  key={e.stationName} 
                  className={styles.eachAlarm} 
                  style={{backgroundImage: activeIndex === index?'url(/img/hover.png)':null}} 
                >
                  <span className={styles.level}>
                    <span className={styles.round}>{e.level}</span>
                  </span>
                  <span className={styles.stationName} title={e.stationName}>{e.stationName}</span>
                  <span className={styles.info} title={e.description}>{e.description}</span>
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
        </div>
      </div>
    </section>
    )
  }
}

export default AlarmList;
