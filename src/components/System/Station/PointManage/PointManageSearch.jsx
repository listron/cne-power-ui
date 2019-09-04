import React, { Component } from 'react';
import styles from './pointManage.scss';
import StationSelect from '../../../Common/StationSelect';
import { Select, Button, Input } from 'antd';
import PropTypes from 'prop-types';
const { Option } = Select;

class PointManageSearch extends Component {
  static propTypes = {
    stationCode: PropTypes.number,
    allStationBaseInfo: PropTypes.array,
    queryParams: PropTypes.object,
    stationDeviceTypes: PropTypes.array,
    deviceModels: PropTypes.array,
    deviceTypeCode: PropTypes.number,
    deviceModeCode: PropTypes.number,
    getPointList: PropTypes.func,
    changeCommonStore: PropTypes.func,
    getStationDeviceTypes: PropTypes.func,
    getDeviceModel: PropTypes.func,
    changePointManageStore: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {

    };
  }

  selectStation = (stations) => {
    const { getStationDeviceTypes, getPointList, queryParams, changePointManageStore } = this.props;
    getStationDeviceTypes({
      stationCodes: stations[0].stationCode,
    });
    getPointList({
      ...queryParams,
      stationCode: stations[0].stationCode,
      deviceTypeCode: null,
      deviceModeCode: null,
      pageNum: 1,
    });
    changePointManageStore({
      deviceModels: [],
    });
  }

  selectDeviceType = (value) => {
    const { getDeviceModel, getPointList, queryParams, stationCode } = this.props;
    getDeviceModel({
      stationCode,
      deviceTypeCode: value,
    });
    getPointList({
      ...queryParams,
      deviceTypeCode: value,
      deviceModeCode: null,
      pageNum: 1,
    });
  }

  selectDeviceModel = (value) => {
    const { getPointList, queryParams } = this.props;
    getPointList({
      ...queryParams,
      deviceModeCode: value,
      pageNum: 1,
    });
  }
  changePointCode = (e) => {

  }
  changeDesc = (e) => {

  }
  searchData = () => {
    //查询数据
  }

  render() {
    const { allStationBaseInfo, stationDeviceTypes, deviceModels, deviceTypeCode, deviceModeCode, stationCode } = this.props;
    const typeSelectDisable = stationDeviceTypes.length === 0;
    const modelSelectDisable = deviceModels.length === 0;
    const getSelectedStation = allStationBaseInfo.find(e => e.stationCode === stationCode);
    const selectedStationInfo = getSelectedStation ? [getSelectedStation] : [];
    return (
      <div className={styles.pointManageSearch}>
        <div className={styles.topSearch}>
          <span className={styles.titleText}>条件查询</span>
          <StationSelect data={allStationBaseInfo} onOK={this.selectStation} value={selectedStationInfo} holderText="请输入电站名称" />
          <Select className={styles.typeSelect} onChange={this.selectDeviceType} value={deviceTypeCode} placeholder="请选择设备类型" disabled={typeSelectDisable}>
            <Option key={null} value={null}>{'全部设备类型'}</Option>
            {stationDeviceTypes.map(e => {
              if (!e) { return null; }
              return <Option key={e.deviceTypeCode} value={e.deviceTypeCode}>{e.deviceTypeName}</Option>;
            })}
          </Select>
          <Select className={styles.modelSelect} onChange={this.selectDeviceModel} value={deviceModeCode} placeholder="请选择设备型号" disabled={modelSelectDisable}>
            <Option key={null} value={null}>{'全部设备型号'}</Option>
            {deviceModels.map(e => {
              if (!e) { return null; }
              return <Option key={e.deviceModeCode} value={e.deviceModeCode}>{e.deviceModeName}</Option>;
            })}
          </Select>
        </div>
        <div className={styles.bottomSeach}>
          <span className={styles.titleText}>测点编号</span>
          <Input className={styles.searchInput} onChange={this.changePointCode} />
          <span className={styles.titleText}>测点描述</span>
          <Input className={styles.searchInput} onChange={this.changeDesc} />
          <Button onClick={this.searchData} className={styles.searchBtn}>查找</Button>

        </div>

      </div>
    );
  }
}

export default PointManageSearch;
