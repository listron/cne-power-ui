import React, { Component } from 'react';
import styles from './alarmManage.scss';
import StationSelect from '../../../Common/StationSelect';
import { Select } from 'antd';
const { Option } = Select

import PropTypes from 'prop-types';

class AlarmManageSearch extends Component {
  static propTypes = {
    stationCode: PropTypes.number,
    allStationBaseInfo: PropTypes.array,
    queryParams: PropTypes.object,
    stationDeviceTypes: PropTypes.array,
    deviceModels: PropTypes.array,
    devicePoints: PropTypes.array,
    deviceTypeCode: PropTypes.number,
    deviceModeCode: PropTypes.number,
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
      deviceModeCode: null,
      pointCode: '',
      pageNum: 1,
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
      deviceModeCode: null,
      pointCode: '',
      pageNum: 1,
    })
    changeCommonStore({
      devicePoints: [],
    })
  }

  selectDeviceModel = (value) => { // 选中设备型号
    const { getAlarmList, queryParams, stationCode, deviceTypeCode, deviceModeCode, getStationDevicePoints } = this.props;
    getStationDevicePoints({
      stationCode,
      deviceTypeCode,
      deviceModeCode
    })
    getAlarmList({
      ...queryParams,
      deviceModeCode: value,
      pointCode: '',
      pageNum: 1,
    })
  }

  selectPoints = (value) => { // 选中测点
    const { getAlarmList, queryParams } = this.props;
    getAlarmList({
      ...queryParams,
      pointCode: value,
      pageNum: 1,
    })
  }

  render() {
    const { allStationBaseInfo, stationDeviceTypes, deviceModels, devicePoints, deviceTypeCode, deviceModeCode, pointCode } = this.props;
    const typeSelectDisable = stationDeviceTypes.length === 0;
    const modelSelectDisable = deviceModels.length === 0;
    const pointSelectDisable = devicePoints.length === 0;
    return (
      <div className={styles.alarmManageSearch}>
        <span className={styles.titleText}>条件查询</span>
        <StationSelect data={allStationBaseInfo} onOK={this.selectStation} />
        <Select className={styles.typeSelect} onChange={this.selectDeviceType} value={deviceTypeCode} placeholder="请选择设备类型" disabled={typeSelectDisable}>
          <Option key={null} value={null}>{'全部设备类型'}</Option>
          {stationDeviceTypes.map(e=>{
            if(!e){ return null; }
            return <Option key={e.deviceTypeCode} value={e.deviceTypeCode}>{e.deviceTypeName}</Option>
          })}
        </Select>
        <Select className={styles.modelSelect} onChange={this.selectDeviceModel} value={deviceModeCode} placeholder="请选择设备型号" disabled={modelSelectDisable}>
          <Option key={null} value={null}>{'全部设备型号'}</Option>
          {deviceModels.map(e=>{
            if(!e){ return null; }
            return <Option key={e.deviceModeCode} value={e.deviceModeCode}>{e.deviceModeName}</Option>
          })}
        </Select>
        <Select className={styles.pointSelect} onChange={this.selectPoints} value={pointCode} placeholder="请选择测点" disabled={pointSelectDisable}>
          <Option key={''} value={''}>{'全部测点'}</Option>
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
