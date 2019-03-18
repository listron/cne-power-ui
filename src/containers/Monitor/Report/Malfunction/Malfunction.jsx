import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import styles from "./malfunction.scss";
import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
import { malfunctionAction } from './malfunctionAction';
import Footer from '../../../../components/Common/Footer';
import MalfunctionContainer from '../../../../components/Monitor/Report/Malfunction/Malfunction';

class Malfunction extends Component {
  static propTypes = {
    resetMalfunctionStore: PropTypes.func,
  }
  constructor(props, context) {
    super(props, context)
  }
  componentDidMount() {
    console.log(this.props)
  }
  componentWillUnmount() {
    this.props.resetMalfunctionStore()
  }
  render() {
    const breadCrumbData = {
      breadData: [
        {
          name: '报告查询-电量报表',
        }
      ],
    };
    return (
      <div className={styles.containerDiv}>
        <CommonBreadcrumb  {...breadCrumbData} style={{ marginLeft: '38px' }} />
        <div className={styles.containerBg}>
          <div className={styles.container}>
            <MalfunctionContainer {...this.props} />
          </div>
        </div>
        <Footer />
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    ...state.monitor.malfunctionReducer.toJS(),
    stations: state.common.get('stations').toJS(),
    deviceTypes: state.common.get('deviceTypes').toJS(),
  }
}
const mapDispatchToProps = (dispatch) => ({
  changeMalfunctionStore: payload => dispatch({ type: malfunctionAction.changeMalfunctionStore, payload }),
  resetMalfunctionStore: payload => dispatch({ type: malfunctionAction.resetMalfunctionStore, payload }),
  getMalfunctionList: payload => dispatch({ type: malfunctionAction.getMalfunctionList, payload }),
})
export default connect(mapStateToProps, mapDispatchToProps)(Malfunction)