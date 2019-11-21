import React, { Component } from 'react';
import styles from './deviceManage.scss';
import StationSelect from '../../../Common/StationSelect';
import { Select } from 'antd';
const { Option } = Select;

import PropTypes from 'prop-types';

class DeviceManageSearch extends Component {
  static propTypes = {
    stationCode: PropTypes.number,
    allStationBaseInfo: PropTypes.array,
    queryParams: PropTypes.object,
    stationDeviceTypes: PropTypes.array,
    deviceModels: PropTypes.array,
    deviceTypeCode: PropTypes.number,
    deviceModeCode: PropTypes.string,
    getDeviceList: PropTypes.func,
    getStationDeviceTypes: PropTypes.func,
    getfactorsDeviceMode: PropTypes.func,
    getDeviceModel: PropTypes.func,
    changeDeviceManageStore: PropTypes.func,
    manufactorId: PropTypes.string,
    deviceFactorsData: PropTypes.object,
    factorsDeviceModeData: PropTypes.array,
  };
  constructor(props) {
    super(props);
    this.state = {
      SelectdeviceType: '',
    };
  }
  selectStation = stations => {
    this.setState({
      SelectdeviceType: '',
    });
    const {
      getStationDeviceTypes,
      getDeviceList,
      queryParams,
      changeDeviceManageStore,
    } = this.props;
    getStationDeviceTypes({
      stationCodes: stations[0].stationCode,
    });

    getDeviceList({
      ...queryParams,
      stationCode: stations[0].stationCode,
      deviceTypeCode: null,
      deviceModeCode: null,
      manufactorId: null,
      pageNum: 1,
    });
    changeDeviceManageStore({
      factorsDeviceModeData: [],
      deviceFactorsList: [],
    });
  };
  selectDeviceType = value => {//获取厂家列表换接口1.2.10
    this.setState({
      SelectdeviceType: value,
    });
    const {
      stationCode,
      getDeviceModel,
      getDeviceList,
      queryParams,
      getfactorsDeviceMode,
      changeDeviceManageStore,
    } = this.props;
    getfactorsDeviceMode({
      stationCode,
      deviceTypeCode: value,
      isConnectDevice: 1,
      manufactorId: 0,
      assetsId: '',
    });
    // this.props.getDeviceFactors({//原接口
    //   stationCode,
    //   deviceTypeCode: value,
    //   orderField: '1',
    //   orderMethod: 'desc',
    // });
    // getDeviceModel({
    //   stationCode,
    //   deviceTypeCode: value,
    // });
    getDeviceList({
      ...queryParams,
      deviceTypeCode: value,
      manufactorId: null,
      deviceModeCode: null,
      pageNum: 1,
    });
    changeDeviceManageStore({
      factorsDeviceModeData: [],
    });
  };
  selectfactory = value => {
    const { getDeviceList, queryParams, getfactorsDeviceMode, stationCode, deviceTypeCode } = this.props;
    getfactorsDeviceMode({
      stationCode,
      deviceTypeCode,
      isConnectDevice: 1,
      manufactorId: value,
      assetsId: '',

    });
    getDeviceList({
      ...queryParams,
      manufactorId: value,
      deviceModeCode: null,
      pageNum: 1,
    });
  };
  selectDeviceModel = value => {
    const { getDeviceList, queryParams } = this.props;
    getDeviceList({
      ...queryParams,
      deviceModeCode: value,
      pageNum: 1,
    });
  };

  render() {
    const { SelectdeviceType } = this.state;
    const {
      allStationBaseInfo,
      stationDeviceTypes,
      deviceModels,
      deviceTypeCode,
      deviceModeCode,
      stationCode,
      deviceFactorsData,
      manufactorId,
      factorsDeviceModeData,
      allMode,

    } = this.props;
    const dataList = deviceFactorsData.dataList ? deviceFactorsData.dataList : [];
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
        <Select
          className={styles.typeSelect}
          onChange={this.selectDeviceType}
          value={this.state.SelectdeviceType}
          placeholder="请选择设备类型"
          disabled={typeSelectDisable}
        >
          <Option key={null} value={null}>
            {'全部设备类型'}
          </Option>
          {stationDeviceTypes.map(e => {

            if (!e) {
              return null;
            }
            return (
              <Option key={e.deviceTypeCode} value={e.deviceTypeCode}>
                {e.deviceTypeName}
              </Option>
            );
          })}
        </Select>
        <Select
          className={styles.modelSelect}
          onChange={this.selectfactory}
          value={manufactorId}
          placeholder="请选择设备厂家"
          disabled={!allMode || allMode.length === 0}
        >
          <Option key={null} value={null}>
            {'全部厂家'}
          </Option>
          {allMode.map(e => {
            if (!e) {
              return null;
            }
            return (
              <Option key={e.manufactorCode} value={e.manufactorId}>
                {e.manufactorName}
              </Option>
            );
          })}
        </Select>
        <Select
          className={styles.modelSelect}
          onChange={this.selectDeviceModel}
          value={deviceModeCode}
          placeholder="请选择设备型号"
          disabled={modelSelectDisable}
        >
          <Option key={null} value={null}>
            {'全部设备型号'}
          </Option>
          {factorsDeviceModeData.map(e => {
            if (!e) {
              return null;
            }
            return (
              <Option key={e.deviceModeCode} value={e.deviceModeCode}>
                {e.modeName}
              </Option>
            );
          })}
        </Select>
      </div>
    );
  }
}

export default DeviceManageSearch;
