import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './departmentContainer.scss';
// import { enterpriseAction } from '../../../constants/actionTypes/system/enterpriseAction';
import PropTypes from 'prop-types';
import TransitionContainer from '../../../components/Common/TransitionContainer';
import DepartmentMain from '../../../components/System/Department/DepartmentMain/DepartmentMain';
import DepartmentSide from '../../../components/System/Department/DepartmentSide/DepartmentSide';
/*
注： 此3引用在企业列表展示功能中引入，后产品调整为直接展示企业详情，去下企业列表页面展示。请不要删除，可能会重新展示企业列表功能；

*/
// import EnterpriseDetail from '../../../components/System/Enterprise/EnterpriseDetail';
// import EnterpriseEdit from '../../../components/System/Enterprise/EnterpriseEdit';

class DepartmentContainer extends Component {
  static propTypes = {
    showPage: PropTypes.string,
  //   filterStatus: PropTypes.number, 
  //   enterpriseName: PropTypes.string, 
  //   enterprisePhone: PropTypes.string,
  //   sort: PropTypes.string, 
  //   ascend: PropTypes.bool,
  //   currentPage: PropTypes.number, 
  //   pageSize: PropTypes.number, 
  //   getEnterpriseDetail: PropTypes.func,
  }
  constructor(props) {
    super(props);
    this.state = {
      showSidePage: false,
    }
  }
  componentDidMount(){
  //   // const params = {
  //   //   filterStatus: this.props.filterStatus, 
  //   //   enterpriseName: this.props.enterpriseName, 
  //   //   enterprisePhone: this.props.enterprisePhone,
  //   //   sort: this.props.sort, 
  //   //   ascend: this.props.ascend,
  //   //   currentPage: this.props.currentPage, 
  //   //   pageSize: this.props.pageSize, 
  //   // }
  //   // this.props.getEnterpriseList(params)//请求企业列表
  //   this.props.getEnterpriseDetail()
  }

  // onShowSide = () => {
  //   const showPage = this.props.showPage;
  //   this.setState({
  //     showDetail: showPage === 'detail'
  //   });
  // }

  render() {
    const { showPage } = this.props;
    const { showSidePage } = this.state;
    return (
      <div className={styles.departmentContainer}>
        <DepartmentMain {...this.props} />
        <TransitionContainer
          show={showPage!=='list'}
          onEnter={this.onShowSide}
          timeout={500}
          effect="side"
        >
          <DepartmentSide {...this.props} showSidePage={showSidePage} />
        </TransitionContainer>
      </div>
        
    );
  }
}
const mapStateToProps = (state) => {
  // console.log(state.department.entries())
  state.department.map(e=>console.log(e))
  return {
    loading: state.department.get('loading'),
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
    departmentData: state.department.get('departmentData').toJS(),
    departmentDetail: state.department.get('departmentDetail').toJS(),
    selectedDepartment: state.department.get('selectedDepartment').toJS(),
  }
};

const mapDispatchToProps = (dispatch) => ({
//   changeEnterpriseStore: payload => dispatch({type:enterpriseAction.GET_ENTERPRISE_ATTR_CHANGE_SAGA, payload}),
//   getEnterpriseList: payload => dispatch({type:enterpriseAction.GET_ENTERPRISE_LIST_SAGA, payload}),
//   getEnterpriseDetail: payload => dispatch({type:enterpriseAction.GET_ENTERPRISE_DETAIL_SAGA, payload}),
//   changeSelectedEnterprise: payload => dispatch({type:enterpriseAction.CHANGE_SELECTED_ENTERPRISE_SAGA, payload}),
//   saveEnterpriseInfor: payload => dispatch({type:enterpriseAction.SAVE_ENTERPRISE_INFO_SAGA, payload}),
//   ignoreEnterpirseEdit: payload => dispatch({type: enterpriseAction.IGNORE_ENTERPRISE_EDIT,payload})
});

// yield takeLatest(departmentAction.CHANGE_DEPARTMENT_STORE_SAGA, changeDepartmentStore);
//   yield takeLatest(departmentAction.GET_DEPARTMENT_LIST_SAGA, getDepartmentList);
//   yield takeLatest(departmentAction.GET_DEPARTMENT_DETAIL_SAGA, getDepartmentDetail);
//   yield takeLatest(departmentAction.ADD_DEPARTMENT_INFO_SAGA, addDepartmentInfor);
//   yield takeLatest(departmentAction.EDIT_DEPARTMENT_INFO_SAGA,editDepartmentInfor);
// DEPARTMENT_FETCH: null,//loading
//     CHANGE_DEPARTMENT_STORE_SAGA: null,//改变reducer参数
//     CHANGE_DEPARTMENT_STORE_SUCCESS: null,//替换reducer参数
//     GET_DEPARTMENT_LIST_SAGA: null,//获取部门列表
//     ADD_DEPARTMENT_INFO_SAGA: null,//部门新增
//     EDIT_DEPARTMENT_INFO_SAGA: null,//部门信息编辑
//     GET_DEPARTMENT_COMMON_FETCH_SUCCESS: null,//部门普通api请求成功
//     GET_DEPARTMENT_DETAIL_SAGA: null,//获取部门详情

export default connect(mapStateToProps, mapDispatchToProps)(DepartmentContainer);
