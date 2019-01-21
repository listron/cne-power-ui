

import React, { Component } from "react";
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import styles from './realTimeWarning.scss'
import { realtimeWarningActive } from './realtimeWarningActive';
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
    super(props, context)
  }
  componentDidMount() {
    const searchInfo = this.props.history.location.search;//拿到路径中的电站编码
    const stationCode = searchInfo.substring(searchInfo.indexOf('=') + 1);
   const {warningTypeStatus,warningType}=this.props;
    this.props.getRealtimeWarning({stationCodes:[stationCode],warningTypeStatus,warningType})

    this.props.getLostGenType({ objectType: 1 })
  }
  componentWillUnmount() {
    this.props.resetRealtimeWarninStore()
  }
  render() {
    const breadCrumbData = {
      breadData: [
        {
          name: '实时预警',
        }
      ],
    };
    return (
      <div className={styles.realtime}>
        <CommonBreadcrumb  {...breadCrumbData} style={{ marginLeft: '38px' }} />
        <div className={styles.realtimeWarningBox}>
          <RealTimeWarningContainer {...this.props} />
        </div>
        <Footer />
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    ...state.monitor.realtimeWarningReducer.toJS(),
    stations: state.common.get('stations').toJS(),
    deviceTypes: state.common.get('deviceTypes').toJS(),
  }
}
const mapDispatchToProps = (dispatch) => ({
  changeRealtimeWarningStore: payload => dispatch({ type: realtimeWarningActive.changeRealtimeWarningStore, payload }),
  resetRealtimeWarninStore: payload => dispatch({ type: realtimeWarningActive.resetRealtimeWarninStore, payload }),
  getRealtimeWarningStatistic: payload => dispatch({ type: realtimeWarningActive.getRealtimeWarningStatistic, payload }),
  getRealtimeWarning: payload => dispatch({ type: realtimeWarningActive.getRealtimeWarning, payload }),
  transferWarning: payload => dispatch({ type: realtimeWarningActive.transferWarning, payload }),
  HandleRemoveWarning: payload => dispatch({ type: realtimeWarningActive.HandleRemoveWarning, payload }),
  getLostGenType: params => dispatch({
    type: commonAction.getLostGenType,
    payload: {
      params,
      actionName: realtimeWarningActive.changeRealtimeWarningStore,
      resultName: 'defectTypes'
    }
  }),

})
export default connect(mapStateToProps, mapDispatchToProps)(RealTimeWarning)