import React, { Component } from 'react';
import styles from './warnConfig.scss';
import StationSelect from '../../../../Common/StationSelect';
import { Select } from 'antd';
const { Option } = Select

import PropTypes from 'prop-types';

class WarnConfigSearch extends Component {
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
    getWarnList: PropTypes.func,
    getStationDeviceTypes: PropTypes.func,
    getDeviceModel: PropTypes.func,
    getPoints: PropTypes.func,
    changeAlarmManageStore: PropTypes.func,

    listQueryParams: PropTypes.object,
    changeWarnStore: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {

    }
  }

  selectStation = (stations) => { // 选中电站
    const { getStationDeviceTypes, getWarnList, listQueryParams, changeWarnStore } = this.props;
    getWarnList({
      ...listQueryParams,
      stationCode: stations.length > 0 && stations[0].stationCode || null,
      deviceTypeCode: null,
      deviceModeCode: null,
      pointCode: '',
      pageNum: 1,
    })
    changeWarnStore({
      deviceModels: [],
      devicePoints: [],
      stationDeviceTypes: [],
    })
    stations.length > 0 && getStationDeviceTypes({
      payload: { stationCodes: stations.length > 0 && stations[0].stationCode || "", },
      resultName: 'stationDeviceTypes'
    });
  }

  selectDeviceType = (value) => { // 选中设备类型
    const { getWarnList, listQueryParams, changeWarnStore, getDeviceModel } = this.props;
    const { stationCode } = listQueryParams;
    getWarnList({
      ...listQueryParams,
      deviceTypeCode: value,
      deviceModeCode: null,
      pointCode: '',
      pageNum: 1,
    })
    changeWarnStore({
      devicePoints: [],
      deviceModels: [],
    })
    value && getDeviceModel({
      payload: { stationCode, deviceTypeCode: value, },
      resultName: 'deviceModels'
    });
  }

  selectDeviceModel = (value) => { // 选中设备型号
    const { getWarnList, listQueryParams, getPoints, changeWarnStore } = this.props;
    const { stationCode, deviceTypeCode } = listQueryParams;
    getWarnList({
      ...listQueryParams,
      deviceModeCode: value,
      pointCode: '',
      pageNum: 1,
    })
    value && getPoints({
      payload: { stationCode,deviceTypeCode, deviceModeCode: value },
      resultName: 'devicePoints'
    });
    changeWarnStore({
      devicePoints: [],
    })
  }

  selectPoints = (value) => { // 选中测点
    const { getWarnList, listQueryParams } = this.props;
    getWarnList({
      ...listQueryParams,
      pointCode: value,
      pageNum: 1,
    })
  }

  render() {
    const { allStationBaseInfo, stationDeviceTypes, deviceModels, devicePoints, listQueryParams } = this.props;
    const { stationCode, deviceTypeCode, deviceModeCode, pointCode } = listQueryParams;
    const typeSelectDisable = stationDeviceTypes.length === 0;
    const modelSelectDisable = deviceModels.length === 0;
    const pointSelectDisable = devicePoints.length === 0;
    const getSelectedStation = allStationBaseInfo.find(e => e.stationCode === stationCode);
    const selectedStationInfo = getSelectedStation ? [getSelectedStation] : [];
    return (
      <div className={styles.warnConfigSearch}>
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
          {deviceModels.map((e, index) => {
            if (!e) { return null; }
            return <Option key={index} value={e.deviceModeCode}>{e.deviceModeName}</Option>
          })}
        </Select>
        <Select className={styles.pointSelect} onChange={this.selectPoints} value={pointCode} placeholder="请选择测点" disabled={pointSelectDisable}>
          <Option key={''} value={''}>{'全部测点'}</Option>
          {devicePoints.map(e => {
            if (!e) { return null; }
            return <Option key={e.devicePointStandardCode} value={e.devicePointStandardCode}>{e.devicePointName}</Option>
          })}
        </Select>
      </div>
    );
  }
}

export default WarnConfigSearch;
