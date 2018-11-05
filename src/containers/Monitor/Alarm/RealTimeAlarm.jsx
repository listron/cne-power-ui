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
    this.state = {
      currentPage: 1,
      pageSize: 10,
    }
  }

  componentDidMount() {
    const status = this.getStatus();
    const warningStatus = this.getAlarmStatus(status);

    const searchInfo = this.props.history.location.search;
    const stationCode = searchInfo.substring(searchInfo.indexOf('=')+1);
    this.props.getRealTimeAlarm({
      warningLevel: [],
      stationType: '2',
      stationCode: stationCode==='' ? [] : [stationCode],
      deviceTypeCode: [],
      warningConfigName: [],
      startTime: [],
      deviceName: '',
      isTransferWork: status === 'transfer' ? 0 : 1,
      isRelieveAlarm: status === 'relieve' ? 0 : 1
    });
    this.props.getLostGenType({ objectType: 1 });
    this.props.getAlarmNum({ warningStatus });
    this.alarmInterval = setInterval(() => { this.getAlarmInfo() }, 10000);
  }

  componentWillUnmount() {
    this.props.resetAlarm();
    clearInterval(this.alarmInterval);
  }

  onPaginationChange = ({ currentPage, pageSize }) => {//分页器
    this.setState({
      currentPage,
      pageSize
    })
  }

  onChangeFilter = (obj) => {
    clearInterval(this.alarmInterval);
    const status = this.getStatus();
    const warningStatus = this.getAlarmStatus(status);
    const { warningLevel, stationType, stationCode, deviceTypeCode, warningConfigName, startTime, deviceName, isTransferWork, isRelieveAlarm } = this.props;
    let filter = {
      warningLevel,
      stationType,
      stationCode,
      deviceTypeCode,
      warningConfigName,
      startTime,
      deviceName,
      isTransferWork,
      isRelieveAlarm
    }
    const newFiter = { ...filter, ...obj };
    this.setState({
      currentPage: 1,
    })
    this.props.getRealTimeAlarm(newFiter);
    this.props.getAlarmNum({ warningStatus });
    this.alarmInterval = setInterval(() => { this.getAlarmInfo() }, 10000);
  }

  getAlarmInfo() {
    const { sortName, warningLevel, stationType, stationCode, deviceTypeCode, warningConfigName, startTime, deviceName, isTransferWork, isRelieveAlarm } = this.props;
    const status = this.getStatus();
    const warningStatus = this.getAlarmStatus(status);
    if (sortName === '' && warningStatus === 1 && warningLevel.length === 0 && stationType === '2' &&
      stationCode.length === 0 && deviceTypeCode.length === 0 &&
      warningConfigName.length === 0 && startTime.length === 0 &&
      deviceName === '' && isTransferWork === 1 && isRelieveAlarm === 1) {
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
      this.props.getAlarmNum({ warningStatus });
    } else {
      clearInterval(this.alarmInterval);
    }
  }

  getStatus() {
    const pathname = this.props.location.pathname;
    const status = pathname.split('/')[3];
    return status;
  }

  getAlarmStatus(status) {
    let warningStatus = 1;
    if (status === 'transfer') {
      warningStatus = 3;
    } else if (status === 'relieve') {
      warningStatus = 2;
    }
    return warningStatus;
  }

  render() {
    console.log(this.props.defectTypes)
    const status = this.getStatus();
    const alarmStatus = this.getAlarmStatus(status);
    const { currentPage, pageSize, } = this.state;
    const breadCrumbData = {
      breadData: [
        {
          name: '实时告警',
        }
      ],
    };
    return (
      <div className={styles.realTimeAlarmBox}>
        <CommonBreadcrumb  {...breadCrumbData} style={{ marginLeft: '38px' }} />
        <div className={styles.realTimeAlarmContainer}>
          <div className={styles.realTimeAlarm}>
            <RealTimeAlarmInfo {...this.props} alarmStatus={alarmStatus} />
            <RealTimeAlarmFilter {...this.props} onChangeFilter={this.onChangeFilter} />
            <DeviceNameSearch onSearch={this.onChangeFilter} deviceName={this.props.deviceName} />
            <RealTimeAlarmTable 
              {...this.props} 
              alarmStatus={alarmStatus} 
              currentPage={currentPage} 
              pageSize={pageSize} 
              onPaginationChange={this.onPaginationChange}
            />
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
export default connect(mapStateToProps, mapDispatchToProps)(RealTimeAlarm);
