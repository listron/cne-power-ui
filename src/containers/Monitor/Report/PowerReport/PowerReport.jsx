import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import styles from "./powerReport.scss";
import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
import { powerReportAction } from './powerReportAction';
import { commonAction } from '../../../../containers/alphaRedux/commonAction';

import Footer from '../../../../components/Common/Footer';
import PowerReportContainer from '../../../../components/Monitor/Report/PowerReport/PowerReport';

class PowerReport extends Component {
  static propTypes = {
    resetPowerReportStore: PropTypes.func,
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
  downLoadFile: payload => dispatch({ type: commonAction.downLoadFile, payload: {
    ...payload,
    actionName: powerReportAction.changePowerReportStore,
  }}),
  getRegion: params => dispatch({ //获取用户权限的电站区域
    type: commonAction.getRegion,
    payload: {
      params,
      actionName: powerReportAction.changePowerReportStore,
      resultName: 'regionData',
    }
  }),
  getRegionStation: params => dispatch({ // //获取用户权限的电站区域下的电站
    type: commonAction.getRegionStation,
    payload: {
      params,
      actionName: powerReportAction.changePowerReportStore,
      resultName: 'regionStationData',
    }
  }),
  getStationDevicemode: params => dispatch({ //获取用户权限的电站区域下的电站下的对应型号
    type: commonAction.getStationDevicemode,
    payload: {
      params,
      actionName: powerReportAction.changePowerReportStore,
      resultName: 'stationDevicemodeData',
    }
  }),
  getRegionStationDevice: params => dispatch({ //获取用户权限的电站区域下电站下的对应设备
    type: commonAction.getRegionStationDevice,
    payload: {
      params,
      actionName: powerReportAction.changePowerReportStore,
      resultName: 'regionStationDeviceData',
    }
  }),

})
export default connect(mapStateToProps, mapDispatchToProps)(PowerReport)
