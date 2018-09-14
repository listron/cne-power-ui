import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './stationManage.scss';
import { stationManageAction } from '../../../../constants/actionTypes/system/station/stationManageAction';
import { commonAction } from '../../../../constants/actionTypes/commonAction';
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
    changeStationManageStore: PropTypes.func,
  }
  constructor(props) {
    super(props);
    this.state = {
      showSidePage: 'list'
    }
  }

  componentDidMount(){
    const { enterpriseId, stationType, regionName, stationName, pageNum, pageSize, orderField, orderCommand } = this.props;
    this.props.getStationList({ 
      stationType, regionName, stationName, pageNum, pageSize, orderField, orderCommand,
    }); // 1.请求stationList
    this.props.getAllDepartmentData({ enterpriseId }) // 2.请求所有部门
  }

  componentWillUnmount(){
    this.props.changeStationManageStore({
      showPage: 'list',
      selectedStationIndex: null,
    });
  }

  onShowSideChange = ({showSidePage}) => {
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
        <CommonBreadcrumb  breadData={[{name: '电站管理'}]} style={{ marginLeft: '38px',backgroundColor:'#fff' }} />
        <div className={styles.stationManage}>
          <StationManageMain {...this.props} queryListParams={queryListParams} />
          <TransitionContainer
            show={showPage!=='list'}
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
    enterpriseId: Cookie.get('enterpriseId'),
    allDepartmentData: state.common.get('allDepartmentData').toJS(),
});

const mapDispatchToProps = (dispatch) => ({
  changeStationManageStore: payload => dispatch({type:stationManageAction.CHANGE_STATION_MANAGE_STORE_SAGA, payload}),
  getStationList: payload => dispatch({type: stationManageAction.GET_STATION_MANAGE_LIST, payload}),
  getStationDetail: payload => dispatch({type: stationManageAction.GET_STATION_MANAGE_DETAIL, payload}),
  getOtherPageStationDetail: payload => dispatch({type: stationManageAction.GET_OTHER_PAGE_STATION_MANAGE_DETAIL, payload}),
  saveStationDetail: payload => dispatch({type: stationManageAction.EDIT_STATION_MANAGE_DETAIL, payload}),
  deleteStation: payload => dispatch({type: stationManageAction.DELET_STATION_MANAGE, payload}),
  setStationDepartment: payload => dispatch({type: stationManageAction.SET_STATION_MANAGE_DEPARTMENT, payload}),
  getAllDepartmentData: payload => dispatch({type: commonAction.GET_ALL_DEPARTMENT_SAGA, payload}),
});

export default connect(mapStateToProps, mapDispatchToProps)(StationManage);
