

import React, { Component } from "react";
import { connect } from "react-redux";
import styles from './realTimeWarning.scss'
import { realtimeWarningActive } from './realtimeWarningActive';

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
    const{warningStatus,warningType}=this.props;
    this.props.getRealtimeWarningStatistic({warningStatus,warningType})
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
  }
}
const mapDispatchToProps = (dispatch) => ({
  resetStore: payload => dispatch({ type: realtimeWarningActive.resetStore, payload }),
  getRealtimeWarningStatistic: payload => dispatch({ type: realtimeWarningActive.getRealtimeWarningStatistic, payload }),

})
export default connect(mapStateToProps, mapDispatchToProps)(RealTimeWarning)