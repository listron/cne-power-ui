import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './deviceMonitor.scss';
import { deviceAction } from './deviceAction';
import { singleStationAction } from '../SingleStation/singleStationAction';
import PropTypes from 'prop-types';
import Seriesinverter from '../../../../components/Monitor/StationMonitor/DeviceMonitor/Seriesinverter/Seriesinverter';
import Confluencebox from '../../../../components/Monitor/StationMonitor/DeviceMonitor/Confluencebox/Confluencebox';
import Boxtransformer from '../../../../components/Monitor/StationMonitor/DeviceMonitor/Boxtransformer/Boxtransformer';
import Weatherstation from '../../../../components/Monitor/StationMonitor/DeviceMonitor/Weatherstation/Weatherstation';
// import WindDevice from '../../../../components/Monitor/StationMonitor/DeviceMonitor/WindDevice/WindDevice';
import WindDevice from '../../../../components/Monitor/StationMonitor/DeviceMonitor/NewWindDevice/WindDevice';
import IntegrateLine from '../../../../components/Monitor/StationMonitor/DeviceMonitor/IntegrateLine/IntegrateLine';
import BoosterStation from '../../../../components/Monitor/StationMonitor/DeviceMonitor/BoosterDevice/BoosterStation';
import Footer from '../../../../components/Common/Footer';

class DeviceMonitor extends Component {
  static propTypes = {
    match: PropTypes.object,
    getSingleStation: PropTypes.func,
    resetDeviceStore: PropTypes.func,
    singleStationData: PropTypes.object,
  }
  constructor(props) {
    super(props);
  }

  componentDidMount(){
    const main = document.getElementById('main');
    main && main.scroll(0,0);
    const { stationCode } =this.props.match.params;
    this.props.getSingleStation({stationCode});
  }

  componentWillUnmount(){
    this.props.resetDeviceStore()
  }

  render() {
    const { deviceTypeCode } = this.props.match.params;
   
    return (
      <div className={styles.monitorDevice}>
        {(deviceTypeCode === '206' || deviceTypeCode === '201') && <Seriesinverter {...this.props} /> }
        {(deviceTypeCode === '202' || deviceTypeCode === '207') && <Confluencebox {...this.props} /> }
        {deviceTypeCode === '304' && <Boxtransformer {...this.props} /> }
        {deviceTypeCode === '203' && <Weatherstation {...this.props} /> }
        {deviceTypeCode === '101' && <WindDevice {...this.props} /> }
        {deviceTypeCode === '302' && <IntegrateLine {...this.props} /> }
        {deviceTypeCode === '301' && <BoosterStation {...this.props} /> }
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
  getSingleStation: payload => dispatch({type: singleStationAction.GET_SINGLE_STATION_SAGA, payload}),
  resetDeviceStore: payload => dispatch({type: deviceAction.RESET_DEVICE_MONITOR_STORE, payload}),
  getwindturbineData: payload => dispatch({type: deviceAction.getwindturbineData, payload}),
  getSequencechartData: payload => dispatch({type: deviceAction.getSequencechartData, payload}),
  getIntegrateData: payload => dispatch({type: deviceAction.getIntegrateData, payload}),
  getBoosterData: payload => dispatch({type: deviceAction.getBoosterData, payload}),
  getWindDeviceCharts: payload => dispatch({type: deviceAction.getWindDeviceCharts, payload}),
  stopWindDeviceCharts: payload => dispatch({type: deviceAction.stopWindDeviceCharts, payload}),
  getWindDeviceRealData: payload => dispatch({type: deviceAction.getWindDeviceRealData, payload}),
});

export default connect(mapStateToProps, mapDispatchToProps)(DeviceMonitor);
