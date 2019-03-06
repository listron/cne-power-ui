

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './windStation.scss';
import { Tabs, Radio } from 'antd';
import { Link } from 'react-router-dom';
import WindStationTop from './WindStationTop';
import OutputTenMin from '../SingleStationCommon/OutputTenMin';
import PowerDiagramTenMin from '../SingleStationCommon/PowerDiagramTenMin';
import CardSection from '../SingleStationCommon/CardSection';
import FanList from './FanList';
import IntegrateList from '../SingleStationCommon/DeviceList/IntegrateList';
import Boosterstation from '../SingleStationCommon/DeviceList/Boosterstation';
import PowerNet from '../SingleStationCommon/DeviceList/PowerNet';
import { getDeviceTypeIcon, getAlarmStatus } from '../SingleStationCommon/DeviceTypeIcon'
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
    realTimePowerUnit: PropTypes.string,
    realTimePowerPoint: PropTypes.any,
    powerUnit: PropTypes.string,
    powerPoint: PropTypes.any,
    fanList: PropTypes.object,
    collectorList: PropTypes.array,
    boosterList: PropTypes.array,
    powerNetList: PropTypes.array,
  }

  constructor(props) {
    super(props);
    this.state = {
      hiddenStationList: false,
    }
  }

  onSelectedDeviceType = (deviceTypeCode) => {
    this.props.changeSingleStationStore({ deviceTypeCode });
  }


  onSelectedDeviceType = (e) => {
    const deviceTypeCode = parseInt(e.target.value);
    this.props.changeSingleStationStore({ deviceTypeCode });
  }


  createFlowButton = (typeCode, typeName, buttonClass, imgClass, clickable = true, alarm = false) => ( // 设备流程生成函数
    <RadioButton value={typeCode} className={styles[buttonClass]} style={clickable ? null : { pointerEvents: 'none' }} key={typeCode}>
      <div className={styles.deviceTypeIcon} >
        <i className={getDeviceTypeIcon(typeCode)} ></i>
        {alarm && <i className="iconfont icon-alarm alarmIcon" ></i>}
        <img src="/img/arrowgo.png" className={styles[imgClass]} />
      </div>
      <div>{typeName}</div>
    </RadioButton>
  )

  render() {
    const { stationCode } = this.props.match.params;
    const { deviceTypeFlow, deviceTypeCode, realTimePowerUnit, realTimePowerPoint, powerUnit, powerPoint } = this.props;
    const deviceFlowTypes = deviceTypeFlow.deviceFlowTypes || [];
    const deviceTypeType = deviceFlowTypes.map(e => { return e.deviceTypes && e.deviceTypes[0] });
    const alarmList = this.props[getAlarmStatus(deviceTypeCode)];
    let alarmStatus = alarmList ? !(alarmList instanceof Array) && alarmList.deviceList && alarmList.deviceList.some(e => e.alarmNum > 0) || (alarmList.length > 0 && alarmList.some(e => e.warningStatus)) : false
    return (
      <div className={styles.windStation} >
        <WindStationTop {...this.props} stationCode={stationCode} hiddenStationList={this.state.hiddenStationList} />
        <div className={styles.outputPowerDiagram}>
          <OutputTenMin {...this.props} yXaisName={'风速(m/s)'} chartType={'wind'} stationCode={stationCode} yAxisUnit={realTimePowerUnit} yAxisValuePoint={realTimePowerPoint} />
          <PowerDiagramTenMin {...this.props} chartType={'wind'} stationCode={stationCode} yAxisUnit={powerUnit} yAxisValuePoint={powerPoint} />
        </div>
        <CardSection {...this.props} stationCode={stationCode} />
        <div className={styles.threadAndDevice} id="deviceType" >
          <Tabs type="card" defaultActiveKey="2" >
            <TabPane tab="示意图" key="2">
              <div className={styles.deviceTypeFlow}>
                <RadioGroup value={deviceTypeCode} onChange={this.onSelectedDeviceType} >
                  {deviceTypeType.map((item, index) => {
                    return (this.createFlowButton(item.deviceTypeCode, item.deviceTypeName, 'deviceTypeItem', 'arrowgo', true, deviceTypeCode === item.deviceTypeCode && alarmStatus))
                  })}
                  <RadioButton value={0} className={styles.elecnettingItem}>
                    <div className={styles.deviceTypeIcon} >
                      <i className="iconfont icon-elecnetting" ></i>
                    </div>
                    <div>电网</div>
                  </RadioButton>
                </RadioGroup>
              </div>
              {deviceTypeCode === 101 && <FanList {...this.props} />}
              {deviceTypeCode === 302 && <IntegrateList {...this.props} />}
              {deviceTypeCode === 301 && <Boosterstation {...this.props} />}
              {deviceTypeCode === 0 && <PowerNet {...this.props} />}
            </TabPane>
          </Tabs>
        </div>
      </div>
    )
  }
}

export default WindStation;
