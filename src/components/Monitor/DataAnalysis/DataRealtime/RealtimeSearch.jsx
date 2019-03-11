import React, { Component } from 'react';
import { Select } from 'antd';
import StationSelect from '../../../Common/StationSelect';
import DeviceSelect from '../../../Common/DeviceSelect';
import PropTypes from 'prop-types';
import moment from 'moment';

import styles from './realtimeStyle.scss';
const { Option } = Select;

class RealtimeSearch extends Component {
  static propTypes = {
    stations: PropTypes.array,
    stationTypeCount: PropTypes.string,

    selectStationType: PropTypes.number, // 选中的电站类型
    deviceTypeCode: PropTypes.number, // 选中的设备类型
    queryParam: PropTypes.object,
    
    stationDeviceTypes: PropTypes.array, // 电站下可选设备类型
    changeRealtimeStore: PropTypes.func,
    getAvailableDeviceType: PropTypes.func,
    getPointInfo: PropTypes.func,
    stopRealtimeChart: PropTypes.func,
    stopRealtimeList: PropTypes.func,
  };

  onStationTypeChange = (selectStationType) => { // 存储选中电站类型，并重置数据。
    const { changeRealtimeStore, queryParam, stopRealtimeChart, stopRealtimeList } = this.props;
    stopRealtimeList();
    stopRealtimeChart();
    changeRealtimeStore({
      selectStationType,
      deviceTypeCode: null,
      queryParam: {
        ...queryParam,
        stationCode: null,
        deviceFullCodes: [],
        devicePoints: [],
      },
      pointInfo: [], // 选中设备内可选测点信息。
      chartRealtime: {}, // chart图 - 所有历史数据
      listRealtime: {}, // 表格内 - 分页后的历史数据
    });
  }

  checkWind = () => this.onStationTypeChange(0) // 选中风电站

  checkPv = () => this.onStationTypeChange(1) // 选中光伏电站

  selectStation = (selectedStationInfo) => { // 电站选择。
    const { getAvailableDeviceType, changeRealtimeStore, queryParam, stopRealtimeChart, stopRealtimeList } = this.props;
    const { stationCode } = selectedStationInfo[0];
    stopRealtimeChart();
    stopRealtimeList();
    getAvailableDeviceType({ stationCode });
    changeRealtimeStore({ // 清空选中的设备类型，测点，图表数据
      deviceTypeCode: null,
      queryParam: {
        ...queryParam,
        stationCode,
        deviceFullCodes: [],
        devicePoints: [],
      },
      pointInfo: [], // 清空测点信息
      chartRealtime: {}, // chart图 - 所有历史数据
      listRealtime: {}, // 表格内 - 分页后的历史数据
    });
  }

  selectDeviceType = (deviceTypeCode) => { // 设备类型选择
    const { changeRealtimeStore, queryParam, stopRealtimeChart, stopRealtimeList } = this.props;
    stopRealtimeChart();
    stopRealtimeList();
    changeRealtimeStore({ // 清空选中的设备类型，测点，图表数据
      deviceTypeCode,
      queryParam: {
        ...queryParam,
        deviceFullCodes: [], // 选中的设备
        devicePoints: [], // 选中的测点
      },
      chartRealtime: {}, // chart图 - 所有历史数据
      listRealtime: {}, // 表格内 - 分页后的历史数据
    });
  }

  selectedDevice = (devices) => { // 设备选择
    const { getPointInfo, stopRealtimeChart, stopRealtimeList, changeRealtimeStore, queryParam } = this.props;
    const { timeInterval } = queryParam;
    stopRealtimeChart();
    stopRealtimeList();
    changeRealtimeStore({
      queryParam: {
        ...queryParam,
        deviceFullCodes: devices,
        devicePoints: [],
      },
      allHistory: {},
      partHistory: {},
    })
    getPointInfo({
      deviceFullCodes: devices,
      timeInterval,
    });
  }

  render(){
    const {
      queryParam, selectStationType, stations, deviceTypeCode, stationDeviceTypes, stationTypeCount
    } = this.props;
    const { stationCode, deviceFullCodes } = queryParam;
    return (
      <div className={styles.realtimeSearch}>
        {stationTypeCount === 'multiple' && <div className={styles.typeCheck}>
          <div className={selectStationType === 0 ? styles.typeActive: styles.typeNormal} onClick={this.checkWind}>风电</div>
          <div className={selectStationType === 1 ? styles.typeActive: styles.typeNormal} onClick={this.checkPv}>光伏</div>
          <div className={styles.holder} />
        </div>}
        <div className={styles.searchPart}>
          <div className={styles.stationSelect}>
            <span className={styles.text}>电站名称</span>
            <StationSelect
              data={typeof(selectStationType) === 'number' ? stations.filter(e => e.stationType === selectStationType) : stations}
              onOK={this.selectStation}
              value={stations.filter(e => e.stationCode === stationCode)}
            />
          </div>
          <div className={styles.typeSelect}>
            <span className={styles.text}>设备类型</span>
            <Select
              style={{ width: '200px' }}
              onChange={this.selectDeviceType}
              value={deviceTypeCode}
              placeholder="请选择设备类型"
              disabled={stationDeviceTypes.length === 0}
            >
              {stationDeviceTypes.map(e => (
                <Option key={e.deviceTypeCode} value={e.deviceTypeCode}>{e.deviceTypeName}</Option>
              ))}
            </Select>
          </div>
          <div className={styles.deviceSelect}>
            <span className={styles.text}>设备名称</span>
            <DeviceSelect
              disabled={!deviceTypeCode}
              stationCode={stationCode}
              value={deviceFullCodes}
              deviceTypeCode={deviceTypeCode}
              multiple={true}
              style={{ width: 'auto', minWidth: '198px' }}
              onChange={this.selectedDevice}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default RealtimeSearch;