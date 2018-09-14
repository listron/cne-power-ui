import React, { Component } from 'react';
import styles from './pointManage.scss';
import StationSelect from '../../../Common/StationSelect';
import { Select } from 'antd';
import PropTypes from 'prop-types';
const { Option } = Select;

class PointManageSearch extends Component {
  static propTypes = {
    stationCode: PropTypes.number,
    stations: PropTypes.array,
    queryParams: PropTypes.object,
    stationDeviceTypes: PropTypes.array,
    deviceModels: PropTypes.array,
    deviceTypeCode: PropTypes.number,
    deviceModelCode: PropTypes.number,
    getPointList: PropTypes.func,
    changeCommonStore: PropTypes.func,
    getStationDeviceTypes: PropTypes.func,
    getStationDeviceModel: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      
    }
  }

  selectStation = (stations) => {
    const { getStationDeviceTypes, getPointList, queryParams, changeCommonStore } = this.props;
    getStationDeviceTypes({
      stationCodes: stations[0].stationCode,
    });
    getPointList({
      ...queryParams,
      stationCode: stations[0].stationCode,
    })
    changeCommonStore({
      deviceModels: []
    })
  }

  selectDeviceType = (value) => {
    const { getStationDeviceModel, getPointList, queryParams, stationCode } = this.props;
    getStationDeviceModel({
      stationCode,
      deviceTypeCode: value,
    });
    getPointList({
      ...queryParams,
      deviceTypeCode: value,
    })
  }

  selectDeviceModel = (value) => {
    const { getPointList, queryParams } = this.props;
    getPointList({
      ...queryParams,
      deviceModelCode: value,
    })
  }

  render() {
    const { stations, stationDeviceTypes, deviceModels, deviceTypeCode, deviceModelCode } = this.props;
    const typeSelectDisable = stationDeviceTypes.length === 0;
    const modelSelectDisable = deviceModels.length === 0;
    return (
      <div className={styles.pointManageSearch}>
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
      </div>
    );
  }
}

export default PointManageSearch;
