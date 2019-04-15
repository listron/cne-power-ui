import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import styles from "./powerLost.scss";
import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
import { powerLostAction } from './powerLostAction';
import { commonAction } from '../../../../containers/alphaRedux/commonAction';
import Footer from '../../../../components/Common/Footer';
import PowerLostContainer from '../../../../components/Monitor/Report/PowerLost/PowerLost';

class PowerLost extends Component {
  static propTypes = {
    resetPowerLostStore: PropTypes.func,
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
    this.props.resetPowerLostStore()
  }
  render() {
    const breadCrumbData = {
      breadData: [
        {
          name: '报告查询-损失电量',
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
  downLoadFile: payload => dispatch({ type: commonAction.downLoadFile, payload: {
    ...payload,
    actionName: powerLostAction.changePowerLostStore,
  }}),
  getRegion: params => dispatch({ //获取用户权限的电站区域
    type: commonAction.getRegion,
    payload: {
      params,
      actionName: powerLostAction.changePowerLostStore,
      resultName: 'regionData',
    }
  }),
  getRegionStation: params => dispatch({ // //获取用户权限的电站区域下的电站
    type: commonAction.getRegionStation,
    payload: {
      params,
      actionName: powerLostAction.changePowerLostStore,
      resultName: 'regionStationData',
    }
  }),
  getStationDevicemode: params => dispatch({ //获取用户权限的电站区域下的电站下的对应型号
    type: commonAction.getStationDevicemode,
    payload: {
      params,
      actionName: powerLostAction.changePowerLostStore,
      resultName: 'stationDevicemodeData',
    }
  }),
  getRegionStationDevice: params => dispatch({ //获取用户权限的电站区域下电站下的对应设备
    type: commonAction.getRegionStationDevice,
    payload: {
      params,
      actionName: powerLostAction.changePowerLostStore,
      resultName: 'regionStationDeviceData',
    }
  }),
})
export default connect(mapStateToProps, mapDispatchToProps)(PowerLost)