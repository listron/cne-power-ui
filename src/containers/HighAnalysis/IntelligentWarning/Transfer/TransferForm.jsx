import React, { Component } from "react";
import { connect } from "react-redux";
import styles from "./transferForm.scss";
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
          <TransferFormContainer />
        </div>
        <Footer />
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  return {
  }
}
const mapDispatchToProps = (dispatch) => ({
  
})
export default connect(mapStateToProps, mapDispatchToProps)(TransferForm)