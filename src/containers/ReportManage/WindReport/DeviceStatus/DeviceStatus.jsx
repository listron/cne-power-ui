import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import styles from "./deviceStatus.scss";
import { deviceStatusAction } from './deviceStatusAction';
import { commonAction } from '../../../../containers/alphaRedux/commonAction';

import Footer from '../../../../components/Common/Footer';
import DeviceStatusContainer from '../../../../components/ReportManage/WindReport/DeviceStatus/DeviceStatus';

class DeviceStatus extends Component {
  static propTypes = {
    resetDeviceStatusStore: PropTypes.func,
    getRegionStationDevice: PropTypes.func,
    getStationDevicemode: PropTypes.func,
    getRegionStation: PropTypes.func,
    getRegion: PropTypes.func,
    changeDeviceStatusStore: PropTypes.func,
    stationTypeCount: PropTypes.string,
    selectStationType: PropTypes.string,
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
  checkWind = () => this.props.changeDeviceStatusStore({selectStationType:'0'}) // 选中风电站

  checkPv = () => this.props.changeDeviceStatusStore({selectStationType:'1'}) // 选中光伏电站
  render() {
    const { stationTypeCount, selectStationType } = this.props;
    return (
      <div className={styles.containerDiv}>
        <div className={styles.containerBg}>
          <div className={styles.container}>

            {/*
            {stationTypeCount === 'multiple' &&
              <div className={styles.typeCheck}>
                <div className={selectStationType === '0' ? styles.typeActive : styles.typeNormal} onClick={this.checkWind}>风电</div>
                <div className={selectStationType === '1' ? styles.typeActive : styles.typeNormal} onClick={this.checkPv}>光伏</div>
                <div className={styles.holder} />
              </div>
            }
           {selectStationType === '0' && <DeviceStatusContainer {...this.props} />}
           {selectStationType === '1' && <DeviceStatusContainer {...this.props} />}

          */}

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
    ...state.reportManageReducer.deviceStatusReducer.toJS(),
    stations: state.common.get('stations').toJS(),
    deviceTypes: state.common.get('deviceTypes').toJS(),
    stationTypeCount: state.common.get('stationTypeCount'),
  }
}
const mapDispatchToProps = (dispatch) => ({
  changeDeviceStatusStore: payload => dispatch({ type: deviceStatusAction.changeDeviceStatusStore, payload }),
  resetDeviceStatusStore: payload => dispatch({ type: deviceStatusAction.resetDeviceStatusStore, payload }),
  getDeviceStatusList: payload => dispatch({ type: deviceStatusAction.getDeviceStatusList, payload }),
  getDeviceStatusDetail: payload => dispatch({ type: deviceStatusAction.getDeviceStatusDetail, payload }),
  downLoadFile: payload => dispatch({
    type: commonAction.downLoadFile, payload: {
      ...payload,
      actionName: deviceStatusAction.changeDeviceStatusStore
    }
  }),
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
