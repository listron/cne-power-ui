

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styles from './realTimeWarning.scss';
import { realtimeWarningAction } from './realtimeWarningAction';
import { commonAction } from '../../../alphaRedux/commonAction';
import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
import Footer from '../../../../components/Common/Footer';
import RealTimeWarningContainer from '../../../../components/Monitor/Alarm/RealTimeWarning/RealTimeWarningContainer';

class RealTimeWarning extends Component {
  static propTypes = {
    getLostGenType: PropTypes.func,
    resetRealtimeWarninStore: PropTypes.func,
    getRealtimeWarning: PropTypes.func,
    history: PropTypes.object,
    warningType: PropTypes.string,
    warningTypeStatus: PropTypes.string,
  }
  constructor(props, context) {
    super(props, context);
  }
  componentDidMount() {
    const searchInfo = this.props.history.location.search;//拿到路径中的电站编码
    const stationCode = searchInfo.substring(searchInfo.indexOf('=') + 1);
    const pathParams = this.props.history.location.state || {};
    const { stationType = '', deviceName = '' } = pathParams;
    const { warningTypeStatus, warningType } = this.props;
    this.props.getRealtimeWarning({
      stationCodes: stationCode ? [stationCode] : [],
      warningTypeStatus, warningType,
      stationType,
      deviceName,
    });
  }
  componentWillUnmount() {
    this.props.resetRealtimeWarninStore();
  }
  render() {
    return (
      <div className={styles.realtime}>
        <CommonBreadcrumb breadData={[{ name: '实时告警' }]} style={{ marginLeft: '38px' }} />
        <div className={styles.realtimeWarningBox}>
          <RealTimeWarningContainer {...this.props} />
        </div>
        <Footer />
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    ...state.monitor.realtimeWarningReducer.toJS(),
    stations: state.common.get('stations').toJS(),
    deviceTypes: state.common.get('deviceTypes').toJS(),
    stationTypeCount: state.common.get('stationTypeCount'),
    theme: state.common.get('theme'),
  };
};
const mapDispatchToProps = (dispatch) => ({
  changeRealtimeWarningStore: payload => dispatch({ type: realtimeWarningAction.changeRealtimeWarningStore, payload }),
  resetRealtimeWarninStore: payload => dispatch({ type: realtimeWarningAction.resetRealtimeWarninStore, payload }),
  getRealtimeWarningStatistic: payload => dispatch({ type: realtimeWarningAction.getRealtimeWarningStatistic, payload }),
  getRealtimeWarning: payload => dispatch({ type: realtimeWarningAction.getRealtimeWarning, payload }),
  transferWarning: payload => dispatch({ type: realtimeWarningAction.transferWarning, payload }),
  HandleRemoveWarning: payload => dispatch({ type: realtimeWarningAction.HandleRemoveWarning, payload }),
  getLostGenType: params => dispatch({
    type: commonAction.getLostGenType,
    payload: {
      params,
      actionName: realtimeWarningAction.changeRealtimeWarningStore,
      resultName: 'defectTypes',
    },
  }),

});
export default connect(mapStateToProps, mapDispatchToProps)(RealTimeWarning)
  ;
