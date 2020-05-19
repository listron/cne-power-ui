import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './deviceMonitor.scss';
import { deviceAction } from './deviceMonitorReducer';
import PropTypes from 'prop-types';
import Inverter from '../../../../components/Monitor/StationMonitor/DeviceMonitor/Inverter/Inverter';
import Confluencebox from '../../../../components/Monitor/StationMonitor/DeviceMonitor/Confluencebox/Confluencebox';
import Boxtransformer from '../../../../components/Monitor/StationMonitor/DeviceMonitor/Boxtransformer/Boxtransformer';
// import Weatherstation from '../../../../components/Monitor/StationMonitor/DeviceMonitor/Weatherstation/Weatherstation';
import WindDevice from '../../../../components/Monitor/StationMonitor/DeviceMonitor/NewWindDevice/WindDevice';
import IntegrateLine from '../../../../components/Monitor/StationMonitor/DeviceMonitor/IntegrateLine/IntegrateLine';
import BoosterStation from '../../../../components/Monitor/StationMonitor/DeviceMonitor/BoosterDevice/BoosterStation';
import Footer from '../../../../components/Common/Footer';
import { deviceManageAction } from '@containers/Operation/Book/DeviceManage/deviceManageAction';
import { commonAction } from '@containers/alphaRedux/commonAction';

class DeviceMonitor extends Component {
  static propTypes = {
    match: PropTypes.object,
    getDevices: PropTypes.func,
    getBoosterstation: PropTypes.func,
    resetDeviceStore: PropTypes.func,
    theme: PropTypes.string,
  }

  constructor(props){
    super(props);
    this.state = {
      scroll: false,
    };
  }

  componentDidMount() {
    const main = document.getElementById('main');
    main.addEventListener('scroll', this.bindScroll);
    const { stationCode, deviceTypeCode } = this.props.match.params;
    if (deviceTypeCode === '301') {
      this.props.getBoosterstation({ stationCode });
    }
    this.props.getDevices({ deviceTypeCode, stationCode });
  }

  componentDidUpdate(prevProps) {
    const { deviceTypeCode, stationCode } = this.props.match.params;
    const preTypeCode = prevProps.match.params.deviceTypeCode;
    if (preTypeCode !== deviceTypeCode) { // 设备类型变化，重新请求设备列表
      this.props.getDevices({ deviceTypeCode, stationCode });
      if (deviceTypeCode === '301') {
        this.props.getBoosterstation({ stationCode });
      }
    }
  }

  componentWillUnmount() {
    const main = document.getElementById('main');
    main && main.removeEventListener('scroll', this.bindScroll, false);
    this.props.resetDeviceStore();
  }

  bindScroll = () =>{
    const main = document.getElementById('main');
    const scrollTop = main.scrollTop;
    const { scroll } = this.state;
    if (scrollTop > 0 && !scroll) {
      this.setState({ scroll: true});
    }
    if(scrollTop === 0){
      this.setState({ scroll: false });
    }
  }

  render() {
    const { scroll } = this.state;
    const { deviceTypeCode } = this.props.match.params;
    return (
      <div className={styles.monitorDevice}>
        {(deviceTypeCode === '206' || deviceTypeCode === '201') && <Inverter {...this.props} scroll={scroll} />}
        {(deviceTypeCode === '202' || deviceTypeCode === '207') && <Confluencebox {...this.props} scroll={scroll} />}
        {deviceTypeCode === '304' && <Boxtransformer scroll={scroll} {...this.props} />}
        {/* {deviceTypeCode === '203' && <Weatherstation {...this.props} /> } */}
        {deviceTypeCode === '101' && <WindDevice {...this.props} scroll={scroll} />}
        {deviceTypeCode === '302' && <IntegrateLine {...this.props} scroll={scroll} />}
        {deviceTypeCode === '301' && <BoosterStation {...this.props} scroll={scroll} />}
        <Footer theme={this.props.theme} />
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  ...state.monitor.deviceMonitor.toJS(),
  stations: state.common.get('stations').toJS(),
  theme: state.common.get('theme'),
});

const mapDispatchToProps = (dispatch) => ({
  changeDeviceManageStore: payload =>
    dispatch({
      type: deviceManageAction.CHANGE_DEVICE_MANAGE_STORE_SAGA,
      payload,
    }),
  changeDeviceStore: payload => dispatch({ type: deviceAction.CHANGE_DEVICE_MONITOR_STORE, payload }),
  resetDeviceStore: () => dispatch({ type: deviceAction.RESET_DEVICE_MONITOR_STORE }),
  getDevices: payload => dispatch({ type: deviceAction.getDevices, payload }),
  getBoosterstation: payload => dispatch({ type: deviceAction.getBoosterstation, payload }),
  getDeviceInfoMonitor: payload => dispatch({ type: deviceAction.getDeviceInfoMonitor, payload }),
  getDeviceChartMonitor: payload => dispatch({ type: deviceAction.getDeviceChartMonitor, payload }),
  stopMonitor: payload => dispatch({ type: deviceAction.stopMonitor, payload }),
  getwindturbineData: payload => dispatch({ type: deviceAction.getwindturbineData, payload }),
  getSequencechartData: payload => dispatch({ type: deviceAction.getSequencechartData, payload }),
  getWindDeviceCharts: payload => dispatch({ type: deviceAction.getWindDeviceCharts, payload }),
  stopWindDeviceCharts: payload => dispatch({ type: deviceAction.stopWindDeviceCharts, payload }),
  getWindDeviceRealData: payload => dispatch({ type: deviceAction.getWindDeviceRealData, payload }),
  handleRemoveWarning: payload => dispatch({ type: deviceAction.handleRemoveWarning, payload }),
  transferWarning: payload => dispatch({ type: deviceAction.transferWarning, payload }),
  getLostGenType: params => dispatch({
    type: commonAction.getLostGenType,
    payload: {
      params,
      actionName: deviceAction.CHANGE_DEVICE_MONITOR_STORE,
      resultName: 'defectTypes',
    },
  }),
});

export default connect(mapStateToProps, mapDispatchToProps)(DeviceMonitor);
