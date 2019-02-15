import React, { Component } from 'react';
import { Select } from 'antd';
import StationSelect from '../../../Common/StationSelect';
import DeviceSelect from '../../../Common/DeviceSelect';
import PropTypes from 'prop-types';

import styles from './historyStyle.scss';
const { Option } = Select;

class HistorySearch extends Component {
  static propTypes = {
    stations: PropTypes.array,
    selectedStationInfo: PropTypes.array,

    deviceTypeCode: PropTypes.number,
    // deviceCodes: PropTypes.array,
    // startTime: PropTypes.string,
    // endTime: PropTypes.string,
    // pointCodes: PropTypes.array, // 选中的测点
    // timeSpace:  PropTypes.string,
    // historyType:  PropTypes.string,
    
    stationDeviceTypes: PropTypes.array, // 电站下可选设备类型
    // pointInfo: PropTypes.array, // 选中设备内可选测点信息。
    // allHistory: PropTypes.array, // chart图 - 所有历史数据
    // partHistory: PropTypes.array, // 表格内 - 分页后的历史数据

    changeHistoryStore: PropTypes.func,
    getStationDeviceTypes: PropTypes.func,
    getPointInfo: PropTypes.func,
    // resetHistoryStore: PropTypes.func,
  };

  selectStation = (selectedStationInfo) => {
    const { getStationDeviceTypes, changeHistoryStore } = this.props;
    getStationDeviceTypes({ // 设备类型
      stationCodes: selectedStationInfo[0].stationCode,
    });
    changeHistoryStore({ // 清空选中的设备类型，测点，图表数据。
      selectedStationInfo,
      deviceTypeCode: null,
      deviceCodes: [], // 选中的设备
      pointCodes: [], // 选中的测点
      pointInfo: [], // 可选测点信息。
      allHistory: [], // chart图 - 所有历史数据
      partHistory: [], // 表格内 - 分页后的历史数据
    })
  }

  selectDeviceType = (deviceTypeCode) => {
    const { changeHistoryStore, getPointInfo } = this.props;
    getPointInfo({deviceTypeCode});
    changeHistoryStore({ // 清空选中的设备类型，测点，图表数据。
      deviceTypeCode,
      deviceCodes: [], // 选中的设备
      pointCodes: [], // 选中的测点
      allHistory: [], // chart图 - 所有历史数据
      partHistory: [], // 表格内 - 分页后的历史数据
    })
  }

  selectedDevice = (devices) => { // 若已选择测点，则请求数据。若未选测点，则保存选中设备。
    // const { changeHistoryStore } = this.props;
    // changeHistoryStore({ // 清空选中的设备类型，测点，图表数据。
    //   deviceTypeCode,
    //   deviceCodes: [], // 选中的设备
    //   pointCodes: [], // 选中的测点
    //   allHistory: [], // chart图 - 所有历史数据
    //   partHistory: [], // 表格内 - 分页后的历史数据
    // })
    console.log(devices);
    // deviceCodes
  }

  render(){
    const { stations, selectedStationInfo, deviceTypeCode, stationDeviceTypes } = this.props;
    const stationInfo = selectedStationInfo[0] || {};
    return (
      <div className={styles.historySearch}>
        <StationSelect data={stations} onOK={this.selectStation} value={selectedStationInfo} />
        <Select
          className={styles.typeSelect}
          onChange={this.selectDeviceType}
          value={deviceTypeCode}
          placeholder="请选择设备类型"
          disabled={stationDeviceTypes.length === 0}
        >
          {stationDeviceTypes.map(e => (
            <Option key={e.deviceTypeCode} value={e.deviceTypeCode}>{e.deviceTypeName}</Option>
          ))}
        </Select>
        <DeviceSelect
          // disabled={disableDevice}
          stationCode={stationInfo.stationCode || null}
          deviceTypeCode={deviceTypeCode}
          multiple={true}
          style={{ width: 'auto', minWidth: '198px' }}
          onChange={this.selectedDevice}
        />
        <span>选择电站</span>
        <span>设备类型</span>
        <span>选择设备</span>
        <span>时间选择</span>
        <span>数据时间间隔</span>
      </div>
    )
  }
}

export default HistorySearch;