import React, { Component } from 'react';
import WindStatistics from './WindStatistics';
import { InverterTenMin, SactterChart, SequenceChart } from './windChart';
import DeviceAlarmTable from '../DeviceMonitorCommon/DeviceAlarmTable';
import DevicePointsData from './windPointsData';
import WindDeviceHeader from './WindDeviceHeader';
import CommonBreadcrumb from '../../../../Common/CommonBreadcrumb';
import PropTypes from 'prop-types';
import styles from './windDevice.scss';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Modal } from 'antd';
import { dataFormats } from '../../../../../utils/utilFunc';
import { OutputChart } from '../../WindCommon/OutputChart';
import { PowerDiagram } from '../../WindCommon/PowerDiagram';
import { PointScatter } from '../../WindCommon/PointScatter';

class WindDevice extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    match: PropTypes.object,
    getSequencechartData: PropTypes.func,
    devices: PropTypes.array,
    windturbineData: PropTypes.object,
    sequencechart: PropTypes.object,
    deviceAlarmList: PropTypes.array,
    devicePointData: PropTypes.array,
    singleStationData: PropTypes.object,
    resetDeviceStore: PropTypes.func,
    stopWindDeviceCharts: PropTypes.func,
    getWindDeviceCharts: PropTypes.func,
    scatterpoint: PropTypes.object,
    sequencediagram: PropTypes.object,
    deviceDetail: PropTypes.object,
    getWindDeviceRealData: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.state = {
      modalVisible: false
    }
  }

  componentDidMount() {
    const { deviceCode, deviceTypeCode, stationCode } = this.props.match.params;
    const startTime = moment().utc().subtract(24, 'hours').format();
    const endTime = moment().utc().format();
    const params = {
      stationCode,
      deviceCode,
      deviceTypeCode,
      timeParam: `${startTime}/${endTime}`,
    };
    this.props.getWindDeviceCharts({ deviceFullCode: deviceCode, startTime, endTime })
    this.props.getWindDeviceRealData(params)
  }

  componentWillReceiveProps(nextProps) {
    const prevDeviceCode = this.props.match.params.deviceCode;
    const nextParams = nextProps.match.params;
    const { stationCode, deviceCode, deviceTypeCode } = nextParams;
    const startTime = moment().utc().subtract(24, 'hours').format();
    const endTime = moment().utc().format();
    if (deviceCode !== prevDeviceCode && deviceTypeCode === '101') {
      this.props.stopWindDeviceCharts();
      this.props.stopWindDeviceCharts('tenSecond');
      const params = {
        stationCode,
        deviceCode,
        deviceTypeCode,
        timeParam: `${startTime}/${endTime}`,
      };
      this.props.getWindDeviceCharts({ deviceFullCode: deviceCode, startTime, endTime })
      this.props.getWindDeviceRealData(params)
    }
  }

  componentWillUnmount() {
    this.props.resetDeviceStore();
    this.props.stopWindDeviceCharts();
    this.props.stopWindDeviceCharts('tenSecond');
  }

  learnMore = () => { // 实时测点查看更多
    this.setState({ modalVisible: true })
  }

  devicePointCancel = () => {
    this.setState({ modalVisible: false })
  }

  render() {
    const { devices, sequencediagram = {}, deviceAlarmList, devicePointData, loading, singleStationData, deviceDetail, scatterpoint } = this.props;
    const { stationCode, deviceTypeCode, deviceCode } = this.props.match.params;
    const { deviceName } = deviceDetail
    const { sequenceChartList = [] } = sequencediagram; // 时序图
    const backData = { path: `/monitor/singleStation/${stationCode}`, name: '返回电站' };
    const breadCrumbData = {
      breadData: [{
        link: true,
        name: singleStationData && singleStationData.stationName || '',
        path: `/monitor/singleStation/${stationCode}`,
      }, {
        link: false,
        name: deviceDetail.deviceTypeName,
      }],
      iconName: 'iconfont icon-windlogo',
    };
    return (
      <div className={styles.newWindDevice}>
        <CommonBreadcrumb {...breadCrumbData} style={{ backgroundColor: '#fff' }} backData={{ ...backData }} />
        <div className={styles.deviceContent}>
          <WindDeviceHeader deviceDetail={deviceDetail} devices={devices} stationCode={stationCode} />
          <WindStatistics deviceDetail={deviceDetail} />
          <div className={styles.windDeviceContainer}>
            <div className={styles.windDeviceInfo}>
              <div className={styles.structure}>
                <div className={styles.structureTitle}>风机结构图</div>
                <div className={styles.structureImg}><img src="/img/wind_fan.png" /></div>
              </div>
              <div className={styles.windPointData} >
                <div className={styles.pointDataTitle}>
                  <span>实时测点数据</span>
                  <span className={styles.learnMore} onClick={this.learnMore}>查看全部</span>
                </div>
                <div className={styles.pointDataContiner} ref={'windPoint'} > </div>
                <Modal
                  visible={this.state.modalVisible}
                  onCancel={this.devicePointCancel}
                  footer={null}
                  mask={false}
                  centered={true}
                  wrapClassName={styles.detailPointName}
                  getContainer={() => this.refs.windPoint}
                  width={1200}
                >
                  <DevicePointsData devicePointData={devicePointData} deviceDetail={deviceDetail} />
                </Modal>
              </div>
              <div className={styles.pointAlarm}>
                <div className={styles.pointAlarmTitle}>
                  <span>实时告警</span>
                  <Link to={{pathname:`/monitor/alarm/realtime`, search:`?stationCode=${stationCode}`,state:{stationType:'0',deviceName}}}> 查看全部 </Link>
                </div>
                <DeviceAlarmTable deviceAlarmList={deviceAlarmList} loading={loading} deviceDetail={deviceDetail} stationCode={stationCode} style={{ padding: `0px 32px 32px`, border: 'none' }} titleName={false} />
              </div>
            </div>
            <div className={styles.windDeviceChart}>
              <div className={styles.tags}>
                <Link to={{pathname:`/monitor/alarm/realtime`,
                search:`?stationCode=${stationCode}`,state:{stationType:'0',deviceName}}}> 查看告警 {dataFormats(deviceDetail.alarmNum, '--')} </Link>
                <Link to={`javascript:void(0)`} className={styles.noLink}> 统计分析  </Link>
                <Link to={`/monitor/report/powerReport`} > 报表查询  </Link>
              </div>
              <div className={styles.chartsBox}>
                <OutputChart capabilityData={sequenceChartList} yAxisUnit={'kW'} />
              </div>
              <div className={styles.chartsBox}>
                <PointScatter scatterData={scatterpoint} type={'windDevice'} />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default WindDevice;

