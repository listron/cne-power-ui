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
import searchUtil from '@utils/searchUtil';

class Seriesinverter extends Component {
  static propTypes = {
    match: PropTypes.object,
    history: PropTypes.object,
    stations: PropTypes.array,
    resetDeviceStore: PropTypes.func,
    stopMonitor: PropTypes.func,
    getDeviceInfoMonitor: PropTypes.func,
    getDeviceChartMonitor: PropTypes.func,
    theme: PropTypes.string,
  }

  constructor(props) {
    super(props);
    const { history: { location: { search } } } = props;
    // 默认选中的支路电流名称
    const pointParamsStr = searchUtil(search).getValue('pointParams') || '';
    // 字符串转成对象
    let pointParams = null;
    if(pointParamsStr !== '') {
      pointParams = {
        ...JSON.parse(pointParamsStr),
        bgcColor: `#${JSON.parse(pointParamsStr).bgcColor}`,
      };
    }
    this.state = {
      pointNameArr: pointParamsStr === '' ? [] : [pointParams], // 选中的支路数组
      tabKey: '1',
      chartName: 'output', // 组串式逆变器 chart图表切换 output <=> branch
    };
  }

  componentDidMount() {
    const { deviceCode, deviceTypeCode, stationCode } = this.props.match.params;
    const params = {
      stationCode,
      deviceCode,
      deviceTypeCode,
      timeParam: '720',
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
    if (nextDevice !== deviceCode) {
      const params = {
        stationCode: nextStation,
        deviceCode: nextDevice,
        deviceTypeCode: nextType,
        timeParam: '720',
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
    this.props.resetDeviceStore();
    this.props.stopMonitor(); // 停止之前的定时器。
  }

  toggleChart = (e) => {
    const { innerHTML } = e.target;
    const { chartName } = this.state;
    if (innerHTML === '出力图' && chartName === 'branch') {
      this.setState({ chartName: 'output' });
    } else if (innerHTML === '支路电流图' && chartName === 'output') {
      this.setState({ chartName: 'branch' });
    }
  };

  pointNameFunc = (arr) => {
    this.setState({
      pointNameArr: arr,
    });
  };

  // 切换
  tabKeyFunc = (key) => {
    this.setState({
      tabKey: key,
    });
  };

  render() {
    const { chartName, tabKey, pointNameArr } = this.state;
    const { match, stations, theme } = this.props;
    const { stationCode, deviceTypeCode, deviceCode } = match.params;
    const backData = { path: `/monitor/singleStation/${stationCode}`, name: '返回电站' };
    const currentStation = stations.find(e => `${e.stationCode}` === stationCode) || {};
    const breadCrumbData = {
      breadData: [{
        link: true,
        name: currentStation.stationName || '',
        path: `/monitor/singleStation/${stationCode}`,
      }, {
        name: deviceTypeCode === '201' ? '集中式逆变器' : '组串式逆变器',
      }],
      iconName: 'iconfont icon-nb',
    };
    return (
      <div className={`${styles.seriesinverter} ${styles[theme]}`}>
        <CommonBreadcrumb {...breadCrumbData} backData={{ ...backData }} theme={theme} />
        <div className={styles.deviceContent}>
          <InverterHeader {...this.props} stationCode={stationCode} deviceTypeCode={deviceTypeCode} />
          <InverterStatistics pointNameFunc={this.pointNameFunc} pointNameArr={pointNameArr} {...this.props} />
          <div className={styles.contWrap}>
            <div className={styles.inverterChartTitle}>
              {deviceTypeCode === '201' && <span className={styles.single}>出力图</span>}
              {deviceTypeCode === '206' && <span className={styles.tabs} onClick={this.toggleChart}>
                <span
                  className={chartName === 'output' ? styles.active : styles.inactive}
                  style={{ borderTopRightRadius: '0px', borderBottomRightRadius: '0px' }}
                >出力图</span>
                <span
                  className={chartName === 'branch' ? styles.active : styles.inactive}
                  style={{ borderTopLeftRadius: '0px', borderBottomLeftRadius: '0px' }}
                >支路电流图</span>
              </span>}
            </div>
            {chartName === 'output' && <InverterOutPutTenMin {...this.props} />}
            {chartName === 'branch' && <InverterSeriesTenMin pointNameArr={pointNameArr} {...this.props} />}
            <div className={styles.inverterTabs}>
              <div className={tabKey === '1' ? styles.tabActive : styles.tabNormal} onClick={() => this.tabKeyFunc('1')}>
                实时告警
              </div>
              <div className={tabKey === '2' ? styles.tabActive : styles.tabNormal} onClick={() => this.tabKeyFunc('2')}>
                测点信息
              </div>
              {(deviceTypeCode === '201') && <div className={tabKey === '3' ? styles.tabActive : styles.tabNormal} onClick={() => this.tabKeyFunc('3')}>
                下级设备
              </div>}
            </div>
            {(tabKey === '1') && <DeviceAlarmTable
              {...this.props}
              stationCode={stationCode}
              deviceTypeCode={deviceTypeCode}
              deviceCode={deviceCode}
              theme={theme}
            />
            }
            {tabKey === '2' && <DevicePointsTable {...this.props} />}
            {(deviceTypeCode === '201' && tabKey === '3') && <SubConfluenceList {...this.props} stationCode={stationCode} />}
          </div>
        </div>
      </div>
    );
  }
}

export default Seriesinverter;

