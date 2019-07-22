import React, { Component } from 'react';
import DeviceAlarmTable from '../DeviceMonitorCommon/DeviceAlarmTable';
import BoosterHeader from './BoosterHeader';
import CommonBreadcrumb from '../../../../Common/CommonBreadcrumb';
import { YcPoints, YxPoints, YmPoints } from '../DeviceMonitorCommon/PointsGroup';
import PropTypes from 'prop-types';
import styles from '../eachDeviceMonitor.scss';

class BoosterStation extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    match: PropTypes.object,
    devices: PropTypes.array,
    deviceDetail: PropTypes.any, // 对于升压站的设备详情为特殊情况数据，数组。
    deviceAlarmList: PropTypes.array,
    singleStationData: PropTypes.object,
    getBoosterData: PropTypes.func,
    resetDeviceStore: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0, // 默认展示升压站下第一个设备
    }
  }

  componentDidMount() {
    const { deviceCode, deviceTypeCode, stationCode } = this.props.match.params;
    const params = {
      stationCode,
      deviceCode,
      deviceTypeCode,
    };
    this.getData(params);
  }

  componentWillReceiveProps(nextProps) {
    const { deviceCode } = this.props.match.params;
    const nextParams = nextProps.match.params;
    const nextDevice = nextParams.deviceCode;
    const nextType = nextParams.deviceTypeCode;
    const nextStation = nextParams.stationCode;
    if( nextDevice !== deviceCode && nextType === '301' ){ // 升压站内设备切换
      clearTimeout(this.timeOutId);
      const params = {
        stationCode: nextStation,
        deviceCode: nextDevice,
        deviceTypeCode: nextType,
      };
      this.setState({
        activeIndex: 0,
      });
      this.getData(params);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeOutId);
    this.props.resetDeviceStore();
  }

  getData = params => {
    this.props.getBoosterData(params);
    this.timeOutId = setTimeout(() => {
      this.getData(params);
    }, 10000);
  }

  checkDevice = (index) => {
    const { activeIndex } = this.state;
    if (index !== activeIndex) {
      this.setState({ activeIndex: index });
    }
  }

  render(){
    const { loading, devices, deviceDetail, deviceAlarmList, singleStationData } = this.props;
    const { activeIndex } = this.state;
    const boosterDetail = deviceDetail[activeIndex] || {};
    const pointData = boosterDetail.pointData || {}; // 测点数据集合
    const { stationCode, deviceTypeCode } = this.props.match.params;
    const { stationName, stationType } = singleStationData;
    const backData = {path: `/monitor/singleStation/${stationCode}`, name: '返回电站'};
    const breadCrumbData = {
      breadData: [{
        link: true,
        name: stationName || '--',
        path: `/monitor/singleStation/${stationCode}`,
      }, {
        name: '升压站',
      }],
      iconName: stationType > 0 ? 'iconfont icon-pvlogo' :'iconfont icon-windlogo',
    };
    return (
      <div className={styles.boosterStation}>
        <CommonBreadcrumb {...breadCrumbData} style={{ backgroundColor: '#fff' }} backData={{...backData}} />
        <div className={styles.deviceContent}>
          <BoosterHeader deviceDetail={boosterDetail} devices={devices} stationCode={stationCode} deviceTypeCode={deviceTypeCode} />
          <div className={styles.deviceList}>
            {deviceDetail.length > 0 && deviceDetail.map((e, index) => (
              <span
                key={e.deviceCode}
                className={styles.eachDevice}
                style={{borderBottom: activeIndex === index ? '2px solid #199475' : 'none'}}
                onClick={() => this.checkDevice(index)}
              >{e.deviceName}</span>
            ))}
          </div>
          <div className={styles.points}>
            <YcPoints ycData={pointData.YC} />
            <YxPoints yxData={pointData.YX} />
          </div>
          <YmPoints data={pointData.YM} />
          <YmPoints data={pointData.YCS} name="YCS" />
          <DeviceAlarmTable
            deviceAlarmList={deviceAlarmList}
            loading={loading}
            deviceDetail={boosterDetail}
            stationCode={stationCode}
            deviceTypeCode={boosterDetail.deviceTypeCode}
            deviceCode={boosterDetail.deviceCode}
          />
        </div>
      </div>
    );
  }
}

export default BoosterStation;

