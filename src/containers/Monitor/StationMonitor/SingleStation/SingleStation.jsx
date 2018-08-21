import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styles from './singleStation.scss';
import { singleStationAction } from '../../../../constants/actionTypes/monitor/stationMonitor/singleStationAction';
import SingleStationMain from '../../../../components/Monitor/StationMonitor/SingleStation/SingleStationMain';
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
  };
  constructor(props) {
    super(props);
    this.state = {
      
    }
  }
  componentDidMount() {
    const { stationCode, intervalTime } = this.props.match.params;
    this.props.getSingleStation({stationCode});
    this.props.getCapabilityDiagram({stationCode,intervalTime});
    this.props.getMonitorPower({stationCode,intervalTime});
    this.props.getOperatorList({stationCode,roleId: '4,5'});
    this.props.getWeatherList({stationCode});
    this.props.getAlarmList({stationCode});
    this.props.getWorkList({stationCode});
    this.props.getDeviceTypeFlow({stationCode});
    this.props.getPvmoduleList({stationCode});
  }

  render() {
    return (
      <div className={styles.singleStationContainer} >
        <SingleStationMain {...this.props} />
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
});

export default connect(mapStateToProps, mapDispatchToProps)(SingleStation);
