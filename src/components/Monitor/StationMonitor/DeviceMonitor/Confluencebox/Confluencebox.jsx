import React, { Component } from 'react';
import ConfluenceStatistics from './ConfluenceStatistics';
import ConfluenceTenMin from './ConfluenceTenMin';
import DeviceAlarmTable from '../DeviceMonitorCommon/DeviceAlarmTable';
import DevicePointsData from '../DeviceMonitorCommon/DevicePointsData';
import ConfluenceHeader from './ConfluenceHeader';
import CommonBreadcrumb from '../../../../Common/CommonBreadcrumb';
import PropTypes from 'prop-types';
import styles from '../eachDeviceMonitor.scss';

class Confluencebox extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    match: PropTypes.object,
    getMonitorDeviceData: PropTypes.func,
    devices: PropTypes.array,
    deviceDetail: PropTypes.object,
    deviceTenMin: PropTypes.array,
    deviceAlarmList: PropTypes.array,
    devicePointData: PropTypes.array,
  }

  componentDidMount(){
    const { deviceCode, deviceTypeCode, stationCode } = this.props.match.params;
    this.getData(stationCode, deviceCode, deviceTypeCode);
  }

  componentWillReceiveProps(nextProps){
    const { deviceCode, deviceTypeCode, stationCode } = this.props.match.params;
    const nextParams = nextProps.match.params;
    const nextDevice = nextParams.deviceCode;
    const nextType = nextParams.deviceTypeCode;
    const nextStation = nextParams.stationCode;
    if( nextDevice !== deviceCode || nextType !== deviceTypeCode || nextStation !== stationCode ){
      clearTimeout(this.timeOutId);
      this.getData(stationCode, deviceCode, deviceTypeCode);
    }
  }

  componentWillUnmount(){
    clearTimeout(this.timeOutId)
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
    const {devices, deviceDetail, deviceTenMin, deviceAlarmList, devicePointData, loading } = this.props;
    const { stationCode, deviceTypeCode } = this.props.match.params;
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
        <CommonBreadcrumb {...breadCrumbData} />
        <div className={styles.deviceContent}>
          <ConfluenceHeader deviceDetail={deviceDetail} devices={devices} stationCode={stationCode} deviceTypeCode={deviceTypeCode} />
          <ConfluenceStatistics deviceDetail={deviceDetail} />
          <ConfluenceTenMin deviceTenMin={deviceTenMin} loading={loading} />
          <DeviceAlarmTable deviceAlarmList={deviceAlarmList} loading={loading} deviceDetail={deviceDetail} />
          <DevicePointsData devicePointData={devicePointData}  deviceDetail={deviceDetail} />
        </div>
      </div>
    ) 
  }
}

export default Confluencebox;

