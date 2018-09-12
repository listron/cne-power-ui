import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './alarmManage.scss';
import { alarmManageAction } from '../../../../constants/actionTypes/system/station/alarmManageAction';
import { commonAction } from '../../../../constants/actionTypes/commonAction';
import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
import AlarmManageTip from '../../../../components/System/Station/AlarmManage/AlarmManageTip';
import AlarmManageSearch from '../../../../components/System/Station/AlarmManage/AlarmManageSearch';
import AlarmManageHandle from '../../../../components/System/Station/AlarmManage/AlarmManageHandle';
import AlarmManageList from '../../../../components/System/Station/AlarmManage/AlarmManageList';
import Footer from '../../../../components/Common/Footer'
import PropTypes from 'prop-types';

class AlarmManage extends Component {
  static propTypes = {
    stationCode: PropTypes.string,
    deviceTypeCode: PropTypes.string,
    deviceModelCode: PropTypes.string,
    pointCode: PropTypes.string,
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    sortField: PropTypes.string,
    sortOrder: PropTypes.string,
    changeDeviceManageStore: PropTypes.func,
  }
  constructor(props) {
    super(props);
    this.state = {
      showAlarmTip: true
    }
  }
  componentDidMount(){
    setTimeout(()=>{this.setState({
      showAlarmTip: false
    })},3000)
  }

  componentWillUnmount(){
    this.props.changeDeviceManageStore({ // 离开页面前，重置数据。
      stationCode: '',
      deviceTypeCode: '',
      deviceModelCode: '',
      pointCode: '',
      pageNum: 1,
      pageSize: 10,
      totalNum:  0,
      sortField: '',
      sortOrder: 'des',
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
      stationCode, deviceTypeCode, deviceModelCode, pointCode, pageNum, pageSize, sortField, sortOrder
    } = this.props;
    const queryParams = { 
      stationCode, deviceTypeCode, deviceModelCode, pointCode, pageNum, pageSize, sortField, sortOrder 
    }
    return (
      <div className={styles.alarmManageContainer}>
        <CommonBreadcrumb  breadData={[{name: '设备'}]} style={{ marginLeft: '38px',backgroundColor:'#fff' }} />
        <div className={styles.alarmManage}>
          <div className={styles.alarmManageMain}>
            {true && <AlarmManageTip hideManageTip={this.hideManageTip} />}
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
    ...state.system.alarmManage.toJS(),
    stations: state.common.get('stations').toJS(),
    deviceModels: state.common.get('deviceModels').toJS(),
    stationDeviceTypes: state.common.get('stationDeviceTypes').toJS(),
    devicePoints: state.common.get('devicePoints').toJS(),
});

const mapDispatchToProps = (dispatch) => ({
  changeAlarmManageStore: payload => dispatch({type:alarmManageAction.CHANGE_ALARM_MANAGE_STORE_SAGA, payload}),
  getAlarmList: payload => dispatch({type: alarmManageAction.GET_ALARM_MANAGE_LIST, payload}),
  deleteAlarmList: payload => dispatch({type: alarmManageAction.DELETE_ALARM_MANAGE_LIST, payload}),
  getStationDeviceTypes: payload => dispatch({type:commonAction.GET_STATION_DEVICETYPES_SAGA, payload}),
  getStationDeviceModel: payload => dispatch({type:commonAction.GET_STATION_DEVICEMODEL_SAGA, payload}),
  getStationDevicePoints: payload => dispatch({type:commonAction.GET_STATION_DEVICEPOINT_SAGA, payload}),
});

export default connect(mapStateToProps, mapDispatchToProps)(AlarmManage);
