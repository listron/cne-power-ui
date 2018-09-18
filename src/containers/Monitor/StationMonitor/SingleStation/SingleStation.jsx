import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styles from './singleStation.scss';
import { singleStationAction } from '../../../../constants/actionTypes/monitor/stationMonitor/singleStationAction';
import SingleStationMain from '../../../../components/Monitor/StationMonitor/SingleStation/SingleStationMain';
import moment from 'moment';
import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
import Footer from '../../../../components/Common/Footer/index';
class SingleStation extends Component {
  static propTypes = {
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
  };
  constructor(props) {
    super(props);
    this.state = {
      
    }
  }

  componentDidMount() {
    const { stationCode } = this.props.match.params;
    this.getTenSeconds(stationCode);
    this.getOutputDataTenMin(stationCode);
    this.getPowerDataTenMin(stationCode);
    this.props.getStationDeviceList({stationCode, deviceTypeCode: 203});//获取单电站气象站信息
    this.props.getStationList({});//获取电站列表
    // 如果是从设备页面跳转过来的，定位到所在设备位置
    const main = document.getElementById('main');
    const locationSearch = this.props.location.search;
    let appointDeviceCode = locationSearch.substr(locationSearch.indexOf('=')+1);
    if(appointDeviceCode && appointDeviceCode!=='undefined'){
      appointDeviceCode = parseInt(appointDeviceCode);
      this.props.changeSingleStationStore({deviceTypeCode: appointDeviceCode});
      main.scrollTo(0, 700);
    }else{
      this.props.changeSingleStationStore({deviceTypeCode: 206});
    }
  }

  componentWillReceiveProps(nextProps){
    const { stationCode } = this.props.match.params;
    const nextParams = nextProps.match.params;
    const nextStation = nextParams.stationCode;
    if( nextStation !== stationCode ){
      clearTimeout(this.timeOutId);
      this.getTenSeconds(nextStation);
      this.getOutputDataTenMin(nextStation);
      this.getPowerDataTenMin(nextStation);
      this.props.changeSingleStationStore({deviceTypeCode: 206});
    }
    // this.props.changeSingleStationStore({deviceTypeCode: nextProps.deviceTypeCode});
  }

  componentWillUnmount(){
    clearTimeout(this.timeOutId);
    clearTimeout(this.timeOutOutputData);
    clearTimeout(this.timeOutPowerData);
  }

  getTenSeconds = (stationCode) => {
    
    this.props.getSingleStation({stationCode});
    this.props.getAlarmList({stationCode});
    this.props.getWorkList({stationCode, startTime: moment().set({'hour': 0, 'minute': 0, 'second': 0, }).utc().format(), endTime: moment().utc().format()});
    this.props.getDeviceTypeFlow({stationCode});
    this.timeOutId = setTimeout(()=>{
      this.getTenSeconds(stationCode);
    },10000);
  }

  getOutputDataTenMin = (stationCode) => { // 10min请求一次处理
    clearTimeout(this.timeOutOutputData);
    this.props.getCapabilityDiagram({
      stationCode,
      startTime: moment().subtract(24, 'hours').utc().format(),
      endTime: moment().utc().format()
    });
    this.timeOutOutputData = setTimeout(()=>{
      this.getOutputDataTenMin(stationCode);
    },600000);
  }

  getPowerDataTenMin = (stationCode, intervalTime = 0) => { // 10min 请求一次发电量(默认请求intervalTime = 0 的日数据)
    clearTimeout(this.timeOutPowerData);
    this.props.getMonitorPower({
      stationCode,
      intervalTime, 
      startTime: moment().set({'year': moment().year(), 'month': 0, 'date': 1, }).format('YYYY-MM-DD'), 
      endTime: moment().format('YYYY-MM-DD')
    });
    this.timeOutPowerData = setTimeout(()=>{
      this.getPowerDataTenMin(stationCode);
    },600000);
  }

  render() {
    
    const breadCrumbData = {
      breadData:[   
       {
        name: '电站监控',
       }
      ],
    };
    return (
      <div className={styles.singleStation}>
      <CommonBreadcrumb {...breadCrumbData} style={{marginLeft:'38px', backgroundColor:'#fff'}} />
      <div className={styles.singleStationContainer} >   
        <SingleStationMain {...this.props} getPowerDataTenMin={this.getPowerDataTenMin} />
        <Footer />
      </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ...state.monitor.singleStation.toJS(),
});

const mapDispatchToProps = (dispatch) => ({
  changeSingleStationStore: payload => dispatch({type:singleStationAction.CHANGE_SINGLE_STATION_STORE_SAGA, payload}),
  getSingleStation: payload => dispatch({type:singleStationAction.GET_SINGLE_STATION_SAGA, payload}),
  getCapabilityDiagram: payload => dispatch({type:singleStationAction.GET_CAPABILITY_DIAGRAM_SAGA, payload}),
  getMonitorPower: payload => dispatch({type:singleStationAction.GET_MONITOR_POWER_SAGA, payload}),
  getOperatorList: payload => dispatch({type:singleStationAction.GET_OPERATOR_LIST_SAGA, payload}),
  getWeatherList: payload => dispatch({type:singleStationAction.GET_WEATHER_LIST_SAGA, payload }),
  getAlarmList: payload => dispatch({type:singleStationAction.GET_ALARM_LIST_SAGA, payload }),
  getWorkList: payload => dispatch({type:singleStationAction.GET_WORK_LIST_SAGA, payload }),
  getDeviceTypeFlow: payload => dispatch({type:singleStationAction.GET_DEVICE_TYPE_FLOW_SAGA, payload}),
  getPvmoduleList: payload => dispatch({type:singleStationAction.GET_PVMODULE_LIST_SAGA, payload}),
  getInverterList: payload => dispatch({type:singleStationAction.GET_INVERTER_LIST_SAGA, payload}),
  getBoxTransformerList: payload => dispatch({type:singleStationAction.GET_BOXTRANSFORMER_LIST_SAGA, payload}),
  getStationList: payload => dispatch({type:singleStationAction.GET_STATION_LIST_SAGA, payload}),
  getStationDeviceList: payload => dispatch({type:singleStationAction.GET_STATION_DEVICELIST_SAGA, payload}),
});

export default connect(mapStateToProps, mapDispatchToProps)(SingleStation);
