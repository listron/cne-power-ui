import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styles from './singleStation.scss';
import { singleStationAction } from './singleStationAction';
import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
import Footer from '../../../../components/Common/Footer/index';
import PvStation from '../../../../components/Monitor/StationMonitor/SingleStation/NewPvStation/PvStation';
// import PvStation from '../../../../components/Monitor/StationMonitor/SingleStation/PvStation/PvStation';
// import WindStation from '../../../../components/Monitor/StationMonitor/SingleStation/WindStation/WindStation';
import WindStation from '../../../../components/Monitor/StationMonitor/SingleStation/NewWindStation/WindStation';
class SingleStation extends Component {
  static propTypes = {
    stationType: PropTypes.string,
    match: PropTypes.object,
    changeSingleStationStore: PropTypes.func,
    resetSingleStationStore: PropTypes.func,
    getFanList: PropTypes.func,
    getSingleScatter: PropTypes.func,
    stationList: PropTypes.array,
    stopSingleRealData: PropTypes.func,
  };
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { stationCode } = this.props.match.params;
    const { stationList } = this.props;
    const staions = stationList.filter(e => e.stationCode === +stationCode);
    const stationType = staions.length > 0 && `${staions[0].stationType}`;
    this.props.changeSingleStationStore({ stationType })
  }

  componentWillReceiveProps(nextProps) {
    const { stationCode, } = this.props.match.params;
    const {stationType}=this.props;
    const nextStationCode = nextProps.match.params.stationCode;
    const { stationList } = nextProps;
    const staions = stationList.filter(e => e.stationCode === +nextStationCode);
    const nextStationType = staions.length > 0 && `${staions[0].stationType}`;
    if (nextStationCode !== stationCode || stationType!== nextStationType) {
      this.props.changeSingleStationStore({ stationType:nextStationType})
    }
  }

  componentWillUnmount() {
    this.props.resetSingleStationStore();
  }


  render() {
    const { stationType } = this.props;
    return (
      <div className={styles.singleStation}>
        <CommonBreadcrumb breadData={[{ name: '电站监控' }]} style={{ marginLeft: '38px', backgroundColor: '#fff' }} />
        <div className={styles.singleStationContainer} >
          {stationType === '1' && <PvStation {...this.props} />}
          {stationType === '0' && <WindStation {...this.props} />}
          {!stationType && <div style={{ display: 'flex', flex: 1, backgroundColor: '#fff' }}></div>}
        </div>
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return ({
    ...state.monitor.singleStation.toJS(),
    stationList: state.common.get('stations').toJS(),
    realTimePowerUnit: state.common.get('realTimePowerUnit'),
    realTimePowerPoint: state.common.get('realTimePowerPoint'),
    realCapacityUnit: state.common.get('realCapacityUnit'),
    realCapacityPoint: state.common.get('realCapacityPoint'),
    powerUnit: state.common.get('powerUnit'),
    powerPoint: state.common.get('powerPoint'),
    monitorPvUnit: state.common.toJS().monitorPvUnit,
  })
};

const mapDispatchToProps = (dispatch) => ({
  changeSingleStationStore: payload => dispatch({ type: singleStationAction.changeSingleStationStore, payload }),
  resetSingleStationStore: payload => dispatch({ type: singleStationAction.resetStore }),
  getRealSingleData: payload => dispatch({ type: singleStationAction.getRealSingleData }),
  getSingleStation: payload => dispatch({ type: singleStationAction.GET_SINGLE_STATION_SAGA, payload }),
  getCapabilityDiagram: payload => dispatch({ type: singleStationAction.GET_CAPABILITY_DIAGRAM_SAGA, payload }),
  getWindMonitorPower: payload => dispatch({ type: singleStationAction.GET_MONITOR_POWER_SAGA, payload }),
  getOperatorList: payload => dispatch({ type: singleStationAction.GET_OPERATOR_LIST_SAGA, payload }),
  getWeatherList: payload => dispatch({ type: singleStationAction.GET_WEATHER_LIST_SAGA, payload }),
  getAlarmList: payload => dispatch({ type: singleStationAction.GET_ALARM_LIST_SAGA, payload }),
  getWorkList: payload => dispatch({ type: singleStationAction.GET_WORK_LIST_SAGA, payload }),
  getDeviceTypeFlow: payload => dispatch({ type: singleStationAction.GET_DEVICE_TYPE_FLOW_SAGA, payload }),
  getPvmoduleList: payload => dispatch({ type: singleStationAction.GET_PVMODULE_LIST_SAGA, payload }),
  getInverterList: payload => dispatch({ type: singleStationAction.GET_INVERTER_LIST_SAGA, payload }),
  getBoxTransformerList: payload => dispatch({ type: singleStationAction.GET_BOXTRANSFORMER_LIST_SAGA, payload }),
  getStationList: payload => dispatch({ type: singleStationAction.GET_STATION_LIST_SAGA, payload }),
  getStationDeviceList: payload => dispatch({ type: singleStationAction.GET_STATION_DEVICELIST_SAGA, payload }),
  getConfluenceBoxList: payload => dispatch({ type: singleStationAction.GET_CONFLUENCEBOX_LIST_SAGA, payload }),
  getCollectorLine: payload => dispatch({ type: singleStationAction.getCollectorLine, payload }),
  getBoosterstation: payload => dispatch({ type: singleStationAction.getBoosterstation, payload }),
  getPowerNet: payload => dispatch({ type: singleStationAction.getPowerNet, payload }),
  editData: payload => dispatch({ type: singleStationAction.EDIT_MONTH_YEAR_DATA_SAGA, payload }),
  getFanList: payload => dispatch({ type: singleStationAction.getFanList, payload }),
  getNewFanList: payload => dispatch({ type: singleStationAction.getNewFanList, payload }),
  getSingleScatter: payload => dispatch({ type: singleStationAction.getSingleScatter, payload }),
  getPointparams: payload => dispatch({ type: singleStationAction.pointparams, payload }),
  getSingleRealChartsData: payload => dispatch({ type: singleStationAction.getSingleRealChartsData, payload }),
  stopSingleRealData: payload => dispatch({ type: singleStationAction.stopSingleRealData, payload }),
  getPvSingleStation: payload => dispatch({ type: singleStationAction.getPvSingleStation, payload }),
  getWindSingleStation: payload => dispatch({ type: singleStationAction.getWindSingleStation, payload }),
  monthplanpower: payload => dispatch({ type: singleStationAction.monthplanpower, payload }),
  getPvMonitorPower: payload => dispatch({ type: singleStationAction.getPvMonitorPower, payload }),
  getWeatherDetail: payload => dispatch({ type: singleStationAction.getWeatherDetail, payload }),
  getRadiationchart: payload => dispatch({ type: singleStationAction.getRadiationchart, payload }),
  getNewDeviceTypeFlow: payload => dispatch({ type: singleStationAction.getNewDeviceTypeFlow, payload }),
  getSketchmap: payload => dispatch({ type: singleStationAction.getSketchmap, payload }),
});

export default connect(mapStateToProps, mapDispatchToProps)(SingleStation);
