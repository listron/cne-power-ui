import React, {Component} from 'react';
import ConfluenceStatistics from './ConfluenceStatistics';
import ConfluenceTenMin from './ConfluenceTenMin';
import DeviceAlarmTable from '../DeviceMonitorCommon/DeviceAlarmTable';
import DevicePointsTable from '../DeviceMonitorCommon/DevicePointsTable';
import ConfluenceHeader from './ConfluenceHeader';
import CommonBreadcrumb from '../../../../Common/CommonBreadcrumb';
import PropTypes from 'prop-types';
import moment from 'moment';
import searchUtil from '@utils/searchUtil';

import styles from '../eachDeviceMonitor.scss';

class Confluencebox extends Component {
  static propTypes = {
    match: PropTypes.object,
    history: PropTypes.object,
    stations: PropTypes.array,
    resetDeviceStore: PropTypes.func,
    getDeviceInfoMonitor: PropTypes.func,
    getDeviceChartMonitor: PropTypes.func,
    stopMonitor: PropTypes.func,
    theme: PropTypes.string,
    scroll: PropTypes.bool,
  };

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
    };
  }

  componentDidMount() {
    const {deviceCode, deviceTypeCode, stationCode} = this.props.match.params;
    const startTime = moment().endOf("day").utc().subtract(720, 'hours').format();
    const endTime = moment().endOf("day").utc().format();
    const params = {
      stationCode,
      deviceCode,
      deviceTypeCode,
      timeParam: `${startTime}/${endTime}`,
    };
    this.props.getDeviceInfoMonitor({deviceCode, deviceTypeCode});
    this.props.getDeviceChartMonitor(params);
  }

  componentWillReceiveProps(nextProps) {
    const {deviceCode} = this.props.match.params;
    const nextParams = nextProps.match.params;
    const nextDevice = nextParams.deviceCode;
    const nextType = nextParams.deviceTypeCode;
    const nextStation = nextParams.stationCode;
    if (nextDevice !== deviceCode) {
      const startTime = moment().endOf("day").subtract(720, 'hours').utc().format();
      const endTime = moment().endOf("day").utc().format();
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
    this.props.resetDeviceStore();
    this.props.stopMonitor(); // 停止之前的定时器。
  }

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
    const { pointNameArr, tabKey } = this.state;
    const {match, stations, theme = 'light', scroll} = this.props;
    const {stationCode, deviceTypeCode, deviceCode} = match.params;
    const currentStation = stations.find(e => `${e.stationCode}` === stationCode) || {};
    const backData = {path: `/monitor/singleStation/${stationCode}`, name: '返回电站'};
    const breadCrumbData = {
      breadData: [{
        link: true,
        name: currentStation.stationName || '',
        path: `/monitor/singleStation/${stationCode}`,
      }, {
        name: '汇流箱',
      }],
      iconName: 'iconfont icon-hl',
    };
    return (
      <div className={`${styles.confluencebox} ${styles[theme]}`}>
        <div className={scroll ? styles.deviceTop : ''}>
          <CommonBreadcrumb {...breadCrumbData} backData={{...backData}} theme={theme} />
          <ConfluenceHeader
            {...this.props}
            stationCode={stationCode}
            deviceTypeCode={deviceTypeCode}
          />
        </div>
        <div className={styles.deviceContent}>
          <ConfluenceStatistics pointNameFunc={this.pointNameFunc} pointNameArr={pointNameArr} {...this.props} />
          <div className={styles.contWrap}>
            <ConfluenceTenMin pointNameArr={pointNameArr} {...this.props} />
            <div className={styles.confluenceTabs}>
              <div className={tabKey === '1' ? styles.tabActive : styles.tabNormal} onClick={() => this.tabKeyFunc('1')}>
                实时告警
              </div>
              <div className={tabKey === '2' ? styles.tabActive : styles.tabNormal} onClick={() => this.tabKeyFunc('2')}>
                测点信息
              </div>
            </div>
            {(tabKey === '1') && <DeviceAlarmTable
              {...this.props}
              stationCode={stationCode}
              deviceTypeCode={deviceTypeCode}
              deviceCode={deviceCode}
            />}
            {(tabKey === '2') && <DevicePointsTable {...this.props} />}
          </div>
        </div>
      </div>
    );
  }
}

export default Confluencebox;

