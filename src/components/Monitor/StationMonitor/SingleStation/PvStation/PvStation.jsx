

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PvStationTop from './PvStationTop';
import OutputPowerDiagram from './OutputPowerDiagram';
import CardSection from './CardSection';
import styles from './pvStation.scss';
import DeviceList from './DeviceList/DeviceList';
import ThreadList from './DeviceList/ThreadList';
import { Tabs,Radio  } from 'antd';

const TabPane = Tabs.TabPane;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
class PvStation extends Component {
  static propTypes = {
    deviceTypeFlow: PropTypes.array,
    changeSingleStationStore: PropTypes.func,
    deviceTypeCode: PropTypes.string,
  }

  constructor(props){
    super(props);
    this.state = {
    }
  }
  onSelectedDeviceType = (e) => {
    console.log(e);
    const deviceTypeCode = e.target.value;
    this.props.changeSingleStationStore({deviceTypeCode});
  }
  getDeviceTypeIcon = (e) => {
    switch(e){
      case '10000':
        return 'iconfont icon-pvs';
      case '10001':
        return 'iconfont icon-nb';
      case '10002':
        return 'iconfont icon-hl';
      case '10003':
        return 'iconfont icon-xb';
      case '10004':
        return 'iconfont icon-elecnetting';
      default:
        return ;
    }
  }
  
  render(){
    const { deviceTypeFlow } = this.props;
    return (
      <div className={styles.pvStation}>
        <PvStationTop {...this.props} />
        <OutputPowerDiagram {...this.props} />  
        <CardSection {...this.props} />
        {/* 设备类型流程图切换 */}
        <div className={styles.threadAndDevice} >
          <Tabs type="card" defaultActiveKey="2" >
            <TabPane tab="主线" key="1">
              <p>主线列表</p>
            </TabPane>
            <TabPane tab="示意图" key="2">
              <div className={styles.deviceTypeFlow}>
                <RadioGroup defaultValue={deviceTypeFlow.length > 0 && deviceTypeFlow[0].deviceTypeName}  onChange={this.onSelectedDeviceType} >
                  {deviceTypeFlow && 
                    deviceTypeFlow.map(e=>{
                      return (<RadioButton value={e.deviceTypeCode} className={styles.deviceTypeItem} key={e.deviceTypeName}>
                        <div className={styles.deviceTypeIcon} ><i className={this.getDeviceTypeIcon(e.deviceTypeCode)} ></i></div><div>{e.deviceTypeName}</div>
                        </RadioButton>)
                    })
                  }
                </RadioGroup>
                <div className={styles.weatherStation}>
                  <i  className="iconfont icon-weather" ></i>
                  <div>气象站</div>
                </div>
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
