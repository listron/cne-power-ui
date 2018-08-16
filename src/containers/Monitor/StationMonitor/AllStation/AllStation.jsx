
import React, { Component } from "react";
import { connect } from "react-redux";
import styles from "./allstation.scss";
import PropTypes from "prop-types";
import { Tabs, Spin } from 'antd';
import { allStationAction } from '../../../../constants/actionTypes/monitor/stationMonitor/allStationAction';
import Allstation from '../../../../components/Monitor/StationMonitor/AllStation/AllStation.jsx';
import WindStation from '../../../../components/Monitor/StationMonitor/AllStation/WindStation/WindStation.jsx';
import PvStation from '../../../../components/Monitor/StationMonitor/AllStation/PvStation/PvStation.jsx';
//import TransitionContainer from '../../../../components/Common/TransitionContainer';

const TabPane = Tabs.TabPane;
class AllStation extends Component {
  static propTypes = {
    getAllMonitorStation: PropTypes.func,
    getPvMonitorStation: PropTypes.func,
    getWindMonitorStation: PropTypes.func,
    loading: PropTypes.bool,
  }
  constructor(props) {
    super(props);
    this.state = {
      key: '全部',
    }
  }
  componentDidMount() {
    this.props.getAllMonitorStation()
  }
  queryTargetData = (activeKey) => {
    activeKey === '全部' ? this.props.getAllMonitorStation() : activeKey === '风电' ? this.props.getWindMonitorStation() : activeKey === '光伏' ? this.props.getPvMonitorStation() : alert('这个按钮没有考虑呢')
    this.setState({
      key: activeKey,
    })
  }


  render() {
    let { key } = this.state;
    const { loading } = this.props;

    return (
      <div className={styles.stationMonitor}>
        <div className={styles.stationContainer}>
          <div className="card-container">
            <Tabs type="card" activeKey={key} onChange={this.queryTargetData} >
              <TabPane tab="全部" key="全部" >
                {!loading ? <Allstation {...this.props} /> : <Spin size="large" />}
              </TabPane>
              <TabPane tab="风电" key="风电">
                {!loading ? <WindStation {...this.props} /> : <Spin size="large" />}
              </TabPane>
              <TabPane tab="光伏" key="光伏">
                {!loading ? <PvStation {...this.props} /> : <Spin size="large" />}
              </TabPane>
            </Tabs>
          </div>
        </div>
      </div>
    )
  }
}
const mapStateToProps = (state) => ({
  ...state.monitor.stationMonitor.toJS()
})
const mapDispatchToProps = (dispatch) => ({
  getAllMonitorStation: payload => dispatch({ type: allStationAction.GET_ALL_MONITORSTATION_SAGA, payload }),
  getWindMonitorStation: payload => dispatch({ type: allStationAction.GET_WIND_MONITORSTATION_SAGA, payload }),
  getPvMonitorStation: payload => dispatch({ type: allStationAction.GET_PV_MONITORSTATION_SAGA, payload }),
  changeMonitorStationStore: payload => dispatch({ type: allStationAction.CHANGE_MONITORSTATION_STORE_SAGA, payload }),

})


export default connect(mapStateToProps, mapDispatchToProps)(AllStation);









