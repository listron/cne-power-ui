

import React, { Component } from "react";
import { connect } from "react-redux";
import styles from './realTimeWarning.scss'
import { realtimeWarningActive } from './realtimeWarningActive';
import { commonAction } from '../../../alphaRedux/commonAction';


import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
import Footer from '../../../../components/Common/Footer';
import RealTimeWarningContainer from '../../../../components/HighAnalysis/IntelligentWarning/RealTimeWarning/RealTimeWarningContainer';

class RealTimeWarning extends Component {
  static propTypes = {
  }
  constructor(props, context) {
    super(props, context)
  }
  componentDidMount(){
  this.props.getLostGenType({objectType: 1})
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
          <RealTimeWarningContainer {...this.props}  />
        </div>
        <Footer />
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    ...state.highAanlysisReducer.realtimeWarningReducer.toJS(),
    stations: state.common.get('stations').toJS(),
    deviceTypes: state.common.get('deviceTypes').toJS(),
    
  }
}
const mapDispatchToProps = (dispatch) => ({
  changeRealtimeWarningStore: payload => dispatch({ type: realtimeWarningActive.changeRealtimeWarningStore, payload }),
  resetStore: payload => dispatch({ type: realtimeWarningActive.resetStore, payload }),
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