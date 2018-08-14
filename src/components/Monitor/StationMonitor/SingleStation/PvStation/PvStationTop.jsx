

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './pvStation.scss';
import { Icon, Progress  } from 'antd';

class PvStationTop extends Component {
  static propTypes = {
    singleStationData: PropTypes.object,
  }

  constructor(props){
    super(props);
  }
  
  render(){
    const { singleStationData } = this.props;
    const stationPower = singleStationData && singleStationData.stationPower;
    const stationCapacity = singleStationData && singleStationData.stationCapacity;
    const powerPercent = stationPower/stationCapacity;
    console.log(powerPercent);
    return (
      <div className={styles.pvStationTop}>
        <div className={styles.pvStationTitle} >
          <div className={styles.pvStationName} >
            <Icon type="swap" /><h3>海兴光伏</h3>
            <span>电站状态：{singleStationData && singleStationData.stationStatus && singleStationData.stationStatus.stationStatusName}</span>
            {singleStationData && singleStationData.stationStatus && singleStationData.stationStatus.stationStatus !== "400" && <div>时间：{singleStationData.stationStatus.stationStatusTime}</div>}
          </div>
          <Icon type="arrow-left" className={styles.backIcon} />
        </div>
        <div className={styles.trueTimeData} >
          <div className={styles.powerScale} >
            <div className={styles.trueTimeValue}><span>{singleStationData && singleStationData.stationPower}</span><span>{singleStationData && singleStationData.stationCapacity}</span></div>
            <Progress percent={powerPercent} showInfo={false} strokeWidth={6} type="line" strokeColor="#199475" />
            <div  className={styles.trueTimeDesc}><span>实时功率 MW</span><span>装机容量 MW</span></div>
          </div>
          <div><div className={styles.trueTimeValue}>{singleStationData && singleStationData.stationUnitCount}</div><div className={styles.trueTimeUnit}>装机台数 台</div></div>
          <div><div className={styles.trueTimeValue} style={{color: "#e08031"}}>{singleStationData && singleStationData.stationUnitCount}</div><div className={styles.trueTimeUnit}>瞬时辐照 w/m<sup>2</sup></div></div>
          <div><div className={styles.trueTimeValue} style={{color: "#e08031"}}>{singleStationData && singleStationData.stationUnitCount}</div><div className={styles.trueTimeUnit}>日曝辐值 MJ/m<sup>2</sup></div></div>
          <div><div className={styles.trueTimeValue}>{singleStationData && singleStationData.stationUnitCount}</div><div className={styles.trueTimeUnit}>日发电量 万kWh</div></div>
          <div><div className={styles.trueTimeValue}>{singleStationData && singleStationData.stationUnitCount}</div><div className={styles.trueTimeUnit}>月发电量 万kWh</div></div>
          <div className={styles.annualEnergyScale} >
            <div className={styles.trueTimeValue}><span>{singleStationData && singleStationData.stationPower}</span><span>{singleStationData && singleStationData.stationCapacity}</span></div>
            <Progress percent={powerPercent} showInfo={false} strokeWidth={6} type="line" strokeColor="#199475" />
            <div  className={styles.trueTimeDesc}><span>实时功率 MW</span><span>装机容量 MW</span></div>
          </div>
          <div className={styles.yearPlanRate} >{singleStationData && singleStationData.yearPlanRate}</div>
        </div>
      </div>
    )
  }
}

export default PvStationTop;
