


import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import styles from './device.scss';
// import StationList from './StationList';
// import StationDates from './StationDates';
import CommonSearch from '../CommonSearch';
import searchUtil from '@utils/searchUtil';


class DeviceOverview extends PureComponent{
  static propTypes = {
    history: PropTypes.object,
    stations: PropTypes.array,
    deviceTopData: PropTypes.object,
    deviceUnix: PropTypes.number,
    deviceParam: PropTypes.object,
    changeOverviewStore: PropTypes.func,
    getOverviewStation: PropTypes.func,
    // getOverviewDates: PropTypes.func,
    getPoints: PropTypes.func,
  }

  componentDidMount(){
    const { deviceParam } = this.props;
    const paramCode = deviceParam.stationCode;
    const paramTypeCode = deviceParam.deviceTypeCode;
    const paramDate = deviceParam.date;
    const { stationCode, deviceTypeCode, dateType, date } = this.getDeviceInfo();
    const paramChange = paramCode !== stationCode || paramTypeCode !== deviceTypeCode || paramDate !== date; // F5或带参数跳转
    // deviceParam: {}, // stationCode, deviceTypeCode, dateType(1日2月), date, pointCodes => search-device是该字段的jsonStr
    if (stationCode && paramChange) { // 路径有新参数, 与之前不同 => F5或电站页带路径跳转
      this.props.changeOverviewStore({ // 存储最新参数
        deviceParam: { stationCode, deviceTypeCode, dateType, date },
      });
      this.props.getPoints({ // 请求测点列表 
        params: {
          stationCode, deviceTypeCode, require: 'yc,ym',
        },
        actionName: 'afterDeviceTypePointGet',
        resultName: 'devicePointsList',
      });
    }
  }

  componentWillReceiveProps(nextProps){
    const { deviceTopData, deviceUnix, deviceParam, history } = nextProps;
    const preUnix = this.props.deviceUnix;
    if (deviceUnix !== preUnix) { // deviceTopData改变
      const { stationCode } = deviceParam;
      const { deviceTypes = [] } = deviceTopData || {};
      const { deviceTypeCode = 101 } = deviceTypes.find(e => [101, 201, 206].includes(e.deviceTypeCode)) || {};
      this.props.getPoints({ // 请求测点列表 
        params: {
          stationCode, deviceTypeCode, require: 'yc,ym',
        },
        actionName: 'afterDeviceTypePointGet',
        resultName: 'devicePointsList',
      });
      const queryParam = {
        ...deviceParam,
        deviceTypeCode,
      };
      this.props.changeOverviewStore({ deviceParam: queryParam }); // 并将请求数据存入reducer
      const { pathname, search } = history.location;
      const newSearch = searchUtil(search).replace({ // 路径自动修改
        device: JSON.stringify(queryParam),
      }).stringify();
      history.push(`${pathname}?${newSearch}`);
    }
  }

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

  deviceTypeChanged = (deviceTypeCode) => { // 设备类型切换
    console.log(deviceTypeCode)
    // const { stationParam } = this.props;
    // const queryParam = {
    //   ...stationParam,
    //   deviceTypeCode,
    // };
    // this.props.changeOverviewStore({
    //   stationParam: { ...queryParam },
    //   stationDatesRate: [], // 清空日期数据
    // });
    // this.props.getOverviewDates({ ...queryParam });
  }

  render(){
    const { deviceParam, deviceTopData, stations } = this.props;
    const { stationCode, deviceTypeCode } = deviceParam;
    return(
      <div className={styles.device}>
        <div>
          <CommonSearch
            stations={stations}
            stationCode={stationCode}
            topData={deviceTopData}
            deviceTypeCode={deviceTypeCode}
            onStationChange={this.stationChanged}
            onTypeChange={this.deviceTypeChanged}
          />
        </div>
      </div>
    );
  }
}

export default DeviceOverview;
