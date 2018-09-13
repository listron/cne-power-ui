import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './deviceManage.scss';
import { deviceManageAction } from '../../../../constants/actionTypes/system/station/deviceManageAction';
import { commonAction } from '../../../../constants/actionTypes/commonAction';
import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
import StationManageTip from '../../../../components/System/Station/Common/StationManageTip';
import DeviceManageSearch from '../../../../components/System/Station/DeviceManage/DeviceManageSearch';
import DeviceManageHandle from '../../../../components/System/Station/DeviceManage/DeviceManageHandle';
import DeviceManageList from '../../../../components/System/Station/DeviceManage/DeviceManageList';
import Footer from '../../../../components/Common/Footer'
import PropTypes from 'prop-types';

class DeviceManage extends Component {
  static propTypes = {
    stationCode: PropTypes.string,
    deviceTypeCode: PropTypes.string,
    deviceModelCode: PropTypes.string,
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    sortField: PropTypes.string,
    sortMethod: PropTypes.string,
    changeDeviceManageStore: PropTypes.func,
  }
  constructor(props) {
    super(props);
    this.state = {
      showDeviceTip: true
    }
  }
  componentDidMount(){
    this.timeout = setTimeout(()=>{this.setState({
      showDeviceTip: false
    })},3000)
  }

  componentWillUnmount(){
    clearTimeout(this.timeout);
    this.props.changeDeviceManageStore({ // 离开页面前，重置数据。
      stationCode: '', // 选中的电站
      deviceTypeCode: '', // 选中的设备类型
      deviceModelCode: '', // 选中的设备型号
      pageNum: 1,
      pageSize: 10,
      totalNum:  0, // 设备总数
      sortField: '', // 排序字段
      sortMethod: 'des',
      deviceList: []
    })
  }

  hideManageTip=()=>{
    this.setState({
      showDeviceTip: false
    })
  }


  render() {
    const { showDeviceTip } = this.state;
    const { 
      stationCode, deviceTypeCode, deviceModelCode, pageNum, pageSize, sortField, sortMethod
    } = this.props;
    const queryParams = { 
      stationCode, deviceTypeCode, deviceModelCode, pageNum, pageSize, sortField, sortMethod 
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
    ...state.system.deviceManage.toJS(),
    stations: state.common.get('stations').toJS(),
    deviceModels: state.common.get('deviceModels').toJS(),
    stationDeviceTypes: state.common.get('stationDeviceTypes').toJS(),
});

const mapDispatchToProps = (dispatch) => ({
  changeDeviceManageStore: payload => dispatch({type:deviceManageAction.CHANGE_DEVICE_MANAGE_STORE_SAGA, payload}),
  getDeviceList: payload => dispatch({type: deviceManageAction.GET_DEVICE_MANAGE_LIST, payload}),
  getStationDeviceTypes: payload => dispatch({type:commonAction.GET_STATION_DEVICETYPES_SAGA, payload}),
  getStationDeviceModel: payload => dispatch({type:commonAction.GET_STATION_DEVICEMODEL_SAGA, payload}),
});

export default connect(mapStateToProps, mapDispatchToProps)(DeviceManage);
