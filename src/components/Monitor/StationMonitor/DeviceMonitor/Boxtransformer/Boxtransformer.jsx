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
    stations: PropTypes.array,
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
    const { stations } = this.props;
    const { stationCode, deviceTypeCode,deviceCode } = this.props.match.params;
    const backData={path: `/monitor/singleStation/${stationCode}`,name: '返回电站'};
    const currentStation = stations.find(e => `${e.stationCode}` === stationCode) || {};
    const breadCrumbData = {
      breadData:[{
        link: true,
        name: currentStation.stationName || '',
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
          <BoxtransformerHeader {...this.props} stationCode={stationCode} deviceTypeCode={deviceTypeCode} />
          <BoxtransformerTenMin {...this.props} />
          <DevicePointsTable {...this.props} />
          <DeviceAlarmTable {...this.props} stationCode={stationCode} deviceTypeCode={deviceTypeCode} deviceCode={deviceCode} />
          <h3 className={styles.subTitleConfig}>下级设备</h3>
          <SubInverter {...this.props} stationCode={stationCode} />
        </div>
      </div>
    ) 
  }
}

export default Boxtransformer;

