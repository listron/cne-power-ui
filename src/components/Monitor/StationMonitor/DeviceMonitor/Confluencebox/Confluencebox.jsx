import React, { Component } from 'react';
import { Button } from 'antd';
// import DeviceMonitorStatistics from '../DeviceMonitorCommon/DeviceMonitorStatistics';
// import InverterTenMin from './InverterTenMin';
import DeviceAlarmTable from '../DeviceMonitorCommon/DeviceAlarmTable';
import DevicePointsData from '../DeviceMonitorCommon/DevicePointsData';
// import DeviceMonitorHeader from '../DeviceMonitorCommon/DeviceMonitorHeader';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

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
        {/* <DeviceMonitorHeader deviceDetail={deviceDetail} devices={devices} stationCode={stationCode} deviceTypeCode={deviceTypeCode} /> */}
        {/* <DeviceMonitorStatistics deviceDetail={deviceDetail} /> */}
        {/* <InverterTenMin deviceTenMin={deviceTenMin} loading={loading} /> */}
        <DeviceAlarmTable deviceAlarmList={deviceAlarmList} loading={loading} />
        <DevicePointsData devicePointData={devicePointData}  deviceDetail={deviceDetail} />
        <h1>汇流箱汇流，嘎嘎嘎嘎嘎</h1>
        <Button>
          <Link to="/hidden/monitorDevice/73/203/112233445566">汇流箱汇流，嘎嘎嘎嘎嘎去气象站</Link>
        </Button>
        <Button>
          <Link to="/hidden/monitorDevice/73/206/112233445566">汇流箱汇流，嘎嘎嘎嘎嘎去组串逆变器</Link>
        </Button>
        <Button>
          <Link to="/hidden/monitorDevice/73/304/112233445566">汇流箱汇流，嘎嘎嘎嘎嘎去箱变</Link>
        </Button>
      </div>
    ) 
  }
}

export default Confluencebox;

