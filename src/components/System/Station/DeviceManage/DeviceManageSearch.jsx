import React, { Component } from 'react';
import styles from './deviceManage.scss';
import StationSelect from '../../../Common/StationSelect';
import { Select } from 'antd';
const { Option } = Select

import PropTypes from 'prop-types';

class DeviceManageSearch extends Component {
  static propTypes = {
    stations: PropTypes.array,
    stationDeviceTypes: PropTypes.array,
    deviceModels: PropTypes.array,
    deviceTypeCode: PropTypes.string,
    deviceModelCode: PropTypes.string,
  }
  constructor(props) {
    super(props);
    this.state = {
      
    }
  }

  selectStation = (stations) => {
    console.log(stations)
  }

  selectDeviceType = (value) => {
    console.log(value)
  }

  selectDeviceModel = (value) => {
    console.log(value)
  }

  render() {
    const { stations, stationDeviceTypes, deviceModels, deviceTypeCode, deviceModelCode } = this.props;
    return (
      <div className={styles.deviceManageSearch}>
        <span>条件查询</span>
        <StationSelect data={stations} onOK={this.selectStation} />
        <Select onChange={this.selectDeviceType} value={deviceTypeCode} placeholder="请选择设备类型">
          <Option key={''} value={''}>{'全部'}</Option>
          {stationDeviceTypes.map(e=>{
            if(!e){ return null; }
            return <Option key={e.deviceTypeCode} value={e.deviceTypeCode}>{e.deviceTypeName}</Option>
          })}
        </Select>
        <Select onChange={this.selectDeviceModel} value={deviceModelCode} placeholder="请选择设备型号">
          <Option key={''} value={''}>{'全部'}</Option>
          {deviceModels.map(e=>{
            if(!e){ return null; }
            return <Option key={e.deviceModeCode} value={e.deviceModeCode}>{e.deviceModeName}</Option>
          })}
        </Select>
      </div>
    );
  }
}

export default DeviceManageSearch;
