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
    showAssignStationModal: PropTypes.bool,
    showAssignUserModal: PropTypes.bool,
    getDepartmentList: PropTypes.func,
    getAllDepartment: PropTypes.func,
  }
  constructor(props) {
    super(props);
    this.state = {
      showSidePage: 'add'
    }
  }
  componentDidMount(){
    const params = {
      enterpriseId: this.props.enterpriseId,
      departmentSource: this.props.departmentSource,
      departmentName: this.props.departmentName,
      parentDepartmentName: this.props.parentDepartmentName,
      stationName: this.props.stationName,
      sort: this.props.sort,
      ascend: this.props.ascend,
      pageNum: this.props.pageNum,
      pageSize: this.props.pageSize,
    }
    this.props.getDepartmentList(params)//请求部门列表
    this.props.getAllDepartment({//请求所有部门
      enterpriseId: this.props.enterpriseId,
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
    console.log(showPage!=='list')
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
    loading: state.system.department.get('loading'),
    buttonLoading: state.system.department.get('buttonLoading'),
    continueAddLoading: state.system.department.get('continueAddLoading'),
    showPage: state.system.department.get('showPage'),
    departmentSource: state.system.department.get('departmentSource'),
    departmentName: state.system.department.get('departmentName'),
    parentDepartmentName: state.system.department.get('parentDepartmentName'),
    stationName: state.system.department.get('stationName'),
    sort: state.system.department.get('sort'),
    ascend: state.system.department.get('ascend'),
    totalNum: state.system.department.get('totalNum'),
    pageNum: state.system.department.get('pageNum'),
    pageSize: state.system.department.get('pageSize'),
    showAssignStationModal: state.system.department.get('showAssignStationModal'),
    showAssignUserModal: state.system.department.get('showAssignUserModal'),

    allDepartment:state.system.department.get('allDepartment').toJS(),
    departmentData: state.system.department.get('departmentData').toJS(),
    departmentDetail: state.system.department.get('departmentDetail').toJS(),
    selectedDepartment: state.system.department.get('selectedDepartment').toJS(),
    stations: state.common.get('stations').toJS()
  });

const mapDispatchToProps = (dispatch) => ({
  changeDepartmentStore: payload => dispatch({type:departmentAction.CHANGE_DEPARTMENT_STORE_SAGA, payload}),
  deleteDepartment: payload => dispatch({type: departmentAction.DELETE_DEPARTMENT_SAGA,payload}),
  getDepartmentList: payload => dispatch({type:departmentAction.GET_DEPARTMENT_LIST_SAGA, payload}),
  getDepartmentDetail: payload => dispatch({type:departmentAction.GET_DEPARTMENT_DETAIL_SAGA, payload}),
  getOtherPageDetail: (payload, {previous}) => dispatch({type:departmentAction.GET_OTHER_PAGE_DEPARTMENT_DETAIL_SAGA, payload, previous}),
  getAllUsers: payload => dispatch({type:departmentAction.GET_ALL_USERS_SAGA,payload}),
  getAllDepartment: payload => dispatch({type:departmentAction.GET_ALL_DEPARTMENT_SAGA,payload}),
  addDepartmentInfor: payload => dispatch({type:departmentAction.ADD_DEPARTMENT_INFO_SAGA, payload}),
  editDepartmentInfor: payload => dispatch({type: departmentAction.EDIT_DEPARTMENT_INFO_SAGA, payload})
});

export default connect(mapStateToProps, mapDispatchToProps)(Department);
