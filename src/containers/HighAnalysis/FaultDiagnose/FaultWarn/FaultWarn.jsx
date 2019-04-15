import React, { Component } from "react";
import { connect } from "react-redux";
import styles from "./faultWarn.scss";
import PropTypes from 'prop-types';
import { faultWarnAction } from './faultWarnAction.js';
import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
import FaultWarnMain from '../../../../components/HighAnalysis/FaultDiagnose/FaultWarn/FaultWarn';
import Footer from '../../../../components/Common/Footer';

class FaultWarn extends Component {
  static propTypes = {
    resetStore:PropTypes.func
  };

  constructor(props, context) {
    super(props, context);
  }

  componentWillUnmount(){
    this.props.resetStore();
  }

  render() {
    return (
      <div className={styles.faultWarnBox}>
        <CommonBreadcrumb breadData={[{name:'故障预警'}]} style={{marginLeft:'38px'}} />
        <div className={styles.faultWarnContainer}>
          <div className={styles.faultWarnContent}>
            <FaultWarnMain {...this.props} />
          </div>
        </div>
        <Footer />
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  return ({
    ...state.highAanlysisReducer.faultWarn.toJS(),
    stations: state.common.get('stations').toJS(),
  })
};
const mapDispatchToProps = (dispatch) => ({
  resetStore: () => dispatch({ type: faultWarnAction.resetStore }),
});
export default connect(mapStateToProps, mapDispatchToProps)(FaultWarn)
