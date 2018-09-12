import React, { Component } from 'react';
import styles from './deviceManage.scss';
import StationSelect from '../../../Common/StationSelect';
import { Select } from 'antd';
const { Option } = Select

import PropTypes from 'prop-types';

class DeviceManageSearch extends Component {
  static propTypes = {
    stationCode: PropTypes.string,
    stations: PropTypes.array,
    queryParams: PropTypes.object,
    stationDeviceTypes: PropTypes.array,
    deviceModels: PropTypes.array,
    deviceTypeCode: PropTypes.string,
    deviceModelCode: PropTypes.string,
    getDeviceList: PropTypes.func,
    getStationDeviceTypes: PropTypes.func,
    getStationDeviceModel: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      
    }
  }

  selectStation = (stations) => {
    const { getStationDeviceTypes, getDeviceList, queryParams } = this.props;
    getStationDeviceTypes({
      stationCodes: stations[0].stationCode,
    });
    getDeviceList({
      ...queryParams,
      stationCode: stations[0].stationCode,
    })
  }

  selectDeviceType = (value) => {
    const { getStationDeviceModel, getDeviceList, queryParams, stationCode } = this.props;
    getStationDeviceModel({
      stationCode,
      deviceTypeCode: value,
    });
    getDeviceList({
      ...queryParams,
      deviceTypeCode: value,
    })
  }

  selectDeviceModel = (value) => {
    const { getDeviceList, queryParams } = this.props;
    getDeviceList({
      ...queryParams,
      deviceTypeCode: value,
    })
  }

  render() {
    const { stations, stationDeviceTypes, deviceModels, deviceTypeCode, deviceModelCode } = this.props;
    const typeSelectDisable = stationDeviceTypes.length === 0;
    const modelSelectDisable = deviceModels.length === 0;
    return (
      <div className={styles.deviceManageSearch}>
        <span>条件查询</span>
        <StationSelect data={stations} onOK={this.selectStation} />
        <Select onChange={this.selectDeviceType} value={deviceTypeCode} placeholder="请选择设备类型" disabled={typeSelectDisable}>
          <Option key={''} value={''}>{'全部'}</Option>
          {stationDeviceTypes.map(e=>{
            if(!e){ return null; }
            return <Option key={e.deviceTypeCode} value={e.deviceTypeCode}>{e.deviceTypeName}</Option>
          })}
        </Select>
        <Select onChange={this.selectDeviceModel} value={deviceModelCode} placeholder="请选择设备型号" disabled={modelSelectDisable}>
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
