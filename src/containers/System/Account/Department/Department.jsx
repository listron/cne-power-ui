import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './department.scss';
import { departmentAction } from '../../../../constants/actionTypes/system/account/departmentAction';
// import { commonAction } from '../../../../constants/actionTypes/commonAction';
import PropTypes from 'prop-types';
import TransitionContainer from '../../../../components/Common/TransitionContainer';
import DepartmentMain from '../../../../components/System/Account/Department/DepartmentMain/DepartmentMain';
import DepartmentSide from '../../../../components/System/Account/Department/DepartmentSide/DepartmentSide';
import Cookie from 'js-cookie';

class Department extends Component {
  static propTypes = {
    showPage: PropTypes.string,
    enterpriseId: PropTypes.string,
    departmentSource: PropTypes.number,
    departmentName: PropTypes.string,
    parentDepartmentName: PropTypes.string,
    stationName: PropTypes.string,
    sort: PropTypes.string,
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    allDepartment: PropTypes.object,
    departmentUser: PropTypes.object,
    DepartmentStation: PropTypes.object,
    getDepartmentList: PropTypes.func,
    getAllDepartment: PropTypes.func,
    getDepartmentUser: PropTypes.func,
    getDepartmentStation: PropTypes.func,
    setDepartmentUser: PropTypes.func,
    setDepartmentStation: PropTypes.func,
    changeDepartmentStore: PropTypes.func,
  }
  constructor(props) {
    super(props);
    this.state = {
      showSidePage: 'list'
    }
  }
  componentDidMount(){
    const { enterpriseId } = this.props; //'1010694160817111040', //this.props.enterpriseId;
    const params = {
      enterpriseId, 
      departmentSource: this.props.departmentSource,
      departmentName: this.props.departmentName,
      parentDepartmentName: this.props.parentDepartmentName,
      stationName: this.props.stationName,
      sort: this.props.sort,
      pageNum: this.props.pageNum,
      pageSize: this.props.pageSize,
    }
    this.props.getDepartmentList(params)//请求部门列表
    this.props.getAllDepartment({//请求所有部门
      enterpriseId,
    })
  }

  componentWillUnmount(){
    this.props.changeDepartmentStore({
      showPage: 'list',
      departmentSource: 0, //部门类型全部2，预设0，自定义1
      departmentName:'', //部门名称
      parentDepartmentName: '',//所属部门
      stationName: '', //负责电站
      sort: '', //排序 => 'field,0/1'field代表排序字段，0升序,1降序
      totalNum: 0,//部门总数
      pageNum: 1,//当前页号
      pageSize: 10,//每页容纳条数
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
    const { showPage } = this.props;
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
      </div>

    );
  }
}
const mapStateToProps = (state) => ({
    ...state.system.department.delete('allDepartment').delete('departmentUser').delete('DepartmentStation').toJS(),
    allDepartment:state.system.department.get('allDepartment'),
    departmentUser: state.system.department.get('departmentUser'),
    DepartmentStation: state.system.department.get('DepartmentStation'),
    // stations: state.common.get('stations'),
    enterpriseId: Cookie.get('enterpriseId'),
    userId: Cookie.get('userId'),
    enterpriseName: Cookie.get('enterpriseName'),
});

const mapDispatchToProps = (dispatch) => ({
  changeDepartmentStore: payload => dispatch({type:departmentAction.CHANGE_DEPARTMENT_STORE_SAGA, payload}),
  deleteDepartment: payload => dispatch({type: departmentAction.DELETE_DEPARTMENT_SAGA,payload}),
  getDepartmentList: payload => dispatch({type:departmentAction.GET_DEPARTMENT_LIST_SAGA, payload}),
  getDepartmentDetail: payload => dispatch({type:departmentAction.GET_DEPARTMENT_DETAIL_SAGA, payload}),
  getOtherPageDetail: (payload, {previous}) => dispatch({type:departmentAction.GET_OTHER_PAGE_DEPARTMENT_DETAIL_SAGA, payload, previous}),
  getDepartmentUser: payload => dispatch({type:departmentAction.GET_DEPARTMENT_USER_SAGA,payload}),
  getAllDepartment: payload => dispatch({type:departmentAction.GET_ALL_DEPARTMENT_SAGA,payload}),
  getDepartmentStation: payload => dispatch({type:departmentAction.GET_DEPARTMENT_STATION_SAGA,payload}),
  setDepartmentUser: payload => dispatch({type:departmentAction.SET_DEPARTMENT_USER_SAGA,payload}),
  setDepartmentStation: payload => dispatch({type:departmentAction.SET_DEPARTMENT_STATION_SAGA,payload}),
  addDepartmentInfo: payload => dispatch({type:departmentAction.ADD_DEPARTMENT_INFO_SAGA, payload}),
  editDepartmentInfo: payload => dispatch({type: departmentAction.EDIT_DEPARTMENT_INFO_SAGA, payload})
});

export default connect(mapStateToProps, mapDispatchToProps)(Department);
