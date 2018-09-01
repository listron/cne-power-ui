import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styles from './singleStation.scss';
import { singleStationAction } from '../../../../constants/actionTypes/monitor/stationMonitor/singleStationAction';
import SingleStationMain from '../../../../components/Monitor/StationMonitor/SingleStation/SingleStationMain';
import moment from 'moment';
class SingleStation extends Component {
  static propTypes = {
    match: PropTypes.object,
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
  };
  constructor(props) {
    super(props);
    this.state = {
      
    }
  }

  componentDidMount() {
    const { stationCode } = this.props.match.params;
    this.getData(stationCode);
  }

  componentWillReceiveProps(nextProps){
    const { stationCode } = this.props.match.params;
    const nextParams = nextProps.match.params;
    const nextStation = nextParams.stationCode;
    if( nextStation !== stationCode ){
      clearTimeout(this.timeOutId);
      this.getData(nextStation);
    }
  }

  componentWillUnmount(){
    clearTimeout(this.timeOutId);
  }

  getData = (stationCode) => {
    this.props.getStationList({});
    this.props.getSingleStation({stationCode});
    this.props.getCapabilityDiagram({stationCode,startTime: moment().subtract(24, 'hours').utc().format(),endTime: moment().utc().format()});
    this.props.getMonitorPower({stationCode,intervalTime: 0, startTime: moment().set({'year': moment().year(), 'month': 0, 'date': 1, }).format('YYYY-MM-DD'), endTime: moment().format('YYYY-MM-DD')});
    this.props.getOperatorList({stationCode,roleId: '4,5'});
    this.props.getWeatherList({stationCode});
    this.props.getAlarmList({stationCode});
    this.props.getWorkList({stationCode, startTime: moment().set({'hour': 0, 'minute': 0, 'second': 0, }).utc().format(), endTime: moment().utc().format()});
    this.props.getDeviceTypeFlow({stationCode});
    this.props.getPvmoduleList({stationCode});
    this.props.getInverterList({stationCode});
    this.props.getBoxTransformerList({stationCode});

    this.timeOutId = setTimeout(()=>{
      this.getData(stationCode);
    },10000);
  }

  render() {
    return (
      <div className={styles.singleStationContainer} >
        <SingleStationMain {...this.props} getData={this.getData} />
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
});

export default connect(mapStateToProps, mapDispatchToProps)(SingleStation);
