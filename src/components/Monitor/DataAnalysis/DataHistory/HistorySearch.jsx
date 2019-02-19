import React, { Component } from 'react';
import { Select, DatePicker } from 'antd';
import StationSelect from '../../../Common/StationSelect';
import DeviceSelect from '../../../Common/DeviceSelect';
import PropTypes from 'prop-types';
import moment from 'moment';

import styles from './historyStyle.scss';
const { Option } = Select;
const { RangePicker } = DatePicker;

class HistorySearch extends Component {
  static propTypes = {
    selectStationType: PropTypes.number,

    stations: PropTypes.array,
    stationTypeCount: PropTypes.string,

    stationCode: PropTypes.number,
    deviceTypeCode: PropTypes.number,
    deviceCodes: PropTypes.array,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
    pointCodes: PropTypes.array, // 选中的测点
    timeSpace:  PropTypes.string,
    historyType:  PropTypes.string,
    
    stationDeviceTypes: PropTypes.array, // 电站下可选设备类型

    changeHistoryStore: PropTypes.func,
    getStationDeviceTypes: PropTypes.func,
    getPointInfo: PropTypes.func,
    getHistory: PropTypes.func,
  };

  checkWind = () => { // 选中风电站
    const { changeHistoryStore } = this.props;
    changeHistoryStore({selectStationType: 0})
  }

  checkPv = () => { // 选中光电站
    const { changeHistoryStore } = this.props;
    changeHistoryStore({selectStationType: 1})
  }

  selectStation = (selectedStationInfo) => { // 电站选择。
    const { getStationDeviceTypes, changeHistoryStore } = this.props;
    const { stationCode } = selectedStationInfo[0];
    getStationDeviceTypes({ // 设备类型
      stationCodes: stationCode,
    });
    changeHistoryStore({ // 清空选中的设备类型，测点，图表数据
      stationCode,
      deviceTypeCode: null,
      deviceCodes: [], // 选中的设备
      pointCodes: [], // 选中的测点
      pointInfo: [], // 可选测点信息
      allHistory: [], // chart图 - 所有历史数据
      partHistory: [], // 表格内 - 分页后的历史数据
    })
  }

  selectDeviceType = (deviceTypeCode) => { // 设备类型选择
    const { changeHistoryStore, getPointInfo } = this.props;
    getPointInfo({deviceTypeCode});
    changeHistoryStore({ // 清空选中的设备类型，测点，图表数据
      deviceTypeCode,
      deviceCodes: [], // 选中的设备
      pointCodes: [], // 选中的测点
      allHistory: [], // chart图 - 所有历史数据
      partHistory: [], // 表格内 - 分页后的历史数据
    })
  }

  selectedDevice = (devices) => { // 设备选择
    const {
      changeHistoryStore, pointCodes, getHistory, deviceTypeCode, deviceCodes, startTime, endTime, timeSpace, historyType, stationCode
    } = this.props;
    if (pointCodes.length === 0) { // 若未选测点，则保存选中设备
      changeHistoryStore({
        deviceCodes: devices.map(e => e.deviceCode),
      })
    } else if (pointCodes.length > 0) { // 若已选择测点，则请求数据
      getHistory({
        stationCode, deviceTypeCode, deviceCodes, startTime, endTime, timeSpace, historyType, pointCodes
      })
    }
  }

  timeChange = (timeMoment) => { // 时间选择
    const { changeHistoryStore } = this.props;
    changeHistoryStore({
      startTime: timeMoment[0],
      endTime: timeMoment[1],
    })
  }

  selectTimeSpace = (timeSpace) => { // 间隔时间选择
    const { changeHistoryStore } = this.props;
    changeHistoryStore({ timeSpace });
  }

  render(){
    const {
      selectStationType, stations, stationCode, deviceTypeCode, stationDeviceTypes, startTime, endTime, timeSpace, stationTypeCount
    } = this.props;
    return (
      <div className={styles.historySearch}>
        {stationTypeCount === 'multiple' && <div className={styles.typeCheck}>
          <div className={selectStationType === 0 ? styles.typeActive: styles.typeNormal} onClick={this.checkWind}>风电</div>
          <div className={selectStationType === 1 ? styles.typeActive: styles.typeNormal} onClick={this.checkPv}>光伏</div>
          <div className={styles.holder} />
        </div>}
        <div className={styles.searchPart}>
          <div className={styles.stationSelect}>
            <span className={styles.text}>电站名称</span>
            <StationSelect
              data={selectStationType ? stations.filter(e => e.stationType === selectStationType) : stations}
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
              deviceTypeCode={deviceTypeCode}
              multiple={true}
              style={{ width: 'auto', minWidth: '198px' }}
              onChange={this.selectedDevice}
            />
          </div>
          <div className={styles.timeSelect}>
            <span className={styles.text}>时间选择</span>
            <RangePicker
              allowClear={false}
              format="YYYY-MM-DD HH:mm:ss"
              onChange={this.timeChange}
              value={[moment(startTime), moment(endTime)]}
            />
          </div>
          <div className={styles.intervalSelect}>
            <span className={styles.text}>数据时间间隔</span>
            <Select
              onChange={this.selectTimeSpace}
              value={timeSpace}
              placeholder="数据间隔时间"
            >
              <Option value="sec">1秒</Option>
              <Option value="fiveSec">5秒</Option>
              <Option value="tenMin">10分钟</Option>
            </Select>
          </div>
          
        </div>
      </div>
    )
  }
}

export default HistorySearch;