import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './styles.scss';
import { branchConfigAction } from './branchConfigAction';
import Footer from '../.../../../../../components/Common/Footer';
import BranchFilter from '../../../../components/System/Station/BranchConfig/BranchFilter';
import BranchTable from '../../../../components/System/Station/BranchConfig/BranchTable';
import PropTypes from 'prop-types';

class BranchConfig extends Component {
  static propTypes = {
    resetBranchStore: PropTypes.func,
  }
  constructor(props, context) {
    super(props, context);
  }
  componentWillUnmount() {
    this.props.resetBranchStore();
  }
  render() {
    return (
      <div className={styles.box}>
        <div className={styles.container}>
          <BranchFilter {...this.props} />
          <BranchTable {...this.props} />
        </div>
        <Footer />
      </div>

    );
  }
}
const mapStateToProps = (state) => {
  return {
    ...state.system.branchConfigReducer.toJS(),
    stations: state.common.get('stations').toJS(),
  };
};
const mapDispatchToProps = (dispatch) => ({
  changeBranchStore: payload => dispatch({ type: branchConfigAction.changeBranchStore, payload }),
  resetBranchStore: payload => dispatch({ type: branchConfigAction.resetBranchStore, payload }),
  getStations: payload => dispatch({ type: branchConfigAction.getStations, payload }),
  getDeviceType: payload => dispatch({ type: branchConfigAction.getDeviceType, payload }),
  getDeviceName: payload => dispatch({ type: branchConfigAction.getDeviceName, payload }),
  getCheckStatus: payload => dispatch({ type: branchConfigAction.getCheckStatus, payload }),
  getDeviceBranchInfo: payload => dispatch({ type: branchConfigAction.getDeviceBranchInfo, payload }),
  getCheckData: payload => dispatch({ type: branchConfigAction.getCheckData, payload }),
  editBranchData: payload => dispatch({ type: branchConfigAction.editBranchData, payload }),

  getAvailableDeviceType: payload => dispatch({ type: branchConfigAction.getAvailableDeviceType, payload }),

});
export default connect(mapStateToProps, mapDispatchToProps)(BranchConfig);

