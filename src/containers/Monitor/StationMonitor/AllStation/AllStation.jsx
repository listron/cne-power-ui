
import React, { Component } from "react";
import { connect } from "react-redux";
import styles from "./allstation.scss";
import PropTypes from "prop-types";
import { Tabs } from 'antd';
import { allStationAction } from './allStationAction';
import Allstation from '../../../../components/Monitor/StationMonitor/AllStation/AllStation.jsx';
import WindStation from '../../../../components/Monitor/StationMonitor/AllStation/WindStation/WindStation.jsx';
import PvStation from '../../../../components/Monitor/StationMonitor/AllStation/PvStation/PvStation.jsx';
import Footer from '../../../../components/Common/Footer';
import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
const TabPane = Tabs.TabPane;
class AllStation extends Component {
  static propTypes = {
    getMonitorStation: PropTypes.func,
    loading: PropTypes.bool,
    allMonitorStation: PropTypes.object,
    windMonitorStation: PropTypes.object,
    pvMonitorStation: PropTypes.object,
    stationTypes: PropTypes.string,
    changeMonitorStationStore: PropTypes.func,
    stopRealtimeData: PropTypes.func,
    getRealtimeData: PropTypes.func,
    stationTypeCount: PropTypes.string,
    stationType: PropTypes.string,
  }
  constructor(props) {
    super(props);
  }

  componentWillUnmount() {
    this.props.changeMonitorStationStore({
      stationShowType: 'stationBlock',
      stationType:'2',
    });
    this.props.stopRealtimeData()
  }

  queryTargetData = (activeKey) => { //切换电站
    const { changeMonitorStationStore, stopRealtimeData, getRealtimeData } = this.props;
    changeMonitorStationStore({ stationShowType: 'stationBlock', stationType: activeKey });
    stopRealtimeData();
    getRealtimeData({ stationType: activeKey })
  }

  render() {
    const { stationTypeCount,stationType } = this.props;
    return (
      <div className={styles.stationMonitor}>
        <CommonBreadcrumb breadData={[{ name: '电站监控', }]} style={{ marginLeft: '38px' }} />
        <div className={styles.stationContainer}>
          {stationTypeCount === 'multiple' &&
            <Tabs type="card" activeKey={stationType} onChange={this.queryTargetData} tabBarGutter={0} >
              <TabPane tab="全部" key="2" ><Allstation {...this.props} /></TabPane>
              <TabPane tab="风电" key="0"><WindStation {...this.props} /></TabPane>
              <TabPane tab="光伏" key="1"><PvStation {...this.props} /></TabPane>
            </Tabs>
          }
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
    stationTypeCount: state.common.get('stationTypeCount'),
  })
}
const mapDispatchToProps = (dispatch) => ({
  getMonitorStation: payload => dispatch({ type: allStationAction.getMonitorStation, payload }),
  changeMonitorStationStore: payload => dispatch({ type: allStationAction.changeMonitorstationStore, payload }),
  getRealtimeData: payload => dispatch({ type: allStationAction.getRealtimeData, payload }),
  stopRealtimeData: payload => dispatch({ type: allStationAction.stopRealtimeData, payload }),
  resetMonitorData: payload => dispatch({ type: allStationAction.resetMonitorData, payload }),
})

export default connect(mapStateToProps, mapDispatchToProps)(AllStation);









