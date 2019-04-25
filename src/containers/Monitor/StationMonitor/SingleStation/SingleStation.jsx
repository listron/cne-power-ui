import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styles from './singleStation.scss';
import { singleStationAction } from './singleStationAction';
import moment from 'moment';
import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
import Footer from '../../../../components/Common/Footer/index';
import PvStation from '../../../../components/Monitor/StationMonitor/SingleStation/PvStation/PvStation';
// import WindStation from '../../../../components/Monitor/StationMonitor/SingleStation/WindStation/WindStation';
import WindStation from '../../../../components/Monitor/StationMonitor/SingleStation/NewWindStation/WindStation';
class SingleStation extends Component {
  static propTypes = {
    stationType: PropTypes.string,
    match: PropTypes.object,
    location: PropTypes.object,
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
    deviceTypeCode: PropTypes.number,
    deviceTypeFlow: PropTypes.object,
    resetSingleStationStore: PropTypes.func,
    getFanList: PropTypes.func,
    getSingleScatter: PropTypes.func,
    singleStationData: PropTypes.object,
    stationList: PropTypes.array,
  };
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { stationCode } = this.props.match.params;
    const { stationList } = this.props;
    const staions = stationList.filter(e => e.stationCode === +stationCode);
    const stationType = staions.length > 0 && `${staions[0].stationType}`;
    this.props.changeSingleStationStore({ stationType })

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
    this.getPowerDataTenMin(stationCode); // 发电量
    this.props.getStationDeviceList({ stationCode, deviceTypeCode: 203 });//获取气象站
  }

  componentWillReceiveProps(nextProps) {
    const { stationCode } = this.props.match.params;
    const nextStationCode = nextProps.match.params.stationCode;
    const { stationList } = nextProps;
    const staions = stationList.filter(e => e.stationCode === +nextStationCode);
    const nextStationType = staions.length > 0 && `${staions[0].stationType}`;
    if (nextStationCode !== stationCode) {
      clearTimeout(this.timeOutId);
      this.props.resetSingleStationStore();
      this.getTenSeconds(nextStationCode, nextStationType);
      this.getOneHourData(nextStationCode, nextStationType);
      this.getPowerDataTenMin(nextStationCode);
      this.props.getDeviceTypeFlow({ stationCode: nextStationCode });//获取设备类型流程图
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeOutId);
    clearTimeout(this.timeOutOutputData);
    clearTimeout(this.timeOutPowerData);
    this.props.resetSingleStationStore();
  }

  getTenSeconds = (stationCode, stationType) => { // 10s请求一次数据 单电站 告警列表 工单列表  运维人员 天气情况 
    this.props.getSingleStation({ stationCode, stationType });
    this.props.getAlarmList({ stationCode });
    let endTime = moment().utc().format();
    this.props.getWorkList({ stationCode, startTime: moment().set({ 'hour': 0, 'minute': 0, 'second': 0, }).utc().format(), endTime, });
    this.timeOutId = setTimeout(() => {
      this.getTenSeconds(stationCode,stationType);
    }, 10000);
  }

  getOneHourData = (stationCode, stationType) => { // 1小时 请求一次处理 出力图 天气
    clearTimeout(this.timeOutOutputData);
    this.props.getCapabilityDiagram({
      stationCode,
      stationType,
      startTime: moment().subtract(24, 'hours').utc().format(),
      endTime: moment().utc().format()
    });
    this.props.getWeatherList({ stationCode }); // 天气
    this.props.getOperatorList({ stationCode, roleId: '4,5' }); // 运维人员
    this.props.getSingleScatter({ stationCode }); // 散点
    this.timeOutOutputData = setTimeout(() => {
      this.getOneHourData(stationCode, stationType);
    }, 3600000); //600000
  }

  getPowerDataTenMin = (stationCode, intervalTime = 0) => { // 10min 请求一次发电量(默认请求intervalTime = 0 的日数据)
    clearTimeout(this.timeOutPowerData);
    let startTime = moment().subtract(5, 'day').format('YYYY-MM-DD')// 默认是6天前;
    if (intervalTime === 1) {
      startTime = moment().subtract(5, 'month').startOf('month').format('YYYY-MM-DD')
    } else if (intervalTime === 2) {
      startTime = moment().subtract(5, 'year').startOf('year').format('YYYY-MM-DD')
    }
    this.props.changeSingleStationStore({powerData:[]})
    this.props.getMonitorPower({
      stationCode,
      intervalTime,
      startTime,
      endTime: moment().format('YYYY-MM-DD')
    });
    this.timeOutPowerData = setTimeout(() => {
      this.getPowerDataTenMin(stationCode, intervalTime);
    }, 600000);
  }

  render() {
    const { stationType } = this.props;
    return (
      <div className={styles.singleStation}>
        <CommonBreadcrumb breadData={[{ name: '电站监控' }]} style={{ marginLeft: '38px', backgroundColor: '#fff' }} />
        <div className={styles.singleStationContainer} >
          {stationType === '1' && <PvStation {...this.props} />}
          {stationType === '0' && <WindStation {...this.props} />}
          {!stationType && <div styles={{ display: 'flex', flex: 1, backgroundColor: '#fff' }}></div>}
        </div>
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return ({
    ...state.monitor.singleStation.toJS(),
    stationList: state.common.get('stations').toJS(),
    realTimePowerUnit: state.common.get('realTimePowerUnit'),
    realTimePowerPoint: state.common.get('realTimePowerPoint'),
    realCapacityUnit: state.common.get('realCapacityUnit'),
    realCapacityPoint: state.common.get('realCapacityPoint'),
    powerUnit: state.common.get('powerUnit'),
    powerPoint: state.common.get('powerPoint'),
  })
};

const mapDispatchToProps = (dispatch) => ({
  changeSingleStationStore: payload => dispatch({ type: singleStationAction.changeSingleStationStore, payload }),
  resetSingleStationStore: payload => dispatch({ type: singleStationAction.resetStore }),
  getRealSingleData: payload => dispatch({ type: singleStationAction.getRealSingleData }),
  getSingleStation: payload => dispatch({ type: singleStationAction.GET_SINGLE_STATION_SAGA, payload }),
  getCapabilityDiagram: payload => dispatch({ type: singleStationAction.GET_CAPABILITY_DIAGRAM_SAGA, payload }),
  getMonitorPower: payload => dispatch({ type: singleStationAction.GET_MONITOR_POWER_SAGA, payload }),
  getOperatorList: payload => dispatch({ type: singleStationAction.GET_OPERATOR_LIST_SAGA, payload }),
  getWeatherList: payload => dispatch({ type: singleStationAction.GET_WEATHER_LIST_SAGA, payload }),
  getAlarmList: payload => dispatch({ type: singleStationAction.GET_ALARM_LIST_SAGA, payload }),
  getWorkList: payload => dispatch({ type: singleStationAction.GET_WORK_LIST_SAGA, payload }),
  getDeviceTypeFlow: payload => dispatch({ type: singleStationAction.GET_DEVICE_TYPE_FLOW_SAGA, payload }),
  getPvmoduleList: payload => dispatch({ type: singleStationAction.GET_PVMODULE_LIST_SAGA, payload }),
  getInverterList: payload => dispatch({ type: singleStationAction.GET_INVERTER_LIST_SAGA, payload }),
  getBoxTransformerList: payload => dispatch({ type: singleStationAction.GET_BOXTRANSFORMER_LIST_SAGA, payload }),
  getStationList: payload => dispatch({ type: singleStationAction.GET_STATION_LIST_SAGA, payload }),
  getStationDeviceList: payload => dispatch({ type: singleStationAction.GET_STATION_DEVICELIST_SAGA, payload }),
  getConfluenceBoxList: payload => dispatch({ type: singleStationAction.GET_CONFLUENCEBOX_LIST_SAGA, payload }),
  getCollectorLine: payload => dispatch({ type: singleStationAction.getCollectorLine, payload }),
  getBoosterstation: payload => dispatch({ type: singleStationAction.getBoosterstation, payload }),
  getPowerNet: payload => dispatch({ type: singleStationAction.getPowerNet, payload }),
  editData: payload => dispatch({ type: singleStationAction.EDIT_MONTH_YEAR_DATA_SAGA, payload }),
  getFanList: payload => dispatch({ type: singleStationAction.getFanList, payload }),
  getNewFanList: payload => dispatch({ type: singleStationAction.getNewFanList, payload }),
  getSingleScatter: payload => dispatch({ type: singleStationAction.getSingleScatter, payload }),
  getPointparams: payload => dispatch({ type: singleStationAction.pointparams, payload }),
});

export default connect(mapStateToProps, mapDispatchToProps)(SingleStation);
