import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './faultWarn.scss';
import PropTypes from 'prop-types';
import { faultWarnAction } from './faultWarnAction.js';
import FaultWarnMain from '../../../../components/HighAnalysis/FaultDiagnose/FaultWarn/FaultWarn';
import Footer from '../../../../components/Common/Footer';

class FaultWarn extends Component {
  static propTypes = {
    resetStore: PropTypes.func,
    getFaultWarnList: PropTypes.func,
  };

  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() {
    const { getFaultWarnList } = this.props;
    getFaultWarnList();
  }

  componentWillUnmount(){
    const { resetStore } = this.props;
    resetStore();
  }

  render() {
    return (
      <div className={styles.faultWarnBox}>
        <div className={styles.faultWarnContainer}>
          <div className={styles.faultWarnContent}>
            <FaultWarnMain {...this.props} />
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return ({
    ...state.highAanlysisReducer.faultWarn.toJS(),
    stations: state.common.get('stations').toJS(),
  });
};
const mapDispatchToProps = (dispatch) => ({
  resetStore: () => dispatch({ type: faultWarnAction.resetStore }),
  getFaultWarnList: () => dispatch({ type: faultWarnAction.getFaultWarnList }),
});
export default connect(mapStateToProps, mapDispatchToProps)(FaultWarn);
