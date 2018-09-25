import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './deviceMonitor.scss';
import { deviceAction } from '../../../../constants/actionTypes/monitor/stationMonitor/deviceAction';
import { singleStationAction } from '../../../../constants/actionTypes/monitor/stationMonitor/singleStationAction';
import PropTypes from 'prop-types';
import Seriesinverter from '../../../../components/Monitor/StationMonitor/DeviceMonitor/Seriesinverter/Seriesinverter';
import Confluencebox from '../../../../components/Monitor/StationMonitor/DeviceMonitor/Confluencebox/Confluencebox';
import Boxtransformer from '../../../../components/Monitor/StationMonitor/DeviceMonitor/Boxtransformer/Boxtransformer';
import Weatherstation from '../../../../components/Monitor/StationMonitor/DeviceMonitor/Weatherstation/Weatherstation';
import Footer from '../../../../components/Common/Footer';

class DeviceMonitor extends Component {
  static propTypes = {
    match: PropTypes.object,
    getSingleStation: PropTypes.func,
    singleStationData: PropTypes.object,
  }
  constructor(props) {
    super(props);
  }

  componentDidMount(){
    const { stationCode } =this.props.match.params;
    this.props.getSingleStation({stationCode});
  }

  render() {
    const { deviceTypeCode } = this.props.match.params;
    return (
      <div className={styles.monitorDevice}>
        {(deviceTypeCode === '206' || deviceTypeCode === '201') && <Seriesinverter {...this.props} /> }
        {(deviceTypeCode === '202' || deviceTypeCode === '207') && <Confluencebox {...this.props} /> }
        {deviceTypeCode === '304' && <Boxtransformer {...this.props} /> }
        {deviceTypeCode === '203' && <Weatherstation {...this.props} /> }
        <Footer />
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
    ...state.monitor.deviceMonitor.toJS(),
    singleStationData: state.monitor.singleStation.get('singleStationData').toJS(),//获取面包屑电站名称
});

const mapDispatchToProps = (dispatch) => ({
  getMonitorDeviceData: payload => dispatch({ type: deviceAction.GET_DEVICE_DATA_SAGA, payload }),
  getTenMinDeviceData: payload => dispatch({ type: deviceAction.GET_DEVICE_MONITOR_TEN_MIN_DATA_SAGA, payload }),
  getSingleStation: payload => dispatch({type:singleStationAction.GET_SINGLE_STATION_SAGA, payload}),
});

export default connect(mapStateToProps, mapDispatchToProps)(DeviceMonitor);
