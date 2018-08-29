import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './deviceMonitor.scss';
import { deviceAction } from '../../../../constants/actionTypes/monitor/stationMonitor/deviceAction';
import PropTypes from 'prop-types';

class InverterMonitor extends Component {
  static propTypes = {
    enterpriseId: PropTypes.string,
  }
  constructor(props) {
    super(props);
    this.state = {
      
    }
  }
  componentDidMount(){
    // console.log(this.props.enterpriseId);
  }

  render() {
    return (
      <div className={styles.inverterMonitor}>
        
      </div>

    );
  }
}
const mapStateToProps = (state) => ({
    ...state.monitor.deviceMonitor.toJS(),
});

const mapDispatchToProps = (dispatch) => ({
  getInverterDetail: payload => dispatch({type: deviceAction.GET_INVERTER_DETAIL_SAGA, payload}),
  getInverterTenMin: payload => dispatch({type: deviceAction.GET_INVERTER_TENMIN_SAGA, payload}),
  getDevicePointData: payload => dispatch({type: deviceAction.GET_MONITOR_POINT_SAGA, payload}),
  getDeviceAlarmData: payload => dispatch({type: deviceAction.GET_DEVICE_ALARM_SAGA, payload}),
});

export default connect(mapStateToProps, mapDispatchToProps)(InverterMonitor);
