
import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './pointManage.scss';
import { pointManageAction } from './pointManageAction';
import { commonAction } from '../../../alphaRedux/commonAction';
import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
import StationManageTip from '../../../../components/System/Station/Common/StationManageTip';
import PointManageSearch from '../../../../components/System/Station/PointManage/PointManageSearch';
import PointManageHandle from '../../../../components/System/Station/PointManage/PointManageHandle';
import PointManageList from '../../../../components/System/Station/PointManage/PointManageList';
import Footer from '../../../../components/Common/Footer';
import PropTypes from 'prop-types';
import Cookie from 'js-cookie';
import TransitionContainer from '../../../../components/Common/TransitionContainer';
import PointSide from '../../../../components/System/Station/PointManage/pointSide';

class PointManage extends Component {
  static propTypes = {
    enterpriseId: PropTypes.string,
    stationCode: PropTypes.number,
    deviceTypeCode: PropTypes.number,
    deviceModeCode: PropTypes.number,
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    orderField: PropTypes.string,
    orderType: PropTypes.number,
    changePointManageStore: PropTypes.func,
    changeStationManageStore: PropTypes.func,
    getStationOfEnterprise: PropTypes.func,
    getStationPointStatusList: PropTypes.func,
    resetStore: PropTypes.func,
  }
  constructor(props) {
    super(props);
    this.state = {
      showPointTip: true,
      showSidePage: 'add',
    };
  }
  componentDidMount() {
    const { enterpriseId, getStationOfEnterprise, getStationPointStatusList } = this.props;
    getStationPointStatusList();
    getStationOfEnterprise({ enterpriseId }); // 请求用户所在企业的所有企业
    this.timeout = setTimeout(() => {
      this.setState({
        showPointTip: false,
      });
    }, 3000);
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
      showSidePage: showPage,
    });
  };

  hideManageTip = () => {
    this.setState({
      showPointTip: false,
    });
  }

  render() {
    const { showPointTip, showSidePage } = this.state;
    const {
      stationCode, deviceTypeCode, deviceModeCode, pageNum, pageSize, orderField, orderType, showPage,
    } = this.props;

    const queryParams = {
      stationCode, deviceTypeCode, deviceModeCode, pageNum, pageSize, orderField, orderType,
    };
    return (
      <div className={styles.pointManageContainer}>
        <CommonBreadcrumb breadData={[{ name: '测点' }]} style={{ marginLeft: '38px', backgroundColor: '#fff' }} />
        <div className={styles.pointManage}>
          <div className={styles.pointManageMain}>
            {showPointTip && <StationManageTip hideManageTip={this.hideManageTip} text="请选择电站！" />}
            <div className={styles.pointManageContent}>
              <PointManageSearch queryParams={queryParams} {...this.props} />
              <PointManageHandle queryParams={queryParams} {...this.props} />
              <PointManageList queryParams={queryParams} {...this.props} />
            </div>
          </div>
          <TransitionContainer
            show={showPage !== 'list'}
            onEnter={this.onToggleSide}
            onExited={this.onToggleSide}
            timeout={500}
            effect="side"
          >
            <PointSide {...this.props} queryParams={queryParams} showSidePage={showSidePage} onShowSideChange={this.onShowSideChange} />
          </TransitionContainer>

        </div>
        <Footer />
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  enterpriseId: Cookie.get('enterpriseId'),
  ...state.system.pointManage.toJS(),
  stationList: state.system.stationManage.get('stationList').toJS(),
});

const mapDispatchToProps = (dispatch) => ({
  changePointManageStore: payload => dispatch({ type: pointManageAction.CHANGE_POINT_MANAGE_STORE_SAGA, payload }),
  getPointList: payload => dispatch({ type: pointManageAction.GET_POINT_MANAGE_LIST, payload }),
  deletePointList: payload => dispatch({ type: pointManageAction.DELETE_POINT_MANAGE_LIST, payload }),
  getStationPointStatusList: payload => dispatch({ type: pointManageAction.GET_POINT_MANAGE_ALL_STATION, payload }),
  resetStore: () => dispatch({ type: pointManageAction.resetStore }),

  changeCommonStore: payload => dispatch({ type: commonAction.changeCommonStore, payload }),
  getStationDeviceTypes: params => dispatch({
    type: commonAction.getStationDeviceTypes,
    payload: {
      params,
      deviceTypeAction: pointManageAction.GET_POINT_MANAGE_FETCH_SUCCESS,
      resultName: 'stationDeviceTypes',
    },
  }),
  getDeviceModel: params => dispatch({
    type: commonAction.getDeviceModel,
    payload: {
      params,
      actionName: pointManageAction.GET_POINT_MANAGE_FETCH_SUCCESS,
      resultName: 'deviceModels',
    },
  }),
  getStationOfEnterprise: params => dispatch({
    type: commonAction.getStationOfEnterprise,
    payload: {
      params,
      actionName: pointManageAction.GET_POINT_MANAGE_FETCH_SUCCESS,
      resultName: 'allStationBaseInfo',
    },
  }),
  exportPoints: payload => dispatch({
    type: commonAction.downLoadFile,
    payload: {
      ...payload,
      actionName: pointManageAction.GET_POINT_MANAGE_FETCH_SUCCESS,
    },
  }),
});

export default connect(mapStateToProps, mapDispatchToProps)(PointManage);

