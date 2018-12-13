import React, { Component } from "react";
import { connect } from "react-redux";
import styles from "./cleanoutWarning.scss";
import { cleanoutWarningAction } from './cleanoutWarningAction';
import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
import Footer from '../../../../components/Common/Footer';
class CleanoutWarning extends Component {
  static propTypes = {
  }
  constructor(props, context) {
    super(props, context)
  }
  render() {
    const breadCrumbData = {
      breadData: [
        {
          name: '清洗预警',
        }
      ],
    };
    return (
      <div className={styles.cleanoutWarningBox} >
      <CommonBreadcrumb  {...breadCrumbData} style={{ marginLeft: '38px' }} />
      <div className={styles.cleanoutWarningContainer}>  
      预警
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
  changeCleanoutWarningStore: payload => dispatch({type:cleanoutWarningAction.CHANGE_CLEANOUT_WARNING_STORE_SAGA, payload}),
})
export default connect(mapStateToProps, mapDispatchToProps)(CleanoutWarning)