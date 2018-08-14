import React, { Component } from 'react';
import { Button } from 'antd';
import DeviceMonitorStatistics from '../DeviceMonitorCommon/DeviceMonitorStatistics';
import InverterTenMin from './InverterTenMin';
import DeviceAlarmTable from '../DeviceMonitorCommon/DeviceAlarmTable';
import DevicePointsData from '../DeviceMonitorCommon/DevicePointsData';
import DeviceMonitorHeader from '../DeviceMonitorCommon/DeviceMonitorHeader';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import styles from './seriesinverter.scss';
import moment from 'moment';

class Seriesinverter extends Component {
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
    this.props.getMonitorDeviceData({
      stationCode,
      deviceCode,
      deviceTypeCode
    })
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
    return (
      <div className={styles.seriesinverter}>
        <DeviceMonitorHeader deviceDetail={deviceDetail} devices={devices} stationCode={stationCode} deviceTypeCode={deviceTypeCode} />
        <DeviceMonitorStatistics deviceDetail={deviceDetail} />
        <InverterTenMin deviceTenMin={deviceTenMin} loading={loading} />
        <DeviceAlarmTable deviceAlarmList={deviceAlarmList} loading={loading} />
        <DevicePointsData devicePointData={devicePointData}  deviceDetail={deviceDetail} />
        <Button>
          <Link to="/hidden/monitorDevice/73/203/112233445566">走我们从逆变器去气象站</Link>
        </Button>
        <Button>
          <Link to="/hidden/monitorDevice/73/202/112233445566">走我们从逆变器去汇流箱</Link>
        </Button>
        <Button>
          <Link to="/hidden/monitorDevice/73/304/112233445566">走我们从逆变器去箱变</Link>
        </Button>
      </div>
    ) 
  }
}

export default Seriesinverter;

