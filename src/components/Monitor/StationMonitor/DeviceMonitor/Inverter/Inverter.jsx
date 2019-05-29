import React, { Component } from 'react';
import InverterStatistics from './InverterStatistics';
import InverterOutPutTenMin from './InverterOutPutTenMin';
import InverterSeriesTenMin from './InverterSeriesTenMin';
import DeviceAlarmTable from '../DeviceMonitorCommon/DeviceAlarmTable';
import DevicePointsTable from '../DeviceMonitorCommon/DevicePointsTable';
import InverterHeader from './InverterHeader';
import SubConfluenceList from './SubConfluenceList';
import CommonBreadcrumb from '../../../../Common/CommonBreadcrumb';
import PropTypes from 'prop-types';
import styles from '../eachDeviceMonitor.scss';

class Seriesinverter extends Component {
  static propTypes = {
    match: PropTypes.object,
    stations: PropTypes.array,
    resetDeviceStore: PropTypes.func,
    stopMonitor: PropTypes.func,
    getDeviceInfoMonitor: PropTypes.func,
    getDeviceChartMonitor: PropTypes.func,
  }

  state = {
    chartName: 'output', // 组串式逆变器 chart图表切换 output <=> branch
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
    if( nextDevice !== deviceCode){
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

  toggleChart = (e) => {
    const { innerHTML } = e.target;
    const { chartName } = this.state;
    if (innerHTML === '出力图' && chartName === 'branch') {
      this.setState({ chartName: 'output' });
    } else if (innerHTML === '支路电流图' && chartName === 'output') {
      this.setState({ chartName: 'branch' });
    }
  }

  render(){
    const { chartName } = this.state;
    const { match, stations } = this.props;
    const { stationCode, deviceTypeCode, deviceCode } = match.params;
    const backData={ path: `/monitor/singleStation/${stationCode}`,name: '返回电站'};
    const currentStation = stations.find(e => `${e.stationCode}` === stationCode) || {};
    const breadCrumbData = {
      breadData:[{
        link: true,
        name: currentStation.stationName || '',
        path: `/monitor/singleStation/${stationCode}`,
      },{
        name: deviceTypeCode === '201'?'集中式逆变器': '组串式逆变器',
      }],
      iconName: 'iconfont icon-nb'
    };
    return (
      <div className={styles.seriesinverter}>
        <CommonBreadcrumb {...breadCrumbData} style={{backgroundColor:'#fff'}}  backData={{...backData}} />
        <div className={styles.deviceContent}>
          <InverterHeader {...this.props} stationCode={stationCode} deviceTypeCode={deviceTypeCode} />
          <InverterStatistics {...this.props} />
          <div className={styles.inverterChartTitle}>
            {deviceTypeCode === '201' && <span className={styles.single}>出力图</span>}
            {deviceTypeCode === '206' && <span className={styles.tabs} onClick={this.toggleChart}>
              <span
                className={chartName === 'output' ? styles.active : styles.inactive}
                style={{borderTopRightRadius: '0px', borderBottomRightRadius: '0px'}}
              >出力图</span>
              <span
                className={chartName === 'branch' ? styles.active : styles.inactive}
                style={{borderTopLeftRadius: '0px', borderBottomLeftRadius: '0px'}}
              >支路电流图</span>
            </span>}
          </div>
          {chartName === 'output' && <InverterOutPutTenMin {...this.props} />}
          {chartName === 'branch' && <InverterSeriesTenMin {...this.props} />}
          <DevicePointsTable {...this.props} />
          <DeviceAlarmTable
            {...this.props}
            stationCode={stationCode}
            deviceTypeCode={deviceTypeCode}
            deviceCode={deviceCode}
          />
          {deviceTypeCode === '201' && <h3 className={styles.subTitleConfig}>下级设备</h3>}
          {deviceTypeCode === '201' && <SubConfluenceList {...this.props} stationCode={stationCode} />}
        </div>
      </div>
    ) 
  }
}

export default Seriesinverter;

