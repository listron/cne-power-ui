import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './user.scss';
import { userAction } from '../../../../constants/actionTypes/system/account/userAction';
import PropTypes from 'prop-types';
import TransitionContainer from '../../../../components/Common/TransitionContainer';
import UserSide from '../../../../components/System/Account/User/UserSide/UserSide';
import UserMain from '../../../../components/System/Account/User/UserList/UserMain';
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
    userDetail: PropTypes.object,
    selectedUser: PropTypes.object,
    getUserList: PropTypes.func,
    changeSelectedUser: PropTypes.func,
    changeUserStore: PropTypes.func,
    userData: PropTypes.object,
    enterpriseId: PropTypes.string,
    getRoleList: PropTypes.func,
    getRoleAllList: PropTypes.func,
    roleAllList: PropTypes.object,
    specialRoleList: PropTypes.object,
  };
  constructor(props) {
    super(props);
    this.state = {
      showSidePage: 'add',
    }
  }
  componentDidMount() {
    const params = {
      enterpriseId: this.props.enterpriseId,
      roleId: this.props.roleId,
      userStatus: this.props.userStatus,
      userName: this.props.userName,
      phoneNum: this.props.phoneNum,
      stationName: this.props.stationName,
      pageNum: this.props.currentPage,
      pageSize: this.props.pageSize,
      order: 0,
    };
    this.props.getUserList(params);
    this.props.getRoleAllList({enterpriseId: this.props.enterpriseId, roleType: "0"});
    this.props.getRoleAllList({enterpriseId: this.props.enterpriseId, roleType: "1"});
  }

  onChangeSort = sort => {
    if (sort !== this.props.sort) {
      let params = {
        enterpriseId: this.props.enterpriseId,
        roleId: this.props.roleId,
        userStatus: this.props.userStatus,
        userName: this.props.userName,
        phoneNum: this.props.phoneNum,
        stationName: this.props.stationName,
        pageNum: 1,
        pageSize: this.props.pageSize,
        order: sort.toString(),
      };
      this.props.getUserList(params);
    }
  };

  onChangePageSize = pageSize => {
    if (pageSize !== this.props.pageSize) {
      let params = {
        enterpriseId: this.props.enterpriseId,
        userStatus: this.props.userStatus,
        pageNum: 1,
        pageSize: pageSize
      };
      this.props.getUserList(params);
    }
  };

  onChangePage = currentPage => {
    if (currentPage !== this.props.currentPage) {
      let params = {
        enterpriseId: this.props.enterpriseId,
        userStatus: this.props.userStatus,
        pageNum: currentPage,
        pageSize: this.props.pageSize
      };
      this.props.getUserList(params);
    }
  };

  onChangeStatus = status => {
    if (Number(status) !== this.props.userStatus) {
      let params = {
        enterpriseId: this.props.enterpriseId,
        userStatus: Number(status),
        pageNum: 1,
        pageSize: this.props.pageSize
      };
      this.props.getUserList(params);
    }
  };

  onUserSearch = data => {
    let params = {
      enterpriseId: this.props.enterpriseId,
      userStatus: this.props.userStatus,
      pageNum: 1,
      pageSize: this.props.pageSize,
      userName: data.nameValue,
      phoneNum: data.phoneValue,
      stationName: data.stationValue
    };
    this.props.getUserList(params);
  }

  onShowSideChange = (showSidePage) => {
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
      <div className={styles.userContainer}>
        <UserMain
          {...this.props}
          onUserSearch={this.onUserSearch}
          onChangeStatus={this.onChangeStatus}
          onChangeSort={this.onChangeSort}
        />
        <TransitionContainer
          show={showPage!=='list'}
          onEnter={this.onToggleSide}
          onExited={this.onToggleSide}
          timeout={500}
          effect="side"
        >
          <UserSide {...this.props} showSidePage={showSidePage} onShowSideChange={this.onShowSideChange} />
        </TransitionContainer>
        <div className={styles.userFooter}>
          <span className={styles.footerText}>
            京ICP备12030847号-2 © 2017-2018 北京动力协合科技有限公司
          </span>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  let userProps = {}; 
  [...state.system.user].forEach(e=>userProps[e[0]]=e[1]);
  userProps['roleData'] = state.system.role.get('roleData');
  userProps['enterpriseId'] = state.login.get('enterpriseId');
  return userProps;
}

const mapDispatchToProps = (dispatch) => ({
  changeUserStore: payload => dispatch({type:userAction.CHANGE_USER_STORE_SAGA, payload}),
  getUserList: payload => dispatch({type:userAction.GET_USER_LIST_SAGA, payload}),
  getUserDetail: payload => dispatch({type:userAction.GET_USER_DETAIL_SAGA, payload}),
  changeSelectedUser: payload => dispatch({type:userAction.CHANGE_SELECTED_USER_SAGA, payload}),
  getRoleAllList: payload => dispatch({type:userAction.GET_ROLE_ALL_LIST_SAGA, payload}),
  changeUserStatus: payload => dispatch({ type:userAction.CHANGE_USER_STATUS_SAGA, payload}),
  createUserInfo: payload => dispatch({type:userAction.CREATE_USER_INFO_SAGA, payload}),
  editUserInfo: payload => dispatch({type:userAction.EDIT_USER_INFO_SAGA, payload}),
  getInviteLink: payload => dispatch({type:userAction.GET_INVITE_LINK_SAGA, payload}),
});

export default connect(mapStateToProps, mapDispatchToProps)(User);
