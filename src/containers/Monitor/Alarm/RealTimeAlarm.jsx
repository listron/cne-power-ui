import React, { Component } from 'react';
import { connect } from 'react-redux';
import { alarmAction } from '../../../constants/actionTypes/monitor/alarmAction';
import { ticketAction } from '../../../constants/actionTypes/operation/ticketAction';
import RealTimeAlarmTable from '../../../components/Monitor/Alarm/RealTimeAlarm/RealTimeAlarmTable';
import RealTimeAlarmFilter from '../../../components/Monitor/Alarm/RealTimeAlarm/RealTimeAlarmFilter';
import RealTimeAlarmInfo from '../../../components/Monitor/Alarm/RealTimeAlarm/RealTimeAlarmInfo';
import DeviceNameSearch from '../../../components/Monitor/Alarm/AlarmFilter/DeviceNameSearch';
import Footer from '../../../components/Common/Footer';
import styles from './alarm.scss';
import PropTypes from 'prop-types';

class RealTimeAlarm extends Component {
  static propTypes = {
    realtimeAlarm: PropTypes.array,
    stations: PropTypes.object,
    deviceTypes: PropTypes.object,
    defectTypes: PropTypes.object,
    warningLevel: PropTypes.array,
    stationType: PropTypes.string,
    stationCode: PropTypes.array,
    deviceTypeCode: PropTypes.array,
    warningConfigName: PropTypes.array,
    startTime: PropTypes.array,
    deviceName: PropTypes.string,
    getRealTimeAlarm: PropTypes.func,
    getDefectTypes: PropTypes.func,
    onTransferAlarm: PropTypes.func,
    onRelieveAlarm: PropTypes.func,
    getAlarmNum: PropTypes.func,
    resetAlarm: PropTypes.func,
    changeAlarmStore: PropTypes.func,
    getTicketInfo: PropTypes.func,
    getRelieveInfo: PropTypes.func,
    location: PropTypes.object,
    ticketInfo: PropTypes.object,
    relieveInfo: PropTypes.object,
  }
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { warningLevel, stationType, stationCode, deviceTypeCode, warningConfigName, startTime, deviceName} = this.props;
    const status = this.getStatus();
    const warningStatus = this.getAlarmStatus(status);
    this.props.getRealTimeAlarm({
      warningLevel,
      stationType,
      stationCode,
      deviceTypeCode,
      warningConfigName,
      startTime,
      deviceName,
      isTransferWork: status === 'transfer' ? 0 : 1,
      isRelieveAlarm: status === 'relieve' ? 0: 1
    });
    this.props.getDefectTypes({stationType: 2});
    this.props.getAlarmNum({warningStatus});
    this.alarmInterval = setInterval(()=>{this.getAlarmInfo()}, 10000);
  }

  

  componentWillUnmount() {
    this.props.resetAlarm();
    clearInterval(this.alarmInterval);
  }

  onChangeFilter = (obj) => {
    clearInterval(this.alarmInterval);
    const status = this.getStatus();
    const warningStatus = this.getAlarmStatus(status);
    const { warningLevel, stationType, stationCode, deviceTypeCode, warningConfigName, startTime, deviceName } = this.props;
    let filter = {
      warningLevel,
      stationType,
      stationCode,
      deviceTypeCode,
      warningConfigName,
      startTime,
      deviceName,
      isTransferWork: status==='transfer'?0:1,
      isRelieveAlarm: status==='relieve'?0:1
    }
    let newFiter = Object.assign({}, filter, obj);
    this.props.getRealTimeAlarm(newFiter);
    this.props.getAlarmNum({warningStatus});
    this.alarmInterval = setInterval(()=>{this.getAlarmInfo()}, 10000);
  }

  getAlarmInfo() {
    const { warningLevel, stationType, stationCode, deviceTypeCode, warningConfigName, startTime, deviceName} = this.props;
    const status = this.getStatus();
    const isTransferWork = status === 'transfer' ? 0 : 1;
    const isRelieveAlarm = status === 'relieve' ? 0: 1;
    const warningStatus = this.getAlarmStatus(status);
    if(warningStatus===1&&warningLevel.length===0&&stationType==='2'&&
    stationCode.length===0&&deviceTypeCode.length===0&&
    warningConfigName.length===0&&startTime.length===0&&
    deviceName===''&&isTransferWork===1&&isRelieveAlarm===1) {
      this.props.getRealTimeAlarm({
        warningLevel,
        stationType,
        stationCode,
        deviceTypeCode,
        warningConfigName,
        startTime,
        deviceName,
        isTransferWork,
        isRelieveAlarm
      });
      this.props.getAlarmNum({warningStatus});
    } else {
      clearInterval(this.alarmInterval);
    }
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

  render() {
    const status = this.getStatus();
    const alarmStatus = this.getAlarmStatus(status);
    return (
      <div className={styles.realTimeAlarmContainer}>
        <div className={styles.realTimeAlarm}>
          <RealTimeAlarmInfo {...this.props} alarmStatus={alarmStatus} />
          <RealTimeAlarmFilter {...this.props} onChangeFilter={this.onChangeFilter} />      
          <DeviceNameSearch onSearch={this.onChangeFilter} deviceName={this.props.deviceName} />
          <RealTimeAlarmTable {...this.props} alarmStatus={alarmStatus} /> 
        </div>
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  realtimeAlarm: state.monitor.alarm.get('realtimeAlarm').toJS(),
  stations: state.common.get('stations'),
  deviceTypes: state.common.get('deviceTypes'),
  warningLevel: state.monitor.alarm.get('warningLevel').toJS(),
  stationType: state.monitor.alarm.get('stationType'),
  stationCode: state.monitor.alarm.get('stationCode').toJS(),
  deviceTypeCode: state.monitor.alarm.get('deviceTypeCode').toJS(),
  warningConfigName: state.monitor.alarm.get('warningConfigName').toJS(),
  startTime: state.monitor.alarm.get('startTime').toJS(),
  deviceName: state.monitor.alarm.get('deviceName'),
  alarmNum: state.monitor.alarm.get('alarmNum').toJS(),
  defectTypes: state.operation.defect.get('defectTypes'),
  lastUpdateTime: state.monitor.alarm.get('lastUpdateTime'),
  ticketInfo: state.monitor.alarm.get('ticketInfo').toJS(),
  relieveInfo: state.monitor.alarm.get('relieveInfo').toJS(),
});
const mapDispatchToProps = (dispatch) => ({
  changeAlarmStore: payload => dispatch({type: alarmAction.CHANGE_ALARM_STORE_SAGA, payload}),
  getRealTimeAlarm: payload => dispatch({type: alarmAction.GET_REALTIME_ALARM_SAGA, payload}),
  getAlarmNum: payload => dispatch({type: alarmAction.GET_ALARM_NUM_SAGA, payload}),
  getDefectTypes: params => dispatch({ type: ticketAction.GET_DEFECTTYPES_SAGA, params }),
  onTransferAlarm: payload =>dispatch({ type: alarmAction.TRANSFER_ALARM_SAGA, payload }),
  onRelieveAlarm: payload =>dispatch({ type: alarmAction.RELIEVE_ALARM_SAGA, payload }),
  getTicketInfo: payload =>dispatch({ type: alarmAction.GET_TICKET_INFO_SAGA, payload }),
  getRelieveInfo: payload =>dispatch({ type: alarmAction.GET_RELIEVE_INFO_SAGA, payload }),
  resetAlarm: payload =>dispatch({ type: alarmAction.RESET_ALARM_SAGA, payload }),
});
export default connect(mapStateToProps, mapDispatchToProps)(RealTimeAlarm);
