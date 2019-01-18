import React, { Component } from 'react';
import { connect } from 'react-redux';
import { realTimeAlarmAction } from './realTimeAlarmAction';
import { ticketAction } from '../../../Operation/Ticket/ticketAction';
import { commonAction } from '../../../alphaRedux/commonAction';

import RealTimeAlarmContainer from '../../../../components/Monitor/Alarm/RealTimeAlarm/RealTimeAlarmContainer';
import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
import Footer from '../../../../components/Common/Footer';
import styles from './realTimeAlarm.scss';
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
    const searchInfo = this.props.history.location.search;//拿到路径中的电站编码
    const stationCode = searchInfo.substring(searchInfo.indexOf('=')+1);
    this.props.getRealTimeAlarm({
      warningTypeStatus:'1',
      warningType:'事件告警',
      warningLevel: [],
      stationType: '2',
      stationCode: stationCode==='' ? [] : [stationCode],
      deviceTypeCode: [],
      warningConfigName: [],
      startTime: [],
      deviceName: '',
   
    });
    this.props.getLostGenType({ objectType: 1 });
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
    const { warningLevel, warningTypeStatus,stationType, stationCode, deviceTypeCode, warningConfigName, startTime, deviceName, isTransferWork, isRelieveAlarm } = this.props;
    let filter = {
      warningTypeStatus:'1',
      warningType:'事件告警',
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
    console.log(newFiter);
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
        warningTypeStatus: "1",
        warningType:'事件告警',
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
      <div className={styles.realtime}>
      <CommonBreadcrumb  {...breadCrumbData} style={{ marginLeft: '38px' }} />
      <div className={styles.realtimeWarningBox}>
        <RealTimeAlarmContainer {...this.props}  />
      </div>
      <Footer />
    </div>
     );
  }
}

const mapStateToProps = (state) => ({
  ...state.monitor.realTimeAlarm.toJs(),
  stations: state.common.get('stations'),
  deviceTypes: state.common.get('deviceTypes'),
});
const mapDispatchToProps = (dispatch) => ({
  changeAlarmStore: payload => dispatch({ type: realTimeAlarmAction.CHANGE_ALARM_STORE_SAGA, payload }),
  getRealTimeAlarm: payload => dispatch({ type: realTimeAlarmAction.GET_REALTIME_ALARM_SAGA, payload }),
  getAlarmNum: payload => dispatch({ type: realTimeAlarmAction.GET_ALARM_NUM_SAGA, payload }),
  getDefectTypes: payload => dispatch({ type: ticketAction.GET_DEFECT_TYPE_SAGA, payload }),
  onTransferAlarm: payload => dispatch({ type: realTimeAlarmAction.TRANSFER_ALARM_SAGA, payload }),
  onRelieveAlarm: payload => dispatch({ type: realTimeAlarmAction.RELIEVE_ALARM_SAGA, payload }),
  onResetRelieveAlarm: payload => dispatch({ type: realTimeAlarmAction.RESET_RELIEVE_ALARM_SAGA, payload }),
  getTicketInfo: payload => dispatch({ type: realTimeAlarmAction.GET_TICKET_INFO_SAGA, payload }),
  getRelieveInfo: payload => dispatch({ type: realTimeAlarmAction.GET_RELIEVE_INFO_SAGA, payload }),
  resetAlarm: payload => dispatch({ type: realTimeAlarmAction.RESET_ALARM_SAGA, payload }),
  getLostGenType: params => dispatch({
    type: commonAction.getLostGenType,
    payload: {
      params, 
      actionName: realTimeAlarmAction.GET_ALARM_FETCH_SUCCESS, 
      resultName: 'defectTypes'
    }
  }),
});
export default connect(mapStateToProps, mapDispatchToProps)(RealTimeAlarm);
