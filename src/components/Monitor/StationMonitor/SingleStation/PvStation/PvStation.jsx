

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
    location: PropTypes.object,
  }

  constructor(props){
    super(props);
    this.state = {
    }
  }

  onSelectedDeviceType = (e) => {
    const deviceTypeCode = parseInt(e.target.value);
    this.props.changeSingleStationStore({deviceTypeCode});
  }

  getDeviceTypeIcon = (e) => {
    switch(e){
      case 509:
        return 'iconfont icon-pvs';
      case 206:
      case 201:
        return 'iconfont icon-nb';
      case 202:
        return 'iconfont icon-hl';
      case 304:
        return 'iconfont icon-xb';
      case '10004':
        return 'iconfont icon-elecnetting';
      default:
        return ;
    }
  }
  
  render(){
    const { deviceTypeFlow } = this.props;
    const locationSearch  = this.props.location.search;
    let appointDeviceCode = locationSearch.substr(locationSearch.indexOf('=')+1);
    if(appointDeviceCode && appointDeviceCode!=='undefined'){
      appointDeviceCode = parseInt(appointDeviceCode);
    }else{
      appointDeviceCode = deviceTypeFlow.length > 0 && deviceTypeFlow[0].deviceTypeCode;
    }
    
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
                {deviceTypeFlow && <RadioGroup defaultValue={appointDeviceCode || 509}  onChange={this.onSelectedDeviceType} >
                  {deviceTypeFlow && 
                    deviceTypeFlow.map(e=>{
                      return (<RadioButton value={e.deviceTypeCode} className={styles.deviceTypeItem} key={e.deviceTypeCode}>
                        <div className={styles.deviceTypeIcon} ><i className={this.getDeviceTypeIcon(e.deviceTypeCode)} ></i></div><div>{e.deviceTypeName}</div>
                        </RadioButton>)
                    })
                  }
                </RadioGroup>}
                <div className={styles.weatherStation}>
                  <i  className="iconfont icon-weather" ></i>
                  <div>气象站</div>
                </div>
              </div>
              <div className={styles.deviceList} >
                <DeviceList {...this.props}  />
              </div>
            </TabPane>
          </Tabs>
        </div>
      </div>
    )
  }
}

export default PvStation;
