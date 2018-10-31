import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './deviceManage.scss';
import { deviceManageAction } from './deviceManageAction';
import { commonAction } from '../../../alphaRedux/commonAction';
import { stationManageAction } from '../StationManage/stationManageAction';
import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
import StationManageTip from '../../../../components/System/Station/Common/StationManageTip';
import DeviceManageSearch from '../../../../components/System/Station/DeviceManage/DeviceManageSearch';
import DeviceManageHandle from '../../../../components/System/Station/DeviceManage/DeviceManageHandle';
import DeviceManageList from '../../../../components/System/Station/DeviceManage/DeviceManageList';
import Footer from '../../../../components/Common/Footer'
import PropTypes from 'prop-types';
import Cookie from 'js-cookie';

class DeviceManage extends Component {
  static propTypes = {
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
      showDeviceTip: true
    }
  }
  componentDidMount(){
    const { enterpriseId, getStationOfEnterprise } = this.props;
    getStationOfEnterprise({ enterpriseId }); // 请求用户所在企业的所有企业
    this.timeout = setTimeout(()=>{this.setState({
      showDeviceTip: false
    })},3000)
  }

  componentWillUnmount(){
    clearTimeout(this.timeout);
    this.props.resetStore(); // 重置数据
  }

  hideManageTip=()=>{
    this.setState({
      showDeviceTip: false
    })
  }


  render() {
    const { showDeviceTip } = this.state;
    const { 
      stationCode, deviceTypeCode, deviceModeCode, pageNum, pageSize, sortField, sortMethod
    } = this.props;
    const queryParams = { 
      stationCode, deviceTypeCode, deviceModeCode, pageNum, pageSize, sortField, sortMethod 
    }
    return (
      <div className={styles.deviceManageContainer}>
        <CommonBreadcrumb  breadData={[{name: '设备'}]} style={{ marginLeft: '38px',backgroundColor:'#fff' }} />
        <div className={styles.deviceManage}>
          <div className={styles.deviceManageMain}>
            {showDeviceTip && <StationManageTip hideManageTip={this.hideManageTip} text="请选择您要查看的电站！" />}
            <div className={styles.deviceManageContent}>
              <DeviceManageSearch queryParams={queryParams} {...this.props} />
              <DeviceManageHandle queryParams={queryParams} {...this.props} />
              <DeviceManageList queryParams={queryParams} {...this.props} />
            </div>
          </div>
          <Footer />
        </div>
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
  changeDeviceManageStore: payload => dispatch({type:deviceManageAction.CHANGE_DEVICE_MANAGE_STORE_SAGA, payload}),
  getDeviceList: payload => dispatch({type: deviceManageAction.GET_DEVICE_MANAGE_LIST, payload}),
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
  getStationOfEnterprise: params =>dispatch({
    type: commonAction.getStationOfEnterprise, 
    payload: {
      params, 
      actionName: deviceManageAction.GET_DEVICE_MANAGE_FETCH_SUCCESS,
      resultName: 'allStationBaseInfo'
    } 
  }),
  changeCommonStore: payload => dispatch({type:commonAction.changeCommonStore, payload}),
});

export default connect(mapStateToProps, mapDispatchToProps)(DeviceManage);
