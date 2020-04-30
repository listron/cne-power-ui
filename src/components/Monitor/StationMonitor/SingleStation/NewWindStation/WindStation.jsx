

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './windStation.scss';
import { Tabs, Radio } from 'antd';
import { Link } from 'react-router-dom';
import WindStationTop from './WindStationTop';
import WindStationHeader from './WindStationHeader';
import FanListCont from './FanList/FanListCont';
import IntegrateList from '../SingleStationCommon/DeviceList/IntegrateList';
import Boosterstation from '../SingleStationCommon/DeviceList/Boosterstation';
import PowerNet from '../SingleStationCommon/DeviceList/PowerNet';
import { getDeviceTypeIcon, getAlarmStatus } from '../SingleStationCommon/DeviceTypeIcon';
import { OutputChart } from '../../WindCommon/OutputChart';
import { PowerDiagram } from '../../WindCommon/PowerDiagram';
import { SpeedScatter } from '../../WindCommon/SpeedScatter';
import { dataFormats } from '../../../../../utils/utilFunc';
import CneButton from '@components/Common/Power/CneButton';
const { TabPane } = Tabs;
import moment from 'moment';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class WindStation extends Component {
  static propTypes = {
    stationCode: PropTypes.string,
    match: PropTypes.object,
    changeSingleStationStore: PropTypes.func,
    deviceTypeFlow: PropTypes.object,
    resetSingleStationStore: PropTypes.func,
    fanList: PropTypes.object,
    singleStationData: PropTypes.object,
    stationList: PropTypes.array,
    weatherList: PropTypes.array,
    operatorList: PropTypes.array,
    windCapabilityData: PropTypes.array,
    fanDisplay: PropTypes.string,
    getWindMonitorPower: PropTypes.func,
    windPowerData: PropTypes.array,
    fanList: PropTypes.object,
    getPowerDataTenMin: PropTypes.func,
    windCapabilityDataTime: PropTypes.number,
    singleStationScattertime: PropTypes.number,
    windPowerTime: PropTypes.number,
    operatorTime: PropTypes.number,
    getDeviceTypeFlow: PropTypes.func,
    getSingleRealChartsData: PropTypes.func,
    getWindSingleStation: PropTypes.func,
    getAlarmList: PropTypes.func,
    getWeatherList: PropTypes.func,
    getWorkList: PropTypes.func,
    editData: PropTypes.func,
    stopSingleRealData: PropTypes.func,
    singleStationScatterLoading: PropTypes.bool,
    windPowerLoading: PropTypes.bool,
    capabilityDataLoading: PropTypes.bool,
  }

  constructor(props) {
    super(props);
    this.state = {
      hiddenStationList: false,
      singleDeviceType: 0,
    }
  }

  componentDidMount() {
    const { stationCode } = this.props.match.params;
    const stationType = '0';
    this.props.getNewDeviceTypeFlow({ stationCode, stationType }); //获取设备类型流程图
    this.getTenSeconds(stationCode, stationType);
    this.getPowerDataTenMin({ stationCode, stationType }); // 发电量
    const main = document.getElementById('main');
    main.scrollTo(0, 0);
    this.props.changeSingleStationStore({ deviceTypeCode: '101' })
    this.props.getSingleRealChartsData({ // 1小时数据 出力图 等效利用小时
      stationCode,
      stationType,
      startTime: moment().subtract(24, 'hours').utc().format(),
      endTime: moment().utc().format()
    });
  }


  componentWillReceiveProps(nextProps) {
    const { stationCode } = this.props.match.params;
    const nextStationCode = nextProps.match.params.stationCode;
    const nextStationType = '1';
    if (nextStationCode !== stationCode) {
      clearTimeout(this.timeOutId);
      this.props.resetSingleStationStore();
      this.getTenSeconds(nextStationCode, nextStationType);
      this.props.changeSingleStationStore({ deviceTypeCode: '101' })
      this.getPowerDataTenMin({ stationCode: nextStationCode, stationType: nextStationType });
      this.props.getNewDeviceTypeFlow({ stationCode: nextStationCode, stationType: nextStationType });//获取设备类型流程图
      this.props.stopSingleRealData();
      this.props.getSingleRealChartsData({ // 1小时数据 出力图 等效利用小时
        stationCode: nextStationCode,
        stationType: nextStationType,
        startTime: moment().subtract(24, 'hours').utc().format(),
        endTime: moment().utc().format()
      });
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeOutId);
    clearTimeout(this.timeOutPowerData);
    this.props.resetSingleStationStore();
    this.props.stopSingleRealData();
  }

  onHandleStation = (e) => {
    this.setState({
      singleDeviceType: e,
    })
  }

  onSelectedDeviceType = (e) => { // 选择设备
    const deviceTypeCode = parseInt(e.target.value);
    this.props.changeSingleStationStore({ deviceTypeCode });
  }


  getTenSeconds = (stationCode, stationType) => { // 10s请求一次数据 单电站 告警列表 工单列表  天气情况 
    this.props.getWindSingleStation({ stationCode });
    this.props.getAlarmList({ stationCode });
    this.props.getWeatherList({ stationCode }); // 天气
    let endTime = moment().utc().format();
    this.props.getWorkList({ stationCode, startTime: moment().set({ 'hour': 0, 'minute': 0, 'second': 0, }).utc().format(), endTime, });
    this.timeOutId = setTimeout(() => {
      this.getTenSeconds(stationCode, stationType);
    }, 10000);
  }


  getStatusNum = (status) => { // 获取状态的数量
    const { deviceStatusSummary = [] } = this.props.fanList;
    const statusList = deviceStatusSummary.filter(e => e.deviceStatusCode === status)
    return statusList.length > 0 && statusList[0].deviceStatusNum || 0
  }


  getPowerDataTenMin = (value) => { // 10min 请求一次发电量(默认请求intervalTime = 0 的日数据)
    clearTimeout(this.timeOutPowerData);
    const { stationCode } = this.props.match.params;
    const { intervalTime = 0 } = value;
    const stationType = '0';
    let startTime = moment().subtract(6, 'day').format('YYYY-MM-DD')// 默认是6天前;
    if (intervalTime === 1) {
      startTime = moment().subtract(5, 'month').startOf('month').format('YYYY-MM-DD')
    }
    if (intervalTime === 2) {
      startTime = moment().subtract(5, 'year').startOf('year').format('YYYY-MM-DD')
    }
    this.props.changeSingleStationStore({ windPowerData: [] });
    this.props.getWindMonitorPower({ // 出力图数据
      stationCode,
      intervalTime,
      startTime,
      endTime: moment().subtract(1, 'day').format('YYYY-MM-DD'),
      stationType,
    });
    this.timeOutPowerData = setTimeout(() => {
      this.getPowerDataTenMin({ stationCode, stationType, intervalTime });
    }, 600000);
  }


  getDeviceTypeFlow = (deviceTypeFlow, list = []) => {
    deviceTypeFlow.forEach(e => {
      if (!(list.some(item => item.deviceTypeCode === e.code))) {
        list.push({
          deviceTypeCode: e.code,
          deviceTypeName: e.name,
        })
        if (e.parents) {
          this.getDeviceTypeFlow(e.parents, list)
        }
      }
    })
    return list
  }


  createFlowButton = (typeCode, typeName, buttonClass, imgClass, clickable = true, alarm = false) => ( // 设备流程生成函数
    <RadioButton value={typeCode} className={styles[buttonClass]} style={clickable ? null : { pointerEvents: 'none' }} key={Math.random()}>
      <div className={styles.deviceTypeIcon} >
        <i className={getDeviceTypeIcon(+typeCode)} ></i>
        {alarm && <i className="iconfont icon-alarm alarmIcon" ></i>}
        {/* <img src="/img/arrowgo.png" className={styles[imgClass]} /> */}
      </div>
      {/* <div>{typeName}</div> */}
    </RadioButton>
  )





  render() {
    const { deviceTypeFlow, deviceTypeCode, singleStationData, fanDisplay, windPowerData, singleStationScatter = {}, windCapabilityData, editData, } = this.props;
    const { windCapabilityDataTime, singleStationScattertime, windPowerTime } = this.props;
    const { singleStationScatterLoading = false, windPowerLoading = false, capabilityDataLoading = false } = this.props;
    const { stationCode } = this.props.match.params;
    const { singleDeviceType } = this.state;
    const deviceType = this.getDeviceTypeFlow([deviceTypeFlow]);
    const alarmList = this.props[getAlarmStatus(deviceTypeCode)];
    let alarmStatus = alarmList ? !(alarmList instanceof Array) && alarmList.deviceList && alarmList.deviceList.some(e => e.alarmNum > 0) || (alarmList.length > 0 && alarmList.some(e => e.warningStatus)) : false;

    const stautus = [
      { text: '运行', deviceStatusCode: 400, },
      { text: '待机', deviceStatusCode: 700 },
      { text: '停机', deviceStatusCode: 200 },
      { text: '维护', deviceStatusCode: 600 },
      { text: '故障', deviceStatusCode: 300 },
      { text: '通讯中断', deviceStatusCode: 500 },
      { text: '未接入', deviceStatusCode: 900 },
    ];
    return (
      <div className={styles.windStation} >
        <WindStationTop
          singleStationData={singleStationData}
          stationList={this.props.stationList}
          weatherList={this.props.weatherList}
          operatorList={this.props.operatorList}
          operatorTime={this.props.operatorTime}
        />
        <WindStationHeader singleStationData={singleStationData} editData={editData} stationCode={stationCode} />
        <div className={styles.windContainer}>
          <div className={styles.windList}>
            <div className={styles.threadAndDevice} id="deviceType" >
              <div className={styles.deviceTypeFlow}>
                <RadioGroup value={deviceTypeCode} onChange={this.onSelectedDeviceType} >
                  {deviceType.map((item, index) => {
                    return (this.createFlowButton(item.deviceTypeCode, item.deviceTypeName, 'deviceTypeItem', 'arrowgo', true, deviceTypeCode === item.deviceTypeCode && alarmStatus))
                  })}
                  <RadioButton value={0} className={styles.elecnettingItem} key={'0'}>
                    <div className={styles.deviceTypeIcon} >
                      <i className="iconfont icon-elecnetting" ></i>
                    </div>
                    {/* <div>电网</div> */}
                  </RadioButton>
                </RadioGroup>
              </div>
              {deviceTypeCode === '101' &&
                <div className={styles.singleDeviceTypeBox}>
                  <span onClick={() => { this.onHandleStation(0) }}
                    className={singleDeviceType === 0 ? styles.spanActive : styles.spanNormal} > 全部</span>
                  {stautus.map(e => {
                    return (<span key={e.deviceStatusCode}
                      onClick={() => { this.onHandleStation(e.deviceStatusCode) }}
                      className={singleDeviceType === e.deviceStatusCode ? styles.spanActive : styles.spanNormal}>
                      {e.text} {this.getStatusNum(e.deviceStatusCode)}
                    </span>)
                  })}
                </div>
              }
            </div>
            <div>
              {`${deviceTypeCode}` === '101' && <FanListCont {...this.props} currentStatus={singleDeviceType} />}
              {`${deviceTypeCode}` === '302' && <IntegrateList {...this.props} />}
              {`${deviceTypeCode}` === '301' && <Boosterstation {...this.props} />}
              {`${deviceTypeCode}` === '0' && <PowerNet {...this.props} />}
            </div>
          </div>
          {fanDisplay !== 'deviceTable' &&
            <div className={styles.windStationChart}>
              <div className={styles.tags}>
                <CneButton lengthMode="long"><Link to={`/monitor/alarm/realtime?stationCode=${stationCode}`} className={styles.alarmBtn}> 查看告警 {dataFormats(singleStationData.alarmNum, '--')} </Link></CneButton>
                <CneButton disabled lengthMode="short"><Link to={`javascript:void(0)`} className={styles.noLink}> 统计分析  </Link></CneButton>
                <CneButton lengthMode="short"><Link to={`/report/windstation/powerReport`} className={styles.reportBtn}> 报表查询  </Link></CneButton>
              </div>
              <div className={styles.chartsBox}>
                <OutputChart
                  capabilityData={windCapabilityData}
                  yAxisUnit={'MW'}
                  loading={capabilityDataLoading}
                  capabilityDataTime={windCapabilityDataTime} />
              </div>
              <div className={styles.chartsBox}>
                <PowerDiagram
                  powerData={windPowerData}
                  onChange={this.getPowerDataTenMin}
                  powerTime={windPowerTime}
                  loading={windPowerLoading}
                />
              </div>
              <div className={styles.chartsBox}>
                <SpeedScatter
                  scatterData={singleStationScatter}
                  type={'singleStation'}
                  scatterTime={singleStationScattertime}
                  loading={singleStationScatterLoading}
                />
              </div>
            </div>
          }
        </div>
      </div>
    )
  }
}

export default WindStation;
