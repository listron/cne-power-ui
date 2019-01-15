import React, { Component } from "react";
import { connect } from "react-redux";
import styles from "./transferForm.scss";
import { transferFormActive } from './transferFormActive';
import { commonAction } from '../../../alphaRedux/commonAction';

import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
import Footer from '../../../../components/Common/Footer';
import TransferFormContainer from '../../../../components/HighAnalysis/IntelligentWarning/Transfer/TransferFormContainer';
import TransitionContainer from '../../../../components/Common/TransitionContainer';
import WorkOrder from '../../../Operation/Ticket/WorkOrder/WorkOrder';



class TransferForm extends Component {
  static propTypes = {
  }
  constructor(props, context) {
    super(props, context)
    this.state = {
      showPage: false
    }
  }
  render() {
    const { pageName, defectId } = this.props;
    const { showPage } = this.state;
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
        <div className={styles.transferColor}>
        <div className={styles.transferAlarmContainer}>
          <TransferFormContainer {...this.props} />
          <TransitionContainer
            show={pageName === 'detail'}
            timeout={500}
            effect="side"
            onEnter={this.onEnterToggleSide}
            onExited={this.onEndToggleSide}
          >
            <WorkOrder defectId={defectId} otherFrom={true} pageName={'list'} onChange={this.prevChange}
              showPage={showPage}
            />
          </TransitionContainer>
        </div>
        </div>
        <Footer />
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    ...state.highAanlysisReducer.transferFormReducer.toJS(),
    stations: state.common.get('stations').toJS(),
    deviceTypes: state.common.get('deviceTypes').toJS(),
  }
}
const mapDispatchToProps = (dispatch) => ({
  getTransferFormStatistic: payload => dispatch({ type: transferFormActive.getTransferFormStatistic, payload }),
  changeTransferFormStore: payload => dispatch({ type: transferFormActive.changeTransferFormStore, payload }),
  resetTransferFormStore: payload => dispatch({ type: transferFormActive.resetTransferFormStore, payload }),
  getTransferForm: payload => dispatch({ type: transferFormActive.getTransferForm, payload }),
  getTransferInfo: payload => dispatch({ type: transferFormActive.getTransferInfo, payload }),
  getLostGenType: params => dispatch({
    type: commonAction.getLostGenType,
    payload: {
      params,
      actionName: transferFormActive.changeRealtimeWarningStore,
      resultName: 'defectTypes'
    }
  }),
})
export default connect(mapStateToProps, mapDispatchToProps)(TransferForm)