import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './styles.scss';
import { branchConfigAction } from './branchConfigAction';
import Footer from '../.../../../../../components/Common/Footer';
import Filter from '../../../../components/System/Station/BranchConfig/Filter';
import Table from '../../../../components/System/Station/BranchConfig/Table';
import PropTypes from 'prop-types';

class BranchConfig extends Component {
  static propTypes = {
  }
  constructor(props, context) {
    super(props, context);
  }
  render() {
    return (
      <div className={styles.box}>
        <div className={styles.container}>
          <Filter {...this.props} />
          <Table {...this.props} />
        </div>
        <Footer />
      </div>

    );
  }
}
const mapStateToProps = (state) => {
  return {
    stations: state.common.get('stations').toJS(),
  };
};
const mapDispatchToProps = (dispatch) => ({
  changeBranchStore: payload => dispatch({ type: branchConfigAction.changeBranchStore, payload }),
  getAvailableDeviceType: payload => dispatch({ type: branchConfigAction.getAvailableDeviceType, payload }),

});
export default connect(mapStateToProps, mapDispatchToProps)(BranchConfig)
  ;
