import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './user.scss';
import { userAction } from './userAction';
import { commonAction } from '../../../alphaRedux/commonAction';
import PropTypes from 'prop-types';
import TransitionContainer from '../../../../components/Common/TransitionContainer';
import UserSide from '../../../../components/System/Account/User/UserSide/UserSide';
import UserMain from '../../../../components/System/Account/User/UserList/UserMain';
import Cookie from 'js-cookie';

class User extends Component {
  static propTypes = {
    showPage: PropTypes.string,
    userId: PropTypes.string,
    roleId: PropTypes.string,
    userStatus: PropTypes.number,
    username: PropTypes.string,
    stationName: PropTypes.string,
    phoneNum: PropTypes.string,
    sort: PropTypes.string,
    ascend: PropTypes.bool,
    pageNum: PropTypes.number,
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
    order: PropTypes.string,
    resetUserState: PropTypes.func,
  };
  constructor(props) {
    super(props);
    this.state = {
      showSidePage: 'add',
    }
  }
  componentDidMount() {
    if (this.props.enterpriseId) {
      const params = {
        enterpriseId: this.props.enterpriseId,
        roleId: this.props.roleId,
        userStatus: this.props.userStatus,
        username: this.props.username,
        phoneNum: this.props.phoneNum,
        stationName: this.props.stationName,
        pageNum: this.props.pageNum,
        pageSize: this.props.pageSize,
        order: '',
      };
      this.props.getUserList(params);
      this.props.getRoleAllList({ enterpriseId: this.props.enterpriseId, roleType: "0" });
      this.props.getRoleAllList({ enterpriseId: this.props.enterpriseId, roleType: "1" });
    }
  }

  componentWillUnmount() {
    this.props.resetUserState();
  }

  onChangeSort = sort => {
    if (sort !== this.props.sort) {
      let params = {
        enterpriseId: this.props.enterpriseId,
        roleId: this.props.roleId,
        userStatus: this.props.userStatus,
        username: this.props.username,
        phoneNum: this.props.phoneNum,
        stationName: this.props.stationName,
        pageNum: 1,
        pageSize: this.props.pageSize,
        order: sort.toString(),
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
        pageSize: this.props.pageSize,
        username: this.props.username,
        phoneNum: this.props.phoneNum,
        stationName: this.props.stationName,
        roleId: this.props.roleId,
        sort: this.props.sort,
      };
      this.props.getUserList(params);
    }
  };

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
      <div className={styles.userContainerBox}>
        <div className={styles.userContainer}>
          <UserMain
            {...this.props}
            onChangeStatus={this.onChangeStatus}
            onChangeSort={this.onChangeSort}
          />
          <TransitionContainer
            show={showPage !== 'list'}
            onEnter={this.onToggleSide}
            onExited={this.onToggleSide}
            timeout={500}
            effect="side"
          >
            <UserSide {...this.props} showSidePage={showSidePage} onShowSideChange={this.onShowSideChange} />
          </TransitionContainer>
          <div className={styles.userFooter}>
            <span className={styles.footerText}>
              京ICP备12030847号-2 © 2017-2019 北京动力协合科技有限公司
          </span>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  let userProps = {};
  [...state.system.user].forEach(e => userProps[e[0]] = e[1]);
  userProps['roleData'] = state.system.role.get('roleData');
  userProps['enterpriseId'] = Cookie.get('enterpriseId');
  return userProps;
}

const mapDispatchToProps = (dispatch) => ({
  changeUserStore: payload => dispatch({ type: userAction.CHANGE_USER_STORE_SAGA, payload }),
  getUserList: payload => dispatch({ type: userAction.GET_USER_LIST_SAGA, payload }),
  getUserDetail: payload => dispatch({ type: userAction.GET_USER_DETAIL_SAGA, payload }),
  changeSelectedUser: payload => dispatch({ type: userAction.CHANGE_SELECTED_USER_SAGA, payload }),
  getRoleAllList: payload => dispatch({ type: userAction.GET_ROLE_ALL_LIST_SAGA, payload }),
  changeUserStatus: payload => dispatch({ type: userAction.CHANGE_USER_STATUS_SAGA, payload }),
  createUserInfo: payload => dispatch({ type: userAction.CREATE_USER_INFO_SAGA, payload }),
  editUserInfo: payload => dispatch({ type: userAction.EDIT_USER_INFO_SAGA, payload }),
  getInviteLink: payload => dispatch({ type: userAction.GET_INVITE_LINK_SAGA, payload }),
  resetUserState: payload => dispatch({ type: userAction.RESET_USER_STATE_SAGA, payload }),
  downLoadUserTemplate: payload => dispatch({
    type: commonAction.downLoadFile,
    payload: {
      ...payload,
      actionName: userAction.CHANGE_USER_STORE_SAGA
    }
  })
});

export default connect(mapStateToProps, mapDispatchToProps)(User);
