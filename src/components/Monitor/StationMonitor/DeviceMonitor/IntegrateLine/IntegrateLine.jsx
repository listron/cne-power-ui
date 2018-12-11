import React, { Component } from 'react';
// import InverterStatistics from './InverterStatistics';
// import InverterTenMin from './InverterTenMin';
import DeviceAlarmTable from '../DeviceMonitorCommon/DeviceAlarmTable';
// import DevicePointsData from '../DeviceMonitorCommon/DevicePointsData';
import IntegrateHeader from './IntegrateHeader';
import CommonBreadcrumb from '../../../../Common/CommonBreadcrumb';
import { YcPoints, YxPoints, YmPoints } from '../DeviceMonitorCommon/PointsGroup';
import PropTypes from 'prop-types';
import styles from '../eachDeviceMonitor.scss';

class IntegrateLine extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    match: PropTypes.object,
  //   getMonitorDeviceData: PropTypes.func,
    devices: PropTypes.array,
    deviceDetail: PropTypes.object,
    deviceAlarmList: PropTypes.array,
    singleStationData: PropTypes.object,
    getIntegrateData: PropTypes.func,
  //   resetDeviceStore: PropTypes.func,
  }

  componentDidMount(){
    const { deviceCode, deviceTypeCode, stationCode } = this.props.match.params;
    const params = {
      stationCode,
      deviceCode,
      deviceTypeCode
    };
    this.props.getIntegrateData(params);
  //   this.getData(stationCode, deviceCode, deviceTypeCode);
  }

  // componentWillReceiveProps(nextProps){
  //   const { deviceCode, deviceTypeCode, stationCode } = this.props.match.params;
  //   const nextParams = nextProps.match.params;
  //   const nextDevice = nextParams.deviceCode;
  //   const nextType = nextParams.deviceTypeCode;
  //   const nextStation = nextParams.stationCode;
  //   if( nextDevice !== deviceCode || nextType !== deviceTypeCode || nextStation !== stationCode ){
  //     clearTimeout(this.timeOutId);
  //     clearTimeout(this.timeOutTenMin);
  //     const params = {
  //       stationCode: nextStation,
  //       deviceCode: nextDevice,
  //       deviceTypeCode: nextType,
  //       timeParam: '72',
  //     };
  //     this.props.getMonitorDeviceData(params);
  //     this.getData(nextStation, nextDevice, nextType);
  //   }
  // }

  // componentWillUnmount(){
  //   clearTimeout(this.timeOutId);
  //   this.props.resetDeviceStore();
  // }

  // getData = (stationCode, deviceCode, deviceTypeCode) => {
  //   const params = {
  //     stationCode,
  //     deviceCode,
  //     deviceTypeCode,
  //   };
  //   this.timeOutId = setTimeout(() => {
  //     this.props.getMonitorDeviceData(params);
  //     this.getData(stationCode, deviceCode, deviceTypeCode);
  //   },10000)
  // }

  render(){
    const { loading, devices, deviceDetail, deviceAlarmList, singleStationData } = this.props;
    const pointData = deviceDetail.pointData || {}; // 测点数据集合
    const { stationCode, deviceTypeCode, deviceCode } = this.props.match.params;
    const { stationName, stationType } = singleStationData;
    const backData={path: `/monitor/singleStation/${stationCode}`,name: '返回电站'};
    const breadCrumbData = {
      breadData:[{
        link: true,
        name: stationName || '--',
        path: `/monitor/singleStation/${stationCode}`,
      },{
        name: '集电线路',
      }],
      iconName: stationType > 0 ? 'iconfont icon-pvlogo' :'iconfont icon-windlogo',
    };
    return (
      <div className={styles.integrateLine}>
        <CommonBreadcrumb {...breadCrumbData} style={{ backgroundColor:'#fff' }}  backData={{...backData}} />
        <div className={styles.deviceContent}>
          <IntegrateHeader deviceDetail={deviceDetail} devices={devices} stationCode={stationCode} deviceTypeCode={deviceTypeCode} />
          <div className={styles.points}>
            <YcPoints ycData={pointData.YC} />
            <YxPoints yxData={pointData.YX} />
          </div>
          <YmPoints ymData={pointData.YM} />
          <DeviceAlarmTable
            deviceAlarmList={deviceAlarmList}
            loading={loading}
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

export default IntegrateLine;

