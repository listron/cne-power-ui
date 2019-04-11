import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import styles from "./deviceStatus.scss";
import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
import { deviceStatusAction } from './deviceStatusAction';
import { commonAction } from '../../../../containers/alphaRedux/commonAction';

import Footer from '../../../../components/Common/Footer';
import DeviceStatusContainer from '../../../../components/Monitor/Report/DeviceStatus/DeviceStatus';

class DeviceStatus extends Component {
  static propTypes = {
    resetDeviceStatusStore: PropTypes.func,
    getRegionStationDevice: PropTypes.func,
    getStationDevicemode: PropTypes.func,
    getRegionStation: PropTypes.func,
    getRegion: PropTypes.func,
  }
  constructor(props, context) {
    super(props, context)
  }
  componentDidMount() {
    this.props.getRegionStationDevice()
    this.props.getStationDevicemode()
    this.props.getRegionStation()
    this.props.getRegion()
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
  getRegion: params => dispatch({ //获取用户权限的电站区域
    type: commonAction.getRegion,
    payload: {
      params,
      actionName: deviceStatusAction.changeDeviceStatusStore,
      resultName: 'regionData',
    }
  }),
  getRegionStation: params => dispatch({ // //获取用户权限的电站区域下的电站
    type: commonAction.getRegionStation,
    payload: {
      params,
      actionName: deviceStatusAction.changeDeviceStatusStore,
      resultName: 'regionStationData',
    }
  }),
  getStationDevicemode: params => dispatch({ //获取用户权限的电站区域下的电站下的对应型号
    type: commonAction.getStationDevicemode,
    payload: {
      params,
      actionName: deviceStatusAction.changeDeviceStatusStore,
      resultName: 'stationDevicemodeData',
    }
  }),
  getRegionStationDevice: params => dispatch({ //获取用户权限的电站区域下电站下的对应设备
    type: commonAction.getRegionStationDevice,
    payload: {
      params,
      actionName: deviceStatusAction.changeDeviceStatusStore,
      resultName: 'regionStationDeviceData',
    }
  }),
})
export default connect(mapStateToProps, mapDispatchToProps)(DeviceStatus)