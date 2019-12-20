import React, { Component } from 'react';
import DeviceAlarmTable from '../DeviceMonitorCommon/DeviceAlarmTable';
import BoosterHeader from './BoosterHeader';
import SubIntegrate from './SubIntegrate';
import CommonBreadcrumb from '../../../../Common/CommonBreadcrumb';
import { YcPoints, YxPoints, YmPoints } from '../DeviceMonitorCommon/PointsGroup';
import PropTypes from 'prop-types';
import styles from '../eachDeviceMonitor.scss';

class BoosterStation extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    match: PropTypes.object,
    stations: PropTypes.array,
    devices: PropTypes.array,
    deviceDetail: PropTypes.any, // 对于升压站的设备详情为特殊情况数据，数组。
    deviceAlarmList: PropTypes.array,
    subDeviceList: PropTypes.array,
    resetDeviceStore: PropTypes.func,
    getDeviceInfoMonitor: PropTypes.func,
    stopMonitor: PropTypes.func,
    theme: PropTypes.string,
    boosterList: PropTypes.array,
  }

  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0, // 默认展示升压站下第一个设备
    };
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
    if (nextDevice !== deviceCode) { // 升压站内设备切换
      this.props.stopMonitor();
      this.props.getDeviceInfoMonitor({
        deviceCode: nextDevice,
        deviceTypeCode: nextType,
      });
    }
  }

  componentWillUnmount() {
    this.props.stopMonitor();
    this.props.resetDeviceStore();
  }

  checkDevice = (index) => {
    const { activeIndex } = this.state;
    if (index !== activeIndex) {
      this.setState({ activeIndex: index });
    }
  }

  render() {
    const { stations, boosterList, deviceDetail, deviceAlarmList, subDeviceList, theme = 'light' } = this.props;
    const { activeIndex } = this.state;
    const boosterDetail = deviceDetail[activeIndex] || {};
    const pointData = boosterDetail.pointData || {}; // 测点数据集合
    const { stationCode, deviceTypeCode } = this.props.match.params;
    const currentStation = stations.find(e => `${e.stationCode}` === stationCode) || {};
    const { stationName, stationType } = currentStation;
    const backData = { path: `/monitor/singleStation/${stationCode}`, name: '返回电站' };
    const breadCrumbData = {
      breadData: [{
        link: true,
        name: stationName || '--',
        path: `/monitor/singleStation/${stationCode}`,
      }, {
        name: '升压站',
      }],
      iconName: stationType > 0 ? 'iconfont icon-pvlogo' : 'iconfont icon-windlogo',
    };
    return (
      <div className={`${styles.boosterStation} ${styles[theme]}`}>
        <CommonBreadcrumb {...breadCrumbData} backData={{ ...backData }} theme={theme} />
        <div className={styles.deviceContent}>
          <BoosterHeader
            deviceDetail={boosterDetail}
            devices={boosterList}
            stationCode={stationCode}
            deviceTypeCode={deviceTypeCode}
          />
          <div className={styles.contWrap}>
            <div className={styles.deviceList}>
              {deviceDetail.length > 0 && deviceDetail.map((e, index) => (
                <span
                  key={e.deviceCode}
                  className={`${styles.eachDevice} ${activeIndex === index && styles.active}`}
                  onClick={() => this.checkDevice(index)}
                >{e.deviceName}</span>
              ))}
            </div>
            <div className={styles.points}>
              <YcPoints ycData={pointData.YC} theme={theme} />
              <YxPoints yxData={pointData.YX} theme={theme} />
            </div>
            <DeviceAlarmTable
              deviceAlarmList={deviceAlarmList}
              deviceDetail={boosterDetail}
              stationCode={stationCode}
              deviceTypeCode={boosterDetail.deviceTypeCode}
              deviceCode={boosterDetail.deviceCode}
              theme={theme}
            />
            {subDeviceList.length > 0 && <h3 className={styles.subTitleConfig}>下级设备</h3>}
            <SubIntegrate subDeviceList={subDeviceList} deviceDetail={deviceDetail} stationCode={stationCode} theme={theme} />
          </div>
        </div>
      </div>
    );
  }
}

export default BoosterStation;

