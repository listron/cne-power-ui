import React, { Component } from "react";
import { connect } from "react-redux";
import styles from "./transferForm.scss";
import { transferFormActive } from './transferFormActive';

import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
import Footer from '../../../../components/Common/Footer';
import TransferFormContainer from '../../../../components/HighAnalysis/IntelligentWarning/Transfer/TransferFormContainer';

class TransferForm extends Component {
  static propTypes = {
  }
  constructor(props, context) {
    super(props, context)
  }
  render() {
    const breadCrumbData = {
      breadData: [
        {
          name: '已转工单',
        }
      ],
    };
    return (
      <div className={styles.transfer}>
        <CommonBreadcrumb  {...breadCrumbData} style={{ marginLeft: '38px' }} />
        <div className={styles.transferFormBox}>
          <TransferFormContainer {...this.props} />
        </div>
        <Footer />
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    ...state.highAanlysisReducer.transferFormReducer.toJS(),
  }
}
const mapDispatchToProps = (dispatch) => ({
  getTransferFormStatistic: payload => dispatch({ type: transferFormActive.getTransferFormStatistic, payload }),
})
export default connect(mapStateToProps, mapDispatchToProps)(TransferForm)