import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './deviceMonitor.scss';
import { deviceAction } from '../../../../constants/actionTypes/monitor/stationmonitor/deviceAction';
import PropTypes from 'prop-types';

class DeviceMonitor extends Component {
  static propTypes = {
    match: PropTypes.object,
    getMonitorDeviceData: PropTypes.func,
    enterpriseId: PropTypes.string,
  }
  constructor(props) {
    super(props);
    this.state = {
      
    }
  }
  componentDidMount(){
    const { deviceCode, deviceTypeCode } = this.props.match.params
    this.props.getMonitorDeviceData({
      deviceCode,
      deviceTypeCode
    })
  }

  render() {
    return (
      <div className={styles.inverterMonitor}>
        实时监控页面啊！
      </div>

    );
  }
}
const mapStateToProps = (state) => ({
    ...state.monitor.deviceMonitorReducer.toJS(),
});

const mapDispatchToProps = (dispatch) => ({
  getMonitorDeviceData: payload => dispatch({ type: deviceAction.GET_DEVICE_DATA_SAGA, payload }),
});

export default connect(mapStateToProps, mapDispatchToProps)(DeviceMonitor);
