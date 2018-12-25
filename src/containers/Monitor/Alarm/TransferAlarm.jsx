import React, { Component } from 'react';
import { connect } from 'react-redux';
import { alarmAction } from './alarmAction';
import { commonAction } from '../../alphaRedux/commonAction';
import CommonBreadcrumb from '../../../components/Common/CommonBreadcrumb';
import Footer from '../../../components/Common/Footer';
import TransitionContainer from '../../../components/Common/TransitionContainer';
import styles from './alarm.scss';
import PropTypes from 'prop-types';
import TransferAlarmCont from '../../../components/Monitor/Alarm/TransferAlarm/TransferAlarm';
import WorkOrder from '../../Operation/Ticket/WorkOrder/WorkOrder';

class TransferAlarm extends Component {
  static propTypes = {
    realtimeAlarm: PropTypes.array,
    stations: PropTypes.array,
    deviceTypes: PropTypes.array,
    warningLevel: PropTypes.array,
    stationType: PropTypes.string,
    stationCode: PropTypes.array,
    deviceTypeCode: PropTypes.array,
    warningConfigName: PropTypes.array,
    startTime: PropTypes.array,
    deviceName: PropTypes.string,
    sortName: PropTypes.string,
    resetAlarm: PropTypes.func,
    getAlarmNum: PropTypes.func,
    changeAlarmStore: PropTypes.func,
    getRealTimeAlarm: PropTypes.func,
    getTicketInfo: PropTypes.func,
    ticketInfo: PropTypes.object,
    isTransferWork: PropTypes.number,
    isRelieveAlarm: PropTypes.number,
    getLostGenType: PropTypes.func,
    pageName: PropTypes.string,
    defectId: PropTypes.string,
  }
  constructor(props) {
    super(props);
    this.state = {
      showPage: false
    }
  }

  componentDidMount() {
    const warningStatus = 3;
    this.props.getRealTimeAlarm({ // 初始请求数据
      warningLevel: [],
      stationType: '2',
      stationCode: [],
      deviceTypeCode: [],
      warningConfigName: [],
      startTime: [],
      deviceName: '',
      isTransferWork: 0,
      isRelieveAlarm: 1,
    });
    this.props.getLostGenType({ objectType: 1 }); // 获取设备类型
    this.props.getAlarmNum({ warningStatus });  // 转工单数
  }

  componentWillUnmount() {
    this.props.resetAlarm();
  }

  onEnterToggleSide = () => {
    this.setState({ showPage: true })
  }

  onEndToggleSide = () => {
    this.setState({ showPage: false })
  }
  prevChange = (value) => { // 切换到当前页
    this.props.changeAlarmStore({ ...value })
  }

  render() {
    const { pageName, defectId } = this.props;
    const { showPage } = this.state;
    return (
      <div className={styles.transferAlarmBox}>
        <CommonBreadcrumb breadData={[{ name: '实时告警' }]} style={{ marginLeft: '38px' }} />
        <div className={styles.transferColor}>
          <div className={styles.transferAlarmContainer}>
            <TransferAlarmCont {...this.props} />
            <TransitionContainer
              show={pageName === 'detail'}
              timeout={500}
              effect="side"
              onEnter={this.onEnterToggleSide}
              onExited={this.onEndToggleSide}
            >
              <WorkOrder defectId={defectId} otherFrom={true} pageName={'list'} onChange={this.prevChange}
                showPage={showPage}
              />
            </TransitionContainer>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  deviceTypes: state.common.get('deviceTypes').toJS(),
  stations: state.common.get('stations').toJS(),
  ...state.monitor.alarm.toJS(),
});
const mapDispatchToProps = (dispatch) => ({
  changeAlarmStore: payload => dispatch({ type: alarmAction.CHANGE_ALARM_STORE_SAGA, payload }),
  getRealTimeAlarm: payload => dispatch({ type: alarmAction.GET_REALTIME_ALARM_SAGA, payload }),
  getAlarmNum: payload => dispatch({ type: alarmAction.GET_ALARM_NUM_SAGA, payload }),
  resetAlarm: payload => dispatch({ type: alarmAction.RESET_ALARM_SAGA, payload }),
  getTicketInfo: payload => dispatch({ type: alarmAction.GET_TICKET_INFO_SAGA, payload }),
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
