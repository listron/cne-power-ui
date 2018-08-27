import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './deviceMonitor.scss';
import { deviceAction } from '../../../../constants/actionTypes/monitor/stationMonitor/deviceAction';
import PropTypes from 'prop-types';
import Seriesinverter from '../../../../components/Monitor/StationMonitor/DeviceMonitor/Seriesinverter/Seriesinverter';
import Confluencebox from '../../../../components/Monitor/StationMonitor/DeviceMonitor/Confluencebox/Confluencebox';
import Boxtransformer from '../../../../components/Monitor/StationMonitor/DeviceMonitor/Boxtransformer/Boxtransformer';
import Weatherstation from '../../../../components/Monitor/StationMonitor/DeviceMonitor/Weatherstation/Weatherstation';
import Footer from '../../../../components/Common/Footer';

class DeviceMonitor extends Component {
  static propTypes = {
    match: PropTypes.object,
    getMonitorDeviceData: PropTypes.func,
  }
  constructor(props) {
    super(props);
  }

  render() {
    const { deviceTypeCode } = this.props.match.params;
    return (
      <div className={styles.monitorDevice}>
        {deviceTypeCode === '206' && <Seriesinverter {...this.props} /> }
        {deviceTypeCode === '202' && <Confluencebox {...this.props} /> }
        {deviceTypeCode === '304' && <Boxtransformer {...this.props} /> }
        {deviceTypeCode === '203' && <Weatherstation {...this.props} /> }
        <Footer />
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
    ...state.monitor.deviceMonitor.toJS(),
});

const mapDispatchToProps = (dispatch) => ({
  getMonitorDeviceData: payload => dispatch({ type: deviceAction.GET_DEVICE_DATA_SAGA, payload }),
});

export default connect(mapStateToProps, mapDispatchToProps)(DeviceMonitor);
