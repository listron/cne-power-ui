import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './alarmManage.scss';
import { alarmManageAction } from '../../../../constants/actionTypes/system/station/alarmManageAction';
import { commonAction } from '../../../../constants/actionTypes/commonAction';
import { stationManageAction } from '../../../../constants/actionTypes/system/station/stationManageAction';
import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
import StationManageTip from '../../../../components/System/Station/Common/StationManageTip';
import AlarmManageSearch from '../../../../components/System/Station/AlarmManage/AlarmManageSearch';
import AlarmManageHandle from '../../../../components/System/Station/AlarmManage/AlarmManageHandle';
import AlarmManageList from '../../../../components/System/Station/AlarmManage/AlarmManageList';
import Footer from '../../../../components/Common/Footer'
import PropTypes from 'prop-types';
import Cookie from 'js-cookie';

class AlarmManage extends Component {
  static propTypes = {
    enterpriseId: PropTypes.string,
    stationCode: PropTypes.number,
    deviceTypeCode: PropTypes.number,
    deviceModeCode: PropTypes.number,
    pointCode: PropTypes.string,
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    sortField: PropTypes.string,
    sortOrder: PropTypes.string,
    changeAlarmManageStore: PropTypes.func,
    getStationOfEnterprise: PropTypes.func,
  }
  constructor(props) {
    super(props);
    this.state = {
      showAlarmTip: true
    }
  }
  componentDidMount(){
    const { enterpriseId, getStationOfEnterprise } = this.props;
    this.timeout = setTimeout(()=>{this.setState({
      showAlarmTip: false
    })},3000)
    getStationOfEnterprise({ enterpriseId }); // 请求用户所在企业的所有企业
  }

  componentWillUnmount(){
    clearTimeout(this.timeout);
    this.props.changeAlarmManageStore({ // 离开页面前，重置数据。
      stationCode: null,
      deviceTypeCode: null,
      deviceModeCode: null,
      pointCode: '',
      pageNum: 1,
      pageSize: 10,
      totalNum:  0,
      sortField: '',
      sortOrder: '',
      alarmList: []
    })
  }

  hideManageTip=()=>{
    this.setState({
      showAlarmTip: false
    })
  }

  render() {
    const { showAlarmTip } = this.state;
    const { 
      stationCode, deviceTypeCode, deviceModeCode, pointCode, pageNum, pageSize, sortField, sortOrder
    } = this.props;
    const queryParams = { 
      stationCode, deviceTypeCode, deviceModeCode, pointCode, pageNum, pageSize, sortField, sortOrder 
    }
    return (
      <div className={styles.alarmManageContainer}>
        <CommonBreadcrumb  breadData={[{name: '设备'}]} style={{ marginLeft: '38px',backgroundColor:'#fff' }} />
        <div className={styles.alarmManage}>
          <div className={styles.alarmManageMain}>
            {showAlarmTip && <StationManageTip hideManageTip={this.hideManageTip} text="请选择您要查看的电站！" />}
            <div className={styles.alarmManageContent}>
              <AlarmManageSearch queryParams={queryParams} {...this.props} />
              <AlarmManageHandle queryParams={queryParams} {...this.props} />
              <AlarmManageList queryParams={queryParams} {...this.props} />
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
  ...state.system.alarmManage.toJS(),
  stations: state.common.get('stations').toJS(),
  deviceModels: state.common.get('deviceModels').toJS(),
  stationDeviceTypes: state.common.get('stationDeviceTypes').toJS(),
  devicePoints: state.common.get('devicePoints').toJS(),
  allStationBaseInfo: state.system.stationManage.get('allStationBaseInfo').toJS(),
});

const mapDispatchToProps = (dispatch) => ({
  changeAlarmManageStore: payload => dispatch({type:alarmManageAction.CHANGE_ALARM_MANAGE_STORE_SAGA, payload}),
  getAlarmList: payload => dispatch({type: alarmManageAction.GET_ALARM_MANAGE_LIST, payload}),
  deleteAlarmList: payload => dispatch({type: alarmManageAction.DELETE_ALARM_MANAGE_LIST, payload}),
  changeCommonStore: payload => dispatch({type:commonAction.CHANGE_COMMON_STORE_SAGA, payload}),
  getStationDeviceTypes: payload => dispatch({type:commonAction.GET_STATION_DEVICETYPES_SAGA, payload}),
  getStationDeviceModel: payload => dispatch({type:commonAction.GET_STATION_DEVICEMODEL_SAGA, payload}),
  getStationDevicePoints: payload => dispatch({type:commonAction.GET_STATION_DEVICEPOINT_SAGA, payload}),
  getStationOfEnterprise: payload =>dispatch({type: stationManageAction.GET_ALL_STATION_MANAGE_BASE_INFO, payload }),
});

export default connect(mapStateToProps, mapDispatchToProps)(AlarmManage);
