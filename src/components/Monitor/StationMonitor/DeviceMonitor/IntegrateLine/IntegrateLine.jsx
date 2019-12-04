import React, { Component } from 'react';
import DeviceAlarmTable from '../DeviceMonitorCommon/DeviceAlarmTable';
import IntegrateHeader from './IntegrateHeader';
import DevicePointsTable from '../DeviceMonitorCommon/DevicePointsTable';
import CommonBreadcrumb from '../../../../Common/CommonBreadcrumb';
import SubBoxtransformer from './SubBoxtransformer';
import PropTypes from 'prop-types';
import styles from '../eachDeviceMonitor.scss';

class IntegrateLine extends Component {
  static propTypes = {
    match: PropTypes.object,
    stations: PropTypes.array,
    resetDeviceStore: PropTypes.func,
    getDeviceInfoMonitor: PropTypes.func,
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
    const { deviceCode, deviceTypeCode } = this.props.match.params;
    this.props.getDeviceInfoMonitor({ deviceCode, deviceTypeCode });
  }

  componentWillReceiveProps(nextProps) {
    const { deviceCode } = this.props.match.params;
    const nextParams = nextProps.match.params;
    const nextDevice = nextParams.deviceCode;
    const nextType = nextParams.deviceTypeCode;
    if (nextDevice !== deviceCode) { // 集电线路电站切换
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

  tabKeyFunc = (key) => {
    this.setState({
      tabKey: key,
    });
  };

  render() {
    const { tabKey } = this.state;
    const { stations, theme = 'light' } = this.props;
    const { stationCode, deviceTypeCode, deviceCode } = this.props.match.params;
    const currentStation = stations.find(e => `${e.stationCode}` === stationCode) || {};
    const { stationName, stationType } = currentStation;
    const backData = { path: `/monitor/singleStation/${stationCode}`, name: '返回电站' };
    const breadCrumbData = {
      breadData: [{
        link: true,
        name: stationName || '--',
        path: `/monitor/singleStation/${stationCode}`,
      }, {
        name: '集电线路',
      }],
      iconName: stationType > 0 ? 'iconfont icon-pvlogo' : 'iconfont icon-windlogo',
    };
    return (
      <div className={`${styles.integrateLine} ${styles[theme]}`}>
        <CommonBreadcrumb {...breadCrumbData} backData={{ ...backData }} theme={theme} />
        <div className={styles.deviceContent}>
          <IntegrateHeader
            {...this.props}
            stationCode={stationCode}
            deviceTypeCode={deviceTypeCode}
          />
          <div className={styles.contWrap}>
            <div style={{marginTop: 20}}/>
            <div className={styles.integrateLineTabs}>
              <div className={tabKey === '1' ? styles.tabActive : styles.tabNormal} onClick={() => this.tabKeyFunc('1')}>
                实时告警
              </div>
              <div className={tabKey === '2' ? styles.tabActive : styles.tabNormal} onClick={() => this.tabKeyFunc('2')}>
                测点信息
              </div>
              {stationType > 0 && <div className={tabKey === '3' ? styles.tabActive : styles.tabNormal} onClick={() => this.tabKeyFunc('3')}>
                下级设备
              </div>}
            </div>
            {tabKey === '1' && <DeviceAlarmTable
              {...this.props}
              stationCode={stationCode}
              deviceTypeCode={deviceTypeCode}
              deviceCode={deviceCode}
            />}
            {tabKey === '2' && <DevicePointsTable {...this.props} />}
            {(stationType > 0 && tabKey === '3') && <SubBoxtransformer {...this.props} stationCode={stationCode} />}
          </div>
        </div>
      </div>
    );
  }
}

export default IntegrateLine;

