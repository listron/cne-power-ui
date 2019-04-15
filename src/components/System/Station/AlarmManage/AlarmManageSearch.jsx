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
    getDeviceModel: PropTypes.func,
    getPoints: PropTypes.func,
    changeAlarmManageStore: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {

    }
  }

  selectStation = (stations) => { // 选中电站
    const { getStationDeviceTypes, getAlarmList, queryParams, changeAlarmManageStore } = this.props;
    getAlarmList({
      ...queryParams,
      stationCode: stations.length > 0 && stations[0].stationCode || null,
      deviceTypeCode: null,
      deviceModeCode: null,
      pointCode: '',
      pageNum: 1,
    })
    changeAlarmManageStore({
      deviceModels: [],
      devicePoints: [],
      stationDeviceTypes: [],
    })
    stations.length > 0 && getStationDeviceTypes({
      stationCodes: stations[0].stationCode,
    });
  }

  selectDeviceType = (value) => { // 选中设备类型
    const { getDeviceModel, getAlarmList, queryParams, stationCode, changeAlarmManageStore } = this.props;
    getAlarmList({
      ...queryParams,
      deviceTypeCode: value,
      deviceModeCode: null,
      pointCode: '',
      pageNum: 1,
    })
    changeAlarmManageStore({
      devicePoints: [],
      deviceModels: [],
    })
    value && getDeviceModel({
      stationCode,
      deviceTypeCode: value,
    });
  }

  selectDeviceModel = (value) => { // 选中设备型号
    const { getAlarmList, queryParams, stationCode, deviceTypeCode, deviceModeCode, getPoints,changeAlarmManageStore } = this.props;
    getAlarmList({
      ...queryParams,
      deviceModeCode: value,
      pointCode: '',
      pageNum: 1,
    })
    changeAlarmManageStore({ devicePoints: [], })
    value && getPoints({ stationCode, deviceTypeCode, deviceModeCode })
  }

  selectPoints = (value) => { // 选中测点
    const { getAlarmList, queryParams } = this.props;
    getAlarmList({
      ...queryParams,
      pointCode: value,
      pageNum: 1,
    })
  }

  selectWarnType = (value) => { // 选中告警类型
    const { getAlarmList, queryParams } = this.props;
    getAlarmList({
      ...queryParams,
      warningType: value,
      pageNum: 1,
    })
  }

  render() {
    const { allStationBaseInfo, stationDeviceTypes, deviceModels, devicePoints, deviceTypeCode, deviceModeCode, pointCode, stationCode, warningType } = this.props;
    const typeSelectDisable = stationDeviceTypes.length === 0;
    const modelSelectDisable = deviceModels.length === 0;
    const pointSelectDisable = devicePoints.length === 0;
    const getSelectedStation = allStationBaseInfo.find(e => e.stationCode === stationCode);
    const selectedStationInfo = getSelectedStation ? [getSelectedStation] : [];
    const warnTypeList = [
      { warnTypeName: '信息', warnTypeCode: 101 },
      { warnTypeName: '警告', warnTypeCode: 102 },
      { warnTypeName: '故障', warnTypeCode: 103 },
      { warnTypeName: '设备状态', warnTypeCode: 104 },
      { warnTypeName: '开关状态', warnTypeCode: 105 },
    ]
    return (
      <div className={styles.alarmManageSearch}>
        <span className={styles.titleText}>条件查询</span>
        <StationSelect data={allStationBaseInfo} onOK={this.selectStation} value={selectedStationInfo} holderText="请选择电站" />
        <Select className={styles.typeSelect} onChange={this.selectDeviceType} value={deviceTypeCode} placeholder="请选择设备类型" disabled={typeSelectDisable}>
          <Option key={null} value={null}>{'全部设备类型'}</Option>
          {stationDeviceTypes.map(e => {
            if (!e) { return null; }
            return <Option key={e.deviceTypeCode} value={e.deviceTypeCode}>{e.deviceTypeName}</Option>
          })}
        </Select>
        <Select className={styles.modelSelect} onChange={this.selectDeviceModel} value={deviceModeCode} placeholder="请选择设备型号" disabled={modelSelectDisable}>
          <Option key={null} value={null}>{'全部设备型号'}</Option>
          {deviceModels.map(e => {
            if (!e) { return null; }
            return <Option key={e.deviceModeCode} value={e.deviceModeCode}>{e.deviceModeName}</Option>
          })}
        </Select>
        <Select className={styles.pointSelect} onChange={this.selectPoints} value={pointCode} placeholder="请选择测点" disabled={pointSelectDisable}>
          <Option key={''} value={''}>{'全部测点'}</Option>
          {devicePoints.map(e => {
            if (!e) { return null; }
            return <Option key={e.devicePointStandardCode} value={e.devicePointStandardCode}>{e.devicePointName}</Option>
          })}
        </Select>
        <Select className={styles.warnTypeSelect} onChange={this.selectWarnType} value={warningType} placeholder="请选择告警类型" disabled={typeSelectDisable}>
          <Option key={''} value={null}>{'全部告警类型'}</Option>
          {warnTypeList.map(e => {
            return <Option key={e.warnTypeCode} value={e.warnTypeCode}>{e.warnTypeName}</Option>
          })}
        </Select>
      </div>
    );
  }
}

export default AlarmManageSearch;
