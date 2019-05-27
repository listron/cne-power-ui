

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PvStationTop from './PvStationTop';
import PvStationHeader from './PvStationHeader';;
import PvStationCont from './PvStationCont';
import PvDevice from './PvDevice';
import styles from './pvStation.scss';
import moment from 'moment';
import TransitionContainer from '../../../../Common/TransitionContainer';
import DetailCharts from './DetailCharts/DetailCharts';

class PvStation extends Component {
  static propTypes = {
    deviceTypeFlow: PropTypes.object,
    changeSingleStationStore: PropTypes.func,
    location: PropTypes.object,
    match: PropTypes.object,
    stationDeviceList: PropTypes.array,
    deviceTypeCode: PropTypes.number,
    stationCode: PropTypes.string,
    resetSingleStationStore: PropTypes.func,
    realTimePowerUnit: PropTypes.string,
    realTimePowerPoint: PropTypes.any,
    powerUnit: PropTypes.string,
    powerPoint: PropTypes.any,
    stationList: PropTypes.array,
    getPvSingleStation: PropTypes.func,
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
    deviceTypeCode: PropTypes.number,
    deviceTypeFlow: PropTypes.object,
    resetSingleStationStore: PropTypes.func,
    getFanList: PropTypes.func,
    getSingleScatter: PropTypes.func,
    singleStationData: PropTypes.object,
    stationList: PropTypes.array,
    monitorPvUnit: PropTypes.object,
    workList: PropTypes.object,
    monthplanpower: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      hiddenStationList: false,
    }
  }

  componentDidMount() {
    const { stationCode } = this.props.match.params;
    const stationType = '1';
    const { search } = this.props.location;
    const tmpSearchData = search.replace('?', '').split('&').filter(e => e); //  search拆分验证是否有指定展示列表
    const searchData = tmpSearchData.map(e => {
      const subData = e.split('=');
      return { [subData[0]]: subData[1] }
    })
    const deviceTypeInfo = searchData.find(e => e.showPart > 0);
    if (deviceTypeInfo) {
      this.props.getDeviceTypeFlow({
        stationCode,
        deviceTypeCode: parseInt(deviceTypeInfo.showPart)
      });//获取设备类型流程图
    } else {
      this.props.getDeviceTypeFlow({ stationCode }); //获取设备类型流程图
    }
    this.getOneHourData(stationCode, stationType);
    this.getTenSeconds(stationCode, stationType);

    this.props.monthplanpower({ stationCode })

  }

  componentWillReceiveProps(nextProps) {
    const { stationCode } = this.props.match.params;
    const nextStationCode = nextProps.match.params.stationCode;
    const nextStationType = '1'
    if (nextStationCode !== stationCode) {
      clearTimeout(this.timeOutId);
      this.props.resetSingleStationStore();
      this.getTenSeconds(nextStationCode, nextStationType);
      this.getOneHourData(nextStationCode, nextStationType);
      this.getPowerDataTenMin({ stationCode: nextStationCode, stationType: nextStationType });
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
    this.props.getPvSingleStation({ stationCode });
    this.props.getAlarmList({ stationCode });
    this.props.getWeatherList({ stationCode }); // 天气
    this.props.getWorkList({
      stationCode,
      startTime: moment().set({ 'hour': 0, 'minute': 0, 'second': 0, }).utc().format(),
      endTime:moment().utc().format(),
    });
    this.timeOutId = setTimeout(() => {
      this.getTenSeconds(stationCode, stationType);
    }, 10000);
  }

  getOneHourData = (stationCode, stationType) => {
    this.props.getCapabilityDiagram({
      stationCode,
      stationType,
      startTime: moment().startOf('day').utc().format(),
      endTime: moment().endOf('day').utc().format()
    });
    this.getPowerDataTenMin({ stationCode, stationType }); // 发电量
    this.props.getOperatorList({ stationCode, roleId: '4,5' }); // 运维人员
  }

  getPowerDataTenMin = (value) => { // 10min 请求一次发电量(默认请求intervalTime = 0 的日数据)
    const { stationCode, intervalTime = 0 } = value;
    let startTime = moment().subtract(30, 'day').format('YYYY-MM-DD')// 默认是6天前;
    if (intervalTime === 1) {
      startTime = moment().subtract(5, 'month').startOf('month').format('YYYY-MM-DD')
    } else if (intervalTime === 2) {
      startTime = moment().subtract(5, 'year').startOf('year').format('YYYY-MM-DD')
    }
    this.props.changeSingleStationStore({ powerData: [] })
    this.props.getPvMonitorPower({ // 出力图数据
      stationCode,
      intervalTime,
      startTime,
      endTime: moment().subtract(1, 'day').format('YYYY-MM-DD'),
    });
  }
  

  hiddenStationList = () => {
    this.setState({
      hiddenStationList: true,
    });
  }

  detailShow = () => { // 查看详情
    this.setState({ detailVisible: true })
  }

  detailHide = (value) => { // 关闭详情
    this.setState(value)
  }

  render() {
    const { singleStationData, editData, monitorPvUnit, monthPlanPower } = this.props;
    const { detailVisible } = this.state;
    const { stationCode } = this.props.match.params;
    const { alarmNum } = singleStationData;
    return (
      <div className={styles.pvStationWrap}>
        <div className={styles.pvStation}  >
          <PvStationTop {...this.props} stationCode={stationCode} hiddenStationList={this.state.hiddenStationList} />
          <PvStationHeader
            singleStationData={singleStationData}
            editData={editData}
            stationCode={stationCode}
            monitorPvUnit={monitorPvUnit}
          />
          <PvDevice {...this.props} />
          <div onClick={this.detailShow} className={styles.detailShow}>
            <i className={`iconfont icon-back ${styles.show}`}></i>
            <span className={styles.detailShowfont}>查看电站概况</span>
          </div>
        </div>
        <TransitionContainer
          show={detailVisible}
          timeout={500}
          effect="side"
        >
          <DetailCharts
            alarmNum={alarmNum}
            workList={this.props.workList}
            detailChange={this.detailHide}
            {...this.props}
            detailVisible={detailVisible}
            getPowerDataTenMin={this.getPowerDataTenMin}
          />
        </TransitionContainer>
      </div>

    )
  }
}

export default PvStation;
