

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './windStation.scss';
import { Tabs, Radio } from 'antd';
import { Link } from 'react-router-dom';
import WindStationTop from './WindStationTop';
import OutputTenMin from '../SingleStationCommon/OutputTenMin';
import PowerDiagramTenMin from '../SingleStationCommon/PowerDiagramTenMin';
import CardSection from '../SingleStationCommon/CardSection';
import FanList from './FanList'
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

  componentWillUnmount() {

  }

  onSelectedDeviceType = (e) => {
    const deviceTypeCode = parseInt(e.target.value);
    this.props.changeSingleStationStore({ deviceTypeCode });
  }

  getDeviceTypeIcon = (e) => {
    switch (e) {
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
      default:
        return;
    }
  }




  render() {
    const { stationCode } = this.props.match.params;
    const { deviceTypeFlow, stationDeviceList, deviceTypeCode, } = this.props;
    const weatherDeviceCode = stationDeviceList && stationDeviceList.deviceCode || 0;
    const deviceFlowTypes = deviceTypeFlow && deviceTypeFlow.deviceFlowTypes || [];
    const isCombinedType = deviceFlowTypes.some(e => e.deviceTypes.length > 1); // 判断位置
    return (
      <div className={styles.windStation} >
        <WindStationTop {...this.props} stationCode={stationCode} hiddenStationList={this.state.hiddenStationList} />
        <div className={styles.outputPowerDiagram}>
          <OutputTenMin {...this.props} yXaisName={'风速(m/s)'} chartType={'wind'} />
          <PowerDiagramTenMin {...this.props} chartType={'wind'} />
        </div>
        {/* <div className={styles.windTabs} >
          <Tabs type="line" defaultActiveKey="station">
            <TabPane tab="电站" key="station">
              <div className={styles.outputPowerDiagram}>
                <OutputTenMin {...this.props} yXaisName={'风速(m/s)'} chartType={'wind'} />
                <PowerDiagramTenMin {...this.props} chartType={'wind'} />
              </div>
            </TabPane>
            <TabPane tab="风机" key="wind">
              <div className={styles.outputPowerDiagram}>
                测试一下
            </div>
            </TabPane>
          </Tabs>
        </div> */}

        <CardSection {...this.props} stationCode={stationCode} />
        <div className={styles.threadAndDevice} id="deviceType" >
          <Tabs type="card" defaultActiveKey="2" >
            {/* <TabPane tab="主线" key="1">
              <p>主线列表</p>
            </TabPane> */}
            <TabPane tab="示意图" key="2">
              <div className={styles.deviceTypeFlow}>
                <Link to={`/hidden/monitorDevice/${stationCode}/203/${weatherDeviceCode}`} className={styles.weatherStationLink} >
                  <div className={styles.weatherStation}>
                    <i className="iconfont icon-weather" ></i>
                    <div className={styles.fontcolor}>气象站</div>
                  </div>
                </Link>

                <div className={styles.title}>
                  <div className={styles.windlogo}>
                    <i className="iconfont icon-windlogo" ></i>
                    <div className={styles.fontcolor}>风机</div>
                  </div>
                  <img src="/img/arrowgo.png" className={styles.rightArrow} />
                  <div className={styles.deviceTypeIcon} >
                    <i className="iconfont icon-elecnetting" ></i>
                    <div>电网</div>
                  </div>
                </div>
              </div>
              <FanList {...this.props} />
            </TabPane>
          </Tabs>
        </div>
      </div>
    )
  }
}

export default WindStation;
