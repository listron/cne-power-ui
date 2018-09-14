import React, { Component } from 'react';
import styles from './alarmManage.scss';
import StationSelect from '../../../Common/StationSelect';
import { Select } from 'antd';
const { Option } = Select

import PropTypes from 'prop-types';

class AlarmManageSearch extends Component {
  static propTypes = {
    stationCode: PropTypes.number,
    stations: PropTypes.array,
    queryParams: PropTypes.object,
    stationDeviceTypes: PropTypes.array,
    deviceModels: PropTypes.array,
    devicePoints: PropTypes.array,
    deviceTypeCode: PropTypes.number,
    deviceModelCode: PropTypes.number,
    pointCode: PropTypes.string,
    getAlarmList: PropTypes.func,
    changeCommonStore: PropTypes.func,
    getStationDeviceTypes: PropTypes.func,
    getStationDeviceModel: PropTypes.func,
    getStationDevicePoints: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      
    }
  }

  selectStation = (stations) => { // 选中电站
    const { getStationDeviceTypes, getAlarmList, queryParams, changeCommonStore } = this.props;
    getStationDeviceTypes({
      stationCodes: stations[0].stationCode,
    });
    getAlarmList({
      ...queryParams,
      stationCode: stations[0].stationCode,
      deviceTypeCode: null,
      deviceModelCode: null,
      pointCode: '',
    })
    changeCommonStore({
      deviceModels: [], 
      devicePoints: [],
    })
  }

  selectDeviceType = (value) => { // 选中设备类型
    const { getStationDeviceModel, getAlarmList, queryParams, stationCode, changeCommonStore } = this.props;
    getStationDeviceModel({
      stationCode,
      deviceTypeCode: value,
    });
    getAlarmList({
      ...queryParams,
      deviceTypeCode: value,
      deviceModelCode: null,
      pointCode: '',
    })
    changeCommonStore({
      devicePoints: [],
    })
  }

  selectDeviceModel = (value) => { // 选中设备型号
    const { getAlarmList, queryParams, stationCode, deviceTypeCode, deviceModelCode, getStationDevicePoints } = this.props;
    getStationDevicePoints({
      stationCode,
      deviceTypeCode,
      deviceModelCode
    })
    getAlarmList({
      ...queryParams,
      deviceModelCode: value,
      pointCode: '',
    })
  }

  selectPoints = (value) => { // 选中测点
    const { getAlarmList, queryParams } = this.props;
    getAlarmList({
      ...queryParams,
      pointCode: value,
    })
  }

  render() {
    const { stations, stationDeviceTypes, deviceModels, devicePoints, deviceTypeCode, deviceModelCode, pointCode } = this.props;
    const typeSelectDisable = stationDeviceTypes.length === 0;
    const modelSelectDisable = deviceModels.length === 0;
    const pointSelectDisable = devicePoints.length === 0;
    console.log(deviceModels )
    console.log(devicePoints )
    return (
      <div className={styles.alarmManageSearch}>
        <span className={styles.titleText}>条件查询</span>
        <StationSelect data={stations} onOK={this.selectStation} />
        <Select className={styles.typeSelect} onChange={this.selectDeviceType} value={deviceTypeCode} placeholder="请选择设备类型" disabled={typeSelectDisable}>
          <Option key={null} value={null}>{'全部'}</Option>
          {stationDeviceTypes.map(e=>{
            if(!e){ return null; }
            return <Option key={e.deviceTypeCode} value={e.deviceTypeCode}>{e.deviceTypeName}</Option>
          })}
        </Select>
        <Select className={styles.modelSelect} onChange={this.selectDeviceModel} value={deviceModelCode} placeholder="请选择设备型号" disabled={modelSelectDisable}>
          <Option key={null} value={null}>{'全部'}</Option>
          {deviceModels.map(e=>{
            if(!e){ return null; }
            return <Option key={e.deviceModeCode} value={e.deviceModeCode}>{e.deviceModeName}</Option>
          })}
        </Select>
        <Select className={styles.pointSelect} onChange={this.selectPoints} value={pointCode} placeholder="请选择测点" disabled={pointSelectDisable}>
          <Option key={''} value={''}>{'全部'}</Option>
          {devicePoints.map(e=>{
            if(!e){ return null; }
            return <Option key={e.devicePointStandardCode} value={e.devicePointStandardCode}>{e.devicePointName}</Option>
          })}
        </Select>
      </div>
    );
  }
}

export default AlarmManageSearch;
