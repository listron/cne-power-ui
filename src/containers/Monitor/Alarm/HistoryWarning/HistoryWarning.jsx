import React, { Component } from "react";
import { connect } from "react-redux";
import styles from "./historyWarning.scss";
import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
import { historyWarningActive } from './historyWarningActive';
import { commonAction } from '../../../alphaRedux/commonAction';
import Footer from '../../../../components/Common/Footer';
import HistoryWarningContainer from '../../../../components/Monitor/Alarm/HistoryWarning/HistoryWarningContainer';

class HistoryWarning extends Component {
  static propTypes = {
  }
  constructor(props, context) {
    super(props, context)
  }
  render() {
    const breadCrumbData = {
      breadData: [
        {
          name: '历史预警',
        }
      ],
    };
    return (
      <div className={styles.history}>
        <CommonBreadcrumb  {...breadCrumbData} style={{ marginLeft: '38px' }} />
        <div className={styles.historyWarningBox}>
          <HistoryWarningContainer {...this.props} />
        </div>
        <Footer />
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    ...state.monitor.historyWarningReducer.toJS(),
    stations: state.common.get('stations').toJS(),
    deviceTypes: state.common.get('deviceTypes').toJS(),
  }
}
const mapDispatchToProps = (dispatch) => ({
  changeHistoryWarningStore: payload => dispatch({ type: historyWarningActive.changeHistoryWarningStore, payload }),
  getHistoryarningList: payload => dispatch({ type: historyWarningActive.getHistoryarningList, payload }),
  getHistoryTicketInfo: payload => dispatch({ type: historyWarningActive.getHistoryTicketInfo, payload }),
  getHistoryRelieveInfo: payload => dispatch({ type: historyWarningActive.getHistoryRelieveInfo, payload }),


  

})
export default connect(mapStateToProps, mapDispatchToProps)(HistoryWarning)