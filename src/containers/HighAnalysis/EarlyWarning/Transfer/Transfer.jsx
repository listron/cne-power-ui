import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styles from './reTransfer.scss';
import { transferAction } from './transferAction';
import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
import Footer from '../../../../components/Common/Footer';
import TransferCont from '../../../../components/HighAnalysis/EarlyWarning/Transfer/Transfer';
import TransitionContainer from '../../../../components/Common/TransitionContainer';
import WorkOrder from '../../../Operation/Ticket/WorkOrder/WorkOrder';

class Transfer extends Component {
  static propTypes = {
    pageName: PropTypes.string,
    defectId: PropTypes.string,
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    changeTransferStore: PropTypes.func,
    theme: PropTypes.string,

  }
  constructor(props, context) {
    super(props, context);
    this.state = {
      showPage: false,
    };

  }

  onEnterToggleSide = () => {
    this.setState({ showPage: true });
  }

  onEndToggleSide = () => {
    this.setState({ showPage: false });
    this.props.changeTransferStore({ defectId: '' });
  }

  prevChange = (value) => {
    this.props.changeTransferStore({ ...value });
  }

  render() {
    const { defectId, pageNum, pageSize, pageName, theme } = this.props;
    const { showPage } = this.state;
    return (
      <div className={`${styles.transferBox} ${styles[theme]}`} >
        <CommonBreadcrumb breadData={[{ name: '已转工单' }]} style={{ marginLeft: '38px' }} />
        <div className={styles.transferColor}>
          <div className={styles.transferContainer}>
            <div className={styles.transBox}>
              <TransferCont {...this.props} />
            </div>
            <TransitionContainer
              show={pageName === 'detail'}
              timeout={500}
              effect="side"
              onEnter={this.onEnterToggleSide}
              onExited={this.onEndToggleSide}
            >
              <WorkOrder defectId={defectId} otherFrom={true} pageName={'list'} onChange={this.prevChange}
                pageNum={pageNum} pageSize={pageSize} showPage={showPage}
              />
            </TransitionContainer>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    ...state.highAanlysisReducer.transFer.toJS(),
    stations: state.common.get('stations').toJS(),
    theme: state.common.get('theme'),

  };
};
const mapDispatchToProps = (dispatch) => ({
  changeTransferStore: payload => dispatch({ type: transferAction.changeTransferStoreSaga, payload }),
  getMatrixlist: payload => dispatch({ type: transferAction.getMatrixlist, payload }),
  getTransferList: payload => dispatch({ type: transferAction.getTransferList, payload }),
  resetStore: () => dispatch({ type: transferAction.resetStore }),
});
export default connect(mapStateToProps, mapDispatchToProps)(Transfer);
