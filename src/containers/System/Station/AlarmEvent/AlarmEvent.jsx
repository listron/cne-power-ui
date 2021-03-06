import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './alarmEvent.scss';
import { alarmEventAction } from './alarmEventReducer';
import VersionSelect from '../../../../components/System/Station/AlarmEvent/VersionSelect';
import VersionEvent from '../../../../components/System/Station/AlarmEvent/VersionEvent';
import Footer from '../../../../components/Common/Footer';
import PropTypes from 'prop-types';
import searchUtil from '@utils/searchUtil';


class AlarmEvent extends Component {
  static propTypes = {
    resetStore: PropTypes.func,
    getDiagVersion: PropTypes.func,
    getAlarmEvent: PropTypes.func,
    deviceTypeCode: PropTypes.number,
    alarmEventDetialFlow: PropTypes.func,
    getVersionEvent: PropTypes.func,
    changeStore: PropTypes.func,
    history: PropTypes.object,
  }
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.getDiagVersion(); // 默认加载全部的设备类型

    //只有在告警中心，跳转到本页面的时候，才触发一下处理
    const search = this.props.history.location.search || '';
    const paramData = searchUtil(search).parse() || {};
    const {source} = paramData;
    if (source && source === 'diagnoseCenter') { //告警中心进入
      const {deviceTypeCode, pointCode, deviceFullcode, stationCode, diagWarningId} = paramData;
      if(deviceTypeCode && pointCode && deviceFullcode && stationCode) {
        const devcode = (typeof deviceTypeCode === 'string') ? parseInt(deviceTypeCode, 10) : deviceTypeCode;
        this.props.alarmEventDetialFlow({deviceTypeCode: devcode, pointCode, deviceFullcode, stationCode, diagWarningId});
      }
    } else if (source && source === 'stationManage') {//电站管理进入
      const {deviceModeCode, manufactorCode, diagModeVersionId, deviceTypeCode} = paramData;
      if (deviceModeCode && manufactorCode && diagModeVersionId && deviceTypeCode) {
        this.props.changeStore({
            deviceTypeCode: parseInt(deviceTypeCode, 10),
            diagModeVersionId,
            deviceModeCode,
            manufactorCode,
            selectedNodesKey: `${manufactorCode}_${deviceModeCode}_${diagModeVersionId}`,
            expandedKeys: [`${manufactorCode}`, `${manufactorCode}_${deviceModeCode}`],
          });
          this.props.getAlarmEvent({ deviceTypeCode, diagModeVersionId });
          this.props.getVersionEvent({ diagModeVersionId });
      }
    }
  }

  componentWillUnmount() {
    this.props.resetStore();
  }


  render() {
    return (
      <div className={styles.alarmEventContiner}>
        <div className={styles.content}>
          <div className={styles.leftCont}>
            <VersionSelect {...this.props} />
          </div>
          <div className={styles.rightCont}>
            <VersionEvent {...this.props} />
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}


const mapStateToProps = (state) => {
  return ({
    ...state.system.alarmEventReducer.toJS(),
    stations: state.common.get('stations').toJS(),
  });
};

const mapDispatchToProps = (dispatch) => ({
  resetStore: payload => dispatch({ type: alarmEventAction.resetStore, payload }),
  changeStore: payload => dispatch({ type: alarmEventAction.changeStore, payload }),
  getDiagVersion: payload => dispatch({ type: alarmEventAction.getDiagVersion, payload }),
  editVersion: payload => dispatch({ type: alarmEventAction.editVersion, payload }),
  updateVersion: payload => dispatch({ type: alarmEventAction.updateVersion, payload }),
  delVersion: payload => dispatch({ type: alarmEventAction.delVersion, payload }),
  getVersionEvent: payload => dispatch({ type: alarmEventAction.getVersionEvent, payload }),
  getEditVersionStation: payload => dispatch({ type: alarmEventAction.getEditVersionStation, payload }),
  addVersionEvent: payload => dispatch({ type: alarmEventAction.addVersionEvent, payload }),
  editVersionEvent: payload => dispatch({ type: alarmEventAction.editVersionEvent, payload }),
  delVersionEvent: payload => dispatch({ type: alarmEventAction.delVersionEvent, payload }),
  getAlarmEvent: payload => dispatch({ type: alarmEventAction.getAlarmEvent, payload }),
  getPointList: payload => dispatch({ type: alarmEventAction.getPointList, payload }),
  getVersionStation: payload => dispatch({ type: alarmEventAction.getVersionStation, payload }),
  filterConditionStations: payload => dispatch({ type: alarmEventAction.filterConditionStations, payload }),
  getEventDetail: payload => dispatch({type: alarmEventAction.getEventDetail, payload}),
  alarmEventDetialFlow: payload => dispatch({type: alarmEventAction.alarmEventDetialFlow, payload}),
});

export default connect(mapStateToProps, mapDispatchToProps)(AlarmEvent);
