


import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Radio, DatePicker } from 'antd';
import styles from './point.scss';
import CommonSearch from '../CommonSearch';
// import DeviceRateChart from './DeviceRateChart';
// import DeviceTable from './DeviceTable';
import searchUtil from '@utils/searchUtil';
const { MonthPicker } = DatePicker;

class PointsOverview extends PureComponent{
  static propTypes = {
    history: PropTypes.object,
    stations: PropTypes.array,
    pointTopData: PropTypes.object,
    pointConnectedDevices: PropTypes.array,
    pointList: PropTypes.array,
    deviceListUnix: PropTypes.number,
    pointUnix: PropTypes.number,
    pointParam: PropTypes.object,
    pointsCheckedList: PropTypes.array,
    // devicesData: PropTypes.object,
    // deveiceLoading: PropTypes.bool,
    // deviceCheckedList: PropTypes.array,
    changeOverviewStore: PropTypes.func,
    getOverviewStation: PropTypes.func,
    getConnectedDevices: PropTypes.func,
    getOverviewPoints: PropTypes.func,
    getPoints: PropTypes.func,
  }

  state = {
    deviceAuto: false, // 未手动选择电站名称, 设备类型时false, 手动选择需自动设置选中device
  }

  componentDidMount(){
    const { pointParam, pointTopData, pointConnectedDevices, pointList } = this.props;
    const paramCode = pointParam.stationCode;
    const paramTypeCode = pointParam.deviceTypeCode;
    const paramDate = pointParam.date;
    const paramDeviceFullcode = pointParam.deviceFullcode;
    const { stationCode, deviceTypeCode, dateType, date, deviceFullcode } = this.getPointInfo();
    const paramChange = paramCode !== stationCode || paramTypeCode !== deviceTypeCode || paramDate !== date || paramDeviceFullcode !== deviceFullcode; // F5或带参数跳转
    if (stationCode && paramChange) { // 路径新参数, 与之前不同 => F5或电站页带路径跳转
      const { deviceTypes = [] } = pointTopData || {};
      this.props.changeOverviewStore({ // 存储最新参数
        deviceParam: { stationCode, deviceTypeCode, dateType, date, deviceFullcode },
      });
      deviceTypes.length === 0 && this.props.getOverviewStation({ // 无电站信息 => 请求;
        stationCode,
        pageKey: 'point',
      });
      pointConnectedDevices.length === 0 && this.props.getConnectedDevices({ // 电站,设备类型下可用的设备列表
        stationCode,
        deviceTypeCode,
        isConnected: 1,
      });
      pointList.length === 0 && this.props.getPoints({ // 请求测点列表 
        params: {
          stationCode, deviceTypeCode, pointTypes: 'YC,YM',
        },
        actionName: 'afterDeviceTypePointGet',
        resultName: 'pointPageList',
      });
    }
  }

  componentWillReceiveProps(nextProps){
    const { pointTopData, pointUnix, pointParam, deviceListUnix, pointsCheckedList, pointConnectedDevices } = nextProps;
    const { stationCode } = pointParam;
    const preUnix = this.props.pointUnix;
    const preDeviceUnix = this.props.deviceListUnix;
    if (pointUnix !== preUnix) { // topData改变 => 请求设备列表和测点列表
      const { deviceTypes = [] } = pointTopData || {};
      const { deviceTypeCode = 101 } = deviceTypes.find(e => [101, 201, 206].includes(e.deviceTypeCode)) || {};
      this.queryDeviceAndPoints(stationCode, deviceTypeCode);
      this.props.changeOverviewStore({ // 替换param并清空数据信息
        pointParam: {
          ...pointParam,
          deviceTypeCode,
          deviceFullcode: null,
        },
        pointsCheckedList: [],
        pointList: [],
        pointConnectedDevices: [],
        pointsData: [],
      });
    }
    const { deviceAuto } = this.state; // true需要默认数据, false为页面刷新时的初始设备列表
    if (preDeviceUnix !== deviceListUnix && deviceAuto) { // 得到设备列表, 且需默认设备
      const { deviceCode } = pointConnectedDevices[0] || {};
      const newParam = { // 写入路径, 存入store
        ...pointParam,
        deviceFullcode: deviceCode,
      };
      this.props.changeOverviewStore({
        pointParam: newParam,
      });
      this.historySearchChange(newParam);
      pointsCheckedList.length > 0 && this.props.getOverviewPoints({ // 此时已有选中设备, 请求列表
        ...newParam,
        pointCodes: pointsCheckedList,
      });
    }
  }

  queryDeviceAndPoints = (stationCode, deviceTypeCode) => { // 电站切换得到设备类型, 设备类型切换时, 同时请求设备列表和测点列表
    this.props.getConnectedDevices({
      stationCode,
      deviceTypeCode,
      isConnected: 1,
    });
    this.props.getPoints({
      params: {
        stationCode, deviceTypeCode, pointTypes: 'YC,YM',
      },
      actionName: 'afterDeviceTypePointGet',
      resultName: 'pointPageList',
    });
  }

  getPointInfo = () => { // 路径中获取测点页信息
    const { history } = this.props;
    const { search } = history.location;
    const pointStr = searchUtil(search).getValue('point') || '';
    let pointInfo = {};
    try{
      pointInfo = JSON.parse(pointStr);
    } catch(err){ null; }
    return pointInfo;
  }

  // dateTypeCheck = ({ target }) => { // 日期模式改变 => 按照默认时间 + 日期类型进行选中
  //   const { deviceParam, deviceCheckedList } = this.props;
  //   const { value } = target;
  //   const date = moment().subtract(1, 'd').format(value === 2 ? 'YYYY-MM' : 'YYYY-MM-DD'); // 2按月, 1按日
  //   const newParams = { ...deviceParam, dateType: value, date };
  //   this.props.changeOverviewStore({
  //     deviceParam: newParams,
  //     devicesData: {}, // 清空设备信息
  //   });
  //   this.props.getOverviewDevices({ ...newParams, pointCodes: deviceCheckedList }); // 请求测点数据
  //   this.historySearchChange(newParams);
  // }

  monthCheck = (month, monthStr) => this.datesChange(monthStr); // 换月

  dayCheck = (day, dayStr) => this.datesChange(dayStr); // 换日

  datesChange = (date) => { // 日期改变
  //   const { deviceParam, deviceCheckedList } = this.props;
  //   const newParams = { ...deviceParam, date };
  //   this.props.changeOverviewStore({
  //     deviceParam: newParams,
  //     devicesData: {}, // 清空设备信息
  //   });
  //   this.props.getOverviewDevices({ ...newParams, pointCodes: deviceCheckedList }); // 请求测点数据
  //   this.historySearchChange(newParams);
  }

  stationChanged = ({ stationCode }) => { // 电站切换 => 请求电站信息
    console.log(stationCode)
    const { deviceAuto } = this.state;
    !deviceAuto && this.setState({ deviceAuto: true });
  //   const { deviceParam } = this.props;
  //   const newParam = {
  //     ...deviceParam,
  //     stationCode,
  //     deviceTypeCode: null, // 取消设备类型选择
  //   };
  //   this.props.changeOverviewStore({
  //     deviceParam: newParam,
  //     devicesData: {}, // 清空设备信息
  //     devicePointsList: [], // 清空测点列表
  //   });
  //   this.props.getOverviewStation({
  //     stationCode,
  //     pageKey: 'device',
  //   });
  }

  deviceTypeChanged = (deviceTypeCode) => { // 设备类型切换 => 请求测点列表
    console.log(deviceTypeCode)
    !deviceAuto && this.setState({ deviceAuto: true });
  //   const { deviceParam } = this.props;
  //   const { stationCode } = deviceParam;
  //   const newParams = { ...deviceParam, deviceTypeCode };
  //   this.props.changeOverviewStore({
  //     deviceParam: newParams,
  //     devicesData: {}, // 清空设备信息
  //     devicePointsList: [], // 清空测点列表
  //   });
  //   this.props.getPoints({ // 请求新的测点列表 
  //     params: {
  //       stationCode, deviceTypeCode, pointTypes: 'YC,YM',
  //     },
  //     actionName: 'afterDeviceTypePointGet',
  //     resultName: 'devicePointsList',
  //   });
  //   this.historySearchChange(newParams);
  }

  historySearchChange = (pointParam) => { // 将参数映射入路径
    const { history } = this.props;
    const { pathname, search } = history.location;
    const newSearch = searchUtil(search).replace({ // 路径自动修改
      point: JSON.stringify(pointParam),
    }).stringify();
    history.push(`${pathname}?${newSearch}`);
  }

  render(){
    const { pointParam, pointTopData, stations } = this.props;
    const { stationCode, deviceTypeCode, dateType, date } = pointParam;
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
            topData={pointTopData}
            deviceTypeCode={deviceTypeCode}
            onStationChange={this.stationChanged}
            onTypeChange={this.deviceTypeChanged}
          />
        </div>
        {/* <DeviceRateChart {...this.props} /> */}
        {/* <DeviceTable {...this.props} /> */}
      </div>
    );
  }
}

export default PointsOverview;
