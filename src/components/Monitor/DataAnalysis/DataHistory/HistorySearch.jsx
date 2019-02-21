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
    stations: PropTypes.array,
    stationTypeCount: PropTypes.string,

    selectStationType: PropTypes.number, // 选中的电站类型
    deviceTypeCode: PropTypes.number, // 选中的设备类型
    queryParam: PropTypes.object,
    listParam: PropTypes.object,
    
    stationDeviceTypes: PropTypes.array, // 电站下可选设备类型
    changeHistoryStore: PropTypes.func,
    getStationDeviceTypes: PropTypes.func,
    getPointInfo: PropTypes.func,
    getChartHistory: PropTypes.func,
    getListHistory: PropTypes.func,
  };

  onStationTypeChange = (selectStationType) => { // 存储选中电站类型，并重置数据。
    const { changeHistoryStore, queryParam } = this.props;
    changeHistoryStore({
      selectStationType,
      deviceTypeCode: null,
      queryParam: {
        ...queryParam,
        stationCode: null,
        deviceFullCode: [],
        devicePoint: [],
      },
      pointInfo: [], // 选中设备内可选测点信息。
      allHistory: {}, // chart图 - 所有历史数据
      partHistory: {}, // 表格内 - 分页后的历史数据
    })
  }

  checkWind = () => this.onStationTypeChange(0) // 选中风电站

  checkPv = () => this.onStationTypeChange(1) // 选中光伏电站

  selectStation = (selectedStationInfo) => { // 电站选择。
    const { getStationDeviceTypes, changeHistoryStore, queryParam } = this.props;
    const { stationCode } = selectedStationInfo[0];
    getStationDeviceTypes({ // 设备类型
      stationCodes: stationCode,
    });
    changeHistoryStore({ // 清空选中的设备类型，测点，图表数据
      deviceTypeCode: null,
      queryParam: {
        ...queryParam,
        stationCode,
        deviceFullCode: [],
        devicePoint: [],
      },
      pointInfo: [], // 清空测点信息
      allHistory: {}, // chart图 - 所有历史数据
      partHistory: {}, // 表格内 - 分页后的历史数据
    });
  }

  selectDeviceType = (deviceTypeCode) => { // 设备类型选择
    const { changeHistoryStore, queryParam } = this.props;
    changeHistoryStore({ // 清空选中的设备类型，测点，图表数据
      deviceTypeCode,
      queryParam: {
        ...queryParam,
        deviceFullCode: [], // 选中的设备
        devicePoint: [], // 选中的测点
      },
      allHistory: {}, // chart图 - 所有历史数据
      partHistory: {}, // 表格内 - 分页后的历史数据
    });
  }

  selectedDevice = (devices) => { // 设备选择
    const { getPointInfo } = this.props;
    getPointInfo({ deviceFullCode: devices });
  }

  timeChange = (timeMoment) => { // 时间选择
    this.historyDataFetch({
      startTime: timeMoment[0],
      endTime: timeMoment[1]
    })
  }

  selectTimeSpace = (timeInterval) => { // 间隔时间选择
    this.historyDataFetch({ timeInterval })
  }

  historyDataFetch = (params) => {
    const { changeHistoryStore, queryParam, listParam, getChartHistory, getListHistory } = this.props;
    const { devicePoint } = queryParam;
    if (devicePoint.length > 0) { // 已选择测点 - 重新请求数据
      const newQueryParam = {
        ...queryParam,
        ...params
      }
      getChartHistory({
        queryParam: newQueryParam
      })
      getListHistory({
        queryParam: newQueryParam,
        listParam,
      })
    } else { // 未选时间-暂存信息。
      changeHistoryStore({ ...params })
    }
  }

  render(){
    const {
      queryParam, selectStationType, stations, deviceTypeCode, stationDeviceTypes, stationTypeCount
    } = this.props;
    const { stationCode, startTime, endTime, timeInterval, deviceFullCode } = queryParam;
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
              value={deviceFullCode}
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
              value={[startTime, endTime]}
            />
          </div>
          <div className={styles.intervalSelect}>
            <span className={styles.text}>数据时间间隔</span>
            <Select
              onChange={this.selectTimeSpace}
              value={timeInterval}
              placeholder="数据间隔时间"
            >
              <Option value={1}>1秒</Option>
              <Option value={5}>5秒</Option>
              <Option value={10}>10分钟</Option>
            </Select>
          </div>
          
        </div>
      </div>
    )
  }
}

export default HistorySearch;