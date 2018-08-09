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

  // '206': {  // 组串式逆变器：206
  // '202': {  // 汇流箱： 202
  // '304': {  // 箱变： 304
  // '203': {  // 气象站： 203

  render() {
    const { deviceTypeCode } = this.props.match.params;
    return (
      <div className={styles.inverterMonitor}>
        实时监控页面啊！
        {deviceTypeCode === '206' && <div>组串式逆变器</div> }
        {deviceTypeCode === '202' && <div>汇流箱：</div> }
        {deviceTypeCode === '304' && <div>箱变：</div> }
        {deviceTypeCode === '203' && <div>气象站：</div> }
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
