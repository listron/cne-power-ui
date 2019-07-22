import React, { Component } from 'react';
import InverterStatistics from './InverterStatistics';
import InverterTenMin from './InverterTenMin';
import DeviceAlarmTable from '../DeviceMonitorCommon/DeviceAlarmTable';
import DevicePointsData from '../DeviceMonitorCommon/DevicePointsData';
import InverterHeader from './InverterHeader';
import CommonBreadcrumb from '../../../../Common/CommonBreadcrumb';
import PropTypes from 'prop-types';
import styles from '../eachDeviceMonitor.scss';

class Seriesinverter extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    match: PropTypes.object,
    getMonitorDeviceData: PropTypes.func,
    getTenMinDeviceData: PropTypes.func,
    devices: PropTypes.array,
    deviceDetail: PropTypes.object,
    deviceTenMin: PropTypes.array,
    deviceAlarmList: PropTypes.array,
    devicePointData: PropTypes.array,
    singleStationData: PropTypes.object,
    resetDeviceStore: PropTypes.func,
  }

  componentDidMount(){
    const { deviceCode, deviceTypeCode, stationCode } = this.props.match.params;
    const params = {
      stationCode,
      deviceCode,
      deviceTypeCode,
      timeParam: '72',
    };
    this.props.getMonitorDeviceData(params);
    this.props.getTenMinDeviceData(params);
    this.getData(stationCode, deviceCode, deviceTypeCode);
    this.getTenMinData(stationCode, deviceCode, deviceTypeCode);
  }

  componentWillReceiveProps(nextProps){
    const { deviceCode } = this.props.match.params;
    const nextParams = nextProps.match.params;
    const nextDevice = nextParams.deviceCode;
    const nextType = nextParams.deviceTypeCode;
    const nextStation = nextParams.stationCode;
    if( nextDevice !== deviceCode && (nextType === '201' || nextType === '206') ){
      clearTimeout(this.timeOutId);
      clearTimeout(this.timeOutTenMin);
      const params = {
        stationCode: nextStation,
        deviceCode: nextDevice,
        deviceTypeCode: nextType,
        timeParam: '72',
      };
      this.props.getMonitorDeviceData(params);
      this.props.getTenMinDeviceData(params);
      this.getData(nextStation, nextDevice, nextType);
      this.getTenMinData(nextStation, nextDevice, nextType);
    }
  }

  componentWillUnmount(){
    clearTimeout(this.timeOutId);
    clearTimeout(this.timeOutTenMin);
    this.props.resetDeviceStore();
  }

  getData = (stationCode, deviceCode, deviceTypeCode) => {
    const params = {
      stationCode,
      deviceCode,
      deviceTypeCode,
    };
    this.timeOutId = setTimeout(() => {
      this.props.getMonitorDeviceData(params);
      this.getData(stationCode, deviceCode, deviceTypeCode);
    }, 10000);
  }

  getTenMinData = (stationCode, deviceCode, deviceTypeCode) => {
    const params = {
      stationCode,
      deviceCode,
      deviceTypeCode,
      timeParam: '72',
    };
    this.timeOutTenMin = setTimeout(() => {
      this.props.getTenMinDeviceData(params);
      this.getData(stationCode, deviceCode, deviceTypeCode);
    }, 600000);
  }

  render(){
    const {devices, deviceDetail, deviceTenMin, deviceAlarmList, devicePointData, loading, singleStationData } = this.props;
    const { stationCode, deviceTypeCode, deviceCode } = this.props.match.params;
    //console.log(this.props.match.params);
    const backData={path: `/monitor/singleStation/${stationCode}`, name: '返回电站'};
    const breadCrumbData = {
      breadData: [{
        link: true,
        name: singleStationData && singleStationData.stationName || '',
        path: `/monitor/singleStation/${stationCode}`,
      }, {
        name: deviceTypeCode==='201'?'集中式逆变器': '组串式逆变器',
      }],
      iconName: 'iconfont icon-nb',
    };
    return (
      <div className={styles.seriesinverter}>
        <CommonBreadcrumb {...breadCrumbData} style={{backgroundColor: '#fff'}} backData={{...backData}} />
        <div className={styles.deviceContent}>
          <InverterHeader deviceDetail={deviceDetail} devices={devices} stationCode={stationCode} deviceTypeCode={deviceTypeCode} />
          <InverterStatistics deviceDetail={deviceDetail} />
          <InverterTenMin deviceTenMin={deviceTenMin} loading={loading} />
          <DeviceAlarmTable deviceAlarmList={deviceAlarmList} loading={loading} deviceDetail={deviceDetail} stationCode={stationCode} deviceTypeCode={deviceTypeCode} deviceCode={deviceCode} {...this.props} />
          <DevicePointsData devicePointData={devicePointData} deviceDetail={deviceDetail} />
        </div>
      </div>
    );
  }
}

export default Seriesinverter;

