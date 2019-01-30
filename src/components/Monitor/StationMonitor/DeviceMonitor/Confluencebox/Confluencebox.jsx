import React, { Component } from 'react';
import ConfluenceStatistics from './ConfluenceStatistics';
import ConfluenceTenMin from './ConfluenceTenMin';
import DeviceAlarmTable from '../DeviceMonitorCommon/DeviceAlarmTable';
import DevicePointsData from '../DeviceMonitorCommon/DevicePointsData';
import ConfluenceHeader from './ConfluenceHeader';
import CommonBreadcrumb from '../../../../Common/CommonBreadcrumb';
import PropTypes from 'prop-types';
import styles from '../eachDeviceMonitor.scss';
import moment from 'moment';

class Confluencebox extends Component {
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
    resetDeviceStore: PropTypes.func,
  }

  componentDidMount(){
    const { deviceCode, deviceTypeCode, stationCode } = this.props.match.params;
    const startTime = moment().utc().subtract(72,'hours').format();
    const endTime = moment().utc().format();
    const params = {
      stationCode,
      deviceCode,
      deviceTypeCode,
      timeParam: `${startTime}/${endTime}`,
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
    if( nextDevice !== deviceCode && (nextType === '202' || nextType === '207') ){
      clearTimeout(this.timeOutId);
      clearTimeout(this.timeOutTenMin);
      const startTime = moment().subtract(72,'hours').utc().format();
      const endTime = moment().utc().format();
      const params = {
        stationCode: nextStation,
        deviceCode: nextDevice,
        deviceTypeCode: nextType,
        timeParam: `${startTime}/${endTime}`,
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
    },10000)
  }

  getTenMinData = (stationCode, deviceCode, deviceTypeCode) => {
    const startTime = moment().utc().format();
    const endTime = moment().subtract(72,'hours').utc().format();
    const params = {
      stationCode,
      deviceCode,
      deviceTypeCode,
      timeParam: `${startTime}/${endTime}`,
    };
    this.timeOutTenMin = setTimeout(() => {
      this.props.getTenMinDeviceData(params);
      this.getData(stationCode, deviceCode, deviceTypeCode);
    },600000)
  }

  render(){
    const {devices, deviceDetail, deviceTenMin, deviceAlarmList, devicePointData, loading } = this.props;
    const { stationCode, deviceTypeCode,deviceCode } = this.props.match.params;
    const backData={path: `/monitor/singleStation/${stationCode}`,name: '返回电站'};
    const breadCrumbData = {
      breadData:[{
        link: true,
        name: deviceDetail.stationName || '',
        path: `/monitor/singleStation/${stationCode}`,
      },{
        name: '汇流箱',
      }],
      iconName: 'iconfont icon-hl'
    };
    return (
      <div className={styles.confluencebox}>
        <CommonBreadcrumb {...breadCrumbData} style={{backgroundColor:'#fff'}}  backData={{...backData}} />
        <div className={styles.deviceContent}>
          <ConfluenceHeader deviceDetail={deviceDetail} devices={devices} stationCode={stationCode} deviceTypeCode={deviceTypeCode} />
          <ConfluenceStatistics deviceDetail={deviceDetail} />
          <ConfluenceTenMin deviceTenMin={deviceTenMin} loading={loading} />
          <DeviceAlarmTable deviceAlarmList={deviceAlarmList} loading={loading} deviceDetail={deviceDetail} stationCode={stationCode} deviceTypeCode={deviceTypeCode} deviceCode={deviceCode} />
          <DevicePointsData devicePointData={devicePointData}  deviceDetail={deviceDetail} />
        </div>
      </div>
    ) 
  }
}

export default Confluencebox;

