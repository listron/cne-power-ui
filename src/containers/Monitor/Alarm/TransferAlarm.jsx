import React, { Component } from 'react';
import { connect } from 'react-redux';
import { alarmAction } from './alarmAction';
import { ticketAction } from '../../Operation/Ticket/ticketAction';
import { commonAction } from '../../alphaRedux/commonAction';
import RealTimeAlarmTable from '../../../components/Monitor/Alarm/RealTimeAlarm/RealTimeAlarmTable';
import RealTimeAlarmFilter from '../../../components/Monitor/Alarm/RealTimeAlarm/RealTimeAlarmFilter';
import RealTimeAlarmInfo from '../../../components/Monitor/Alarm/RealTimeAlarm/RealTimeAlarmInfo';
import DeviceNameSearch from '../../../components/Monitor/Alarm/AlarmFilter/DeviceNameSearch';
import CommonBreadcrumb from '../../../components/Common/CommonBreadcrumb';
import Footer from '../../../components/Common/Footer';
import styles from './alarm.scss';
import PropTypes from 'prop-types';
import TransferAlarmCont from '../../../components/Monitor/Alarm/TransferAlarm/TransferAlarm'

class TransferAlarm extends Component {
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
    sortName: PropTypes.string,
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
    isTransferWork: PropTypes.number,
    isRelieveAlarm: PropTypes.number,
    history: PropTypes.object,
    getLostGenType: PropTypes.func,
  }
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const warningStatus = 3;
    this.props.getRealTimeAlarm({
      warningLevel: [],
      stationType: '2',
      stationCode: [],
      deviceTypeCode: [],
      warningConfigName: [],
      startTime: [],
      deviceName: '',
      isTransferWork:0,
      isRelieveAlarm:1,
    });
    this.props.getLostGenType({ objectType: 1 });
    this.props.getAlarmNum({ warningStatus });
  }

  componentWillUnmount() {
    this.props.resetAlarm();
  }


  render() {
    return (
      <div className={styles.realTimeAlarmBox}>
        <CommonBreadcrumb breadData={[{ name: '实时告警' }]} style={{ marginLeft: '38px' }} />
        <div className={styles.realTimeAlarmContainer}>
          <TransferAlarmCont {...this.props} />
        </div>
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  realtimeAlarm: state.monitor.alarm.get('realtimeAlarm').toJS(),
  
  warningLevel: state.monitor.alarm.get('warningLevel').toJS(),
  stationType: state.monitor.alarm.get('stationType'),
  stationCode: state.monitor.alarm.get('stationCode').toJS(),
  deviceTypeCode: state.monitor.alarm.get('deviceTypeCode').toJS(),
  warningConfigName: state.monitor.alarm.get('warningConfigName').toJS(),
  startTime: state.monitor.alarm.get('startTime').toJS(),
  deviceName: state.monitor.alarm.get('deviceName'),
  sortName: state.monitor.alarm.get('sortName'),
  alarmNum: state.monitor.alarm.get('alarmNum').toJS(),
  isTransferWork: state.monitor.alarm.get('isTransferWork'),
  isRelieveAlarm: state.monitor.alarm.get('isRelieveAlarm'),
  defectTypes: state.monitor.alarm.get('defectTypes'),
  lastUpdateTime: state.monitor.alarm.get('lastUpdateTime'),
  ticketInfo: state.monitor.alarm.get('ticketInfo').toJS(),
  relieveInfo: state.monitor.alarm.get('relieveInfo').toJS(),
  selectedRowKeys: state.monitor.alarm.get('selectedRowKeys').toJS(),

  deviceTypes: state.common.get('deviceTypes').toJS(),
  stations: state.common.get('stations').toJS(),
});
const mapDispatchToProps = (dispatch) => ({
  changeAlarmStore: payload => dispatch({ type: alarmAction.CHANGE_ALARM_STORE_SAGA, payload }),
  getRealTimeAlarm: payload => dispatch({ type: alarmAction.GET_REALTIME_ALARM_SAGA, payload }),
  getAlarmNum: payload => dispatch({ type: alarmAction.GET_ALARM_NUM_SAGA, payload }),
  getDefectTypes: payload => dispatch({ type: ticketAction.GET_DEFECT_TYPE_SAGA, payload }),
  onTransferAlarm: payload => dispatch({ type: alarmAction.TRANSFER_ALARM_SAGA, payload }),
  onRelieveAlarm: payload => dispatch({ type: alarmAction.RELIEVE_ALARM_SAGA, payload }),
  onResetRelieveAlarm: payload => dispatch({ type: alarmAction.RESET_RELIEVE_ALARM_SAGA, payload }),
  getTicketInfo: payload => dispatch({ type: alarmAction.GET_TICKET_INFO_SAGA, payload }),
  getRelieveInfo: payload => dispatch({ type: alarmAction.GET_RELIEVE_INFO_SAGA, payload }),
  resetAlarm: payload => dispatch({ type: alarmAction.RESET_ALARM_SAGA, payload }),
  getLostGenType: params => dispatch({
    type: commonAction.getLostGenType,
    payload: {
      params,
      actionName: alarmAction.GET_ALARM_FETCH_SUCCESS,
      resultName: 'defectTypes'
    }
  }),
});
export default connect(mapStateToProps, mapDispatchToProps)(TransferAlarm);
