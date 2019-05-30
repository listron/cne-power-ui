
import React, { Component } from "react";
import { connect } from "react-redux";
import styles from "./allstation.scss";
import PropTypes from "prop-types";
import { Tabs } from 'antd';
import { allStationAction } from './allStationAction';
import Allstation from '../../../../components/Monitor/StationMonitor/AllStation/AllStation.jsx';
// import WindStation from '../../../../components/Monitor/StationMonitor/AllStation/WindStation/WindStation.jsx';
import WindStation from '../../../../components/Monitor/StationMonitor/AllStation/NewWindStation/WindStation.jsx';
import PvStation from '../../../../components/Monitor/StationMonitor/AllStation/PvStation/PvStation.jsx';
// import PvStation from '../../../../components/Monitor/StationMonitor/AllStation/NewPvStation/PvStation.jsx';
import Footer from '../../../../components/Common/Footer';
import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
class AllStation extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    allMonitorStation: PropTypes.object,
    windMonitorStation: PropTypes.object,
    pvMonitorStation: PropTypes.object,
    stationTypes: PropTypes.string,
    changeMonitorStationStore: PropTypes.func,
    stopRealMonitorData: PropTypes.func,
    getRealMonitorData: PropTypes.func,
    stationTypeCount: PropTypes.string,
    stationType: PropTypes.string,
    stopRealCharstData: PropTypes.func,
  }
  constructor(props) {
    super(props);
  }

  componentWillUnmount() {
    this.props.changeMonitorStationStore({
      stationShowType: 'stationBlock',
    });
    this.props.stopRealMonitorData();
    this.props.stopRealCharstData();
    this.props.stopRealCharstData('power');
  }

  queryTargetData = (activeKey) => { //切换电站
    const { changeMonitorStationStore, stopRealMonitorData, getRealMonitorData } = this.props;
    changeMonitorStationStore({ stationShowType: 'stationBlock', stationType: activeKey });
    stopRealMonitorData();
    // getRealMonitorData({ stationType: activeKey })
  }

  render() {
    const { stationTypeCount, stationType } = this.props;
    return (
      <div className={styles.stationMonitor}>
        <CommonBreadcrumb breadData={[{ name: '电站监控', }]} style={{ marginLeft: '38px' }} />
        <div className={styles.stationContainer}>
          {stationTypeCount === 'multiple' &&
            <div className={styles.allStationTitle} >
              <p className={`${stationType === '2' && styles.activeStation}`} onClick={() => { this.queryTargetData('2') }}>全部</p>
              <p className={`${stationType === '0' && styles.activeStation}`} onClick={() => { this.queryTargetData('0') }}>风电</p>
              <p className={`${stationType === '1' && styles.activeStation}`} onClick={() => { this.queryTargetData('1') }}>光伏</p>
            </div>
          }
          {stationTypeCount === 'multiple' && stationType === '2' && <Allstation {...this.props} />}
          {stationTypeCount === 'multiple' && stationType === '0' && <WindStation {...this.props} />}
          {stationTypeCount === 'multiple' && stationType === '1' && <PvStation {...this.props} />}
          {stationTypeCount === 'wind' && <WindStation {...this.props} />}
          {stationTypeCount === 'pv' && <PvStation {...this.props} />}
          {stationTypeCount === 'none' && <div className={styles.noData}> </div>}
        </div>
        <Footer />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return ({
    ...state.monitor.stationMonitor.toJS(),
    realTimePowerUnit: state.common.get('realTimePowerUnit'),
    realTimePowerPoint: state.common.get('realTimePowerPoint'),
    realCapacityUnit: state.common.get('realCapacityUnit'),
    realCapacityPoint: state.common.get('realCapacityPoint'),
    powerUnit: state.common.get('powerUnit'),
    powerPoint: state.common.get('powerPoint'),
    stationTypeCount: state.common.get('stationTypeCount'), // 旧版本需要保留
    monitorPvUnit:state.common.toJS().monitorPvUnit,
  })
}

const mapDispatchToProps = (dispatch) => ({
  changeMonitorStationStore: payload => dispatch({ type: allStationAction.changeMonitorstationStore, payload }),
  resetMonitorData: payload => dispatch({ type: allStationAction.resetMonitorData, payload }),
  getRealMonitorData: payload => dispatch({ type: allStationAction.getRealMonitorData, payload }),
  stopRealMonitorData: payload => dispatch({ type: allStationAction.stopRealMonitorData, payload }),
  getRealChartsData: payload => dispatch({ type: allStationAction.getRealChartsData, payload }),
  stopRealCharstData: payload => dispatch({ type: allStationAction.stopRealCharstData, payload }),
  getRealMonitorPower: payload => dispatch({ type: allStationAction.getRealMonitorPower, payload }),
  getPvChartsData: payload => dispatch({ type: allStationAction.getPvChartsData, payload }),
})

export default connect(mapStateToProps, mapDispatchToProps)(AllStation);









