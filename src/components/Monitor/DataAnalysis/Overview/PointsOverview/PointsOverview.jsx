import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Radio, DatePicker } from 'antd';
import styles from './point.scss';
import CommonSearch from '../CommonSearch';
import PointsSearch from './PointsSearch';
import PointsList from './PointsList';
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
        pointParam: { stationCode, deviceTypeCode, dateType, date, deviceFullcode },
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
        actionName: 'afterPointPagePointsGet',
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
      actionName: 'afterPointPagePointsGet',
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

  dateTypeCheck = ({ target }) => { // 日期模式改变 => 按照默认时间 + 日期类型进行选中
    const { pointParam, pointsCheckedList } = this.props;
    const { value } = target;
    const date = moment().subtract(1, 'd').format(value === 2 ? 'YYYY-MM' : 'YYYY-MM-DD'); // 2按月, 1按日
    const newParams = { ...pointParam, dateType: value, date };
    this.props.changeOverviewStore({
      pointParam: newParams,
      pointsData: [], // 清空设备信息
    });
    this.props.getOverviewPoints({
      ...newParams,
      pointCodes: pointsCheckedList,
    }); // 请求测点数据
    this.historySearchChange(newParams);
  }

  monthCheck = (month, monthStr) => this.datesChange(monthStr); // 换月

  dayCheck = (day, dayStr) => this.datesChange(dayStr); // 换日

  datesChange = (date) => { // 日期改变
    const { pointParam, pointsCheckedList } = this.props;
    const newParams = { ...pointParam, date };
    this.props.changeOverviewStore({
      pointParam: newParams,
      pointsData: [], // 清空测点信息
    });
    this.props.getOverviewPoints({
      ...newParams,
      pointCodes: pointsCheckedList,
    }); // 请求测点数据
    this.historySearchChange(newParams);
  }

  stationChanged = ({ stationCode }) => { // 电站切换 => 请求电站信息
    const { deviceAuto } = this.state;
    !deviceAuto && this.setState({ deviceAuto: true });
    const { pointParam } = this.props;
    const newParam = {
      ...pointParam,
      stationCode,
      deviceTypeCode: null, // 取消设备类型选择
    };
    this.props.changeOverviewStore({
      pointParam: newParam,
      pointsData: [], // 清空设备信息
      pointsCheckedList: [],
      pointList: [],
      pointConnectedDevices: [],
    });
    this.props.getOverviewStation({
      stationCode,
      pageKey: 'point',
    });
  }

  deviceTypeChanged = (deviceTypeCode) => { // 设备类型切换 => 请求测点列表
    const { deviceAuto } = this.state;
    !deviceAuto && this.setState({ deviceAuto: true });
    const { pointParam } = this.props;
    const newParam = { ...pointParam, deviceTypeCode };
    this.props.changeOverviewStore({
      pointParam: newParam,
      pointsData: [], // 清空设备信息
      pointsCheckedList: [],
      pointList: [],
      pointConnectedDevices: [],
    });
    this.queryDeviceAndPoints(pointParam.stationCode, deviceTypeCode);
  }

  deviceChanged = (deviceFullcode) => { // 设备选择
    const { pointParam, pointsCheckedList } = this.props;
    const newParams = { ...pointParam, deviceFullcode };
    this.props.changeOverviewStore({ pointParam: newParams });
    this.props.getOverviewPoints({
      ...newParams,
      pointCodes: pointsCheckedList,
    }); // 请求测点数据
    this.historySearchChange(newParams);
  }

  pointsChanged = (pointCodes) => { // 测点选择
    const { pointParam } = this.props;
    this.props.changeOverviewStore({ pointsCheckedList: pointCodes });
    this.props.getOverviewPoints({
      ...pointParam,
      pointCodes,
    });
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
        <PointsSearch
          {...this.props}
          deviceChanged={this.deviceChanged}
          pointsChanged={this.pointsChanged}
        />
        <PointsList {...this.props} />
      </div>
    );
  }
}

export default PointsOverview;
