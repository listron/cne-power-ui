import React, { Component } from "react";
import { connect } from "react-redux";
import styles from "./cleanoutRecord.scss";
import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
import Footer from '../../../../components/Common/Footer';
class CleanoutRecord extends Component {
  static propTypes = {
  }
  constructor(props, context) {
    super(props, context)
  }
  render() {
    const breadCrumbData = {
      breadData: [
        {
          name: '清洗计划与记录',
        }
      ],
    };
    return (
      <div className={styles.cleanoutRecordBox} >
      <CommonBreadcrumb  {...breadCrumbData} style={{ marginLeft: '38px' }} />
      <div className={styles.cleanoutRecordContainer}>  
      计划与记录
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
export default connect(mapStateToProps, mapDispatchToProps)(CleanoutRecord)