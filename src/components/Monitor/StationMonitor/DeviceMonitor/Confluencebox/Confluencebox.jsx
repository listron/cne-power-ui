import React, { Component } from 'react';
import ConfluenceStatistics from './ConfluenceStatistics';
import ConfluenceTenMin from './ConfluenceTenMin';
import DeviceAlarmTable from '../DeviceMonitorCommon/DeviceAlarmTable';
import DevicePointsTable from '../DeviceMonitorCommon/DevicePointsTable';
import ConfluenceHeader from './ConfluenceHeader';
import CommonBreadcrumb from '../../../../Common/CommonBreadcrumb';
import PropTypes from 'prop-types';
import styles from '../eachDeviceMonitor.scss';
import moment from 'moment';

class Confluencebox extends Component {
  static propTypes = {
    match: PropTypes.object,
    devices: PropTypes.array,
    deviceDetail: PropTypes.object,
    subDeviceList: PropTypes.array,
    devicePointData: PropTypes.array,
    deviceEvents: PropTypes.array,
    tenMinChartLoading: PropTypes.bool,
    tenMinUnix: PropTypes.number,
    deviceTenMin: PropTypes.array,
    deviceAlarmList: PropTypes.array,
    resetDeviceStore: PropTypes.func,
    getDeviceInfoMonitor: PropTypes.func,
    getDeviceChartMonitor: PropTypes.func,
    stopMonitor: PropTypes.func,
  }

  componentDidMount() {
    const { deviceCode, deviceTypeCode, stationCode } = this.props.match.params;
    const startTime = moment().utc().subtract(72,'hours').format();
    const endTime = moment().utc().format();
    const params = {
      stationCode,
      deviceCode,
      deviceTypeCode,
      timeParam: `${startTime}/${endTime}`,
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
      const startTime = moment().subtract(72,'hours').utc().format();
      const endTime = moment().utc().format();
      const params = {
        stationCode: nextStation,
        deviceCode: nextDevice,
        deviceTypeCode: nextType,
        timeParam: `${startTime}/${endTime}`,
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
      match, deviceDetail, devices, deviceTenMin, tenMinUnix, tenMinChartLoading, subDeviceList, devicePointData, deviceEvents, deviceAlarmList
    } = this.props;
    const { stationCode, deviceTypeCode, deviceCode } = match.params;
    const backData={path: `/monitor/singleStation/${stationCode}`,name: '返回电站'};
    const breadCrumbData = {
      breadData:[{
        link: true,
        name: deviceDetail.stationName || '',
        path: `/monitor/singleStation/${stationCode}`,
      }, {
        name: '汇流箱',
      }],
      iconName: 'iconfont icon-hl'
    };
    return (
      <div className={styles.confluencebox}>
        <CommonBreadcrumb {...breadCrumbData} style={{backgroundColor:'#fff'}}  backData={{...backData}} />
        <div className={styles.deviceContent}>
          <ConfluenceHeader
            deviceDetail={deviceDetail}
            devices={devices}
            stationCode={stationCode}
            deviceTypeCode={deviceTypeCode}
          />
          <ConfluenceStatistics deviceDetail={deviceDetail} subDeviceList={subDeviceList} />
          <ConfluenceTenMin
            deviceTenMin={deviceTenMin}
            tenMinUnix={tenMinUnix}
            tenMinChartLoading={tenMinChartLoading}
          />
          <DevicePointsTable deviceEvents={deviceEvents} devicePointData={devicePointData} />
          <DeviceAlarmTable
            deviceAlarmList={deviceAlarmList}
            deviceDetail={deviceDetail}
            stationCode={stationCode}
            deviceTypeCode={deviceTypeCode}
            deviceCode={deviceCode}
          />
        </div>
      </div>
    ) 
  }
}

export default Confluencebox;

