import React, { Component } from "react";
import { connect } from "react-redux";
import styles from "./test.scss";
import PropTypes from 'prop-types';
import { historyWarnAction } from './historyWarnAction';
import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
import Footer from '../../../../components/Common/Footer';
import HistoryWarnCon from '../../../../components/HighAnalysis/EarlyWarning/HistoryWarn/HistoryWarnCon';

class HistoryWarn extends Component {
  static propTypes = {
    resetStore:PropTypes.func
  }

  constructor(props, context) {
    super(props, context)
  }

  componentWillUnmount(){
    this.props.resetStore()
  }

  render() {
    return (
      <div className={styles.historyWarnBox}>
        <CommonBreadcrumb breadData={[{name:'历史预警'}]} style={{marginLeft:'38px'}} />
        <div className={styles.historyWarnContainer}>
          <div className={styles.historyWarnContent}>
            <HistoryWarnCon {...this.props} />
          </div>
        </div>
        <Footer />
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  return ({
    ...state.highAanlysisReducer.historyWarn.toJS(),
    stations: state.common.get('stations').toJS(),
  })
}
const mapDispatchToProps = (dispatch) => ({
  changeCleanoutRecordStore: payload => dispatch({ type: historyWarnAction.changeHistoryWarnStoreSaga, payload }),
  getHistoryWarnList: payload => dispatch({ type: historyWarnAction.getHistoryWarnList, payload }),
  getHistoryWarnMatrixList: payload => dispatch({ type: historyWarnAction.getHistoryWarnMatrixList, payload }),
  getSequencechart: payload => dispatch({ type: historyWarnAction.getSequencechart, payload }),
  resetStore: () => dispatch({ type: historyWarnAction.resetStore }),
})
export default connect(mapStateToProps, mapDispatchToProps)(HistoryWarn)