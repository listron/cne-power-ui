import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './alarmManage.scss';
import { alarmManageAction } from './alarmManageAction';
import { commonAction } from '../../../alphaRedux/commonAction';
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
    resetStore: PropTypes.func,
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
    this.props.resetStore(); // 重置数据
  }

  hideManageTip=()=>{
    this.setState({
      showAlarmTip: false
    })
  }

  render() {
    const { showAlarmTip } = this.state;
    const {
      stationCode, deviceTypeCode, deviceModeCode, pointCode, pageNum, pageSize, sortField, sortOrder,warningType
    } = this.props;
    const queryParams = {
      stationCode, deviceTypeCode, deviceModeCode, pointCode, pageNum, pageSize, sortField, sortOrder,warningType
    }
    return (
      <div className={styles.alarmManageContainer}>
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
});

const mapDispatchToProps = (dispatch) => ({
  changeAlarmManageStore: payload => dispatch({type:alarmManageAction.CHANGE_ALARM_MANAGE_STORE_SAGA, payload}),
  resetStore: () => dispatch({ type: alarmManageAction.resetStore }),
  getAlarmList: payload => dispatch({type: alarmManageAction.GET_ALARM_MANAGE_LIST, payload}),
  downloadAlarmExcel: payload => dispatch({type: alarmManageAction.downloadAlarmExcel, payload}),
  deleteAlarmList: payload => dispatch({type: alarmManageAction.DELETE_ALARM_MANAGE_LIST, payload}),
  changeCommonStore: payload => dispatch({type:commonAction.changeCommonStore, payload}),
  getStationDeviceTypes: params => dispatch({
    type: commonAction.getStationDeviceTypes,
    payload: {
      params,
      deviceTypeAction: alarmManageAction.GET_ALARM_MANAGE_FETCH_SUCCESS,
      resultName: 'stationDeviceTypes'
    }
  }),
  getDeviceModel: params => dispatch({
    type: commonAction.getDeviceModel,
    payload: {
      params,
      actionName: alarmManageAction.GET_ALARM_MANAGE_FETCH_SUCCESS,
      resultName: 'deviceModels'
    }
  }),
  getPoints: params => dispatch({
    type: commonAction.getPoints,
    payload: {
      params,
      actionName: alarmManageAction.GET_ALARM_MANAGE_FETCH_SUCCESS,
      resultName: 'devicePoints'
    }
  }),
  getStationOfEnterprise: params =>dispatch({
    type: commonAction.getStationOfEnterprise,
    payload: {
      params,
      actionName: alarmManageAction.GET_ALARM_MANAGE_FETCH_SUCCESS,
      resultName: 'allStationBaseInfo'
    }
  }),
});



export default connect(mapStateToProps, mapDispatchToProps)(AlarmManage);
