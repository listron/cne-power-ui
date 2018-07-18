import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './departmentContainer.scss';
import { departmentAction } from '../../../constants/actionTypes/system/departmentAction';
import PropTypes from 'prop-types';
import TransitionContainer from '../../../components/Common/TransitionContainer';
import DepartmentMain from '../../../components/System/Department/DepartmentMain/DepartmentMain';
import DepartmentSide from '../../../components/System/Department/DepartmentSide/DepartmentSide';

class DepartmentContainer extends Component {
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
    getDepartmentList: PropTypes.func
  }
  constructor(props) {
    super(props);
    this.state = {
      showSidePage: 'add',
    }
  }
  componentDidMount(){
    const params = {
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
  });

const mapDispatchToProps = (dispatch) => ({
  changeDepartmentStore: payload => dispatch({type:departmentAction.CHANGE_DEPARTMENT_STORE_SAGA, payload}),
  getDepartmentList: payload => dispatch({type:departmentAction.GET_DEPARTMENT_LIST_SAGA, payload}),
//   getEnterpriseDetail: payload => dispatch({type:departmentAction.GET_ENTERPRISE_DETAIL_SAGA, payload}),
//   changeSelectedEnterprise: payload => dispatch({type:departmentAction.CHANGE_SELECTED_ENTERPRISE_SAGA, payload}),
//   saveEnterpriseInfor: payload => dispatch({type:departmentAction.SAVE_ENTERPRISE_INFO_SAGA, payload}),
//   ignoreEnterpirseEdit: payload => dispatch({type: departmentAction.IGNORE_ENTERPRISE_EDIT,payload})
});

//   yield takeLatest(departmentAction.GET_DEPARTMENT_LIST_SAGA, getDepartmentList);
//   yield takeLatest(departmentAction.GET_DEPARTMENT_DETAIL_SAGA, getDepartmentDetail);
//   yield takeLatest(departmentAction.ADD_DEPARTMENT_INFO_SAGA, addDepartmentInfor);
//   yield takeLatest(departmentAction.EDIT_DEPARTMENT_INFO_SAGA,editDepartmentInfor);

export default connect(mapStateToProps, mapDispatchToProps)(DepartmentContainer);
