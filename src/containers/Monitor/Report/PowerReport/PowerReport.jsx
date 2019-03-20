import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import styles from "./powerReport.scss";
import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
import { powerReportAction } from './powerReportAction';
import Footer from '../../../../components/Common/Footer';
import PowerReportContainer from '../../../../components/Monitor/Report/PowerReport/PowerReport';

class PowerReport extends Component {
  static propTypes = {
    resetPowerReportStore: PropTypes.func,
  }
  constructor(props, context) {
    super(props, context)
  }
  componentDidMount() {
    console.log(this.props)
  }
  componentWillUnmount() {
    this.props.resetPowerReportStore()
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
            <PowerReportContainer {...this.props} />
          </div>
        </div>
        <Footer />
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    ...state.monitor.powerReportReducer.toJS(),
    stations: state.common.get('stations').toJS(),
    deviceTypes: state.common.get('deviceTypes').toJS(),
  }
}
const mapDispatchToProps = (dispatch) => ({
  changePowerReportStore: payload => dispatch({ type: powerReportAction.changePowerReportStore, payload }),
  resetPowerReportStore: payload => dispatch({ type: powerReportAction.resetPowerReportStore, payload }),
  getPowerReportList: payload => dispatch({ type: powerReportAction.getPowerReportList, payload }),
})
export default connect(mapStateToProps, mapDispatchToProps)(PowerReport)