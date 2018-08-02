import React, { Component } from 'react';
import { Button, Icon } from 'antd';
import PropTypes from 'prop-types';
import styles from './userSide.scss';
import WarningTip from '../../../../Common/WarningTip'
class UserDetail extends Component {
  static propTypes = {
    UserDetail: PropTypes.object,
    userStation: PropTypes.number,
    ascend: PropTypes.bool,
    roleId: PropTypes.string,
    roleName: PropTypes.string,
    specialRoleId: PropTypes.string,
    specialRoleName: PropTypes.string,
    userData: PropTypes.object,
    currentPage: PropTypes.number,
    enterpriseId: PropTypes.string,
    enterpriseData: PropTypes.array,
    enterpriseUserStatus: PropTypes.number,
    departmentId: PropTypes.string,
    departmentData: PropTypes.object,
    departmentName: PropTypes.string,
    stationId: PropTypes.string,
    stationData: PropTypes.array,
    pageSize: PropTypes.number,
    totalNum: PropTypes.number,
    getOtherPageDetail: PropTypes.func,
    getUserDetail: PropTypes.func,
    changeUserStore: PropTypes.func,
    onShowSideChange: PropTypes.func,
    userDetail: PropTypes.object,
    changeUserStore: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      showWarningTip: false,
      warningTipText: ""
    };
  }

  onShowSideChange = ({ showSidePage }) => {
    this.props.changeUserStore({
      showPage: 'edit'
    });
  };

  prePage = () => {
    const {
      getOtherPageDetail,
      getUserDetail,
      userDetail,
      UserDetail,
      userStation,
      roleId,
      roleName,
      specialRoleId,
      specialRoleName,
      enterpriseId,
      enterpriseData,
      enterpriseUserStatus,
      departmentData,
      departmentName,
      stationId,
      stationData,
      departmentId,
      currentPage,
      pageSize,
      totalNum,
      userData
    } = this.props;
    let detailIndex = userData.findIndex(
      e => e.userId === userDetail.userId
    );
    let params = {
      UserDetail,
      userStation,
      roleId,
      roleName,
      specialRoleId,
      specialRoleName,
      enterpriseId,
      enterpriseData,
      enterpriseUserStatus,
      departmentId,
      departmentData,
      departmentName,
      stationId,
      stationData,
      currentPage,
      pageSize,
      totalNum
    };
    if (currentPage === 1 && detailIndex === 0) {
      //第一条记录
      this.setState({
        showWarningTip: true,
        warningTipText: '这是第一个!'
      });
    } else if (currentPage > 1 && detailIndex === 0) {
      params.currentPage = currentPage - 1;
      getOtherPageDetail(params, { previous: true });
    } else if (detailIndex > 0) {
      const { userId } = userData[detailIndex - 1];
      getUserDetail({ userId });
    } else {
      console.log('用户id信息有误，在tablelist中未获取');
    }
  };

  nextPage = () => {
    const {
      getOtherPageDetail,
      getUserDetail,
      userStation,
      roleId,
      roleName,
      specialRoleId,
      specialRoleName,
      enterpriseId,
      enterpriseData,
      enterpriseUserStatus,
      departmentId,
      departmentData,
      departmentName,
      stationId,
      stationData,
      currentPage,
      pageSize,
      totalNum,
      userData,
      userDetail
    } = this.props;
    let detailIndex = userData.findIndex(
      e => e.userId === userDetail.userId
    );
    let params = {
      UserDetail,
      userStation,
      roleId,
      roleName,
      specialRoleId,
      specialRoleName,
      enterpriseId,
      enterpriseData,
      enterpriseUserStatus,
      departmentId,
      departmentData,
      departmentName,
      stationId,
      stationData,
      currentPage,
      pageSize,
      totalNum
    };
    const maxPage = Math.ceil(totalNum / pageSize);
    const lastPageMaxIndex = totalNum - (maxPage - 1) * pageSize - 1;
    if (currentPage === maxPage && detailIndex === lastPageMaxIndex) {
      //最后一条记录
      this.setState({
        showWarningTip: true,
        warningTipText: '这是最后一个!'
      });
    } else if (currentPage < maxPage && detailIndex === pageSize - 1) {
      params.currentPage = currentPage + 1;
      getOtherPageDetail(params, { previous: false });
    } else if (currentPage < maxPage) {
      const { userId } = userData[detailIndex + 1];
      getUserDetail({ userId });
    } else {
      console.log('用户id信息有误，在userlist中未获取');
    }
  };
  backToList = () => {
    this.props.changeUserStore({
      showPage: 'list'
    });
  };
  render() {
    const { userDetail} = this.props;
   console.log(userDetail.toJS());
    const { showWarningTip, warningTipText } = this.state;
    console.log(userDetail.get('enterpriseData'))
    return (
      <div className={styles.userDetail}>
        {showWarningTip && (
          <WarningTip onOK={this.confirmWarningTip} value={warningTipText} />
        )}
        <div className={styles.detailTop}>
          <Button
            className={styles.editButton}
            onClick={() => this.onShowSideChange({ showSidePage: 'eidt' })}
          >
            编辑
          </Button>
          <span className={styles.handleArea}>
            <Icon
              type="arrow-up"
              className={styles.previous}
              title="上一个"
              onClick={this.prePage}
            />
            <Icon
              type="arrow-down"
              className={styles.next}
              title="下一个"
              onClick={this.nextPage}
            />
            <Icon
              type="arrow-left"
              className={styles.backIcon}
              onClick={this.backToList}
            />
          </span>
        </div>
        <div className={styles.userInfor}>
          <div className={styles.logoPart}>
            <div className={styles.userImg}>
              <img src={userDetail.userLogo} />
            </div>

            <div className={styles.user}>
              <span>状态</span>
              {userDetail.get('enterpriseUserStatus')}
            </div>
            <div className={styles.time}>
              <span>创建时间</span>
              {userDetail.get('createtime')}
            </div>
          </div>
          <div className={styles.userDetailContainer}>
            <div>
              <span className={styles.title}>用户名</span>
              <span className={styles.value}>{userDetail.get('username')}</span>
            </div>
            <div>
              <span className={styles.title}>电话</span>
              <span className={styles.value}>{userDetail.get('phoneNum')}</span>
            </div>

            <div>
              <span className={styles.title}>真实姓名</span>
              <span className={styles.value}>{userDetail.get('fullName')}</span>
            </div>
            <div>
              <span className={styles.title}>邮箱</span>
              <span className={styles.value}>{userDetail.get('Email')}</span>
            </div>
            <div>
              <span className={styles.title}>微信账户</span>
              <span className={styles.value}>{userDetail.get('webChat')}</span>
            </div>
            <hr className={styles.doshLine} />
            <div>
              <span className={styles.title}>角色</span>
              <span className={styles.value}>{userDetail.get('roleName')}</span>
            </div>
            <div>
              <span className={styles.title}>特殊权限</span>
              <span className={styles.value}>
                {userDetail.get('specialRoleName')}
              </span>
            </div>
            <hr className={styles.doshLine} />
            <div>
              <span className={styles.enterpriseDepartment}>
                企业部门(负责电站)
              </span>
              <div className={styles.enterpriseDepartmentValue}>
               {userDetail.get('enterpriseData') && userDetail.get('enterpriseData').get('enterpriseName')}: {userDetail.get('enterpriseData') && userDetail.get('enterpriseData').get('departmentData').get('departmentName')}({userDetail.get('enterpriseData') && userDetail.get('enterpriseData').get('departmentData').get('stationData').get('stationName')})
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


export default UserDetail;


