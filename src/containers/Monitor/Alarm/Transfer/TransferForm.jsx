import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styles from './transferForm.scss';
import { transferFormAction } from './transferFormAction';
import { commonAction } from '../../../alphaRedux/commonAction';
import Footer from '../../../../components/Common/Footer';
import TransferFormContainer from '../../../../components/Monitor/Alarm/Transfer/TransferFormContainer';
// import TransitionContainer from '../../../../components/Common/TransitionContainer';
// import WorkOrder from '../../../Operation/Ticket/WorkOrder/WorkOrder';



class TransferForm extends Component {
  static propTypes = {
    resetTransferFormStore: PropTypes.func,
    changeTransferFormStore: PropTypes.func,
    pageName: PropTypes.string,
    defectId: PropTypes.string,
    theme: PropTypes.string,
  }
  constructor(props, context) {
    super(props, context);
    this.state = {
      showPage: false,
    };
  }
  componentWillUnmount() {
    this.props.resetTransferFormStore();
  }
  onEnterToggleSide = () => {//动态切换页面,开
    this.setState({ showPage: true });
  }

  onEndToggleSide = () => {//动态切换页面,关
    this.setState({ showPage: false });
    this.props.changeTransferFormStore({ defectId: '' });
  }
  prevChange = (value) => { // 切换到当前页
    this.props.changeTransferFormStore({ ...value });
  }
  render() {
    const { pageName, defectId, theme } = this.props;
    const { showPage } = this.state;
    return (
      <div className={`${styles.transfer} ${styles[theme]}`}>
        <div className={styles.transferColor}>
          <div className={styles.transferAlarmContainer}>
            <TransferFormContainer {...this.props} />
            {/* <TransitionContainer
              show={pageName === 'detail'}
              timeout={500}
              effect="side"
              onEnter={this.onEnterToggleSide}
              onExited={this.onEndToggleSide}
            > */}
            {/* <WorkOrder defectId={defectId} otherFrom={true} pageName={'list'} onChange={this.prevChange}
                showPage={showPage}
              /> */}
            {/* </TransitionContainer> */}
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    ...state.monitor.transferFormReducer.toJS(),
    stations: state.common.get('stations').toJS(),
    deviceTypes: state.common.get('deviceTypes').toJS(),
    theme: state.common.get('theme'),
  };
};
const mapDispatchToProps = (dispatch) => ({
  getTransferFormStatistic: payload => dispatch({ type: transferFormAction.getTransferFormStatistic, payload }),
  changeTransferFormStore: payload => dispatch({ type: transferFormAction.changeTransferFormStore, payload }),
  resetTransferFormStore: payload => dispatch({ type: transferFormAction.resetTransferFormStore, payload }),
  getTransferForm: payload => dispatch({ type: transferFormAction.getTransferForm, payload }),
  getTransferInfo: payload => dispatch({ type: transferFormAction.getTransferInfo, payload }),
  getLostGenType: params => dispatch({
    type: commonAction.getLostGenType,
    payload: {
      params,
      actionName: transferFormAction.changeRealtimeWarningStore,
      resultName: 'defectTypes',
    },
  }),
});
export default connect(mapStateToProps, mapDispatchToProps)(TransferForm)
  ;
