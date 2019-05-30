

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PvStationTop from './PvStationTop';
import OutputTenMin from '../SingleStationCommon/OutputTenMin';
import PowerDiagramTenMin from '../SingleStationCommon/PowerDiagramTenMin';
import CardSection from '../SingleStationCommon/CardSection';
import PvStationCont from './PvStationCont';
import styles from './pvStation.scss';
import moment from 'moment';
import { getDeviceTypeIcon, getAlarmStatus } from '../SingleStationCommon/DeviceTypeIcon'

class PvStation extends Component {
  static propTypes = {
    deviceTypeFlow: PropTypes.object,
    changeSingleStationStore: PropTypes.func,
    location: PropTypes.object,
    match: PropTypes.object,
    stationDeviceList: PropTypes.array,
    stationCode: PropTypes.string,
    resetSingleStationStore: PropTypes.func,
    realTimePowerUnit: PropTypes.string,
    realTimePowerPoint: PropTypes.any,
    powerUnit: PropTypes.string,
    powerPoint: PropTypes.any,
    stationList: PropTypes.array,
    getSingleStation: PropTypes.func,
    getCapabilityDiagram: PropTypes.func,
    getMonitorPower: PropTypes.func,
    getOperatorList: PropTypes.func,
    getWeatherList: PropTypes.func,
    getAlarmList: PropTypes.func,
    getWorkList: PropTypes.func,
    getDeviceTypeFlow: PropTypes.func,
    getPvmoduleList: PropTypes.func,
    getInverterList: PropTypes.func,
    getStationList: PropTypes.func,
    getBoxTransformerList: PropTypes.func,
    changeSingleStationStore: PropTypes.func,
    getStationDeviceList: PropTypes.func,
    deviceTypeCode: PropTypes.string,
    deviceTypeFlow: PropTypes.object,
    resetSingleStationStore: PropTypes.func,
    getFanList: PropTypes.func,
    getSingleScatter: PropTypes.func,
    singleStationData: PropTypes.object,
    stationList: PropTypes.array,
  }

  constructor(props) {
    super(props);
    this.state = {
      hiddenStationList: false,
    }
  }

  componentDidMount() {
    const { stationCode } = this.props.match.params;
    const stationType ='1';
    const { search } = this.props.location;
    const tmpSearchData = search.replace('?', '').split('&').filter(e => e); //  search拆分验证是否有指定展示列表
    const searchData = tmpSearchData.map(e => {
      const subData = e.split('=');
      return { [subData[0]]: subData[1] }
    })
    const deviceTypeInfo = searchData.find(e => e.showPart > 0);
    if (deviceTypeInfo) {
      const main = document.getElementById('main');
      main.scrollTo(0, 700);
      this.props.getDeviceTypeFlow({
        stationCode,
        deviceTypeCode: parseInt(deviceTypeInfo.showPart)
      });//获取设备类型流程图
    } else {
      this.props.getDeviceTypeFlow({ stationCode }); //获取设备类型流程图
    }
    this.getOneHourData(stationCode, stationType);
    this.getTenSeconds(stationCode, stationType);
    this.getPowerDataTenMin({stationCode,stationType}); // 发电量
    this.props.getStationDeviceList({ stationCode, deviceTypeCode: 203 });//获取气象站
  }

  componentWillReceiveProps(nextProps) {
    const { stationCode } = this.props.match.params;
    const nextStationCode = nextProps.match.params.stationCode;
    const nextStationType='1'
    if (nextStationCode !== stationCode) {
      clearTimeout(this.timeOutId);
      this.props.resetSingleStationStore();
      this.getTenSeconds(nextStationCode, nextStationType);
      this.getOneHourData(nextStationCode, nextStationType);
      this.getPowerDataTenMin({stationCode:nextStationCode,stationType:nextStationType});
      this.props.getDeviceTypeFlow({ stationCode: nextStationCode });//获取设备类型流程图
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeOutId);
    clearTimeout(this.timeOutOutputData);
    clearTimeout(this.timeOutPowerData);
    this.props.resetSingleStationStore();
  }

  getTenSeconds = (stationCode, stationType) => { // 10s请求一次数据 单电站 告警列表 工单列表  天气情况 
    this.props.getSingleStation({ stationCode, stationType });
    this.props.getAlarmList({ stationCode });
    this.props.getWeatherList({ stationCode }); // 天气
    let endTime = moment().utc().format();
    this.props.getWorkList({ stationCode, startTime: moment().set({ 'hour': 0, 'minute': 0, 'second': 0, }).utc().format(), endTime, });
    this.timeOutId = setTimeout(() => {
      this.getTenSeconds(stationCode,stationType);
    }, 10000);
  }

  getOneHourData = (stationCode, stationType) => { // 1小时 请求一次处理 出力图 运维人员
    clearTimeout(this.timeOutOutputData);
    this.props.getCapabilityDiagram({
      stationCode,
      stationType,
      startTime: moment().subtract(24, 'hours').utc().format(),
      endTime: moment().utc().format()
    });
    this.props.getOperatorList({ stationCode, roleId: '4,5' }); // 运维人员
    this.timeOutOutputData = setTimeout(() => {
      this.getOneHourData(stationCode, stationType);
    }, 3600000); //600000
  }

  getPowerDataTenMin = (value) => { // 10min 请求一次发电量(默认请求intervalTime = 0 的日数据)
    clearTimeout(this.timeOutPowerData);
    const {stationCode, stationType,intervalTime = 0}=value;
    let startTime = moment().subtract(6, 'day').format('YYYY-MM-DD')// 默认是6天前;
    if (intervalTime === 1) {
      startTime = moment().subtract(5, 'month').startOf('month').format('YYYY-MM-DD')
    } else if (intervalTime === 2) {
      startTime = moment().subtract(5, 'year').startOf('year').format('YYYY-MM-DD')
    }
    this.props.changeSingleStationStore({powerData:[]})
    this.props.getMonitorPower({ // 出力图数据
      stationCode,
      intervalTime,
      startTime,
      endTime: moment().subtract(1, 'day').format('YYYY-MM-DD'),
      stationType,
    });
    this.timeOutPowerData = setTimeout(() => {
      this.getPowerDataTenMin({stationCode,stationType,intervalTime});
    }, 600000);
  }

  hiddenStationList = () => {
    this.setState({
      hiddenStationList: true,
    });
  }

  render() {
    const { realTimePowerUnit, realTimePowerPoint, powerUnit, powerPoint } = this.props;
    const { stationCode } = this.props.match.params;
    return (
      <div className={styles.pvStation}  >
        <PvStationTop {...this.props} stationCode={stationCode} hiddenStationList={this.state.hiddenStationList} />
        <div className={styles.outputPowerDiagram}>
          <OutputTenMin {...this.props} yXaisName={'辐射(W/m²)'} stationCode={stationCode} yAxisUnit={realTimePowerUnit} yAxisValuePoint={realTimePowerPoint} />
          <PowerDiagramTenMin {...this.props} stationCode={stationCode} yAxisUnit={powerUnit} yAxisValuePoint={powerPoint}  getPowerDataTenMin={this.getPowerDataTenMin} />
        </div>
        <CardSection {...this.props} stationCode={stationCode} />
        {/* 设备类型流程图切换 */}
        <PvStationCont {...this.props} />
      </div>
    )
  }
}

export default PvStation;
