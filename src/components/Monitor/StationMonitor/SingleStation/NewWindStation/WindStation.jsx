

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './windStation.scss';
import { Tabs, Radio } from 'antd';
import { Link } from 'react-router-dom';
import WindStationTop from './WindStationTop';
import WindStationHeader from './WindStationHeader';
import OutputTenMin from '../SingleStationCommon/OutputTenMin';
import PowerDiagramTenMin from '../SingleStationCommon/PowerDiagramTenMin';
import CardSection from '../SingleStationCommon/CardSection';
import FanListCont from './FanList/FanListCont';
import IntegrateList from '../SingleStationCommon/DeviceList/IntegrateList';
import Boosterstation from '../SingleStationCommon/DeviceList/Boosterstation';
import PowerNet from '../SingleStationCommon/DeviceList/PowerNet';
import { getDeviceTypeIcon, getAlarmStatus } from '../SingleStationCommon/DeviceTypeIcon';
import { OutputChart } from '../../WindCommon/OutputChart';
import { PowerDiagram } from '../../WindCommon/PowerDiagram';
const { TabPane } = Tabs;
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
    const statusList = deviceStatusSummary.filter(e => e.stationStatus === status)
    return statusList.length > 0 && statusList[0].stationNum || 0
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




  render() {
    const { deviceTypeFlow, deviceTypeCode, singleStationData, stationList, weatherList, operatorList, fanDisplay } = this.props;
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
          stationList={stationList}
          weatherList={weatherList}
          operatorList={operatorList} />
        <WindStationHeader singleStationData={singleStationData} />
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
            {deviceTypeCode === 101 && <FanListCont {...this.props} currentStatus={singleDeviceType} />}
            {deviceTypeCode === 302 && <IntegrateList {...this.props} />}
            {deviceTypeCode === 301 && <Boosterstation {...this.props} />}
            {deviceTypeCode === 0 && <PowerNet {...this.props} />}
          </div>
          {fanDisplay !== 'deviceTable' &&
            <div className={styles.charts}>
              <div className={styles.chartsBox}>
                <OutputChart {...this.props} yAxisUnit={'kW'} />
              </div>
              <div className={styles.chartsBox}>
                {/* <PowerDiagram {...this.props} /> */}
              </div>
            </div>
          }

        </div>
      </div>
    )
  }
}

export default WindStation;
