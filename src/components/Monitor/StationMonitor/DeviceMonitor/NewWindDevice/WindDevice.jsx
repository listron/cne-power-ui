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
import { apiUrlReal } from '../../../../../config/apiConfig';
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
    scatterpointTime: PropTypes.number,
    sequencediagramTime: PropTypes.number,
    scatterpointLoading: PropTypes.bool,
    sequenceLoading: PropTypes.bool,
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

  pointList = () => {
    const { devicePointData } = this.props;
    const pointData = [
      { name: '风机状态', code: 'TR001' },
      { name: '限功率状态', code: 'TR005' },
      { name: '无功功率', code: 'TR003' },
      { name: '电网频率', code: 'CV001' },
      { name: '网测U相电压', code: 'CV007' },
      { name: '网测U相电流', code: 'TR010' },
      { name: '叶轮转速', code: 'RT001' },
      { name: '发电机转速', code: 'CN001' },
      { name: '实际转矩', code: 'CV002' },
      { name: '主轴温度', code: 'TM001' },
      { name: '齿轮箱油温', code: 'TM101' },
      { name: '齿轮箱高速轴承温度', code: 'TM106', weightCode: 'TM105' },
      { name: '发电机U相绕组温度', code: 'CN013' },
      { name: '发电机绕组温度', code: 'CN033' },
      { name: '发电机驱动端轴承温度', code: 'CN010' },
      { name: '发电机非驱动端轴承温度', code: 'CN011' },
      { name: '机舱温度', code: 'NC005' },
      { name: '环境温度', code: 'NC004' },
      { name: '偏航对风角', code: 'YW002' },
      { name: '桨叶1角度', code: 'RT101' },
      { name: '桨叶2角度', code: 'RT102' },
      { name: '桨叶3角度', code: 'RT103' },
      { name: '桨叶1变桨电机温度', code: 'RT104' },
      { name: '桨叶2变桨电机温度', code: 'RT105' },
      { name: '桨叶3变桨电机温度', code: 'RT106' },
      { name: '电缆扭转角度', code: 'YW003' },
    ]
    let list = [];
    pointData.forEach((item) => {
      let code = item.weightCode && 'weightCode' || 'code';
      devicePointData.forEach(e => {
        if (e.devicePointCode === item[code]) {
          list.push(e)
        }
      })
    })
    const groupList = [];
    let step = list.length > 15 ? 5 : 4; // 数据太少 一列4行
    let ListLength = list.length > 20 ? 20 : list.length; // 只取前20个测点
    for (var i = 0; i < ListLength; i += step) {
      groupList.push(list.slice(i, i + step));
    }
    return groupList
  }

  render() {
    const { devices, sequencediagram = {}, deviceAlarmList, devicePointData, loading, singleStationData, deviceDetail, scatterpoint, stations } = this.props;
    const { scatterpointTime, sequencediagramTime, scatterpointLoading = false, sequenceLoading = false } = this.props;
    const { stationCode, deviceTypeCode, deviceCode } = this.props.match.params;
    const { deviceName, deviceModeCode } = deviceDetail
    const { sequenceChartList = [] } = sequencediagram; // 时序图
    const backData = { path: `/monitor/singleStation/${stationCode}`, name: '返回电站' };
    const currentStation = stations.find(e => `${e.stationCode}` === stationCode) || {};
    const breadCrumbData = {
      breadData: [{
        link: true,
        name: currentStation.stationName || '',
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
                <div className={styles.structureImg}>
                  {deviceModeCode && <img src={`${apiUrlReal}/api/v3/images/windturbine/${deviceModeCode}.png`} />}
                </div>
              </div>
              <div className={styles.windPointData} >
                <div className={styles.pointDataTitle}>
                  <span>实时测点数据</span>
                  <span className={styles.learnMore} onClick={this.learnMore}>查看全部</span>
                </div>
                <div className={styles.pointDataContiner} ref={'windPoint'} >
                  {
                    this.pointList().map((item, index) => {
                      return (
                        <div className={styles.group} key={index}>
                          {item.map(e => {
                            return (<div className={styles.eachData} key={e.devicePointCode}>
                              <p className={styles.devicePointName}>{e.devicePointName}</p>
                              <p className={styles.devicePointValue}>{e.devicePointValue} <span className={styles.unit}>{e.devicePointUnit}</span></p>
                            </div>)
                          })}
                        </div>
                      )
                    })
                  }
                </div>
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
                  <Link to={{ pathname: `/monitor/alarm/realtime`, search: `?stationCode=${stationCode}`, state: { stationType: '0', deviceName } }}> 查看全部 </Link>
                </div>
                <DeviceAlarmTable deviceAlarmList={deviceAlarmList} loading={loading} deviceDetail={deviceDetail} stationCode={stationCode} style={{ padding: `0px 32px 32px`, border: 'none' }} titleName={false} />
              </div>
            </div>
            <div className={styles.windDeviceChart}>
              <div className={styles.tags}>
                <Link to={{
                  pathname: `/monitor/alarm/realtime`,
                  search: `?stationCode=${stationCode}`, state: { stationType: '0', deviceName }
                }}> 查看告警 {dataFormats(deviceDetail.alarmNum, '--')} </Link>
                <Link to={`javascript:void(0)`} className={styles.noLink}> 统计分析  </Link>
                <Link to={`/report/windstation/powerReport`} > 报表查询  </Link>
              </div>
              <div className={styles.chartsBox}>
                <OutputChart
                  capabilityData={sequenceChartList}
                  yAxisUnit={'kW'}
                  loading={sequenceLoading}
                  capabilityDataTime={sequencediagramTime} />
              </div>
              <div className={styles.chartsBox}>
                <PointScatter
                  scatterData={scatterpoint}
                  type={'windDevice'}
                  scatterpointTime={scatterpointTime}
                  loading={scatterpointLoading}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default WindDevice;

