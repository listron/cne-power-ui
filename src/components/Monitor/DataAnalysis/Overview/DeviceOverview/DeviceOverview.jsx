


import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Radio, DatePicker } from 'antd';
import styles from './device.scss';
// import StationList from './StationList';
// import StationDates from './StationDates';
import CommonSearch from '../CommonSearch';
import DeviceRateChart from './DeviceRateChart';
import searchUtil from '@utils/searchUtil';
const { MonthPicker } = DatePicker;

class DeviceOverview extends PureComponent{
  static propTypes = {
    history: PropTypes.object,
    stations: PropTypes.array,
    deviceTopData: PropTypes.object,
    deviceUnix: PropTypes.number,
    deviceParam: PropTypes.object,
    devicesData: PropTypes.object,
    deveiceLoading: PropTypes.bool,
    deviceCheckedList: PropTypes.array,
    changeOverviewStore: PropTypes.func,
    getOverviewStation: PropTypes.func,
    getOverviewDevices: PropTypes.func,
    // getOverviewDates: PropTypes.func,
    getPoints: PropTypes.func,
  }

  componentDidMount(){
    const { deviceParam, deviceTopData } = this.props;
    const paramCode = deviceParam.stationCode;
    const paramTypeCode = deviceParam.deviceTypeCode;
    const paramDate = deviceParam.date;
    const { stationCode, deviceTypeCode, dateType, date } = this.getDeviceInfo();
    const paramChange = paramCode !== stationCode || paramTypeCode !== deviceTypeCode || paramDate !== date; // F5或带参数跳转
    if (stationCode && paramChange) { // 路径有新参数, 与之前不同 => F5或电站页带路径跳转
      const { deviceTypes = [] } = deviceTopData || {};
      this.props.changeOverviewStore({ // 存储最新参数
        deviceParam: { stationCode, deviceTypeCode, dateType, date },
      });
      deviceTypes.length === 0 && this.props.getOverviewStation({ // 无电站信息 => 请求;
        stationCode,
        pageKey: 'device',
      });
      this.props.getPoints({ // 请求测点列表 
        params: {
          stationCode, deviceTypeCode, pointTypes: 'YC,YM',
        },
        actionName: 'afterDeviceTypePointGet',
        resultName: 'devicePointsList',
      });
    }
  }

  componentWillReceiveProps(nextProps){
    const { deviceTopData, deviceUnix, deviceParam } = nextProps;
    const preUnix = this.props.deviceUnix;
    if (deviceUnix !== preUnix) { // deviceTopData改变
      const { stationCode } = deviceParam;
      const { deviceTypes = [] } = deviceTopData || {};
      const { deviceTypeCode = 101 } = deviceTypes.find(e => [101, 201, 206].includes(e.deviceTypeCode)) || {};
      this.props.getPoints({ // 请求测点列表 
        params: {
          stationCode, deviceTypeCode, pointTypes: 'YC,YM',
        },
        actionName: 'afterDeviceTypePointGet',
        resultName: 'devicePointsList',
      });
      const queryParam = {
        ...deviceParam,
        deviceTypeCode,
      };
      this.props.changeOverviewStore({ deviceParam: queryParam }); // 并将请求数据存入reducer
      this.historySearchChange(queryParam);
    }
  }
    // deviceParam: {}, // stationCode, deviceTypeCode, dateType(1日2月), date, pointCodes => search-device是该字段的jsonStr

  getDeviceInfo = () => { // 路径信息中获取设备页信息
    const { history } = this.props;
    const { search } = history.location;
    const deviceStr = searchUtil(search).getValue('device') || '';
    let deviceInfo = {};
    try{
      deviceInfo = JSON.parse(deviceStr);
    } catch(err){ null; }
    return deviceInfo;
  }

  dateTypeCheck = ({ target }) => { // 日期模式改变 => 按照默认时间 + 日期类型进行选中
    const { deviceParam, deviceCheckedList } = this.props;
    const { value } = target;
    const date = moment().subtract(1, 'd').format(value === 2 ? 'YYYY-MM' : 'YYYY-MM-DD'); // 2按月, 1按日
    const newParams = { ...deviceParam, dateType: value, date };
    this.props.changeOverviewStore({
      deviceParam: newParams,
      devicesData: {}, // 清空设备信息
    });
    this.props.getOverviewDevices({ ...newParams, pointCodes: deviceCheckedList }); // 请求测点数据
    this.historySearchChange(newParams);
  }

  monthCheck = (month, monthStr) => this.dayCheck(monthStr); // 换月

  dayCheck = (day, dayStr) => this.dayCheck(dayStr); // 换日

  datesChange = (date) => { // 日期改变
    const { deviceParam, deviceCheckedList } = this.props;
    const newParams = { ...deviceParam, date };
    this.props.changeOverviewStore({
      deviceParam: newParams,
      devicesData: {}, // 清空设备信息
    });
    this.props.getOverviewDevices({ ...newParams, pointCodes: deviceCheckedList }); // 请求测点数据
    this.historySearchChange(newParams);
  }

  stationChanged = ({ stationCode }) => { // 电站切换 => 请求电站信息
    const { deviceParam } = this.props;
    const newParam = {
      ...deviceParam,
      stationCode,
      deviceTypeCode: null, // 取消设备类型选择
    };
    this.props.changeOverviewStore({
      deviceParam: newParam,
      devicesData: {}, // 清空设备信息
      devicePointsList: [], // 清空测点列表
    });
    this.props.getOverviewStation({
      stationCode,
      pageKey: 'device',
    });
  }

  deviceTypeChanged = (deviceTypeCode) => { // 设备类型切换 => 请求测点列表
    const { deviceParam } = this.props;
    const { stationCode } = deviceParam;
    const newParams = { ...deviceParam, deviceTypeCode };
    this.props.changeOverviewStore({
      deviceParam: newParams,
      devicesData: {}, // 清空设备信息
      devicePointsList: [], // 清空测点列表
    });
    this.props.getPoints({ // 请求新的测点列表 
      params: {
        stationCode, deviceTypeCode, pointTypes: 'YC,YM',
      },
      actionName: 'afterDeviceTypePointGet',
      resultName: 'devicePointsList',
    });
    this.historySearchChange(newParams);
  }

  historySearchChange = (deviceParam) => { // 将参数映射入路径
    const { history } = this.props;
    const { pathname, search } = history.location;
    const newSearch = searchUtil(search).replace({ // 路径自动修改
      device: JSON.stringify(deviceParam),
    }).stringify();
    history.push(`${pathname}?${newSearch}`);
  }

  render(){
    const { deviceParam, deviceTopData, stations, devicesData, deveiceLoading } = this.props;
    const { stationCode, deviceTypeCode, dateType, date } = deviceParam;
    return(
      <div className={styles.device}>
        <div className={styles.topSearch}>
          <div className={styles.dateCheck}>
            <span className={styles.checkText}>时间范围</span>
            <Radio.Group value={dateType} onChange={this.dateTypeCheck}>
              <Radio.Button value={2}>按月</Radio.Button>
              <Radio.Button value={1}>按日</Radio.Button>
            </Radio.Group>
            {dateType === 2 && <MonthPicker value={moment(date)} allowClear={false} onChange={this.monthCheck} />}
            {dateType === 1 && <DatePicker value={moment(date)} allowClear={false} onChange={this.dayCheck} />}
          </div>
          <CommonSearch
            stations={stations}
            stationCode={stationCode}
            topData={deviceTopData}
            deviceTypeCode={deviceTypeCode}
            onStationChange={this.stationChanged}
            onTypeChange={this.deviceTypeChanged}
          />
        </div>
        <DeviceRateChart devicesData={devicesData} deveiceLoading={deveiceLoading} />
        <div className={styles.devicePoints}>
          <div className={styles.pointHandle}>
            <span>测点</span>
            <span>测点选择弹框</span>
            <span>指标名称</span>
            <span>指标选择</span>
          </div>
          <div className={styles.pointTable}>
            测点详情表格
          </div>
        </div>
      </div>
    );
  }
}

export default DeviceOverview;
