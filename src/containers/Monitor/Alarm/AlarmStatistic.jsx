
import React, { Component } from "react";
import { connect } from "react-redux";
import styles from "./alarm.scss";
import PropTypes from "prop-types";
import { Tabs } from 'antd';
import AlarmStatisticByType from '../../../components/Monitor/Alarm/AlarmStatistic/AlarmStatisticByType.jsx';
import { alarmAction } from '../../../constants/actionTypes/monitor/alarmAction';




const TabPane = Tabs.TabPane;
class AllStation extends Component {
  static propTypes = {
    warningLevel: PropTypes.array,
    stationType: PropTypes.string,
    stationCode: PropTypes.array,
    deviceTypeCode: PropTypes.array,
    warningConfigName: PropTypes.array,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
    deviceName: PropTypes.string,

    getRealTimeAlarm: PropTypes.func,
    getAlarmNum: PropTypes.func,
    location: PropTypes.object,
    loading: PropTypes.bool,
  }
  constructor(props) {
    super(props);
    this.state = {
      key: '风电',
    }
  }
  componentDidMount() {
    const { warningLevel, stationType, stationCode, deviceTypeCode, warningConfigName, startTime, endTime, deviceName} = this.props;
    const status = this.getStatus();
    const warningStatus = this.getAlarmStatus(status);
    this.props.getRealTimeAlarm({
      warningLevel,
      stationType,
      stationCode,
      deviceTypeCode,
      warningConfigName,
      startTime,
      endTime,
      deviceName,
      isTransferWork: status === 'transfer' ? 0 : 1,
      isRelieveAlarm: status === 'relieve' ? 0: 1
    });
   // this.props.getDefectTypes({stationType: 2});
    this.props.getAlarmNum({warningStatus});
  }
  
  onChangeFilter = (obj) => {
    const status = this.getStatus();
    const { warningLevel, stationCode, deviceTypeCode, warningConfigName, startTime, endTime, deviceName } = this.props;
    let filter = {
      warningLevel,
      stationCode,
      deviceTypeCode,
      warningConfigName,
      startTime,
      endTime,
      deviceName,
      isTransferWork: status==='transfer'?0:1,
      isRelieveAlarm: status==='relieve'?0:1
    }
    let newFiter = Object.assign({}, filter, obj);
    this.props.getRealTimeAlarm(newFiter);
  }
  getStatus() {
    const pathname = this.props.location.pathname;
    const status = pathname.split('/')[4];
    return status;
  }
  getAlarmStatus(status) {
    let warningStatus = 1;
    if(status === 'transfer') {
      warningStatus = 3;
    } else if(status === 'relieve') {
      warningStatus = 2;
    }
    return warningStatus;
  }
  queryTargetData = (activeKey) => {

    this.setState({
      key: activeKey,
    })
  }


  render() {
   
    let { key } = this.state;
   

    const operations = (
      <div style={{ marginRight: '50px' }}>
        单电站告警统计
        <i className="iconfont icon-filter"></i>
      </div>
    );

    return (
      <div className={styles.alarmStatist}>

        <div className={styles.alarmStatistTabs}>
          <div className="tabsContainer">
            <Tabs type="card" activeKey={key} tabBarExtraContent={operations} onChange={this.queryTargetData} >

              <TabPane tab="风电" key="风电">
                <AlarmStatisticByType {...this.props} onChangeFilter={this.onChangeFilter} graphId="windStation" />
              </TabPane>
              <TabPane tab="光伏" key="光伏">
                <AlarmStatisticByType {...this.props} onChangeFilter={this.onChangeFilter} graphId="pvStation" />
              </TabPane>
            </Tabs>
          </div>
        </div>
      </div>
    )
  }
}
const mapStateToProps = (state) => {

  return {
    ...state.alarmReducer.toJS(),
    stations: state.common.get('stations'),
    stationCode: state.monitor.alarm.get('stationCode').toJS(),
  }
}
const mapDispatchToProps = (dispatch) => ({
  getRealTimeAlarm: payload => dispatch({type: alarmAction.GET_REALTIME_ALARM_SAGA, payload}),
  getAlarmNum: payload => dispatch({type: alarmAction.GET_ALARM_NUM_SAGA, payload}),
  //getDefectTypes: params => dispatch({ type: ticketAction.GET_DEFECTTYPES_SAGA, params }),

})


export default connect(mapStateToProps, mapDispatchToProps)(AllStation);









