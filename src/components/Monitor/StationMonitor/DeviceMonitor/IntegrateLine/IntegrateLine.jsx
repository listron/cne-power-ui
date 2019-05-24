import React, { Component } from 'react';
import DeviceAlarmTable from '../DeviceMonitorCommon/DeviceAlarmTable';
import IntegrateHeader from './IntegrateHeader';
import DevicePointsTable from '../DeviceMonitorCommon/DevicePointsTable';
import CommonBreadcrumb from '../../../../Common/CommonBreadcrumb';
import SubBoxtransformer from './SubBoxtransformer';
import { YcPoints, YxPoints, YmPoints } from '../DeviceMonitorCommon/PointsGroup';
import PropTypes from 'prop-types';
import styles from '../eachDeviceMonitor.scss';

class IntegrateLine extends Component {
  static propTypes = {
    // loading: PropTypes.bool,
    match: PropTypes.object,
  //   getMonitorDeviceData: PropTypes.func,
    devices: PropTypes.array,
    stations: PropTypes.array,
    deviceDetail: PropTypes.object,
    subDeviceList: PropTypes.array,
    deviceAlarmList: PropTypes.array,
    deviceEvents: PropTypes.array,
    devicePointData: PropTypes.array,
    // singleStationData: PropTypes.object,
    // getIntegrateData: PropTypes.func,
    resetDeviceStore: PropTypes.func,
    getDeviceInfoMonitor: PropTypes.func,
    stopMonitor: PropTypes.func,
  }

  componentDidMount() {
    const { deviceCode, deviceTypeCode } = this.props.match.params;
    this.props.getDeviceInfoMonitor({ deviceCode, deviceTypeCode });
  }

  componentWillReceiveProps(nextProps) {
    const { deviceCode } = this.props.match.params;
    const nextParams = nextProps.match.params;
    const nextDevice = nextParams.deviceCode;
    const nextType = nextParams.deviceTypeCode;
    if( nextDevice !== deviceCode ){ // 集电线路电站切换
      this.props.stopMonitor();
      this.props.getDeviceInfoMonitor({ deviceCode, deviceTypeCode: nextType });
    }
  }

  componentWillUnmount() {
    this.props.stopMonitor();
    this.props.resetDeviceStore();
  }

  render(){
    const { devices, deviceDetail, deviceAlarmList, stations, deviceEvents, devicePointData, subDeviceList } = this.props;
    const { stationCode, deviceTypeCode, deviceCode } = this.props.match.params;
    // const pointData = deviceDetail.pointData || {}; // 测点数据集合
    const currentStation = stations.find(e => e.stationCode === stationCode) || {};
    const backData={path: `/monitor/singleStation/${stationCode}`,name: '返回电站'};
    const breadCrumbData = {
      breadData:[{
        link: true,
        name: currentStation.stationName || '--',
        path: `/monitor/singleStation/${stationCode}`,
      },{
        name: '集电线路',
      }],
      iconName: currentStation.stationType > 0 ? 'iconfont icon-pvlogo' :'iconfont icon-windlogo',
    };
    return (
      <div className={styles.integrateLine}>
        <CommonBreadcrumb {...breadCrumbData} style={{ backgroundColor:'#fff' }}  backData={{...backData}} />
        <div className={styles.deviceContent}>
          <IntegrateHeader
            deviceDetail={deviceDetail}
            devices={devices}
            stationCode={stationCode}
            deviceTypeCode={deviceTypeCode}
          />
          <DevicePointsTable deviceEvents={deviceEvents} devicePointData={devicePointData} />
          {/* <div className={styles.points}>
            <YcPoints ycData={pointData.YC} />
            <YxPoints yxData={pointData.YX} />
          </div>
          <YmPoints ymData={pointData.YM} /> */}
          <DeviceAlarmTable
            deviceAlarmList={deviceAlarmList}
            deviceDetail={deviceDetail}
            stationCode={stationCode}
            deviceTypeCode={deviceTypeCode}
            deviceCode={deviceCode}
          />
          <SubBoxtransformer subDeviceList={subDeviceList} deviceDetail={deviceDetail} />
        </div>
      </div>
    ) 
  }
}

export default IntegrateLine;

