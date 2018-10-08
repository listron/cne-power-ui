import React, { Component } from 'react';
import { connect } from 'react-redux';
import { alarmAction } from './alarmAction';
import HistoryAlarmTable from '../../../components/Monitor/Alarm/HistoryAlarm/HistoryAlarmTable';
import HistoryAlarmFilter from '../../../components/Monitor/Alarm/HistoryAlarm/HistoryAlarmFilter';
import DeviceNameSearch from '../../../components/Monitor/Alarm/AlarmFilter/DeviceNameSearch';
import CommonBreadcrumb from '../../../components/Common/CommonBreadcrumb';
import Footer from '../../../components/Common/Footer';
import styles from './alarm.scss';
import PropTypes from 'prop-types';

class HistoryAlarm extends Component {
  static propTypes = {
    historyAlarm: PropTypes.array,
    stations: PropTypes.object,
    deviceTypes: PropTypes.object,
    warningLevel: PropTypes.array,
    stationType: PropTypes.string,
    stationCode: PropTypes.array,
    deviceTypeCode: PropTypes.array,
    warningConfigName: PropTypes.array,
    warningStatus: PropTypes.array,
    startTime: PropTypes.array,
    endTime: PropTypes.array,
    deviceName: PropTypes.string,
    getHistoryAlarm: PropTypes.func,
    changeAlarmStore: PropTypes.func,
    getTicketInfo: PropTypes.func,
    getRelieveInfo: PropTypes.func,
    resetAlarm: PropTypes.func,
    ticketInfo: PropTypes.object,
    relieveInfo: PropTypes.object,
    history: PropTypes.object,
    location: PropTypes.object,

  }
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
      pageSize: 10,
    }
  }

  componentDidMount() {
    const searchInfo = this.props.history.location.search;
    let reg =/([^?=&]+)=([^?=&]+)/g;
    let obj = {};
    searchInfo.replace(reg, function(){
      obj[arguments[1]] = arguments[2];
    })
    //console.log(obj);
    const stationCode = obj["stationCode"]
   // console.log(stationCode);
    const deviceTypeCode=obj["deviceTypeCode"]
    //console.log(deviceTypeCode);
    const deviceCode=obj["deviceCode"]
    this.props.getHistoryAlarm({
      warningLevel: [],
      stationType: '2',
      stationCode: stationCode?[stationCode] : [] ,
      deviceTypeCode:deviceTypeCode?[deviceTypeCode]: [],
      warningConfigName: [],
      warningStatus: [],
      startTime: [],
      endTime: [],
      deviceName: '',
      deviceCode:deviceCode?deviceCode:'',
    });
  }

  componentWillUnmount() {
    this.props.resetAlarm();
  }

  onPaginationChange = ({ currentPage, pageSize }) => {//分页器
    this.setState({
      currentPage,
      pageSize
    })
  }

  onChangeFilter = (obj) => {
    const { warningLevel, stationType, stationCode, deviceTypeCode, warningConfigName, startTime, endTime, warningStatus, deviceName } = this.props;
    let filter = {
      warningLevel,
      stationCode,
      stationType,
      deviceTypeCode,
      warningConfigName,
      warningStatus,
      startTime,
      endTime,
      deviceName,
    }
    this.setState({
      currentPage: 1,
    })
    //let newFiter = Object.assign({}, filter, obj);
    const newFiter = { ...filter, ...obj };

    this.props.getHistoryAlarm(newFiter);
  }

  render() {
    const breadCrumbData = {
      breadData: [
        {
          name: '历史告警',
        }
      ],
    };
    const { currentPage, pageSize, } = this.state;
    return (
      <div className={styles.historyAlarmBox}>
        <CommonBreadcrumb  {...breadCrumbData} style={{ marginLeft: '38px' }} />
        <div className={styles.historyAlarmContainer}>
          <div className={styles.historyAlarm}>
            <HistoryAlarmFilter {...this.props} onChangeFilter={this.onChangeFilter} />
            <DeviceNameSearch onSearch={this.onChangeFilter} deviceName={this.props.deviceName} />
            <HistoryAlarmTable
              {...this.props}
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
  historyAlarm: state.monitor.alarm.get('historyAlarm').toJS(),
  stations: state.common.get('stations'),
  deviceTypes: state.common.get('deviceTypes'),
  warningLevel: state.monitor.alarm.get('warningLevel').toJS(),
  stationType: state.monitor.alarm.get('stationType'),
  stationCode: state.monitor.alarm.get('stationCode').toJS(),
  deviceTypeCode: state.monitor.alarm.get('deviceTypeCode').toJS(),
  warningConfigName: state.monitor.alarm.get('warningConfigName').toJS(),
  warningStatus: state.monitor.alarm.get('warningStatus').toJS(),
  startTime: state.monitor.alarm.get('startTime').toJS(),
  endTime: state.monitor.alarm.get('endTime').toJS(),
  deviceName: state.monitor.alarm.get('deviceName'),
  ticketInfo: state.monitor.alarm.get('ticketInfo').toJS(),
  relieveInfo: state.monitor.alarm.get('relieveInfo').toJS(),
});
const mapDispatchToProps = (dispatch) => ({
  changeAlarmStore: payload => dispatch({ type: alarmAction.CHANGE_ALARM_STORE_SAGA, payload }),
  getHistoryAlarm: payload => dispatch({ type: alarmAction.GET_HISTORY_ALARM_SAGA, payload }),
  getTicketInfo: payload => dispatch({ type: alarmAction.GET_TICKET_INFO_SAGA, payload }),
  getRelieveInfo: payload => dispatch({ type: alarmAction.GET_RELIEVE_INFO_SAGA, payload }),
  resetAlarm: payload => dispatch({ type: alarmAction.RESET_ALARM_SAGA, payload }),
});
export default connect(mapStateToProps, mapDispatchToProps)(HistoryAlarm);
