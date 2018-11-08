

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './windStation.scss';
import { Icon, Progress, Modal, Input} from 'antd';
import moment from 'moment';
import ChangeStation from '../SingleStationCommon/ChangeStation';
import { Link } from 'react-router-dom';
class PvStationTop extends Component {
  static propTypes = {
    match: PropTypes.object,
    singleStationData: PropTypes.object,
    getSingleStation: PropTypes.func,
    stationList: PropTypes.array,
    showStationList: PropTypes.bool,
    changeSingleStationStore: PropTypes.func,
    onSelectedDeviceType: PropTypes.func,
    editData: PropTypes.func,
    stationCode:PropTypes.string,
  }

  constructor(props) {
    super(props);
    this.state = {
      showStationList: false,
    }
  }

  componentDidMount() {
    const main = document.getElementById('main');
    main && main.addEventListener('click', this.hiddenStationList, true);
  }

  componentWillUnmount() {
    const main = document.getElementById('main');
    main && main.removeEventListener('click', this.hiddenStationList, true);
  }

  onChange = (e) => {
    const editValue = e.target.value;
    this.setState({ 
      editValue,
      editInfoError: (!editValue || isNaN(editValue))?true: false,
    });
  }
  onOk = () => {
    const { editData,stationCode } = this.props
    const { editValue } = this.state;
    if(!editValue || isNaN(editValue)){
      return;
    }
    const editTime = moment().format('YYYY-MM-DD');
    this.state.modalMonth ? editData({ 
      monthGen: editValue, 
      date:editTime, 
      stationCode:stationCode 
    }) : editData({ 
      yearGen: editValue, 
      date:editTime, 
      stationCode:stationCode
    });
    this.setState({ modalMonth: false, modalYear: false, editValue: '' });
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

  hideStationChange = () => {
    this.setState({
      showStationList: false,
    });
  }

  render() {
    const { singleStationData, stationList } = this.props;
    const { showStationList } = this.state;

    const stationPower = singleStationData && singleStationData.stationPower;
    const stationCapacity = singleStationData && singleStationData.stationCapacity;
    const powerPercent = stationPower / stationCapacity * 100;

    const provenceCodes = stationList && stationList.length > 0 ? stationList.map(e => e.provinceCode) : [];
    const stationListSet = new Set(provenceCodes);
    const tmpProvenceCodes = [...stationListSet];
    tmpProvenceCodes.forEach((value, key) => {
      tmpProvenceCodes[key] = stationList.filter(e => value === e.provinceCode);
    });

    let stationStatusTime = singleStationData && singleStationData.stationStatus && singleStationData.stationStatus.stationStatusTime;
    let localTime = stationStatusTime && moment.utc(stationStatusTime).toDate();
    let tmpStationStatusTime = localTime && moment(localTime).fromNow();
    
    const baseLinkPath = `/monitor/singleStation`;
    const pathAllStation = "/monitor/station";
  
    return (
      <div className={styles.pvStationTop} >
        <div className={styles.pvStationTitle} >
          <div className={styles.pvStationName} >
            {showStationList && <ChangeStation stations={stationList} stationName={singleStationData.stationName} baseLinkPath={baseLinkPath} hideStationChange={this.hideStationChange} />}
            <div onClick={this.showStationList} className={styles.stationToggle} id="stationToggle" >
              <Icon type="swap" />
              <h3>{singleStationData && singleStationData.stationName}-{singleStationData && singleStationData.provinceName}</h3>
            </div>
            <span>电站状态：{singleStationData && singleStationData.stationStatus && singleStationData.stationStatus.stationStatusName}</span>
            {singleStationData && singleStationData.stationStatus && singleStationData.stationStatus.stationStatus !== 400 && stationStatusTime !== null && <span>时间：{tmpStationStatusTime || ""}</span>}
          </div>
          <Link to={pathAllStation}  >
            <Icon type="arrow-left" className={styles.backIcon} />
          </Link>
        </div>
        <div className={styles.trueTimeData} >
          <div className={styles.pvlogo} >
            {singleStationData && singleStationData.stationType === '0' ? <i className="iconfont icon-windlogo" /> :
           <i className="iconfont icon-pvs" />}
          </div>
          <div className={styles.powerScale} >
            <div className={styles.trueTimeValue}>
              <span>{singleStationData && singleStationData.stationPower && parseFloat(singleStationData.stationPower).toFixed(2) || 0}</span>
              <span>{singleStationData && singleStationData.stationCapacity && parseFloat(singleStationData.stationCapacity).toFixed(2) || 0}</span>
            </div>
            <Progress percent={powerPercent || 0} showInfo={false} strokeWidth={3} type="line" strokeColor="#199475" />
            <div className={styles.trueTimeDesc}><span>实时功率 MW</span><span>装机容量 MW</span></div>
          </div>
          <div>
            <div className={styles.trueTimeValue}>{singleStationData && singleStationData.stationUnitCount || 0}</div>
            <div className={styles.trueTimeUnit}>装机台数 台</div>
          </div>
          <div>
            <div className={styles.trueTimeValue} style={{ color: "#e08031" }}>{singleStationData && singleStationData.dayResources || 0}</div>
            <div className={styles.trueTimeUnit}>平均风速 m/s</div>
          </div>
          <div>
            <div className={styles.trueTimeValue}>{singleStationData && singleStationData.dayPower && parseFloat(singleStationData.dayPower).toFixed(4) || 0}</div>
            <div className={styles.trueTimeUnit}>日发电量 万kWh</div>
          </div>
          <div>
            <div className={styles.trueTimeValue}>
              <div>
                {singleStationData && singleStationData.monthPower && parseFloat(singleStationData.monthPower).toFixed(4) || 0}
              </div>
            </div>
            <div className={styles.trueTimeUnit}>月累计发电量 万kWh</div>
          </div>
          <div className={styles.stationYearPlan}>
            <div className={styles.annualEnergyScale} >
              <div className={styles.trueTimeValue}>
                <div>
                  <span>{singleStationData && singleStationData.yearPower && parseFloat(singleStationData.yearPower).toFixed(4) || 0}</span>

                </div>
                <span>{singleStationData && singleStationData.yearPlanPower && parseFloat(singleStationData.yearPlanPower).toFixed(4) || 0}</span>
              </div>
              <Progress percent={singleStationData && singleStationData.yearPlanRate * 100 || 0} showInfo={false} strokeWidth={3} type="line" strokeColor="#199475" />
              <div className={styles.trueTimeDesc}><span>年累计发电量 万kWh</span><span>计划 万kWh</span></div>
            </div>
            <div className={styles.yearPlanRate} >{singleStationData && singleStationData.yearPlanRate}</div>
          </div>
        </div>
      </div>
    )
  }
}

export default PvStationTop;
