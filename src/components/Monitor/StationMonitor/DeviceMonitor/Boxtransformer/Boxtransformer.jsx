import React, { Component } from 'react';
import BoxtransformerHeader from './BoxtransformerHeader';
import SubInverter from './SubInverter';
import BoxtransformerTenMin from './BoxtransformerTenMin';
import DeviceAlarmTable from '../DeviceMonitorCommon/DeviceAlarmTable';
import DevicePointsTable from '../DeviceMonitorCommon/DevicePointsTable';
import CommonBreadcrumb from '../../../../Common/CommonBreadcrumb';
import PropTypes from 'prop-types';
import styles from '../eachDeviceMonitor.scss';

class Boxtransformer extends Component {
  static propTypes = {
    match: PropTypes.object,
    deviceEvents: PropTypes.array,
    devices: PropTypes.array,
    deviceDetail: PropTypes.object,
    deviceTenMin: PropTypes.array,
    subDeviceList: PropTypes.array,
    deviceAlarmList: PropTypes.array,
    devicePointData: PropTypes.array,
    tenMinUnix: PropTypes.number,
    tenMinChartLoading: PropTypes.bool,
    getDeviceInfoMonitor: PropTypes.func,
    getDeviceChartMonitor: PropTypes.func,
    resetDeviceStore: PropTypes.func,
    stopMonitor: PropTypes.func,
  }

  componentDidMount(){
    const { deviceCode, deviceTypeCode, stationCode } = this.props.match.params;
    const params = {
      stationCode,
      deviceCode,
      deviceTypeCode,
      timeParam: '72',
    };
    this.props.getDeviceInfoMonitor({ deviceCode, deviceTypeCode });
    this.props.getDeviceChartMonitor(params);
  }

  componentWillReceiveProps(nextProps){
    const { deviceCode } = this.props.match.params;
    const nextParams = nextProps.match.params;
    const nextDevice = nextParams.deviceCode;
    const nextType = nextParams.deviceTypeCode;
    const nextStation = nextParams.stationCode;
    if( nextDevice !== deviceCode ){
      const params = {
        stationCode: nextStation,
        deviceCode: nextDevice,
        deviceTypeCode: nextType,
        timeParam: '72',
      };
      this.props.stopMonitor(); // 停止之前的定时器。
      this.props.getDeviceInfoMonitor({ deviceCode, deviceTypeCode: nextType, });
      this.props.getDeviceChartMonitor(params);
    }
  }

  componentWillUnmount(){
    this.props.stopMonitor(); // 停止之前的定时器。
    this.props.resetDeviceStore();
  }

  render(){
    const {
      devices, deviceDetail, deviceTenMin, deviceAlarmList, devicePointData, tenMinUnix, tenMinChartLoading, deviceEvents, subDeviceList
    } = this.props;
    const { stationCode, deviceTypeCode,deviceCode } = this.props.match.params;
    const backData={path: `/monitor/singleStation/${stationCode}`,name: '返回电站'};
    const breadCrumbData = {
      breadData:[{
        link: true,
        name: deviceDetail && deviceDetail.stationName || '',
        path: `/monitor/singleStation/${stationCode}`,
      },{
        name: '箱变',
      }],
      iconName: 'iconfont icon-xb'
    };
    return (
      <div className={styles.boxtransformer}>
        <CommonBreadcrumb {...breadCrumbData} style={{backgroundColor:'#fff'}}  backData={{...backData}} />
        <div className={styles.deviceContent}>
          <BoxtransformerHeader deviceDetail={deviceDetail} devices={devices} stationCode={stationCode} deviceTypeCode={deviceTypeCode} />
          {/* <BoxtransformerStatistics deviceDetail={deviceDetail} /> */}
          <BoxtransformerTenMin
            deviceTenMin={deviceTenMin}
            tenMinUnix={tenMinUnix}
            tenMinChartLoading={tenMinChartLoading}
          />
          <DevicePointsTable deviceEvents={deviceEvents} devicePointData={devicePointData} />
          <DeviceAlarmTable deviceAlarmList={deviceAlarmList} deviceDetail={deviceDetail} stationCode={stationCode} deviceTypeCode={deviceTypeCode} deviceCode={deviceCode} />
          {/* <DevicePointsData devicePointData={devicePointData}  deviceDetail={deviceDetail} /> */}
          <SubInverter subDeviceList={subDeviceList} deviceDetail={deviceDetail} />
        </div>
      </div>
    ) 
  }
}

export default Boxtransformer;

