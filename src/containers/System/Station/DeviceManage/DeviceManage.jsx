import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './deviceManage.scss';
import { deviceManageAction } from './deviceManageAction';
import { commonAction } from '../../../alphaRedux/commonAction';
import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
import TransitionContainer from '../../../../components/Common/TransitionContainer';
import DeviceSide from '../../../../components/System/Station/DeviceManage/DeviceSide';

import StationManageTip from '../../../../components/System/Station/Common/StationManageTip';
import DeviceManageSearch from '../../../../components/System/Station/DeviceManage/DeviceManageSearch';
import DeviceManageHandle from '../../../../components/System/Station/DeviceManage/DeviceManageHandle';
import DeviceManageList from '../../../../components/System/Station/DeviceManage/DeviceManageList';
import Footer from '../../../../components/Common/Footer'
import PropTypes from 'prop-types';
import Cookie from 'js-cookie';

class DeviceManage extends Component {
  static propTypes = {
    showPage: PropTypes.string,
    enterpriseId: PropTypes.string,
    stationCode: PropTypes.number,
    deviceTypeCode: PropTypes.number,
    deviceModeCode: PropTypes.number,
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    sortField: PropTypes.string,
    sortMethod: PropTypes.string,
    changeDeviceManageStore: PropTypes.func,
    getStationOfEnterprise: PropTypes.func,
    resetStore: PropTypes.func,
  }
  constructor(props) {
    super(props);
    this.state = {
      showDeviceTip: true,
      showSidePage: 'add',
    }
  }
  componentWillMount() {
    this.props.history.push('/operation/book/deviceManage')
  }
  componentDidMount() {
    const { enterpriseId, getStationOfEnterprise } = this.props;
    getStationOfEnterprise({ enterpriseId }); // 请求用户所在企业的所有企业
    this.timeout = setTimeout(() => {
      this.setState({
        showDeviceTip: false
      })
    }, 3000)
  }
  componentWillUnmount() {
    clearTimeout(this.timeout);
    this.props.resetStore(); // 重置数据
  }
  onShowSideChange = (showSidePage) => {
    this.setState({ showSidePage });
  }

  onToggleSide = () => {
    const { showPage } = this.props;
    this.setState({
      showSidePage: showPage
    });
  }

  hideManageTip = () => {
    this.setState({
      showDeviceTip: false
    })
  }
  render() {
    const { showDeviceTip, showSidePage } = this.state;
    const {
      stationCode, deviceTypeCode, deviceModeCode, pageNum, pageSize, sortField, sortMethod, showPage
    } = this.props;
    const queryParams = {
      stationCode, deviceTypeCode, deviceModeCode, pageNum, pageSize, sortField, sortMethod
    }
    return (
      <div className={styles.deviceManageContainer}>
        <CommonBreadcrumb breadData={[{ name: '设备' }]} style={{ marginLeft: '38px', backgroundColor: '#fff' }} />
        <div className={styles.deviceManage}>
          <div className={styles.deviceManageMain}>
            {showDeviceTip && <StationManageTip hideManageTip={this.hideManageTip} text="请选择您要查看的电站！" />}
            <div className={styles.deviceManageContent}>
              <DeviceManageSearch queryParams={queryParams} {...this.props} />
              <DeviceManageHandle queryParams={queryParams} {...this.props} />
              <DeviceManageList queryParams={queryParams} {...this.props} />
            </div>
          </div>
          <TransitionContainer
            show={showPage !== 'list'}
            onEnter={this.onToggleSide}
            onExited={this.onToggleSide}
            timeout={500}
            effect="side"
          >

            <DeviceSide {...this.props} queryParams={queryParams} showSidePage={showSidePage} onShowSideChange={this.onShowSideChange} />
          </TransitionContainer>
        </div>
        <Footer />
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  enterpriseId: Cookie.get('enterpriseId'),
  ...state.system.deviceManage.toJS(),
  stations: state.common.get('stations').toJS(),
});

const mapDispatchToProps = (dispatch) => ({
  changeDeviceManageStore: payload => dispatch({ type: deviceManageAction.CHANGE_DEVICE_MANAGE_STORE_SAGA, payload }),
  getDeviceList: payload => dispatch({ type: deviceManageAction.GET_DEVICE_MANAGE_LIST, payload }),
  resetStore: () => dispatch({ type: deviceManageAction.resetStore }),
  getStationDeviceTypes: params => dispatch({
    type: commonAction.getStationDeviceTypes,
    payload: {
      params,
      deviceTypeAction: deviceManageAction.GET_DEVICE_MANAGE_FETCH_SUCCESS,
      resultName: 'stationDeviceTypes'
    }
  }),
  getDeviceModel: params => dispatch({
    type: commonAction.getDeviceModel,
    payload: {
      params,
      actionName: deviceManageAction.GET_DEVICE_MANAGE_FETCH_SUCCESS,
      resultName: 'deviceModels'
    }
  }),
  getPvDevice: params => dispatch({
    type: commonAction.getDeviceModel,
    payload: {
      params,
      actionName: deviceManageAction.GET_DEVICE_MANAGE_FETCH_SUCCESS,
      resultName: 'pvDeviceModels'
    }
  }),
  getStationOfEnterprise: params => dispatch({
    type: commonAction.getStationOfEnterprise,
    payload: {
      params,
      actionName: deviceManageAction.GET_DEVICE_MANAGE_FETCH_SUCCESS,
      resultName: 'allStationBaseInfo'
    }
  }),
  exportPoints: payload => dispatch({
    type: commonAction.downLoadFile,
    payload: {
      ...payload,
      actionName: deviceManageAction.GET_DEVICE_MANAGE_FETCH_SUCCESS
    }
  }),
  changeCommonStore: payload => dispatch({ type: commonAction.changeCommonStore, payload }),
  addDeviceDetail: payload => dispatch({ type: deviceManageAction.addDeviceDetail, payload }),
  getStationDeviceDetail: payload => dispatch({ type: deviceManageAction.getStationDeviceDetail, payload }),
  getOtherPageDeviceDetail: payload => dispatch({ type: deviceManageAction.getOtherPageDeviceDetail, payload }),
  editDeviceDetail: payload => dispatch({ type: deviceManageAction.editDeviceDetail, payload }),
  getConnectDevice: payload => dispatch({ type: deviceManageAction.getConnectDevice, payload }),
  deleteDevice: payload => dispatch({ type: deviceManageAction.deleteDevice, payload }),
  addDeviceType: payload => dispatch({ type: deviceManageAction.addDeviceType, payload }),
  addDeviceMode: payload => dispatch({ type: deviceManageAction.addDeviceMode, payload }),
  addPvDeviceMode: payload => dispatch({ type: deviceManageAction.addPvDeviceMode, payload }),
  checkDeviceName: payload => dispatch({ type: deviceManageAction.checkDeviceName, payload }),
  checkDeviceType: payload => dispatch({ type: deviceManageAction.checkDeviceType, payload }),
  checkDeviceMode: payload => dispatch({ type: deviceManageAction.checkDeviceMode, payload }),
  deleteStationDevice: payload => dispatch({ type: deviceManageAction.deleteStationDevice, payload }),
  importStationDevice: payload => dispatch({ type: deviceManageAction.importStationDevice, payload }),
  getStationDeviceType: payload => dispatch({ type: deviceManageAction.getStationDeviceType, payload }),
});

export default connect(mapStateToProps, mapDispatchToProps)(DeviceManage);
