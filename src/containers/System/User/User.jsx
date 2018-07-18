import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './user.scss';
import { userAction } from '../../../constants/actionTypes/system/userAction';
import PropTypes from 'prop-types';
import UserDetail from '../../../components/System/User/UserDetail';
import UserEdit from '../../../components/System/User/UserEdit';
import UserList from '../../../components/System/User/UserList';

class User extends Component {
  static propTypes = {
    showPage: PropTypes.string, 
    userId: PropTypes.string,
    roleId: PropTypes.string,
    userStatus: PropTypes.number,
    userName: PropTypes.string, 
    stationName: PropTypes.string,
    phoneNum: PropTypes.string,
    sort: PropTypes.string, 
    ascend: PropTypes.bool,
    currentPage: PropTypes.number, 
    pageSize: PropTypes.number, 
    userDetail:PropTypes.object, 
    selectedUser: PropTypes.object, 
    getUserList: PropTypes.func,
    changeSelectedUser: PropTypes.func,
    changeUserAttr: PropTypes.func,
    userData: PropTypes.object,
  }
  constructor(props) {
    super(props);
  }
  componentDidMount(){
    const params = {
      userId: this.props.userId,
      roleId: this.props.roleId,
      userStatus: this.props.userStatus,
      userName: this.props.userName, 
      phoneNum: this.props.phoneNum,
      stationName: this.props.stationName,
      sort: this.props.sort, 
      ascend: this.props.ascend,
      currentPage: this.props.currentPage, 
      pageSize: this.props.pageSize, 
    }
    this.props.getUserList(params)
  }

  componentWillReceiveProps(nextProps){

  }

  render() {
    const { showPage } = this.props;
    return (
      <div className={styles.userContainer}>
        { showPage === 'list' && <UserList {...this.props} /> }
        { showPage === 'detail' && <UserDetail {...this.props} /> }
        { showPage === 'edit' && <UserEdit {...this.props} /> }
        <div className={styles.userFooter}>
          <span className={styles.footerText}>京ICP备12030847号-2 © 2017-2018 北京动力协合科技有限公司</span>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  let departmentProps = {};
  // [...state.department].forEach(e=>departmentProps[e[0]]=(e[1].toJS?e[1].toJS():e[1]))
  [...state.user].forEach(e=>departmentProps[e[0]]=e[1])
  return departmentProps
}
// const mapStateToProps = (state) => ({
//   loading: state.user.get('loading'),
//   showPage: state.user.get('showPage'),
//   userId: state.user.get('userId'),
//   roleId: state.user.get('roleId'),
//   userStatus: state.user.get('userStatus'),
//   roleName: state.user.get('roleName'),
//   filterStatus: state.user.get('filterStatus'),
//   sort: state.user.get('sort'),
//   ascend: state.user.get('ascend'),
//   userName: state.user.get('userName'),
//   phoneNum: state.user.get('phoneNum'),
//   stationName: state.user.get('stationName'),
//   totalNum: state.user.get('totalNum'),
//   userData: state.user.get('userData').toJS(),
//   currentPage: state.user.get('currentPage'),
//   pageSize: state.user.get('pageSize'),
//   userDetail: state.user.get('userDetail').toJS(),
//   selectedUser: state.user.get('selectedUser').toJS(),
// });

const mapDispatchToProps = (dispatch) => ({
  changeUserAttr: payload => dispatch({type:userAction.GET_USER_ATTR_CHANGE_SAGA, payload}),
  getUserList: payload => dispatch({type:userAction.GET_USER_LIST_SAGA, payload}),
  getUserDetail: payload => dispatch({type:userAction.GET_USER_DETAIL_SAGA, payload}),
  changeSelectedUser: payload => dispatch({type:userAction.CHANGE_SELECTED_USER_SAGA, payload}),
});

export default connect(mapStateToProps, mapDispatchToProps)(User);
