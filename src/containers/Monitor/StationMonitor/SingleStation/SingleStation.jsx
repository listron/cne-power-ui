import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styles from './singleStation.scss';
import { singleStationAction } from './singleStationAction';
import SingleStationMain from '../../../../components/Monitor/StationMonitor/SingleStation/SingleStationMain';
import moment from 'moment';
import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
import Footer from '../../../../components/Common/Footer/index';
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
    singleStationData: PropTypes.object,
  };
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { stationCode } = this.props.match.params;
    this.getTenSeconds(stationCode);
    this.getOutputDataTenMin(stationCode,this.props.stationType);
    this.getPowerDataTenMin(stationCode);
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
      this.props.getDeviceTypeFlow({ stationCode });//获取设备类型流程图
    }
    this.props.getStationDeviceList({ stationCode, deviceTypeCode: 203 });//获取气象站
    this.props.getStationList({});//获取电站列表
  }

  componentWillReceiveProps(nextProps) {
    const { stationCode } = this.props.match.params;
    const nextParams = nextProps.match.params;
    const nextStationCode = nextParams.stationCode;
    const nextStationType=nextProps.stationType;
    const stationType=this.props.stationType;
    if(nextStationType && nextStationType !==stationType){
      this.getOutputDataTenMin(nextStationCode,nextStationType);
    }
    if (nextStationCode !== stationCode) {
      clearTimeout(this.timeOutId);
      this.props.resetSingleStationStore();
      this.props.getStationList({})
      this.getTenSeconds(nextStationCode);
      this.getOutputDataTenMin(nextStationCode,nextStationType);
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

  getTenSeconds = (stationCode) => {
    this.props.getSingleStation({ stationCode });
    this.props.getAlarmList({ stationCode });
    this.props.getWorkList({ stationCode, startTime: moment().set({ 'hour': 0, 'minute': 0, 'second': 0, }).utc().format(), endTime: moment().utc().format() });

    this.timeOutId = setTimeout(() => {
      this.getTenSeconds(stationCode);
    }, 10000);
  }

  getOutputDataTenMin = (stationCode,stationType) => { // 10min请求一次处理
    clearTimeout(this.timeOutOutputData);
    this.props.getCapabilityDiagram({
      stationCode,
      stationType,
      startTime: moment().subtract(24, 'hours').utc().format(),
      endTime: moment().utc().format()
    });
    this.timeOutOutputData = setTimeout(() => {
      this.getOutputDataTenMin(stationCode,stationType);
    }, 600000);
  }

  getPowerDataTenMin = (stationCode, intervalTime = 0) => { // 10min 请求一次发电量(默认请求intervalTime = 0 的日数据)
    clearTimeout(this.timeOutPowerData);
    let startTime = moment().subtract(7, 'day').format('YYYY-MM-DD')// 默认是7天前;
    if (intervalTime === 1) {
      startTime = moment().subtract(6, 'month').startOf('month').format('YYYY-MM-DD')
    } else if (intervalTime === 2) {
      startTime = moment().subtract(6, 'year').startOf('year').format('YYYY-MM-DD')
    }
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
    const { stationType }=this.props;
    return (
      <div className={styles.singleStation}>
        <CommonBreadcrumb breadData={[{ name: '电站监控' }]} style={{ marginLeft: '38px', backgroundColor: '#fff' }} />
        <div className={styles.singleStationContainer} >
          <SingleStationMain {...this.props} getPowerDataTenMin={this.getPowerDataTenMin} stationType={stationType} />
          <Footer />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return ({
    ...state.monitor.singleStation.toJS(),
    // singleStationDatas: state.monitor.stationMonitor.toJS().singleStationData,//获取当前是在哪一个类型 风电／光伏
    realTimePowerUnit: state.common.get('realTimePowerUnit'),
    realTimePowerPoint: state.common.get('realTimePowerPoint'),
    realCapacityUnit: state.common.get('realCapacityUnit'),
    realCapacityPoint: state.common.get('realCapacityPoint'),
    powerUnit: state.common.get('powerUnit'),
    powerPoint: state.common.get('powerPoint'),
  })
};

const mapDispatchToProps = (dispatch) => ({
  changeSingleStationStore: payload => dispatch({ type: singleStationAction.CHANGE_SINGLE_STATION_STORE_SAGA, payload }),
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
  getFanList: payload => dispatch({ type: singleStationAction.getFanList,payload }),
  resetSingleStationStore: payload => dispatch({ type: singleStationAction.RESET_SINGLE_STATION_STORE }),
});

export default connect(mapStateToProps, mapDispatchToProps)(SingleStation);
