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
    startTime: PropTypes.string,
    endTime: PropTypes.string,
    deviceName: PropTypes.string,
    getRealTimeAlarm: PropTypes.func,
    getDefectTypes: PropTypes.func,
    onTransferAlarm: PropTypes.func,
    onRelieveAlarm: PropTypes.func,
    getAlarmNum: PropTypes.func,
    location: PropTypes.object,
  }
  constructor(props) {
    super(props);
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
    this.props.getDefectTypes({stationType: 2});
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

  render() {
    const status = this.getStatus();
    const alarmStatus = this.getAlarmStatus(status);
    return (
      <div className={styles.realTimeAlarmContainer}>
        <div className={styles.realTimeAlarmBox}>
          <div className={styles.realTimeAlarm}>
            <RealTimeAlarmInfo {...this.props} alarmStatus={alarmStatus} />
            <RealTimeAlarmFilter {...this.props} onChangeFilter={this.onChangeFilter} />      
            <DeviceNameSearch onSearch={this.onChangeFilter} />
            <RealTimeAlarmTable {...this.props} /> 
          </div>
          <Footer />
        </div>
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
  startTime: state.monitor.alarm.get('startTime'),
  endTime: state.monitor.alarm.get('endTime'),
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
});
export default connect(mapStateToProps, mapDispatchToProps)(RealTimeAlarm);
