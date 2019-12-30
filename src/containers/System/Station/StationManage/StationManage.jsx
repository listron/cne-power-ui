import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './stationManage.scss';
import { stationManageAction } from './stationManageAction';
import { commonAction } from '../../../alphaRedux/commonAction';
import TransitionContainer from '../../../../components/Common/TransitionContainer';
import StationManageMain from '../../../../components/System/Station/StationManage/StationManageMain/StationManageMain';
import StationManageSide from '../../../../components/System/Station/StationManage/StationManageSide/StationManageSide';
import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
import PropTypes from 'prop-types';
import Cookie from 'js-cookie';

class StationManage extends Component {
  static propTypes = {
    showPage: PropTypes.string,
    stationType: PropTypes.string,
    regionName: PropTypes.string,
    stationName: PropTypes.string,
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    orderField: PropTypes.string,
    orderCommand: PropTypes.string,

    enterpriseId: PropTypes.string,
    getStationList: PropTypes.func, // 获取电站列表信息
    getAllDepartmentData: PropTypes.func, // 企业下所有部门
    resetStore: PropTypes.func, // 重置数据
    getStationBelongTypes: PropTypes.func,
  }
  constructor(props) {
    super(props);
    this.state = {
      showSidePage: 'list'
    }
  }

  componentDidMount() {
    const { enterpriseId, stationType, regionName, stationName, pageNum, pageSize, orderField, orderCommand } = this.props;

    this.props.getStationList({ // 初始请求电站列表
      stationType,
      regionName,
      stationName,
      pageNum,
      pageSize,
      orderField,
      orderCommand,
    });
    this.props.getStationBelongTypes()
    this.props.getAllDepartmentData({ enterpriseId }) // 2.请求所有部门
  }

  componentWillUnmount() {
    this.props.resetStore();
  }

  onShowSideChange = ({ showSidePage }) => {
    this.setState({ showSidePage });
  }

  onToggleSide = () => {
    const { showPage } = this.props;
    this.setState({
      showSidePage: showPage
    });
  }

  render() {
    const { showPage, stationType, regionName, stationName, pageNum, pageSize, orderField, orderCommand } = this.props;
    const queryListParams = {
      stationType, regionName, stationName, pageNum, pageSize, orderField, orderCommand,
    }
    const { showSidePage } = this.state;
    return (
      <div className={styles.stationManageContainer}>
        {/* <CommonBreadcrumb breadData={[{ name: '电站管理' }]} style={{ marginLeft: '38px', backgroundColor: '#fff' }} /> */}
        <div className={styles.stationManage}>
          <StationManageMain
            {...this.props}
            queryListParams={queryListParams}
          />
          <TransitionContainer
            show={showPage !== 'list'}
            onEnter={this.onToggleSide}
            onExited={this.onToggleSide}
            timeout={500}
            effect="side"
          >
            <StationManageSide
              {...this.props}
              showSidePage={showSidePage}
              queryListParams={queryListParams}
              onShowSideChange={this.onShowSideChange}
            />
          </TransitionContainer>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  ...state.system.stationManage.toJS(),
  stations: state.common.get('stations').toJS(),
  enterpriseId: Cookie.get('enterpriseId'),
});

const mapDispatchToProps = (dispatch) => ({
  changeStationManageStore: payload => dispatch({ type: stationManageAction.changeStationManageStore, payload }),
  getStationList: payload => dispatch({ type: stationManageAction.GET_STATION_MANAGE_LIST, payload }),
  getStationDetail: payload => dispatch({ type: stationManageAction.GET_STATION_MANAGE_DETAIL, payload }),
  getOtherPageStationDetail: payload => dispatch({ type: stationManageAction.GET_OTHER_PAGE_STATION_MANAGE_DETAIL, payload }),
  saveStationDetail: payload => dispatch({ type: stationManageAction.EDIT_STATION_MANAGE_DETAIL, payload }),
  deleteStation: payload => dispatch({ type: stationManageAction.DELET_STATION_MANAGE, payload }),
  setStationDepartment: payload => dispatch({ type: stationManageAction.SET_STATION_MANAGE_DEPARTMENT, payload }),
  setDiagconfigYx: payload => dispatch({ type: stationManageAction.setDiagconfigYx, payload }),
  getDiagconfigYx: payload => dispatch({ type: stationManageAction.getDiagconfigYx, payload }),
  setDiagconfigYc: payload => dispatch({ type: stationManageAction.setDiagconfigYc, payload }),
  getDiagconfigYc: payload => dispatch({ type: stationManageAction.getDiagconfigYc, payload }),
  resetStore: () => dispatch({ type: stationManageAction.resetStore }),
  getAllDepartmentData: params => dispatch({
    type: commonAction.getAllDepartment,
    payload: {
      params,
      actionName: stationManageAction.GET_STATION_MANAGE_FETCH_SUCCESS,
      resultName: 'allDepartmentData',
    }
  }),
  getStationBelongTypes: params => dispatch({
    type: commonAction.getStationBelongTypes,
    payload: {
      params,
      actionName: stationManageAction.GET_STATION_MANAGE_FETCH_SUCCESS,
      resultName: 'stationBelongInfo'
    }
  }),
  getStationTargetInfo: ({ params, resultName }) => dispatch({ // 省市县
    type: commonAction.getStationTargetInfo,
    payload: {
      params,
      actionName: stationManageAction.GET_STATION_MANAGE_FETCH_SUCCESS,
      resultName,
    }
  }),
  getStations: payload => dispatch({ type: commonAction.getStations, payload }),
});

export default connect(mapStateToProps, mapDispatchToProps)(StationManage);
