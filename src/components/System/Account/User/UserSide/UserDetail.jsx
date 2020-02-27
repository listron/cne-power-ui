import React, { Component } from 'react';
import { Button, Icon, message } from 'antd';
import PropTypes from 'prop-types';
import styles from './userSide.scss';
import WarningTip from '../../../../Common/WarningTip';
class UserDetail extends Component {
  static propTypes = {
    userData: PropTypes.object,
    getUserDetail: PropTypes.func,
    changeUserStore: PropTypes.func,
    onShowSideChange: PropTypes.func,
    userDetail: PropTypes.object,
    userId: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      showWarningTip: false,
      warningTipText: '',
    };
  }

  onShowSideChange = () => {
    const { userDetail } = this.props;
    this.props.changeUserStore({ showPage: 'edit', userDetail: userDetail });
    this.props.onShowSideChange('edit');
  };
  getEnterpriseStatus = (enterpriseStatus) => {
    switch (enterpriseStatus) {
      case 3:
        return '启用';
      case 4:
        return '禁用';
      case 5:
        return '待审核';
      case 6:
        return '审核不通过';
      case 7:
        return '移除';
      default:
        return;
    }
  }
  prePage = () => {
    const userData = this.props.userData;
    const userId = this.props.userDetail.get('userId');
    const index = userData.findIndex(item => {
      return item.get('userId') === userId;
    });
    if (index !== -1) {
      if (index !== 0) {
        this.props.getUserDetail({ userId: userData.getIn([index - 1, 'userId']) });
      } else {
        message.destroy();
        message.config({
          top: 130,
          duration: 2,
          maxCount: 1,
        });
        message.info('已经是第一条');
      }
    }
  }

  nextPage = () => {
    const userData = this.props.userData;
    const userId = this.props.userDetail.get('userId');
    const index = userData.findIndex(item => {
      return item.get('userId') === userId;
    });
    if (index !== -1) {
      if (index !== userData.size - 1) {
        this.props.getUserDetail({ userId: userData.getIn([index + 1, 'userId']) });
      } else {
        message.destroy();
        message.config({
          top: 130,
          duration: 2,
          maxCount: 1,
        });
        message.info('已经是最后一条');
      }
    }
  }

  backToList = () => {
    this.props.changeUserStore({
      showPage: 'list',
    });
  };
  render() {
    const { userDetail } = this.props;
    const { showWarningTip, warningTipText } = this.state;
    const rightHandler = localStorage.getItem('rightHandler');
    const userEditRight = rightHandler && rightHandler.split(',').includes('account_user_edit');
    return (
      <div className={styles.userDetail}>
        {showWarningTip && (
          <WarningTip onOK={this.confirmWarningTip} value={warningTipText} />
        )}
        <div className={styles.detailTop}>
          {userEditRight && <Button
            className={styles.editButton}
            onClick={this.onShowSideChange}
          >
            编辑
          </Button>}
          <span className={styles.handleArea}>
            <i className="iconfont icon-last"
              title="上一个"
              onClick={this.prePage}
            />
            <i className="iconfont icon-next"
              title="下一个"
              onClick={this.nextPage}
            />
            <i className={`iconfont icon-fanhui ${styles.backIcon}`} onClick={this.backToList} />
          </span>
        </div>
        <div className={styles.userInfor}>
          <div className={styles.logoPart}>
            <div className={styles.userImg}>
              <img src={userDetail && userDetail.get('userLogo')} />
            </div>

            <div className={styles.user}>
              <span>状态</span>
              {this.getEnterpriseStatus(userDetail.get('enterpriseUserStatus')) || '--'}
            </div>
            <div className={styles.time}>
              <span>注册时间</span>
              {userDetail.get('createtime') || '--'}
            </div>
          </div>
          <div className={styles.userDetailContainer}>
            <div>
              <span className={styles.title}>用户名</span>
              <span className={styles.value}>{userDetail.get('username') || '--'}</span>
            </div>
            <div>
              <span className={styles.title}>真实姓名</span>
              <span className={styles.value}>{userDetail.get('userFullName') || '--'}</span>
            </div>
            <div>
              <span className={styles.title}>电话</span>
              <span className={styles.value}>{userDetail.get('phoneNum') || '--'}</span>
            </div>
            <div>
              <span className={styles.title}>邮箱</span>
              <span className={styles.value}>{userDetail.get('email') || '--'}</span>
            </div>
            <div>
              <span className={styles.title}>微信账户</span>
              <span className={styles.value}>{userDetail.get('webChat') || '--'}</span>
            </div>
            <hr className={styles.doshLine} />
            <div className={styles.detailRole}>
              <span className={styles.title}>角色</span>
              <span className={styles.value}>{userDetail.get('roleName') || '--'}</span>
            </div>
            {/* <div className={styles.detailSpecialRole} >
              <span className={styles.title}>特殊权限</span>
              <span className={styles.value}>
                {userDetail.get('spcialRoleName') || '--'}
              </span>
            </div> */}
            <hr className={styles.doshLine} />
            <div>
              <span className={styles.enterpriseDepartment}>
                企业-部门(负责电站)
              </span>
              <div className={styles.enterpriseDepartmentValue}>
                {userDetail.get('enterpriseData') &&
                  userDetail.get('enterpriseData').toJS().map((item, index) => {
                    return (<div className={styles.departmentDetail} key={index} >
                      <div className={styles.enterpriseName}>{item.enterpriseName}：</div>
                      <div className={styles.enterpriseDetail}>
                        {item.departmentData && item.departmentData.map((item2, i) => {
                          return (<p key={i} >{item2.parentDepartmentName || ''}{item2.parentDepartmentName && item2.departmentName && '-'}{item2.departmentName}（负责电站：{item2.stationData &&
                            item2.stationData.map((item3, index3) => {
                              if (item2.stationData.length - 1 === index3) {
                                return item3.stationName;
                              }
                              return `${item3.stationName}，`;

                            })
                          }）</p>);
                        })}
                      </div>
                    </div>);
                  })
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


export default UserDetail;


