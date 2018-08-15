import React, { Component } from 'react';
// import InverterHeader from './InverterHeader';
// import InverterStatistics from './InverterStatistics';
import DeviceAlarmTable from '../DeviceMonitorCommon/DeviceAlarmTable';
import PropTypes from 'prop-types';
import styles from '../eachDeviceMonitor.scss';

class Weatherstation extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    match: PropTypes.object,
    getMonitorDeviceData: PropTypes.func,
    deviceDetail: PropTypes.object,
    deviceAlarmList: PropTypes.array,
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
    const {devices, deviceDetail, deviceAlarmList, loading } = this.props;
    const { stationCode, deviceTypeCode } = this.props.match.params;
    return (
      <div className={styles.seriesinverter}>
        {/* <InverterHeader deviceDetail={deviceDetail} devices={devices} stationCode={stationCode} deviceTypeCode={deviceTypeCode} /> */}
        {/* <InverterStatistics deviceDetail={deviceDetail} /> */}
        <DeviceAlarmTable deviceAlarmList={deviceAlarmList} deviceDetail={deviceDetail} loading={loading} />
      </div>
    )
  }
}

export default Weatherstation;

