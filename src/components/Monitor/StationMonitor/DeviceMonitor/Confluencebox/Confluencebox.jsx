import React, { Component } from 'react';
import { Button } from 'antd';
// import DeviceMonitorStatistics from '../DeviceMonitorCommon/DeviceMonitorStatistics';
// import InverterTenMin from './InverterTenMin';
// import DeviceAlarmTable from '../DeviceMonitorCommon/DeviceAlarmTable';
// import DevicePointsData from '../DeviceMonitorCommon/DevicePointsData';
import ConfluenceHeader from './ConfluenceHeader';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import styles from '../eachDeviceMonitor.scss';

class Confluencebox extends Component {
  static propTypes = {
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
    // this.timeOutId = setTimeout(() => {
    //   this.props.getMonitorDeviceData(params);
    //   this.getData(stationCode, deviceCode, deviceTypeCode);
    // },10000)
  }

  render(){
    const {devices, deviceDetail, deviceTenMin, deviceAlarmList, devicePointData, loading } = this.props;
    const { stationCode, deviceTypeCode } = this.props.match.params;
    return (
      <div>
        <ConfluenceHeader deviceDetail={deviceDetail} devices={devices} stationCode={stationCode} deviceTypeCode={deviceTypeCode} />
        {/* <DeviceMonitorStatistics deviceDetail={deviceDetail} /> */}
        {/* <InverterTenMin deviceTenMin={deviceTenMin} loading={loading} /> */}
        {/* <DeviceAlarmTable deviceAlarmList={deviceAlarmList} loading={loading} /> */}
        {/* <DevicePointsData devicePointData={devicePointData}  deviceDetail={deviceDetail} /> */}
      </div>
    ) 
  }
}

export default Confluencebox;

