import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './department.scss';
import { departmentAction } from '../../../constants/actionTypes/system/departmentAction';
import PropTypes from 'prop-types';
import TransitionContainer from '../../../components/Common/TransitionContainer';
import DepartmentMain from '../../../components/System/Department/DepartmentMain/DepartmentMain';
import DepartmentSide from '../../../components/System/Department/DepartmentSide/DepartmentSide';

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
    getDepartmentList: PropTypes.func,
    getAllDepartment: PropTypes.func,
  }
  constructor(props) {
    super(props);
    this.state = {
      showSidePage: 'add',
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

  onToggleSide = () => {
    const { showPage } = this.props;
    this.setState({
      showSidePage: showPage
    });
  }

  render() {
    const { showPage } = this.props;
    const { showSidePage } = this.state;
    return (
      <div className={styles.departmentContainer}>
        <DepartmentMain {...this.props} />
        <TransitionContainer
          show={showPage!=='list'}
          onEnter={this.onToggleSide}
          onExited={this.onToggleSide}
          timeout={500}
          effect="side"
        >
          <DepartmentSide {...this.props} showSidePage={showSidePage} />
        </TransitionContainer>
      </div>
        
    );
  }
}
const mapStateToProps = (state) => ({
    loading: state.department.get('loading'),
    buttonLoading:  state.department.get('buttonLoading'),
    continueAddLoading:  state.department.get('continueAddLoading'),
    showPage: state.department.get('showPage'),
    departmentSource: state.department.get('departmentSource'),
    departmentName: state.department.get('departmentName'),
    parentDepartmentName: state.department.get('parentDepartmentName'),
    stationName: state.department.get('stationName'),
    sort: state.department.get('sort'),
    ascend: state.department.get('ascend'),
    totalNum: state.department.get('totalNum'),
    pageNum: state.department.get('pageNum'),
    pageSize: state.department.get('pageSize'),

    allDepartment:state.department.get('allDepartment').toJS(),
    departmentData: state.department.get('departmentData').toJS(),
    departmentDetail: state.department.get('departmentDetail').toJS(),
    selectedDepartment: state.department.get('selectedDepartment').toJS(),
    stations: state.common.get('stations').toJS()
  });

const mapDispatchToProps = (dispatch) => ({
  changeDepartmentStore: payload => dispatch({type:departmentAction.CHANGE_DEPARTMENT_STORE_SAGA, payload}),
  deleteDepartment: payload => dispatch({type: departmentAction.DELETE_DEPARTMENT_SAGA,payload}),
  getDepartmentList: payload => dispatch({type:departmentAction.GET_DEPARTMENT_LIST_SAGA, payload}),
  getDepartmentDetail: payload => dispatch({type:departmentAction.GET_DEPARTMENT_DETAIL_SAGA, payload}),
  getAllUsers: payload => dispatch({type:departmentAction.GET_ALL_USERS_SAGA,payload}), 
  getAllDepartment: payload => dispatch({type:departmentAction.GET_ALL_DEPARTMENT,payload}),
  addDepartmentInfor: payload => dispatch({type:departmentAction.ADD_DEPARTMENT_INFO_SAGA, payload}),
//   saveEnterpriseInfor: payload => dispatch({type:departmentAction.SAVE_ENTERPRISE_INFO_SAGA, payload}),
//   ignoreEnterpirseEdit: payload => dispatch({type: departmentAction.IGNORE_ENTERPRISE_EDIT,payload})
});

//   yield takeLatest(departmentAction.EDIT_DEPARTMENT_INFO_SAGA,editDepartmentInfor);

export default connect(mapStateToProps, mapDispatchToProps)(Department);
