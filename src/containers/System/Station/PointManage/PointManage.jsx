
import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './pointManage.scss';
import { pointManageAction } from '../../../../constants/actionTypes/system/station/pointManageAction';
import { commonAction } from '../../../../constants/actionTypes/commonAction';
import { stationManageAction } from '../../../../constants/actionTypes/system/station/stationManageAction';
import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
import StationManageTip from '../../../../components/System/Station/Common/StationManageTip';
import PointManageSearch from '../../../../components/System/Station/PointManage/PointManageSearch';
import PointManageHandle from '../../../../components/System/Station/PointManage/PointManageHandle';
import PointManageList from '../../../../components/System/Station/PointManage/PointManageList';
import Footer from '../../../../components/Common/Footer'
import PropTypes from 'prop-types';

class PointManage extends Component {
  static propTypes = {
    stationCode: PropTypes.number,
    deviceTypeCode: PropTypes.number,
    deviceModelCode: PropTypes.number,
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    orderField: PropTypes.string,
    orderType: PropTypes.number,
    changePointManageStore: PropTypes.func,
    getStationList: PropTypes.func,
  }
  constructor(props) {
    super(props);
    this.state = {
      showPointTip: true
    }
  }
  componentDidMount(){
    this.props.getStationList({ // 请求一次设备列表
      stationType: 0,
      pageSize: 1000000,
      pageNum: 1,
    })
    this.timeout = setTimeout(()=>{this.setState({
      showPointTip: false
    })},3000)
  }

  componentWillUnmount(){
    clearTimeout(this.timeout);
    this.props.changePointManageStore({ // 重置测点数据。
      stationCode: '', // 选中的电站
      deviceTypeCode: '', // 选中的设备类型
      deviceModelCode: '', // 选中的设备型号
      pageNum: 1,
      pageSize: 10,
      totalNum:  0, // 设备总数
      orderField: '', // 排序字段
      orderType: 0,
      pointList: [],
    })
  }

  hideManageTip=()=>{
    this.setState({
      showPointTip: false
    })
  }

  render() {
    const { showPointTip } = this.state;
    const { 
      stationCode, deviceTypeCode, deviceModelCode, pageNum, pageSize, orderField, orderType
    } = this.props;
    const queryParams = { 
      stationCode, deviceTypeCode, deviceModelCode, pageNum, pageSize, orderField, orderType 
    }
    return (
      <div className={styles.pointManageContainer}>
        <CommonBreadcrumb  breadData={[{name: '设备'}]} style={{ marginLeft: '38px',backgroundColor:'#fff' }} />
        <div className={styles.pointManage}>
          <div className={styles.pointManageMain}>
            {showPointTip && <StationManageTip hideManageTip={this.hideManageTip} text="请选择电站！" />}
            <div className={styles.pointManageContent}>
              <PointManageSearch queryParams={queryParams} {...this.props} />
              <PointManageHandle queryParams={queryParams} {...this.props} />
              <PointManageList queryParams={queryParams} {...this.props} />
            </div>
          </div>
          <Footer />
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
    ...state.system.pointManage.toJS(),
    stations: state.common.get('stations').toJS(),
    deviceModels: state.common.get('deviceModels').toJS(),
    stationDeviceTypes: state.common.get('stationDeviceTypes').toJS(),
    stationList: state.system.stationManage.get('stationList').toJS(),
});

const mapDispatchToProps = (dispatch) => ({
  changePointManageStore: payload => dispatch({type:pointManageAction.CHANGE_POINT_MANAGE_STORE_SAGA, payload}),
  getPointList: payload => dispatch({type:pointManageAction.GET_POINT_MANAGE_LIST, payload}),
  deletePointList: payload => dispatch({type:pointManageAction.DELETE_POINT_MANAGE_LIST, payload}),

  changeCommonStore: payload => dispatch({type:commonAction.CHANGE_COMMON_STORE_SAGA, payload}),
  getStationDeviceTypes: payload => dispatch({type:commonAction.GET_STATION_DEVICETYPES_SAGA, payload}),
  getStationDeviceModel: payload => dispatch({type:commonAction.GET_STATION_DEVICEMODEL_SAGA, payload}),

  getStationList: payload => dispatch({type: stationManageAction.GET_STATION_MANAGE_LIST, payload}),
});

export default connect(mapStateToProps, mapDispatchToProps)(PointManage);

