


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
    devicePointsList: PropTypes.array,
    deviceTopData: PropTypes.object,
    // stationUnix: PropTypes.number,
    deviceParam: PropTypes.object,
    changeOverviewStore: PropTypes.func,
    // getOverviewStation: PropTypes.func,
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
    // if (stationCode && deviceTypeCode && stationDatesRate.length === 0) { 
    //   const stationParam = { stationCode, deviceTypeCode, month };
    //   this.props.changeOverviewStore({ stationParam });
    //   this.props.getOverviewStation({ // 电站信息;
    //     stationCode,
    //     pageKey: 'station',
    //   });
    //   this.props.getOverviewDates(stationParam);
    // }
  }

  componentWillReceiveProps(nextProps){
    // const { stationTopData, stationUnix, stationParam, history } = nextProps;
    // const preStationUnix = this.props.stationUnix;
    // if (stationUnix !== preStationUnix) { // 得到最新得stationTopData
    //   const { deviceTypes = [] } = stationTopData || {};
    //   const { deviceTypeCode = 101 } = deviceTypes.find(e => [101, 201, 206].includes(e.deviceTypeCode)) || {};
    //   const queryParam = {
    //     stationCode: stationParam.stationCode,
    //     deviceTypeCode, // 按默认设备类型进自动填入进行数据请求,
    //     month: stationParam.month || moment().subtract(1, 'day').format('YYYY-MM'), // 默认昨天所属月
    //   };
    //   const { pathname, search } = history.location;
    //   const newSearch = searchUtil(search).replace({
    //     station: JSON.stringify(queryParam),
    //   }).stringify();
    //   history.push(`${pathname}?${newSearch}`); // 替换station信息
    //   this.props.changeOverviewStore({ stationParam: queryParam }); // 并将请求数据存入reducer
    //   this.props.getOverviewDates(queryParam);
    // }
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
    console.log(stationCode);
    // const { stationParam } = this.props;
    // const newStationParam = {
    //   ...stationParam,
    //   stationCode,
    //   deviceTypeCode: null, // 取消设备类型选择
    // };
    // this.props.changeOverviewStore({
    //   stationParam: newStationParam,
    //   stationDatesRate: [], // 清空日期数据
    // });
    // this.props.getOverviewStation({
    //   stationCode,
    //   pageKey: 'station',
    // });
  }

  deviceTypeChanged = (deviceTypeCode) => { // 设备类型切换
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
        {
          stationCode && <div>
            
            <StationDates {...this.props} />
          </div>
        }
      </div>
    );
  }
}

export default DeviceOverview;
