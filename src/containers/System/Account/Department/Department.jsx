import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './department.scss';
import { departmentAction } from '../../../../constants/actionTypes/system/account/departmentAction';
import PropTypes from 'prop-types';
import TransitionContainer from '../../../../components/Common/TransitionContainer';
import DepartmentMain from '../../../../components/System/Account/Department/DepartmentMain/DepartmentMain';
import DepartmentSide from '../../../../components/System/Account/Department/DepartmentSide/DepartmentSide';

class Department extends Component {
  static propTypes = {
    showPage: PropTypes.string,
    enterpriseId: PropTypes.string,
    departmentSource: PropTypes.number,
    departmentName: PropTypes.string,
    parentDepartmentName: PropTypes.string,
    stationName: PropTypes.string,
    sort: PropTypes.string,
    ascend: PropTypes.bool,
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    allDepartment: PropTypes.array,
    allUser: PropTypes.object,
    showAssignStationModal: PropTypes.bool,
    showAssignUserModal: PropTypes.bool,
    getDepartmentList: PropTypes.func,
    getAllDepartment: PropTypes.func,
    getAllUser: PropTypes.func,
    setDepartmentUser: PropTypes.func,
    setDepartmentStation: PropTypes.func,
  }
  constructor(props) {
    super(props);
    this.state = {
      showSidePage: 'add'
    }
  }
  componentDidMount(){
    const params = {
      enterpriseId: this.props.enterpriseId, //this.props.enterpriseId,//'1010694160817111040',
      departmentSource: this.props.departmentSource,
      departmentName: this.props.departmentName,
      parentDepartmentName: this.props.parentDepartmentName,
      stationName: this.props.stationName,
      // sort: this.props.sort,
      // ascend: this.props.ascend,
      pageNum: this.props.pageNum,
      pageSize: this.props.pageSize,
    }
    this.props.getDepartmentList(params)//请求部门列表
    this.props.getAllDepartment({//请求所有部门
      enterpriseId: this.props.enterpriseId, //this.props.enterpriseId,//'1010694160817111040',
    })
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
    const { showPage, showAssignStationModal, showAssignUserModal } = this.props;
    const { showSidePage } = this.state;
    return (
      <div className={styles.departmentContainer}>
        <DepartmentMain {...this.props} onWarningTipToggle={this.onWarningTipToggle} />
        <TransitionContainer
          show={showPage!=='list'}
          onEnter={this.onToggleSide}
          onExited={this.onToggleSide}
          timeout={500}
          effect="side"
        >
          <DepartmentSide {...this.props} showSidePage={showSidePage} onShowSideChange={this.onShowSideChange} />
        </TransitionContainer>
        {showAssignStationModal && null}
        {showAssignUserModal && null}
      </div>

    );
  }
}
const mapStateToProps = (state) => ({
    ...state.system.department.toJS(),
    stations: state.common.get('stations').toJS(),
    enterpriseId: state.common.get('enterpriseId'),
});

const mapDispatchToProps = (dispatch) => ({
  changeDepartmentStore: payload => dispatch({type:departmentAction.CHANGE_DEPARTMENT_STORE_SAGA, payload}),
  deleteDepartment: payload => dispatch({type: departmentAction.DELETE_DEPARTMENT_SAGA,payload}),
  getDepartmentList: payload => dispatch({type:departmentAction.GET_DEPARTMENT_LIST_SAGA, payload}),
  getDepartmentDetail: payload => dispatch({type:departmentAction.GET_DEPARTMENT_DETAIL_SAGA, payload}),
  getOtherPageDetail: (payload, {previous}) => dispatch({type:departmentAction.GET_OTHER_PAGE_DEPARTMENT_DETAIL_SAGA, payload, previous}),
  getAllUser: payload => dispatch({type:departmentAction.GET_ALL_USER_SAGA,payload}),
  getAllDepartment: payload => dispatch({type:departmentAction.GET_ALL_DEPARTMENT_SAGA,payload}),
  setDepartmentUser: payload => dispatch({type:departmentAction.SET_DEPARTMENT_USER_SAGA,payload}),
  setDepartmentStation: payload => dispatch({type:departmentAction.SET_DEPARTMENT_STATION_SAGA,payload}),
  addDepartmentInfo: payload => dispatch({type:departmentAction.ADD_DEPARTMENT_INFO_SAGA, payload}),
  editDepartmentInfo: payload => dispatch({type: departmentAction.EDIT_DEPARTMENT_INFO_SAGA, payload})
});

export default connect(mapStateToProps, mapDispatchToProps)(Department);
