import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styles from './reTransfer.scss';
import { transferAction } from './transferAction';
import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
import Footer from '../../../../components/Common/Footer';
import TransferCont from '../../../../components/HighAnalysis/EarlyWarning/Transfer/Transfer';

class Transfer extends Component {
  static propTypes = {
    theme: PropTypes.string,
  }
  constructor(props, context) {
    super(props, context);
  }

  render() {
    const { theme } = this.props;
    return (
      <div className={`${styles.transferBox} ${styles[theme]}`} >
        <CommonBreadcrumb breadData={[{ name: '已转工单' }]} style={{ marginLeft: '38px' }} />
        <div className={styles.transferColor}>
          <TransferCont {...this.props} />
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
