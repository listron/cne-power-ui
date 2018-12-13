

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
const { TabPane } = Tabs;

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

  getDeviceTypeIcon = (e) => {
    switch (e) {
      case 101:
        return 'iconfont icon-windlogo';
      case 509:
        return 'iconfont icon-pvs';
      case 206:
      case 201:
        return 'iconfont icon-nb';
      case 202:
      case 207:
        return 'iconfont icon-hl';
      case 304:
        return 'iconfont icon-xb';
      case 302:
        return 'iconfont icon-jidian';
      case 301:
        return 'iconfont icon-syz';
      default:
        return;
    }
  }

  render() {
    const { stationCode } = this.props.match.params;
    const { deviceTypeFlow, deviceTypeCode } = this.props;
    const deviceFlowTypes = deviceTypeFlow.deviceFlowTypes || [];
    const deviceTypeType = deviceFlowTypes.map(e => e.deviceTypes);
    return (
      <div className={styles.windStation} >
        <WindStationTop {...this.props} stationCode={stationCode} hiddenStationList={this.state.hiddenStationList} />
        <div className={styles.outputPowerDiagram}>
          <OutputTenMin {...this.props} yXaisName={'风速(m/s)'} chartType={'wind'} stationCode={stationCode} />
          <PowerDiagramTenMin {...this.props} chartType={'wind'} stationCode={stationCode} />
        </div>
        <CardSection {...this.props} stationCode={stationCode} />
        <div className={styles.threadAndDevice} id="deviceType" >
          <Tabs type="card" defaultActiveKey="2" >
            <TabPane tab="示意图" key="2">
              <div className={styles.deviceTypeFlow}>
                {deviceTypeType.map((item, index) => {
                  const deviceInfo = item[0] || {};
                  const activeClass = {
                    backgroundColor: deviceTypeCode === deviceInfo.deviceTypeCode ? '#fff' : 'transparent'
                  }
                  return (
                    <div
                      key={index}
                      className={styles.eachDeviceType}
                      style={activeClass}
                      onClick={() => this.onSelectedDeviceType(deviceInfo.deviceTypeCode)}
                    >
                      <div className={styles.deviceTypeIcon} >
                        <i className={this.getDeviceTypeIcon(deviceInfo.deviceTypeCode)} ></i>
                        <span className={styles.text}>{deviceInfo.deviceTypeName}</span>
                      </div>
                      <img src="/img/arrowgo.png" className={styles.rightArrow} />
                    </div>
                  )
                })}
                <div
                  className={styles.eachDeviceType}
                  style={{
                    backgroundColor: deviceTypeCode === 0 ? '#fff' : 'transparent'
                  }}
                  onClick={() => this.onSelectedDeviceType(0)}
                >
                  <div className={styles.deviceTypeIcon} >
                    <i className="iconfont icon-elecnetting" ></i>
                    <span className={styles.text}>电网</span>
                  </div>
                </div>
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
