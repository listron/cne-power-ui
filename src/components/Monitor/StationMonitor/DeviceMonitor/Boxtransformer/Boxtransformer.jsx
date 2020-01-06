import React, { Component } from 'react';
import BoxtransformerHeader from './BoxtransformerHeader';
import SubInverter from './SubInverter';
import BoxtransformerTenMin from './BoxtransformerTenMin';
import DeviceAlarmTable from '../DeviceMonitorCommon/DeviceAlarmTable';
import DevicePointsTable from '../DeviceMonitorCommon/DevicePointsTable';
import CommonBreadcrumb from '../../../../Common/CommonBreadcrumb';
import PropTypes from 'prop-types';
import styles from '../eachDeviceMonitor.scss';
import moment from 'moment';

class Boxtransformer extends Component {
  static propTypes = {
    match: PropTypes.object,
    stations: PropTypes.array,
    getDeviceInfoMonitor: PropTypes.func,
    getDeviceChartMonitor: PropTypes.func,
    resetDeviceStore: PropTypes.func,
    stopMonitor: PropTypes.func,
    theme: PropTypes.string,
  }

  constructor(props) {
    super(props);
    this.state = {
      tabKey: '1',
    };
  }

  componentDidMount() {
    const endTime = moment().endOf("day").utc().format();
    const startTime = moment().endOf("day").utc().subtract(72, 'hours').format();
    const { deviceCode, deviceTypeCode, stationCode } = this.props.match.params;
    const params = {
      stationCode,
      deviceCode,
      deviceTypeCode,
      timeParam: `${startTime}/${endTime}`,
    };
    this.props.getDeviceInfoMonitor({ deviceCode, deviceTypeCode });
    this.props.getDeviceChartMonitor(params);
  }

  componentWillReceiveProps(nextProps) {
    const { deviceCode } = this.props.match.params;
    const nextParams = nextProps.match.params;
    const nextDevice = nextParams.deviceCode;
    const nextType = nextParams.deviceTypeCode;
    const nextStation = nextParams.stationCode;

    const endTime = moment().endOf("day").utc().format();
    const startTime = moment().endOf("day").utc().subtract(72, 'hours').format();
    if (nextDevice !== deviceCode) {
      const params = {
        stationCode: nextStation,
        deviceCode: nextDevice,
        deviceTypeCode: nextType,
        timeParam: `${startTime}/${endTime}`,
      };
      this.props.stopMonitor(); // 停止之前的定时器。
      this.props.getDeviceInfoMonitor({
        deviceCode: nextDevice,
        deviceTypeCode: nextType,
      });
      this.props.getDeviceChartMonitor(params);
    }
  }

  componentWillUnmount() {
    this.props.stopMonitor(); // 停止之前的定时器。
    this.props.resetDeviceStore();
  }

  tabKeyFunc = (key) => {
    this.setState({
      tabKey: key,
    });
  };

  render() {
    const { tabKey } = this.state;
    const { stations, theme } = this.props;
    const { stationCode, deviceTypeCode, deviceCode } = this.props.match.params;
    const backData = { path: `/monitor/singleStation/${stationCode}`, name: '返回电站' };
    const currentStation = stations.find(e => `${e.stationCode}` === stationCode) || {};
    const breadCrumbData = {
      breadData: [{
        link: true,
        name: currentStation.stationName || '',
        path: `/monitor/singleStation/${stationCode}`,
      }, {
        name: '箱变',
      }],
      iconName: 'iconfont icon-xb',
    };
    return (
      <div className={`${styles.boxtransformer} ${styles[theme]}`}>
        <CommonBreadcrumb {...breadCrumbData} backData={{ ...backData }} theme={theme} />
        <div className={styles.deviceContent}>
          <BoxtransformerHeader {...this.props} stationCode={stationCode} deviceTypeCode={deviceTypeCode} />
          <div className={styles.contWrap}>
            <BoxtransformerTenMin {...this.props} />
            <div className={styles.boxtransformerTabs}>
              <div className={tabKey === '1' ? styles.tabActive : styles.tabNormal} onClick={() => this.tabKeyFunc('1')}>
                实时告警
              </div>
              <div className={tabKey === '2' ? styles.tabActive : styles.tabNormal} onClick={() => this.tabKeyFunc('2')}>
                测点信息
              </div>
              <div className={tabKey === '3' ? styles.tabActive : styles.tabNormal} onClick={() => this.tabKeyFunc('3')}>
                下级设备
              </div>
            </div>
            {tabKey === '1' && <DeviceAlarmTable {...this.props} stationCode={stationCode} deviceTypeCode={deviceTypeCode} deviceCode={deviceCode} />}
            {tabKey === '2' && <DevicePointsTable {...this.props} /> }
            {tabKey === '3' && <SubInverter {...this.props} stationCode={stationCode} />}
          </div>
        </div>
      </div>
    );
  }
}

export default Boxtransformer;

