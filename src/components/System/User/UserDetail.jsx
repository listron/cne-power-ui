import React, { Component } from "react";
import { Button, Icon } from "antd";
import PropTypes from "prop-types";
import styles from "./userDetail.scss";
import WarningTip from "../../Common/WarningTip";

class UserDetail extends Component {
  static propTypes = {
    userId: PropTypes.string,
    username: PropTypes.string,
    userLogo: PropTypes.string,
    userFullName: PropTypes.string,
    UserDetail: PropTypes.object,
    phoneNum: PropTypes.string,
    Email: PropTypes.string,
    userStation: PropTypes.number,
    ascend: PropTypes.bool,
    createtime: PropTypes.string,
    roleId: PropTypes.string,
    roleName: PropTypes.string,
    specialRoleId: PropTypes.string,
    specialRoleName: PropTypes.string,
    enterpriseId: PropTypes.string,
    enterpriseData: PropTypes.array,
    enterpriseUserStatus: PropTypes.number,
    departmentId: PropTypes.string,
    departmentData: PropTypes.array,
    departmentName: PropTypes.string,
    stationId: PropTypes.string,
    stationData: PropTypes.array,
    currentPage: PropTypes.number,
    pageSize: PropTypes.number,
    totalNum: PropTypes.number,
    getOtherPageDetail: PropTypes.func,
    getUserDetail: PropTypes.func,
    changeUserStore: PropTypes.func,
    onShowSideChange: PropTypes.func,
    userDetail: PropTypes.object,
    changeUserAttr: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      showWarningTip: false,
      warningTipText: ""
    };
  }

  onShowSideChange = ({ showSidePage }) => {
    this.props.changeUserAttr({
      showPage: "edit"
    });
  };

  prePage = () => {
    const {
      getOtherPageDetail,
      getUserDetail,
      userId,
      username,
      userDetail,
      userLogo,
      userFullName,
      UserDetail,
      phoneNum,
      Email,
      userStation,
      createtime,
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
      userData
    } = this.props;
    let detailIndex = userData.findIndex(
      e => e.userId === userDetail.userId,
      userLogo
    );
    let params = {
      userId,
      username,
      userFullName,
      UserDetail,
      Email,
      phoneNum,
      userStation,
      createtime,
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
        warningTipText: "这是第一个!"
      });
    } else if (currentPage > 1 && detailIndex === 0) {
      params.currentPage = currentPage - 1;
      getOtherPageDetail(params, { previous: true });
    } else if (detailIndex > 0) {
      const { userId } = userData[detailIndex - 1];
      getUserDetail({ userId });
    } else {
      console.log("用户id信息有误，在tablelist中未获取");
    }
  };

  nextPage = () => {
    const {
      getOtherPageDetail,
      getUserDetail,
      userId,
      username,
      userLogo,
      userFullName,
      UserDetail,
      phoneNum,
      Email,
      userStation,
      createtime,
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
      usertData,
      userDetail
    } = this.props;
    let detailIndex = usertData.findIndex(e => e.userId === userDetail.userId);
    let params = {
      userId,
      username,
      userLogo,
      userFullName,
      UserDetail,
      phoneNum,
      Email,
      userStation,
      createtime,
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
        warningTipText: "这是最后一个!"
      });
    } else if (currentPage < maxPage && detailIndex === pageSize - 1) {
      params.currentPage = currentPage + 1;
      getOtherPageDetail(params, { previous: false });
    } else if (currentPage < maxPage) {
      const { userId } = userData[detailIndex + 1];
      getUserDetail({ userId });
    } else {
      console.log("用户id信息有误，在tablelist中未获取");
    }
  };

  backToList = () => {
    this.props.changeUserAttr({
      showPage: "list"
    });
  };

  render() {

    console.log(this.props);
    const { userDetail } = this.props;
    console.log(userDetail);

    const { showWarningTip, warningTipText } = this.state;

    let stationNames =
      userDetail.stationNameData && userDetail.stationNameData.length > 0
        ? userDetail.stationNameData.map(e => e.stationName).join(",")
        : " -- ";
    return (
      <div className={styles.userDetail}>
        {showWarningTip && (
          <WarningTip onOK={this.confirmWarningTip} value={warningTipText} />
        )}
        <div className={styles.detailTop}>
          <Button
            className={styles.editButton}
            onClick={() => this.onShowSideChange({ showSidePage: "eidt" })}
          >
            编辑
          </Button>
          <span className={styles.handleArea}>
            <Icon
              type="arrow-up"
              className={styles.previous}
              title="上一个"
              onClick={this.preDepartment}
            />
            <Icon
              type="arrow-down"
              className={styles.next}
              title="下一个"
              onClick={this.nextDepartment}
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
              {userDetail.enterpriseUserStatus}
            </div>
            <div className={styles.time}>
              <span>创建时间</span>
              {userDetail.createtime}
            </div>
          </div>
          <div className={styles.userDetailContainer}>
            <div>
              <span className={styles.title}>用户名</span>
              <span className={styles.value}>{userDetail.username}</span>
            </div>
            <div>
              <span className={styles.title}>电话</span>
              <span className={styles.value}>{userDetail.phoneNum}</span>
            </div>

            <div>
              <span className={styles.title}>真实姓名</span>
              <span className={styles.value}>真实姓名</span>
            </div>
            <div>
              <span className={styles.title}>邮箱</span>
              <span className={styles.value}>{userDetail.Email}</span>
            </div>
            <div>
              <span className={styles.title}>微信账户</span>
              <span className={styles.value}>待续</span>
            </div>
            <hr className={styles.doshLine} />
            <div>
              <span className={styles.title}>角色</span>
              <span className={styles.value}>{userDetail.roleName}</span>
            </div>
            <div>
              <span className={styles.title}>特殊权限</span>
              <span className={styles.value}>{userDetail.specialRoleName}</span>
            </div>
            <hr className={styles.doshLine} />
            <div>
              <span className={styles.enterpriseDepartment}>
                企业部门(负责电站)
              </span>
              <div className={styles.value}>{stationNames}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default UserDetail;
