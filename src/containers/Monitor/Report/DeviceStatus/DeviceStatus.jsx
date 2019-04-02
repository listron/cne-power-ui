import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import styles from "./deviceStatus.scss";
import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
import { deviceStatusAction } from './deviceStatusAction';
import Footer from '../../../../components/Common/Footer';
import DeviceStatusContainer from '../../../../components/Monitor/Report/DeviceStatus/DeviceStatus';

class DeviceStatus extends Component {
  static propTypes = {
    resetDeviceStatusStore: PropTypes.func,
  }
  constructor(props, context) {
    super(props, context)
  }
  componentDidMount() {
    console.log(this.props)
  }
  componentWillUnmount() {
    this.props.resetDeviceStatusStore()
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
            <DeviceStatusContainer {...this.props} />
          </div>
        </div>
        <Footer />
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    ...state.monitor.deviceStatusReducer.toJS(),
    stations: state.common.get('stations').toJS(),
    deviceTypes: state.common.get('deviceTypes').toJS(),
  }
}
const mapDispatchToProps = (dispatch) => ({
  changeDeviceStatusStore: payload => dispatch({ type: deviceStatusAction.changeDeviceStatusStore, payload }),
  resetDeviceStatusStore: payload => dispatch({ type: deviceStatusAction.resetDeviceStatusStore, payload }),
  getDeviceStatusList: payload => dispatch({ type: deviceStatusAction.getDeviceStatusList, payload }),
})
export default connect(mapStateToProps, mapDispatchToProps)(DeviceStatus)