import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import styles from "./powerLost.scss";
import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
import { powerLostAction } from './powerLostAction';
import Footer from '../../../../components/Common/Footer';
import PowerLostContainer from '../../../../components/Monitor/Report/PowerLost/PowerLost';

class PowerLost extends Component {
  static propTypes = {
    resetPowerLostStore: PropTypes.func,
  }
  constructor(props, context) {
    super(props, context)
  }
  componentDidMount() {
    console.log(this.props)
  }
  componentWillUnmount() {
    this.props.resetPowerLostStore()
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
            <PowerLostContainer {...this.props} />
          </div>
        </div>
        <Footer />
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    ...state.monitor.powerLostReducer.toJS(),
    stations: state.common.get('stations').toJS(),
    deviceTypes: state.common.get('deviceTypes').toJS(),
  }
}
const mapDispatchToProps = (dispatch) => ({
  changePowerLostStore: payload => dispatch({ type: powerLostAction.changePowerLostStore, payload }),
  resetPowerLostStore: payload => dispatch({ type: powerLostAction.resetPowerLostStore, payload }),
  getPowerLostList: payload => dispatch({ type: powerLostAction.getPowerLostList, payload }),
})
export default connect(mapStateToProps, mapDispatchToProps)(PowerLost)