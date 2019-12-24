import React, { Component } from 'react';
import { Select, DatePicker, Button } from 'antd';
import StationSelect from '../../../Common/StationSelect';
import DeviceSelect from '../../../Common/DeviceSelect';
import PropTypes from 'prop-types';
import moment from 'moment';
import path from '../../../../constants/path';
import cookie from 'js-cookie';
import styles from './historyStyle.scss';
import { message } from 'antd';
const { APIBasePath } = path.basePaths;
const { monitor } = path.APISubPaths;

const { Option } = Select;
const { RangePicker } = DatePicker;
class HistorySearch extends Component {
  static propTypes = {
    stations: PropTypes.array,
    filterDevices: PropTypes.array,
    stationTypeCount: PropTypes.string,
    recordedMinuteStart: PropTypes.object,
    recordedMinuteEnd: PropTypes.object,
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

  componentDidUpdate(prevProps) {
    const { queryParam, changeHistoryStore, filterDevices } = this.props;
    const prevDevices = prevProps.filterDevices;
    if (prevDevices.length === 0 && filterDevices.length > 0) { // 得到初始设备数据
      changeHistoryStore({
        queryParam: {
          ...queryParam,
          deviceFullCodes: [filterDevices[0]], // 默认选中第一个设备
        },
      });
      this.selectedDevice([filterDevices[0]]);
    } else if (
      prevDevices.length > 0
      && filterDevices.length > 0
      && prevDevices[0].deviceCode !== filterDevices[0].deviceCode
    ) { // 设备数据切换
      changeHistoryStore({
        queryParam: {
          ...queryParam,
          deviceFullCodes: [filterDevices[0]], // 默认选中第一个设备
        },
      });
      this.selectedDevice([filterDevices[0]]);
    }
  }

  selectStation = (selectedStationInfo) => { // 电站选择。
    const { getAvailableDeviceType, changeHistoryStore, queryParam } = this.props;
    const { stationCode } = selectedStationInfo[0];
    const { stationType } = selectedStationInfo[0];
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
      selectStationType: stationType,
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
    const { getPointInfo, changeHistoryStore, queryParam, getListHistory, getChartHistory, listParam, selectStationType } = this.props;
    const { timeInterval } = queryParam;
    changeHistoryStore({
      chartTime: null,
      queryParam: {
        ...queryParam,
        deviceFullCodes: devices,
        // devicePoints: [],
      },
      allHistory: {},
      partHistory: {},
    });
    getPointInfo({
      deviceFullCodes: devices,
      timeInterval,
      selectStationType,
    });
    getChartHistory({
      queryParam: {
        ...queryParam,
        deviceFullCodes: devices,
      },
    });
    getListHistory({
      queryParam: {
        ...queryParam,
        deviceFullCodes: devices,
      },
      listParam,
    });
  }

  // startChange = (nowStartTime) => {
  //   const { queryParam } = this.props;
  //   const { endTime, startTime } = queryParam;
  //   if (moment(nowStartTime).isSame(startTime, 's')) {
  //     return;
  //   }
  //   if (moment().isBefore(nowStartTime, 's')) {
  //     nowStartTime = moment();
  //   } else if (endTime && endTime.isBefore(nowStartTime, 's')) {
  //     nowStartTime = moment(endTime);
  //   }
  //   this.historyDataFetch({ startTime: nowStartTime, endTime: null });
  // }

  // endChange = (endTime) => {
  //   const { queryParam } = this.props;
  //   const { startTime } = queryParam;
  //   if (moment().isBefore(endTime, 's')) {
  //     endTime = moment();
  //   } else if (endTime.isBefore(startTime, 's')) {
  //     endTime = moment(startTime);
  //   }
  //   this.historyDataFetch({ endTime });
  // }

  createTimeArr = (start, end) => {
    const timeArr = [];
    for (let i = start; i < end; i += 1) {
      timeArr.push(i);
    }
    return timeArr;
  }
  disabledDate = (current) => {
    if (this.start) {
      const end = moment(this.start).add(30, 'days');
      return current > moment.min(moment().endOf('day'), end);
    }
    return current && current > moment().endOf('day');
  }

  onCalendarChange = (dates) => {

    if (dates.length === 1) {
      this.start = dates[0].format('YYYY-MM-DD');
    } else {
      this.start = null;
    }
  }
  onChangeTime = (dateMoment, dateString) => { // 按日选择
    this.historyDataFetch({
      startTime: moment(dateString[0]),
      endTime: moment(dateString[1]),
    });

  }
  disableStartDate = (date) => { // 不可选的开始日期。
    const { queryParam } = this.props;
    const { endTime, timeInterval } = queryParam;
    // const disableStart = timeInterval === 10 ? moment(endTime).subtract(1, 'M') : moment(endTime).subtract(1, 'd');
    if (endTime) {
      return moment().isBefore(date, 'D') || endTime.isBefore(date, 'D'); // || date.isBefore(disableStart, 'D');
    }
  }

  disableStartTime = (time) => {
    const { queryParam } = this.props;
    const { endTime } = queryParam;
    if (endTime && endTime.isSame(time, 'd')) { // 同一天，不可大于结束时间
      const endHour = endTime.hour();
      const endMinute = endTime.minute();
      const endSecond = endTime.second();
      const disabledHours = this.createTimeArr(endHour + 1, 24);
      const disabledMinutes = this.createTimeArr(time.hour() === endHour ? endMinute + 1 : 60, 60);
      const disabledSeconds = this.createTimeArr((time.hour() === endHour && time.minute() === endMinute) ? endSecond : 60, 60);
      return {
        disabledHours: () => disabledHours,
        disabledMinutes: () => disabledMinutes,
        disabledSeconds: () => disabledSeconds,
      };
    }
    return;
  }

  disableEndDate = (date) => {
    const { queryParam } = this.props;
    const { startTime, timeInterval } = queryParam;
    // const disableEnd = timeInterval === 10 ? moment(startTime).add(1, 'M') : moment(startTime).add(1, 'd');
    return moment().isBefore(date, 'D') || date.isBefore(startTime, 'D'); // || date.isAfter(disableEnd, 'D');
  }

  disableEndTime = (time) => {
    const { queryParam } = this.props;
    const { startTime } = queryParam;
    if (startTime.isSame(time, 'd')) { // 同一天，不可大于结束时间
      const startHour = startTime.hour();
      const startMinute = startTime.minute();
      const startSecond = startTime.second();
      const disabledHours = this.createTimeArr(0, startHour);
      const disabledMinutes = this.createTimeArr(0, time.hour() === startHour ? startMinute : 0);
      const disabledSeconds = this.createTimeArr(0, (time.hour() === startHour && time.minute() === startMinute) ? startSecond + 1 : 0);
      return {
        disabledHours: () => disabledHours,
        disabledMinutes: () => disabledMinutes,
        disabledSeconds: () => disabledSeconds,
      };
    }
    return;
  }
  selectTimeSpace = (interval) => { // 间隔时间选择
    const { queryParam, changeHistoryStore, getPointInfo, recordedMinuteStart, recordedMinuteEnd, listParam, getChartHistory, getListHistory } = this.props;
    const { timeInterval, deviceFullCodes, devicePoints } = queryParam;
    const tmpQueryParam = {
      ...queryParam,
      deviceFullCodes: deviceFullCodes.slice(0, 2),
      timeInterval: interval,
      // devicePoints: [],
    };
    if (interval === 10) { // 由秒级数据切换至10min数据
      changeHistoryStore({
        queryParam: {
          ...tmpQueryParam,
          startTime: recordedMinuteStart,
          endTime: recordedMinuteEnd,
        },
        allHistory: {},
        partHistory: {},
      });

      getChartHistory({
        queryParam: {
          ...tmpQueryParam,
          startTime: recordedMinuteStart,
          endTime: recordedMinuteEnd,
        },
      });
      getListHistory({
        queryParam: {
          ...tmpQueryParam,
        },
        listParam,
      });
    } else if (timeInterval === 10) { // 10min数据切换至秒级数
      changeHistoryStore({
        queryParam: {
          ...tmpQueryParam,
          startTime: moment().startOf('day'),
          endTime: moment().format(),
        },
        allHistory: {},
        partHistory: {},
      });
      // getPointInfo({
      //   deviceFullCodes: deviceFullCodes.slice(0, 2),
      //   timeInterval: interval,
      // });
      getChartHistory({
        queryParam: {
          ...tmpQueryParam,
          startTime: moment().startOf('day'),
          endTime: moment().format(),
        },
      });
      getListHistory({
        queryParam: {
          ...tmpQueryParam,
        },
        listParam,
      });
    } else { // 秒级数据( 1s与5s)切换
      this.historyDataFetch({ timeInterval });
    }
  }

  historyDataFetch = (params) => {
    const { changeHistoryStore, queryParam, listParam, getChartHistory, getListHistory } = this.props;
    const { devicePoints } = queryParam;
    const tmpPayload = { queryParam: { ...queryParam, ...params } };
    const { startTime, endTime, timeInterval } = tmpPayload.queryParam;

    if (timeInterval === 10) {
      tmpPayload.recordedMinuteStart = startTime;
      tmpPayload.recordedMinuteEnd = endTime;
    }
    const tmpAllowedEnd = timeInterval === 10 ? moment(endTime).subtract(1, 'M') : moment(endTime).subtract(1, 'd');



    if (startTime.isBefore(tmpAllowedEnd, 's')) {
      message.error(`${timeInterval === 10 ? '时间选择范围不可超过1个月' : '时间选择范围不可超过1天'}`);
      changeHistoryStore(tmpPayload);
    } else if (devicePoints.length > 0) { // 已选择测点 - 重新请求数据
      changeHistoryStore(tmpPayload);
      getChartHistory(tmpPayload);
      getListHistory({ ...tmpPayload, listParam });
    } else { // 未选时间-暂存信息。
      changeHistoryStore(tmpPayload);
    }
  }
  exportHistory = () => { // '导出历史数据excel'
    const { downLoadFile, queryParam, enterpriseId } = this.props;
    const enterpriseCode = cookie.get('enterpriseCode');
    const url = `${APIBasePath}${monitor.exportHistory}`;
    let { startTime, endTime, deviceFullCodes, devicePoints } = queryParam;
    startTime = moment(startTime).utc().format();
    endTime = moment(endTime).utc().format();
    const timeZone = moment().utcOffset() / 60; // utc时区获取
    downLoadFile({ // 
      url,
      fileName: `${startTime}至${endTime}历史数据.xlsx`,
      params: {
        ...queryParam,
        deviceFullCodes: deviceFullCodes.map(e => e.deviceCode),
        devicePoints: devicePoints.filter(e => !e.includes('group_')), // 去掉测点的所属分组code
        enterpriseId,
        enterpriseCode,
        timeZone,
        startTime,
        endTime,
      },
    });
  }

  stationTypeInfo = {
    pv: 1,
    wind: 0,
  }

  render() {
    const {
      queryParam, selectStationType, stations, deviceTypeCode, stationDeviceTypes, stationTypeCount, intervalInfo, downloading, partHistory } = this.props;


    const { dataList = [] } = partHistory;
    const { stationCode, startTime, endTime, timeInterval, deviceFullCodes } = queryParam;


    return (
      <div className={styles.historySearch}>
        <div className={styles.searchPart}>
          <div className={styles.stationSelect}>
            <span className={styles.text}>电站名称</span>
            <StationSelect
              data={stations.filter(e => {
                return e.stationType === selectStationType; // 多种类型时才有顶部区别
              })}
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
              // max={timeInterval === 10 ? 5 : 2}
              deviceShowNumber={true}
              style={{ width: 'auto', minWidth: '198px' }}
              onChange={this.selectedDevice}
            />
          </div>
          <div className={styles.startSelect}>
            <span className={styles.text}>选择日期</span>
            <RangePicker
              allowClear={false}
              value={[moment(startTime), moment(endTime)]}
              format="YYYY-MM-DD"
              disabledDate={this.disabledDate}
              onChange={this.onChangeTime}
              onCalendarChange={this.onCalendarChange}
            />

          </div>

        </div>
        <div className={styles.timeType}>
          <div className={styles.intervalSelect}>
            <span className={styles.text}>数据时间间隔</span>
            <Select
              onChange={this.selectTimeSpace}
              value={timeInterval}
              placeholder="数据间隔时间"
            >
              {intervalInfo.map(e => (
                <Option key={e} value={e}>{e === 10 ? '10分钟' : `${e}秒`}</Option>
              ))}
            </Select>
          </div>
          <div className={styles.export}>
            <Button
              className={dataList.length === 0 ? `${styles.btn}` : `${styles.btn} ${styles.am} ${styles.amScale}`}
              loading={downloading}
              onClick={this.exportHistory}
              disabled={dataList.length === 0}
            >
              <span>导出</span>
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default HistorySearch;
