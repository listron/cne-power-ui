
import React, { Component } from "react";
import { connect } from "react-redux";
import styles from "./alarm.scss";
import PropTypes from "prop-types";
import { Tabs } from 'antd';
import AlarmStatisticByType from '../../../components/Monitor/Alarm/AlarmStatistic/AlarmStatisticByType.jsx';
// import { allStationAction } from '../../../../constants/actionTypes/monitor/stationMonitor/allStationAction';
// import Allstation from '../../../../components/Monitor/StationMonitor/AllStation/AllStation.jsx';
// import WindStation from '../../../../components/Monitor/StationMonitor/AllStation/WindStation/WindStation.jsx';
// import PvStation from '../../../../components/Monitor/StationMonitor/AllStation/PvStation/PvStation.jsx';
//import TransitionContainer from '../../../../components/Common/TransitionContainer';

const TabPane = Tabs.TabPane;
class AllStation extends Component {
  static propTypes = {
    // getAllMonitorStation: PropTypes.func,
    // getPvMonitorStation: PropTypes.func,
    // getWindMonitorStation: PropTypes.func,
     loading: PropTypes.bool,
  }
  constructor(props) {
    super(props);
    this.state = {
      key: '风电',
    }
  }
  componentDidMount() {
    //this.props.getAllMonitorStation({stationType:'2'})
  }

  queryTargetData = (activeKey) => {
    // activeKey === '全部' ? this.props.getAllMonitorStation({stationType:'2'}) : activeKey === '风电' ? this.props.getWindMonitorStation({stationType:'0'}) : activeKey === '光伏' ? this.props.getPvMonitorStation({stationType:'1'}) : alert('这个按钮没有考虑呢')
    this.setState({
      key: activeKey,
    })
  }


  render() {
    let { key } = this.state;
    const { loading } = this.props;

    const operations = (
      <div style={{marginRight:'50px'}}>
        单电站告警统计
        <i className="iconfont icon-filter"></i>
      </div>
    );

    return (
      <div className={styles.alarmStatist}>
      
        <div className={styles.alarmStatistTabs}>
          <div className="tabsContainer">
            <Tabs type="card" activeKey={key} tabBarExtraContent= {operations}  onChange={this.queryTargetData} >
             
              <TabPane tab="风电" key="风电">
               <AlarmStatisticByType {...this.props} graphId="windStation" /> 
              </TabPane>
              <TabPane tab="光伏" key="光伏">
              <AlarmStatisticByType {...this.props} graphId="pvStation" /> 
              </TabPane>
            </Tabs>
          </div>
        </div>
      </div>
    )
  }
}
const mapStateToProps = (state) => ({
  //...state.monitor.alarmReducer.toJS()
  //...state.monitor.stationMonitor.toJS()
})
const mapDispatchToProps = (dispatch) => ({
  //getAllMonitorStation: payload => dispatch({ type: allStationAction.GET_ALL_MONITORSTATION_SAGA, payload }),
  //getWindMonitorStation: payload => dispatch({ type: allStationAction.GET_WIND_MONITORSTATION_SAGA, payload }),
  //getPvMonitorStation: payload => dispatch({ type: allStationAction.GET_PV_MONITORSTATION_SAGA, payload }),
  //changeMonitorStationStore: payload => dispatch({ type: allStationAction.CHANGE_MONITORSTATION_STORE_SAGA, payload }),


})


export default connect(mapStateToProps, mapDispatchToProps)(AllStation);









