

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './pvStation.scss';
import { Icon, Progress  } from 'antd';
import moment from 'moment';
import ChangeStation from '../SingleStationCommon/ChangeStation';
import { Link } from 'react-router-dom';
class PvStationTop extends Component {
  static propTypes = {
    match: PropTypes.object,
    singleStationData: PropTypes.object,
    getSingleStation: PropTypes.func,
    stationList: PropTypes.array,
    getData: PropTypes.func,
    showStationList: PropTypes.bool,
  }

  constructor(props){
    super(props);
    this.state={
      showStationList: false,
    }
  }

  componentDidMount(){
    const main = document.getElementById('main');
    main && main.addEventListener('click', this.hiddenStationList,true);
  }

  componentWillUnmount() {
    const main = document.getElementById('main');
    main && main.removeEventListener('click', this.hiddenStationList,true);
  }

  hiddenStationList = () => {
    this.setState({
      showStationList: false,
    });
  }

  showStationList = () => {
    this.setState({
      showStationList: true,
    });
  }

  hideDeviceChange = () => {
    this.setState({
      showStationList: false,
    });
  }
  
  render(){
    const { singleStationData, stationList } = this.props;
    const { showStationList } = this.state;
    
    const stationPower = singleStationData && singleStationData.stationPower;
    const stationCapacity = singleStationData && singleStationData.stationCapacity;
    const powerPercent = stationPower/stationCapacity*100;
    
    const provenceCodes = stationList && stationList.length>0 ? stationList.map(e=>e.provinceCode) : [];
    const stationListSet = new Set(provenceCodes);
    const tmpProvenceCodes = [...stationListSet];
    tmpProvenceCodes.forEach((value,key)=>{
      tmpProvenceCodes[key] = stationList.filter(e=>value===e.provinceCode);
    });

    let stationStatusTime = singleStationData && singleStationData.stationStatus && singleStationData.stationStatus.stationStatusTime;
    let localTime = stationStatusTime!==null && moment.utc(stationStatusTime).toDate();
    let tmpStationStatusTime = localTime && moment(localTime).format("YYYY/MM/DD hh:mm");
    
    const baseLinkPath = `/monitor/singleStation`;
    const pathAllStation = "/monitor/station";
    return (
      <div className={styles.pvStationTop} >
        <div className={styles.pvStationTitle} >
          <div className={styles.pvStationName} >
            {showStationList && <ChangeStation stations={stationList} stationName={singleStationData.stationName} baseLinkPath={baseLinkPath} hideStationChange={this.hideDeviceChange} />}
            <div onClick={this.showStationList} className={styles.stationToggle}  id="stationToggle" >
              <Icon type="swap" />
              <h3>{singleStationData && singleStationData.stationName}-{singleStationData && singleStationData.stationName}</h3>
            </div>
            <span>电站状态：{singleStationData && singleStationData.stationStatus && singleStationData.stationStatus.stationStatusName}</span>
            {singleStationData && singleStationData.stationStatus && singleStationData.stationStatus.stationStatus !== 400 && stationStatusTime!==null && <span>时间：{tmpStationStatusTime||""}</span>}
          </div>
          <Link to={pathAllStation}  >
            <Icon type="arrow-left" className={styles.backIcon}  />
          </Link>
        </div>
        <div className={styles.trueTimeData} >
          <div className={styles.pvlogo} ><i  className="iconfont icon-pvlogo" ></i></div>
          <div className={styles.powerScale} >
            <div className={styles.trueTimeValue}>
              <span>{singleStationData && singleStationData.stationPower && parseFloat(singleStationData.stationPower).toFixed(2) || 0}</span>
              <span>{singleStationData && singleStationData.stationCapacity && parseFloat(singleStationData.stationCapacity).toFixed(2) || 0}</span>
            </div>
            <Progress percent={powerPercent || 0 } showInfo={false} strokeWidth={6} type="line" strokeColor="#199475" />
            <div  className={styles.trueTimeDesc}><span>实时功率 MW</span><span>装机容量 MW</span></div>
          </div>
          <div>
            <div className={styles.trueTimeValue}>{singleStationData && singleStationData.stationUnitCount || 0}</div>
            <div className={styles.trueTimeUnit}>装机台数 台</div>
          </div>
          <div>
            <div className={styles.trueTimeValue} style={{color: "#e08031"}}>{singleStationData && singleStationData.instantaneous && parseFloat(singleStationData.instantaneous).toFixed(2) ||0}</div>
            <div className={styles.trueTimeUnit}>瞬时辐照 W/m<sup>2</sup></div>
          </div>
          <div>
            <div className={styles.trueTimeValue} style={{color: "#e08031"}}>{singleStationData && singleStationData.dayResources || 0}</div>
            <div className={styles.trueTimeUnit}>日曝辐值 MJ/m<sup>2</sup></div>
          </div>
          <div>
            <div className={styles.trueTimeValue}>{singleStationData && singleStationData.dayPower && parseFloat(singleStationData.dayPower).toFixed(4) || 0}</div>
            <div className={styles.trueTimeUnit}>日发电量 万kWh</div>
          </div>
          <div>
            <div className={styles.trueTimeValue}>{singleStationData && singleStationData.monthPower && parseFloat(singleStationData.monthPower).toFixed(4) || 0}</div>
            <div className={styles.trueTimeUnit}>月发电量 万kWh</div>
          </div>
          <div className={styles.annualEnergyScale} >
            <div className={styles.trueTimeValue}>
              <span>{singleStationData && singleStationData.yearPower && parseFloat(singleStationData.yearPower).toFixed(4) || 0}</span>
              <span>{singleStationData && singleStationData.yearPlanPower && parseFloat(singleStationData.yearPlanPower).toFixed(4) || 0}</span>
            </div>
            <Progress percent={singleStationData && singleStationData.yearPlanRate*100 || 0} showInfo={false} strokeWidth={6} type="line" strokeColor="#199475" />
            <div  className={styles.trueTimeDesc}><span>年累计发电量 万kWh</span><span>计划 万kWh</span></div>
          </div>
          <div className={styles.yearPlanRate} >{singleStationData && singleStationData.yearPlanRate}</div>
        </div>
      </div>
    )
  }
}

export default PvStationTop;
