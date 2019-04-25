

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './windStation.scss';
import { Tabs, Radio } from 'antd';
import { Link } from 'react-router-dom';
import WindStationTop from './WindStationTop';
import WindStationHeader from './WindStationHeader';
import FanListCont from './FanList/FanListCont';
import IntegrateList from '../SingleStationCommon/DeviceList/IntegrateList';
import Boosterstation from '../SingleStationCommon/DeviceList/Boosterstation';
import PowerNet from '../SingleStationCommon/DeviceList/PowerNet';
import { getDeviceTypeIcon, getAlarmStatus } from '../SingleStationCommon/DeviceTypeIcon';
import { OutputChart } from '../../WindCommon/OutputChart';
import { PowerDiagram } from '../../WindCommon/PowerDiagram';
import { SpeedScatter } from '../../WindCommon/SpeedScatter';
import { dataFormats } from '../../../../../utils/utilFunc';
const { TabPane } = Tabs;
import moment from 'moment';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class WindStation extends Component {
  static propTypes = {
    stationCode: PropTypes.string,
    match: PropTypes.object,
    changeSingleStationStore: PropTypes.func,
    deviceTypeFlow: PropTypes.object,
    location: PropTypes.object,
    stationDeviceList: PropTypes.array,
    deviceTypeCode: PropTypes.number,
    resetSingleStationStore: PropTypes.func,
    fanList: PropTypes.object,
    collectorList: PropTypes.array,
    boosterList: PropTypes.array,
    powerNetList: PropTypes.array,
    singleStationData: PropTypes.object,
    stationList: PropTypes.array,
    weatherList: PropTypes.array,
    operatorList: PropTypes.array,
    capabilityData: PropTypes.array,
    fanDisplay: PropTypes.string,
    getMonitorPower: PropTypes.func,
    powerData: PropTypes.array,
    singleStationScatter: PropTypes.object,
    fanList: PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.state = {
      hiddenStationList: false,
      singleDeviceType: 0,
    }
  }

  componentDidMount() {
  }

  onSelectedDeviceType = (deviceTypeCode) => {
    this.props.changeSingleStationStore({ deviceTypeCode });
  }


  onSelectedDeviceType = (e) => {
    const deviceTypeCode = parseInt(e.target.value);
    this.props.changeSingleStationStore({ deviceTypeCode });
  }


  onHandleStation = (e) => {
    this.setState({
      singleDeviceType: e,
    })
  }

  getStatusNum = (status) => { // 获取状态的数量
    const { deviceStatusSummary = [] } = this.props.fanList;
    const statusList = deviceStatusSummary.filter(e => e.deviceStatusCode === status)
    return statusList.length > 0 && statusList[0].deviceStatusNum || 0
  }


  createFlowButton = (typeCode, typeName, buttonClass, imgClass, clickable = true, alarm = false) => ( // 设备流程生成函数
    <RadioButton value={typeCode} className={styles[buttonClass]} style={clickable ? null : { pointerEvents: 'none' }} key={typeCode}>
      <div className={styles.deviceTypeIcon} >
        <i className={getDeviceTypeIcon(typeCode)} ></i>
        {alarm && <i className="iconfont icon-alarm alarmIcon" ></i>}
        {/* <img src="/img/arrowgo.png" className={styles[imgClass]} /> */}
      </div>
      {/* <div>{typeName}</div> */}
    </RadioButton>
  )

  powerDiagramChange = (value) => {
    const { stationCode } = this.props.match.params;
    clearTimeout(this.timeOutPowerData);
    const { intervalTime } = value;
    let startTime = moment().subtract(6, 'day').format('YYYY-MM-DD')// 默认是6天前;
    if (intervalTime === 1) {
      startTime = moment().subtract(5, 'month').format('YYYY-MM-DD')
    } else if (intervalTime === 2) {
      startTime = moment().subtract(5, 'year').format('YYYY-MM-DD')
    }
    let endTime = moment().subtract(1, 'day').format('YYYY-MM-DD');
    this.props.changeSingleStationStore({powerData:[]})
    this.props.getMonitorPower({
      stationCode,
      intervalTime,
      startTime,
      endTime: endTime
    });
    this.timeOutPowerData = setTimeout(() => {
      this.getPowerDataTenMin(stationCode, intervalTime);
    }, 600000);
  }

  render() {
    const { deviceTypeFlow, deviceTypeCode, singleStationData, fanDisplay, powerData, singleStationScatter, capabilityData ,editData,} = this.props;
    const { stationCode } = this.props.match.params;
    const { singleDeviceType } = this.state;
    const deviceFlowTypes = deviceTypeFlow.deviceFlowTypes || [];
    const deviceTypeType = deviceFlowTypes.map(e => { return e.deviceTypes && e.deviceTypes[0] });
    const alarmList = this.props[getAlarmStatus(deviceTypeCode)];
    let alarmStatus = alarmList ? !(alarmList instanceof Array) && alarmList.deviceList && alarmList.deviceList.some(e => e.alarmNum > 0) || (alarmList.length > 0 && alarmList.some(e => e.warningStatus)) : false;
    const stautus = [
      { text: '运行', deviceStatusCode: 400, },
      { text: '待机', deviceStatusCode: 700 },
      { text: '停机', deviceStatusCode: 200 },
      { text: '维护', deviceStatusCode: 600 },
      { text: '故障', deviceStatusCode: 300 },
      { text: '通讯中断', deviceStatusCode: 500 },
      { text: '未接入', deviceStatusCode: 900 },
    ];
    return (
      <div className={styles.windStation} >
        <WindStationTop
          singleStationData={singleStationData}
          stationList={this.props.stationList}
          weatherList={this.props.weatherList}
          operatorList={this.props.operatorList} />
        <WindStationHeader singleStationData={singleStationData} editData={editData} stationCode={stationCode} />
        <div className={styles.windContainer}>
          <div className={styles.windList}>
            <div className={styles.threadAndDevice} id="deviceType" >
              <div className={styles.deviceTypeFlow}>
                <RadioGroup value={deviceTypeCode} onChange={this.onSelectedDeviceType} >
                  {deviceTypeType.map((item, index) => {
                    return (this.createFlowButton(item.deviceTypeCode, item.deviceTypeName, 'deviceTypeItem', 'arrowgo', true, deviceTypeCode === item.deviceTypeCode && alarmStatus))
                  })}
                  <RadioButton value={0} className={styles.elecnettingItem}>
                    <div className={styles.deviceTypeIcon} >
                      <i className="iconfont icon-elecnetting" ></i>
                    </div>
                    {/* <div>电网</div> */}
                  </RadioButton>
                </RadioGroup>
              </div>
              {deviceTypeCode === 101 &&
                <div className={styles.singleDeviceTypeBox}>
                  <span onClick={() => { this.onHandleStation(0) }}
                    className={singleDeviceType === 0 ? styles.spanActive : styles.spanNormal} > 全部</span>
                  {stautus.map(e => {
                    return (<span key={e.deviceStatusCode}
                      onClick={() => { this.onHandleStation(e.deviceStatusCode) }}
                      className={singleDeviceType === e.deviceStatusCode ? styles.spanActive : styles.spanNormal}>
                      {e.text} {this.getStatusNum(e.deviceStatusCode)}
                    </span>)
                  })}
                </div>
              }
            </div>
            <div>
              {deviceTypeCode === 101 && <FanListCont {...this.props} currentStatus={singleDeviceType} />}
              {deviceTypeCode === 302 && <IntegrateList {...this.props} />}
              {deviceTypeCode === 301 && <Boosterstation {...this.props} />}
              {deviceTypeCode === 0 && <PowerNet {...this.props} />}
            </div>
          </div>
          {fanDisplay !== 'deviceTable' &&
            <div className={styles.windStationChart}>
              <div className={styles.tags}>
                <Link to={`/monitor/alarm/realtime?stationCode=${stationCode}`}> 查看告警 {dataFormats(singleStationData.alarmNum, '--')} </Link>
                <Link to={`javascript:void(0)`} className={styles.noLink}> 统计分析  </Link>
                <Link to={`javascript:void(0)`} className={styles.noLink}> 报表查询  </Link>
              </div>
              <div className={styles.chartsBox}>
                <OutputChart capabilityData={capabilityData} yAxisUnit={'MW'} />
              </div>
              <div className={styles.chartsBox}>
                <PowerDiagram powerData={powerData} onChange={this.powerDiagramChange} />
              </div>
              <div className={styles.chartsBox}>
                <SpeedScatter scatterData={singleStationScatter} type={'singleStation'} />
              </div>
            </div>
          }
        </div>
      </div>
    )
  }
}

export default WindStation;
