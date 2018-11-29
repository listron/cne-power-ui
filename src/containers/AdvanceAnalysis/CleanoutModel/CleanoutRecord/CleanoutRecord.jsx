import React, { Component } from "react";
import { connect } from "react-redux";
import styles from "./cleanoutRecord.scss";
import { cleanoutRecordAction } from './cleanoutRecordAction';
import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
import Footer from '../../../../components/Common/Footer';
import TransitionContainer from '../../../../components/Common/TransitionContainer';

import CleanoutRecordMain from '../../../../components/AdvanceAnalysis/CleanoutModel/CleanoutRecord/CleanoutRecordMain/CleanoutRecordMain';
import CleanoutRecordSide from '../../../../components/AdvanceAnalysis/CleanoutModel/CleanoutRecord/CleanoutRecordSide/CleanoutRecordSide';
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
          <CleanoutRecordMain />
          <TransitionContainer
            show={showPage!=='list'}
            onEnter={this.onToggleSide}
            onExited={this.onToggleSide}
            timeout={500}
            effect="side"
          >
            <CleanoutRecordSide
              {...this.props} 
              // showSidePage={showSidePage}
              // queryListParams={queryListParams}
              // onShowSideChange={this.onShowSideChange} 
            />
          </TransitionContainer>
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
  changeCleanoutRecordStore: payload => dispatch({ type: cleanoutRecordAction.CHANGE_CLEANOUT_RECORD_STORE_SAGA, payload }),
})
export default connect(mapStateToProps, mapDispatchToProps)(CleanoutRecord)