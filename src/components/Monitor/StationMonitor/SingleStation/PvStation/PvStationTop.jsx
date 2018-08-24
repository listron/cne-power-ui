

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './pvStation.scss';
import { Icon, Progress, Modal  } from 'antd';
import moment from 'moment';
class PvStationTop extends Component {
  static propTypes = {
    singleStationData: PropTypes.object,
    getSingleStation: PropTypes.func,
    stationList: PropTypes.array,
  }

  constructor(props){
    super(props);
    this.state={
      showAllStation: false,
    }
  }
  onToggleStation = (e) => {
    this.setState({
      showAllStation: false,
    })
    this.props.getSingleStation({stationCode: e});
    
  }
  showStationList = () => {
    this.setState({
      showAllStation: true,
    });
  }
  handleCancel = () => {
    this.setState({
      showAllStation: false,
    });
  }
  
  render(){
    const { singleStationData, stationList } = this.props;
    const { showAllStation } = this.state;
    const stationPower = singleStationData && singleStationData.stationPower;
    const stationCapacity = singleStationData && singleStationData.stationCapacity;
    const powerPercent = stationPower/stationCapacity*100;
    
    const provenceCodes = stationList && stationList.map(e=>e.provinceCode);
    const stationListSet = new Set(provenceCodes);
    const tmpProvenceCodes = [...stationListSet];
    tmpProvenceCodes.forEach((value,key)=>{
      tmpProvenceCodes[key] = stationList.filter(e=>value===e.provinceCode);
    })
    let stationStatusTime = singleStationData && singleStationData.stationStatus && singleStationData.stationStatus.stationStatusTime
    let localTime = moment.utc(stationStatusTime).toDate();
    console.log(localTime)
    stationStatusTime = moment(localTime).format("YYYY/MM/DD hh:mm");
    console.log(stationStatusTime)
    return (
      <div className={styles.pvStationTop}>
        <div className={styles.pvStationTitle} >
          <div className={styles.pvStationName} >
            <Modal
              visible={showAllStation}
              title={singleStationData && singleStationData.stationName}
              onCancel={this.handleCancel}
              footer={false}
              width={308}
              mask={false}
              maskClosable={true}
              getContainer={() => document.getElementById('stationToggle')}
              style={{left: 0, top: 0}}
              wrapClassName={styles.allStationModal}
            >
              {tmpProvenceCodes && tmpProvenceCodes.map((item,index)=>{
                return (<div key={index} >
                  <div className={styles.provinceName} >{item[0].provinceName}</div>
                  {item && item.map(e=>{
                    return (<div key={e.stationCode} className={(singleStationData && singleStationData.stationName)===e.stationName ? styles.currentStationName : styles.stationName} onClick={()=>this.onToggleStation(e.stationCode)}  >{e.stationName}</div>)
                  })}
                </div>)
              })}
            </Modal>
            <div onClick={this.showStationList} className={styles.stationToggle}  id="stationToggle" ><Icon type="swap" /><h3>{singleStationData && singleStationData.stationName}</h3></div>
            <span>电站状态：{singleStationData && singleStationData.stationStatus && singleStationData.stationStatus.stationStatusName}</span>
            {singleStationData && singleStationData.stationStatus && singleStationData.stationStatus.stationStatus !== "400" && <div>时间：{stationStatusTime}</div>}
          </div>
          <Icon type="arrow-left" className={styles.backIcon} />
        </div>
        <div className={styles.trueTimeData} >
          <div className={styles.pvlogo} ><i  className="iconfont icon-pvlogo" ></i></div>
          <div className={styles.powerScale} >
            <div className={styles.trueTimeValue}><span>{singleStationData && singleStationData.stationPower}</span><span>{singleStationData && singleStationData.stationCapacity}</span></div>
            <Progress percent={powerPercent} showInfo={false} strokeWidth={6} type="line" strokeColor="#199475" />
            <div  className={styles.trueTimeDesc}><span>实时功率 MW</span><span>装机容量 MW</span></div>
          </div>
          <div><div className={styles.trueTimeValue}>{singleStationData && singleStationData.stationUnitCount || 0}</div><div className={styles.trueTimeUnit}>装机台数 台</div></div>
          <div><div className={styles.trueTimeValue} style={{color: "#e08031"}}>{singleStationData && singleStationData.instantaneous ||0}</div><div className={styles.trueTimeUnit}>瞬时辐照 w/m<sup>2</sup></div></div>
          <div><div className={styles.trueTimeValue} style={{color: "#e08031"}}>{singleStationData && singleStationData.dayResources || 0}</div><div className={styles.trueTimeUnit}>日曝辐值 MJ/m<sup>2</sup></div></div>
          <div><div className={styles.trueTimeValue}>{singleStationData && parseFloat(singleStationData.dayPower).toFixed(2) || 0}</div><div className={styles.trueTimeUnit}>日发电量 万kWh</div></div>
          <div><div className={styles.trueTimeValue}>{singleStationData && singleStationData.monthPower || 0}</div><div className={styles.trueTimeUnit}>月发电量 万kWh</div></div>
          <div className={styles.annualEnergyScale} >
            <div className={styles.trueTimeValue}><span>{singleStationData && singleStationData.yearPower || 0}</span><span>{singleStationData && singleStationData.yearPlanPower || 0}</span></div>
            <Progress percent={singleStationData && singleStationData.yearPlanRate*100} showInfo={false} strokeWidth={6} type="line" strokeColor="#199475" />
            <div  className={styles.trueTimeDesc}><span>年累计发电量 万kWh</span><span>计划 万kWh</span></div>
          </div>
          <div className={styles.yearPlanRate} >{singleStationData && singleStationData.yearPlanRate}</div>
        </div>
      </div>
    )
  }
}

export default PvStationTop;
