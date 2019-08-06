import React, { Component } from 'react';
import styles from './homeParts.scss';
import PropTypes from 'prop-types';
import { dataFormat } from '../../../../utils/utilFunc';

class AlarmList extends Component{
  static propTypes = {
    alarmeQueryTime: PropTypes.string,
    enterpriseId: PropTypes.string,
    alarmList: PropTypes.array,
    getAlarmList: PropTypes.func,
  }

  constructor(props){
    super(props);
    this.state = {
      activeIndex: 0,
    }
  }

  componentWillReceiveProps(nextProps) {
    const { alarmeQueryTime, alarmList } = nextProps;
    const preAlarmTime = this.props.alarmeQueryTime;
    if(preAlarmTime !== alarmeQueryTime){ // 得到新数据
      this.getAlarmClocker && clearTimeout(this.getAlarmClocker);
      this.startShowAlarm(0, alarmList);
    }
  }
  
  componentWillUnmount() {
    this.clocker && clearTimeout(this.clocker);
    this.getAlarmClocker && clearTimeout(this.getAlarmClocker);
  }

  startShowAlarm = (activeIndex, alarmList) => {
    const { enterpriseId, getAlarmList } = this.props;
    this.clocker && clearTimeout(this.clocker);
    const totalCount = alarmList.length;
    if (totalCount === 0 ) { // 无告警 10s后重新请求
      this.getAlarmClocker = setTimeout(() => getAlarmList({ enterpriseId }), 10000);
    } else if (activeIndex + 1 === totalCount ) { // 已到最后一行=> 10s后重新请求
      this.setState({ activeIndex });
      this.getAlarmClocker = setTimeout(() => getAlarmList({ enterpriseId }), 10000);
    } else {
      let scrollHeight;
      if(totalCount <= 5 || activeIndex === 0){ // 数量小于5条或激活第一条，不上滚
        scrollHeight = 0;
      }else if(activeIndex + 1 > totalCount - 5){ // 当前条数
        scrollHeight = 22 * (5 - totalCount); // 最大滚动高度，余下五条盒子不滚动
      }else if(activeIndex + 1 <= totalCount - 5){ // 正常滚动
        scrollHeight = activeIndex * (-22);
      }
      this.setState({ activeIndex, scrollHeight });
      this.clocker = setTimeout(() => {
        this.startShowAlarm(activeIndex + 1, alarmList)
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
          {alarmList.length > 0 ? <div className={styles.scrollAlarm} style={{ transform: `translateY(${scrollHeight}px)`}}>
            {alarmList.map((e,index)=>{
              const durationDay = dataFormat(e.durationHours/24,'--',0);
              const restHours = dataFormat(e.durationHours % 24,'--',0);
              return (
                <div
                  key={index}
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
          </div> : <div className={styles.noData}><span>暂无数据</span></div>}
        </div>
      </div>
    </section>
    )
  }
}

export default AlarmList;
