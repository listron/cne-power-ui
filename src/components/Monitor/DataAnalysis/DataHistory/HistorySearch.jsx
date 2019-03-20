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
    
    intervalInfo: PropTypes.array, // 可选时间间隔
    stationDeviceTypes: PropTypes.array, // 电站下可选设备类型
    changeHistoryStore: PropTypes.func,
    getAvailableDeviceType: PropTypes.func,
    getPointInfo: PropTypes.func,
    getChartHistory: PropTypes.func,
    getListHistory: PropTypes.func,
  };

  onStationTypeChange = (selectStationType) => { // 存储选中电站类型，并重置数据。
    const { changeHistoryStore, queryParam } = this.props;
    changeHistoryStore({
      selectStationType,
      deviceTypeCode: null,
      chartTime: null,
      queryParam: {
        ...queryParam,
        stationCode: null,
        deviceFullCodes: [],
        devicePoints: [],
      },
      pointInfo: [], // 选中设备内可选测点信息。
      allHistory: {}, // chart图 - 所有历史数据
      partHistory: {}, // 表格内 - 分页后的历史数据
    })
  }

  checkWind = () => this.onStationTypeChange(0) // 选中风电站

  checkPv = () => this.onStationTypeChange(1) // 选中光伏电站

  selectStation = (selectedStationInfo) => { // 电站选择。
    const { getAvailableDeviceType, changeHistoryStore, queryParam } = this.props;
    const { stationCode } = selectedStationInfo[0];
    getAvailableDeviceType({ stationCode });
    changeHistoryStore({ // 清空选中的设备类型，测点，图表数据
      deviceTypeCode: null,
      chartTime: null,
      queryParam: {
        ...queryParam,
        stationCode,
        deviceFullCodes: [],
        devicePoints: [],
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
      chartTime: null,
      queryParam: {
        ...queryParam,
        deviceFullCodes: [], // 选中的设备
        devicePoints: [], // 选中的测点
      },
      pointInfo: [], // 清空测点信息
      allHistory: {}, // chart图 - 所有历史数据
      partHistory: {}, // 表格内 - 分页后的历史数据
    });
  }

  selectedDevice = (devices) => { // 设备选择
    const { getPointInfo, changeHistoryStore, queryParam } = this.props;
    const { timeInterval } = queryParam;
    changeHistoryStore({
      chartTime: null,
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

  timeChange = (timeMoment) => { // 时间选择
    this.historyDataFetch({
      startTime: timeMoment[0],
      endTime: timeMoment[1]
    })
  }

  selectTimeSpace = (interval) => { // 间隔时间选择
    const { queryParam, changeHistoryStore, getPointInfo } = this.props;
    const { timeInterval, deviceFullCodes } = queryParam;
    const pointTypeChange = [interval, timeInterval].includes(10);
    if (pointTypeChange) { // 重置测点树，请求最新测点。
      changeHistoryStore({
        queryParam: {
          ...queryParam,
          timeInterval: interval,
          devicePoints: [],
        },
        allHistory: {},
        partHistory: {},
      });
      getPointInfo({
        deviceFullCodes,
        timeInterval: interval,
      });
    } else { // 1 -> 5或5 -> 1 的转化，不用刷新测点树。
      this.historyDataFetch({ timeInterval })
    }
    
  }

  historyDataFetch = (params) => {
    const { changeHistoryStore, queryParam, listParam, getChartHistory, getListHistory } = this.props;
    const { devicePoints } = queryParam;
    const newQueryParam = {
      ...queryParam,
      ...params
    }
    if (devicePoints.length > 0) { // 已选择测点 - 重新请求数据
      getChartHistory({
        queryParam: newQueryParam
      })
      getListHistory({
        queryParam: newQueryParam,
        listParam,
      })
    } else { // 未选时间-暂存信息。
      changeHistoryStore({
        queryParam: newQueryParam
      })
    }
  }

  render(){
    const {
      queryParam, selectStationType, stations, deviceTypeCode, stationDeviceTypes, stationTypeCount, intervalInfo
    } = this.props;
    const { stationCode, startTime, endTime, timeInterval, deviceFullCodes } = queryParam;
  
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
              disabledStation={stations.filter(e => e.isConnected === 0).map(e => e.stationCode)}
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
              deviceShowNumber={true}
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
              disabledDate={(current) => current > moment()}
              showTime
            />
          </div>
          <div className={styles.intervalSelect}>
            <span className={styles.text}>数据时间间隔</span>
            <Select
              onChange={this.selectTimeSpace}
              value={timeInterval}
              placeholder="数据间隔时间"
            >
              {intervalInfo.map(e => (
                <Option key={e} value={e}>{e === 10 ? '10分' : `${e}秒`}</Option>
              ))}
            </Select>
          </div>
          
        </div>
      </div>
    )
  }
}

export default HistorySearch;