import React, { Component } from 'react';
import WeatherStationHeader from './WeatherStationHeader';
import WeatherStationStatistics from './WeatherStationStatistics';
import DeviceAlarmTable from '../DeviceMonitorCommon/DeviceAlarmTable';
import CommonBreadcrumb from '../../../../Common/CommonBreadcrumb';
import PropTypes from 'prop-types';
import styles from '../eachDeviceMonitor.scss';

class Weatherstation extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    match: PropTypes.object,
    getMonitorDeviceData: PropTypes.func,
    deviceDetail: PropTypes.object,
    deviceAlarmList: PropTypes.array,
    singleStationData: PropTypes.object,
    resetDeviceStore: PropTypes.func,
  }

  componentDidMount(){
    const { deviceCode, deviceTypeCode, stationCode } = this.props.match.params;
    this.getData(stationCode, deviceCode, deviceTypeCode);
  }

  componentWillReceiveProps(nextProps){
    const { deviceCode } = this.props.match.params;
    const nextParams = nextProps.match.params;
    const nextDevice = nextParams.deviceCode;
    const nextType = nextParams.deviceTypeCode;
    const nextStation = nextParams.stationCode;
    if( nextDevice !== deviceCode && nextType === '203' ){
      clearTimeout(this.timeOutId);
      this.getData(nextStation, nextDevice, nextType);
    }
  }

  componentWillUnmount(){
    clearTimeout(this.timeOutId);
    this.props.resetDeviceStore();
  }

  getData = (stationCode, deviceCode, deviceTypeCode) => {
    const params = {
      stationCode,
      deviceCode,
      deviceTypeCode,
    };
    this.props.getMonitorDeviceData(params);
    this.timeOutId = setTimeout(() => {
      this.props.getMonitorDeviceData(params);
      this.getData(stationCode, deviceCode, deviceTypeCode);
    },10000)
  }

  render(){
    const { deviceDetail, deviceAlarmList, loading, singleStationData } = this.props;
    const { stationCode,deviceCode,deviceTypeCode } = this.props.match.params;
    const backData={path: `/monitor/singleStation/${stationCode}`,name: '返回电站'};
    const breadCrumbData = {
      breadData:[{
        link: true,
        name: singleStationData.stationName || '',
        path: `/monitor/singleStation/${stationCode}`,
      },{
        name: '气象站',
      }],
      iconName: 'iconfont icon-weather'
    };
    return (
      <div className={styles.weatherstation}>
        <CommonBreadcrumb {...breadCrumbData} style={{backgroundColor:'#fff'}}  backData={{...backData}} />
        <div className={styles.deviceContent}>
          <WeatherStationHeader deviceDetail={deviceDetail} />
          <WeatherStationStatistics deviceDetail={deviceDetail} />
          <DeviceAlarmTable deviceAlarmList={deviceAlarmList} deviceDetail={deviceDetail} loading={loading}stationCode={stationCode} deviceTypeCode={deviceTypeCode} deviceCode={deviceCode} />
        </div>
      </div>
    )
  }
}

export default Weatherstation;

