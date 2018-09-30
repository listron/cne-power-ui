

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PvStationTop from './PvStationTop';
import OutputTenMin from './OutputTenMin';
import PowerDiagramTenMin from './PowerDiagramTenMin';
import CardSection from './CardSection';
import styles from './pvStation.scss';
import DeviceList from './DeviceList/DeviceList';
import { Tabs, Radio } from 'antd';
import { Link } from 'react-router-dom';

const { TabPane } = Tabs;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
class PvStation extends Component {
  static propTypes = {
    deviceTypeFlow: PropTypes.array,
    changeSingleStationStore: PropTypes.func,
    location: PropTypes.object,
    match: PropTypes.object,
    stationDeviceList: PropTypes.array,
    deviceTypeCode: PropTypes.number,
    stationCode: PropTypes.string,
  }

  constructor(props) {
    super(props);
    this.state = {
      hiddenStationList: false,
    }
  }
  
  componentWillUnmount(){
    this.props.changeSingleStationStore({ deviceTypeFlow: [] });
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
      case '10004':
        return 'iconfont icon-elecnetting';
      default:
        return;
    }
  }

  hiddenStationList = () => {
    this.setState({
      hiddenStationList: true,
    });
  }


  render() {
    const { deviceTypeFlow, stationDeviceList, deviceTypeCode, } = this.props;
    const weatherDeviceCode = stationDeviceList && stationDeviceList.deviceCode || 0;
    const { stationCode } = this.props.match.params;
    
    return (
      <div className={styles.pvStation}  >
        <PvStationTop {...this.props} stationCode={stationCode} hiddenStationList={this.state.hiddenStationList} />
        <div className={styles.outputPowerDiagram}>
          <OutputTenMin {...this.props} />
          <PowerDiagramTenMin {...this.props} />
        </div>
        <CardSection {...this.props} stationCode={stationCode} />
        {/* 设备类型流程图切换 */}
        <div className={styles.threadAndDevice} id="deviceType" >
          <Tabs type="card" defaultActiveKey="2" >
            {/* <TabPane tab="主线" key="1">
              <p>主线列表</p>
            </TabPane> */}
            <TabPane tab="示意图" key="2">
              <div className={styles.deviceTypeFlow}>
               
                <Link  to={`/hidden/monitorDevice/${stationCode}/203/${weatherDeviceCode}`} >
                <div className={styles.weatherStation}>
                <i className="iconfont icon-weather" ></i>
                <div className={styles.fontcolor}>气象站</div>
                </div>
                </Link>
                {deviceTypeFlow.length > 0 && <RadioGroup value={deviceTypeCode} onChange={this.onSelectedDeviceType} >
                  {deviceTypeFlow.map((e,i)=> {
                    const clickable = [509, 201, 206, 304, 202]; // 允许点击及展示列表的设备类型
                    const pointEventStye = clickable.includes(e.deviceTypeCode)?{}:{pointerEvents:'none'};
                    return (<RadioButton value={e.deviceTypeCode} style={pointEventStye} className={styles.deviceTypeItem} key={i}>
                      <div className={styles.deviceTypeIcon} >
                        <i className={this.getDeviceTypeIcon(e.deviceTypeCode)} ></i>
                        <img src="/img/arrowgo.png" className={styles.arrowgo} />
                      </div>
                      <div>{e.deviceTypeName}</div>
                    </RadioButton>)
                  })}
                  <RadioButton className={styles.elecnettingItem}>
                    <div className={styles.deviceTypeIcon} >
                      <i className="iconfont icon-elecnetting" ></i>
                    </div>
                    <div>电网</div>
                  </RadioButton>
                </RadioGroup>}
            
                 
              
              </div>
              <div className={styles.deviceList} >
                <DeviceList {...this.props} />
              </div>
            </TabPane>
          </Tabs>
        </div>

      </div>
    )
  }
}

export default PvStation;
