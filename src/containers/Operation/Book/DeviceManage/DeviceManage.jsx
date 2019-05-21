import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './deviceManage.scss';
import { deviceManageAction } from './deviceManageAction';
import { commonAction } from '../../../alphaRedux/commonAction';
import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
import TransitionContainer from '../../../../components/Common/TransitionContainer';
import DeviceSide from '../../../../components/Operation/Book/DeviceManage/DeviceSide';
import DeviceManageSearch from '../../../../components/Operation/Book/DeviceManage/DeviceManageSearch';
import DeviceManageHandle from '../../../../components/Operation/Book/DeviceManage/DeviceManageHandle';
import DeviceManageList from '../../../../components/Operation/Book/DeviceManage/DeviceManageList';
import Footer from '../../../../components/Common/Footer';
import PartInfo from './PartInfo/PartInfo';

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
    selectType: PropTypes.func,
  }
  constructor(props) {
    super(props);
    this.state = {
      showDeviceTip: true,
      showSidePage: 'add',
    }
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
  queryTargetData = (value) => {
    this.props.changeDeviceManageStore({ selectType: value })
  }

  changeTab = (type) => {
    this.props.changeDeviceManageStore({ selectType: type })
  }

  render() {
    const { showDeviceTip, showSidePage } = this.state;
    const {
      selectType, stationCode, deviceTypeCode, deviceModeCode, pageNum, pageSize, sortField, sortMethod, showPage
    } = this.props;
    console.log('selectType: ', selectType);
    const queryParams = {
      stationCode, deviceTypeCode, deviceModeCode, pageNum, pageSize, sortField, sortMethod
    }
    return (
      <div className={styles.deviceManageContainer}>
        <CommonBreadcrumb breadData={[{ name: '设备' }]} style={{ marginLeft: '38px', backgroundColor: '#fff' }} />
        {selectType === 'deviceInfo' && <div className={styles.deviceManage}>

          <div className={styles.deviceManageMain}>
            <div className={styles.allStationTitle} >
              <p className={selectType === 'deviceInfo' ? styles.activeStation : ''} >设备信息</p>
              <p className={selectType === 'partInfo' ? styles.activeStation : ''} onClick={() => { this.queryTargetData('partInfo') }}>组件信息</p>
            </div>
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
        </div>}
        {selectType === 'partInfo' && <PartInfo changeTab={this.changeTab} />
        }
        <Footer />
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  enterpriseId: Cookie.get('enterpriseId'),
  ...state.operation.deviceManage.toJS(),
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
  addDeviceFactors: payload => dispatch({ type: deviceManageAction.addDeviceFactors, payload }),
  getDeviceFactors: payload => dispatch({ type: deviceManageAction.getDeviceFactors, payload }),
  getfactorsDeviceMode: payload => dispatch({ type: deviceManageAction.getfactorsDeviceMode, payload }),
  getDevicePartInfo: payload => dispatch({ type: deviceManageAction.getDevicePartInfo, payload }),
  getDevicefixRecord: payload => dispatch({ type: deviceManageAction.getDevicefixRecord, payload }),
  getDevicehistoryWarning: payload => dispatch({ type: deviceManageAction.getDevicehistoryWarning, payload }),
 
});

export default connect(mapStateToProps, mapDispatchToProps)(DeviceManage);
