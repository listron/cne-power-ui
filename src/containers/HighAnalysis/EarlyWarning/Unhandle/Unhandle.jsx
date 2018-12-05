import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import styles from "./Unhandle.scss";
import { unhandleAction } from './unhandleAction';
import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
import Footer from '../../../../components/Common/Footer';
import TransitionContainer from '../../../../components/Common/TransitionContainer';
import UnhandleContainer from '../../../../components/HighAnalysis/EarlyWarning/Unhandle/Unhandle'

class Unhandle extends Component {
  static propTypes = {

  }
  constructor(props, context) {
    super(props, context)

  }

  render() {
    const breadCrumbData = {
      breadData: [
        {
          name: '待处理预警',
        }
      ],
    };
    return (
      <div className={styles.UnhandleBox} >
        <CommonBreadcrumb  {...breadCrumbData} style={{ marginLeft: '38px' }} />
        <div className={styles.unhandleContainer}>
          <UnhandleContainer />
        </div>
        <Footer />
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    ...state.advanceAanlysisReducer.cleanoutRecordReducer.toJS(),
    stations: state.common.get('stations'),

  }
}
const mapDispatchToProps = (dispatch) => ({
  changeUnhandleStoreSage: payload => dispatch({ type: unhandleAction.changeUnhandleStoreSage, payload }),
})
export default connect(mapStateToProps, mapDispatchToProps)(Unhandle)