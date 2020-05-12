import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Radio, DatePicker, Spin } from 'antd';
import styles from './point.scss';
import CommonSearch from '../CommonSearch';
import PointsSearch from './PointsSearch';
import PointsList from './PointsList';
import searchUtil from '@utils/searchUtil';
const { MonthPicker } = DatePicker;

class PointsOverview extends PureComponent{
  static propTypes = {
    theme: PropTypes.string,
    history: PropTypes.object,
    pointRecord: PropTypes.object,
    autoDevice: PropTypes.bool, // 未手动选择电站名称, 设备类型时false, 手动选择需自动设置选中device
    pointsLoading: PropTypes.bool,
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

  componentDidMount(){ // 判断是否f5刷新 => 请求相关信息, (从设备数据质量页新开传输过来的逻辑以在device页面进行处理)
    const { pointParam } = this.props;
    const isRefresh = Object.keys(pointParam).length === 0; // 是否F5刷新
    if (isRefresh) {
      const { stationCode, deviceTypeCode, dateType, date, deviceFullcode } = this.getPointInfo();
      this.props.changeOverviewStore({ // 存储最新参数
        pointParam: { stationCode, deviceTypeCode, dateType, date, deviceFullcode },
      });
      this.props.getOverviewStation({ // 请求电站信息
        stationCode,
        pageKey: 'point',
      });
      this.queryDeviceAndPoints(stationCode, deviceTypeCode); // 继续请求设备，测点列表
    }
  }

  componentWillReceiveProps(nextProps){
    const { pointTopData, pointUnix, pointParam, deviceListUnix, pointsCheckedList, pointConnectedDevices, autoDevice } = nextProps;
    const { stationCode } = pointParam;
    const preUnix = this.props.pointUnix;
    const preDeviceUnix = this.props.deviceListUnix;
    if (pointUnix !== preUnix && autoDevice) { // 非F5而是手动修改获取电站topData, 需替换param, 请求设备与测点, 重置默认数据信息
      const { deviceTypes = [] } = pointTopData || {};
      const { deviceTypeCode = 101 } = deviceTypes.find(e => [101, 201, 206].includes(e.deviceTypeCode)) || {};
      this.queryDeviceAndPoints(stationCode, deviceTypeCode);
      autoDevice && this.props.changeOverviewStore({
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
    if (preDeviceUnix !== deviceListUnix && autoDevice) { // 得到设备列表, 且需默认设备
      const { deviceCode } = pointConnectedDevices[0] || {};
      const newParam = { // 写入路径, 存入store
        ...pointParam,
        deviceFullcode: deviceCode,
      };
      this.props.changeOverviewStore({
        pointParam: newParam,
      });
      this.historySearchChange(newParam);
      pointsCheckedList.length > 0 && this.props.getOverviewPoints({ // 此时已有选中测点, 请求测点详细数据
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
        stationCode, deviceTypeCode, devicePointTypes: ['YM', 'YC'],
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
    const { pointParam, pointsCheckedList, pointRecord } = this.props;
    const { value } = target;
    const { month, day } = pointRecord; // 切换模式时候，将对应格式的日期存入record以便读取。
    const { date } = pointParam; // 请求的时间参数
    let newDate;
    if(value === 1){ // 从月切换至按日: 若有记录, 使用记录的日, 若没有, 使用该月第一天
      newDate = day ? day : moment(date).format('YYYY-MM-DD');
    } else { // 从日切换至月: 若有记录，使用记录的月，若没有，使用当前日对应的月
      newDate = month ? month : moment(date).format('YYYY-MM');
    }
    // const date = moment().subtract(1, 'd').format(value === 2 ? 'YYYY-MM' : 'YYYY-MM-DD'); // 2按月, 1按日
    const newParams = { ...pointParam, dateType: value, date: newDate };
    this.props.changeOverviewStore({
      pointParam: newParams,
      pointsData: [], // 清空设备信息
      pointRecord: {
        ...pointRecord,
        [value === 1 ? 'month' : 'day']: date, // 将上次请求的参数存入记录
      },
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
      autoDevice: true,
    });
    this.props.getOverviewStation({
      stationCode,
      pageKey: 'point',
    });
  }

  deviceTypeChanged = (deviceTypeCode) => { // 设备类型切换 => 请求测点列表
    const { pointParam } = this.props;
    const newParam = { ...pointParam, deviceTypeCode };
    this.props.changeOverviewStore({
      pointParam: newParam,
      pointsData: [], // 清空设备信息
      pointsCheckedList: [],
      pointList: [],
      pointConnectedDevices: [],
      deviceAuto: true,
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

  disableFun = (type) => { // type: 'month' / 'date'
    return (cur) => {
      const { pointTopData } = this.props;
      const { dataStartTime } = pointTopData;
      return moment().isBefore(cur, type) || moment(dataStartTime).isAfter(cur, type);
    };
  }

  render(){
    const { pointParam, pointTopData, stations, theme, pointsLoading } = this.props;
    const { stationCode, deviceTypeCode, dateType, date } = pointParam;
    return(
      <div className={`${styles.point} ${styles[theme]}`}>
        <div className={styles.topSearch}>
          <div className={styles.dateCheck}>
            <span className={styles.checkText}>时间范围</span>
            <Radio.Group value={dateType} onChange={this.dateTypeCheck}>
              <Radio.Button value={2}>按月</Radio.Button>
              <Radio.Button value={1}>按日</Radio.Button>
            </Radio.Group>
            <span ref={(ref) => { this.datesRef = ref; }}>
              {dateType === 2 && <MonthPicker
                getCalendarContainer={() => this.datesRef}
                value={moment(date)}
                allowClear={false}
                onChange={this.monthCheck}
                disabledDate={this.disableFun('month')}
              />}
              {dateType === 1 && <DatePicker
                getCalendarContainer={() => this.datesRef}
                value={moment(date)}
                allowClear={false}
                onChange={this.dayCheck}
                disabledDate={this.disableFun('date')}
              />}
            </span>
          </div>
          <CommonSearch
            stations={stations}
            stationCode={stationCode}
            topData={pointTopData}
            deviceTypeCode={deviceTypeCode}
            onStationChange={this.stationChanged}
            onTypeChange={this.deviceTypeChanged}
            theme={theme}
          />
        </div>
        <div className={styles.pointsContent}>
          <PointsSearch
            {...this.props}
            deviceChanged={this.deviceChanged}
            pointsChanged={this.pointsChanged}
          />
          <Spin spinning={pointsLoading} size="large" delay={200}>
            <PointsList {...this.props} />
          </Spin>
        </div>
      </div>
    );
  }
}

export default PointsOverview;
