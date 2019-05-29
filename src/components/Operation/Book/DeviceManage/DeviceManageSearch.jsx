import React, { Component } from 'react';
import styles from './deviceManage.scss';
import StationSelect from '../../../Common/StationSelect';
import { Select } from 'antd';
const { Option } = Select

import PropTypes from 'prop-types';

class DeviceManageSearch extends Component {
  static propTypes = {
    stationCode: PropTypes.number,
    allStationBaseInfo: PropTypes.array,
    queryParams: PropTypes.object,
    stationDeviceTypes: PropTypes.array,
    deviceModels: PropTypes.array,
    deviceTypeCode: PropTypes.number,
    deviceModeCode: PropTypes.number,
    changeCommonStore: PropTypes.func,
    getDeviceList: PropTypes.func,
    getStationDeviceTypes: PropTypes.func,
    getDeviceModel: PropTypes.func,
    changeDeviceManageStore: PropTypes.func,
    getDeviceFactors: PropTypes.func,
    manufactorId: PropTypes.string,
    deviceFactorsList: PropTypes.array,
  }
  constructor(props) {
    super(props);
    this.state = {
    }
  }
  componentDidMount() {
    this.props.getDeviceFactors({
      orderField: '1',
      orderMethod: 'desc',
    })
  }
  selectStation = (stations) => {
    const { getStationDeviceTypes, getDeviceList, queryParams, changeDeviceManageStore } = this.props;
    getStationDeviceTypes({
      stationCodes: stations[0].stationCode,
    });
    getDeviceList({
      ...queryParams,
      stationCode: stations[0].stationCode,
      deviceTypeCode: null,
      deviceModeCode: null,
      pageNum: 1,
    })
    changeDeviceManageStore({
      deviceModels: []
    })
  }
  selectDeviceType = (value) => {
    const { getDeviceModel, getDeviceList, queryParams, stationCode } = this.props;
    getDeviceModel({
      stationCode,
      deviceTypeCode: value,
    });
    getDeviceList({
      ...queryParams,
      deviceTypeCode: value,
      deviceModeCode: null,
      pageNum: 1,
    })
  }
  selectDeviceModel = (value) => {
    const { getDeviceList, queryParams } = this.props;
    getDeviceList({
      ...queryParams,
      deviceModeCode: value,
      pageNum: 1,
    })
  }
  selectfactory=(value)=>{
    console.log('value: ', value);
    this.props.getfactorsDeviceMode({
      manufactorId:value
    })

  }
  render() {
    const { allStationBaseInfo, stationDeviceTypes, deviceModels, deviceTypeCode, deviceModeCode, stationCode, deviceFactorsList, manufactorId ,factorsDeviceModeData} = this.props;
    const typeSelectDisable = stationDeviceTypes.length === 0;
    const modelSelectDisable = factorsDeviceModeData.length === 0;
    return (
      <div className={styles.deviceManageSearch}>
        <span className={styles.titleText}>条件查询</span>
        <StationSelect
          data={allStationBaseInfo}
          onOK={this.selectStation}
          holderText="请选择电站"
          value={allStationBaseInfo.filter(e => e.stationCode === stationCode)}
        />
        <Select className={styles.typeSelect} onChange={this.selectDeviceType} value={deviceTypeCode} placeholder="请选择设备类型" disabled={typeSelectDisable}>
          <Option key={null} value={null}>{'全部设备类型'}</Option>
          {stationDeviceTypes.map(e => {
            if (!e) { return null; }
            return <Option key={e.deviceTypeCode} value={e.deviceTypeCode}>{e.deviceTypeName}</Option>
          })}
        </Select>
        <Select className={styles.modelSelect} onChange={this.selectfactory} value={manufactorId}  placeholder="请选择设备厂家" disabled={false}>
          <Option key={null} value={null}>{'全部厂家'}</Option>
          {deviceFactorsList.map(e => {
            if (!e) { return null; }
            return <Option key={e.manufactorCode} value={e.manufactorId}>{e.manufactorName}</Option>
          })}
        </Select>
        <Select className={styles.modelSelect} onChange={this.selectDeviceModel} value={deviceModeCode} placeholder="请选择设备型号" disabled={modelSelectDisable}>
          <Option key={null} value={null}>{'全部设备型号'}</Option>
          {factorsDeviceModeData.map(e => {
            if (!e) { return null; }
            return <Option key={e.deviceModeCode} value={e.deviceModeCode}>{e.deviceModeName}</Option>
          })}
        </Select>
      </div>
    );
  }
}

export default DeviceManageSearch;
