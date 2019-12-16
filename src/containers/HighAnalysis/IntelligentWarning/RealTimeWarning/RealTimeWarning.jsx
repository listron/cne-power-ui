

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styles from './realTimeWarning.scss';
import { realtimeWarningAction } from './realtimeWarningAction';
import { commonAction } from '../../../alphaRedux/commonAction';
import Footer from '../../../../components/Common/Footer';
import RealTimeWarningContainer from '../../../../components/HighAnalysis/IntelligentWarning/RealTimeWarning/RealTimeWarningContainer';

class RealTimeWarning extends Component {
  static propTypes = {
    getLostGenType: PropTypes.func,
    resetRealtimeWarninStore: PropTypes.func,
    theme: PropTypes.string,
  }
  constructor(props, context) {
    super(props, context);
  }

  componentWillUnmount() {
    this.props.resetRealtimeWarninStore();
  }
  render() {
    const { theme } = this.props;
    return (
      <div className={`${styles.realtime} ${styles[theme]}`}>
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
    ...state.highAanlysisReducer.realtimeWarningReducer.toJS(),
    stations: state.common.get('stations').toJS(),
    deviceTypes: state.common.get('deviceTypes').toJS(),
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
