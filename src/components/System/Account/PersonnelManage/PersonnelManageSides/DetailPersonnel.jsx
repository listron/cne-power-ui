

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, message } from 'antd';
import moment from 'moment';
import styles from './side.scss';

class PersonnelManageSides extends Component {
  static propTypes = {
    pageKey: PropTypes.string,
    userDetailInfo: PropTypes.object,
    userList: PropTypes.array,
    changeStore: PropTypes.func,
    getUserDetailInfo: PropTypes.func,
  }

  backToList = () => {
    this.props.changeStore({ pageKey: 'list', userDetailInfo: {} }); // 清空详情请求
  }

  toEdit = () => {
    const { userDetailInfo } = this.props; //需将详情信息结构 重置copy刷新一下对象, 保证对象内存地址变化从而手动触发edit的表单刷新。
    this.props.changeStore({ pageKey: 'editPersonnel', userDetailInfo: { ...userDetailInfo } });
  }

  preDetail = () => {
    const { userDetailInfo, userList } = this.props;
    const { userId } = userDetailInfo;
    const userIndex = userList.findIndex(e => `${e.userId}` === `${userId}`);
    if (userIndex === 0) {
      message.error('已经是当前页第一条数据');
    } else if (userIndex > 0) {
      const newInfo = userList[userIndex - 1] || {};
      const newUserId = newInfo.userId;
      this.props.getUserDetailInfo({ userId: newUserId });
    }
  }

  nextDetail = () => {
    const { userDetailInfo, userList } = this.props;
    const { userId } = userDetailInfo;
    const userIndex = userList.findIndex(e => `${e.userId}` === `${userId}`);
    if (userIndex === userList.length - 1) {
      message.error('已经是当前页最后一条数据');
    } else if (userIndex >= 0) {
      const newInfo = userList[userIndex + 1] || {};
      const newUserId = newInfo.userId;
      this.props.getUserDetailInfo({ userId: newUserId });
    }
  }

  enterpriseStatusInfo = {
    3: '启用',
    4: '禁用',
    5: '待审核',
    6: '审核不通过',
    7: '移除',
  }

  userInfoBase = [
    ['用户名', 'username'],
    ['真实姓名', 'userFullName'],
    ['电话', 'phoneNum'],
    ['邮箱', 'email'],
    ['微信账户', 'webChat', <hr className={styles.doshLine} />],
    ['角色', 'roleName'],
    // ['特殊权限', 'spcialRoleName', <hr className={styles.doshLine} />],
  ]

  render() {
    const { pageKey, userDetailInfo } = this.props;
    const { userLogo, enterpriseUserStatus, createtime, enterpriseData } = userDetailInfo;
    const enterpriseList = enterpriseData || [];
    const rights = localStorage.getItem('rightHandler');
    const editRight = rights && rights.split(',').includes('account_user_edit'); // 编辑
    return (
      <div className={styles.detail} style={['addPersonnel', 'editPersonnel'].includes(pageKey) ? { display: 'none' } : {}}>
        <div className={styles.topTitle}>
          {editRight ? <Button className={styles.topButton} onClick={this.toEdit}>编辑</Button> : <span />}
          <span className={styles.rightHandle}>
            <i className="iconfont icon-last" title="上一个" onClick={this.preDetail} />
            <i className="iconfont icon-next" title="下一个" onClick={this.nextDetail} />
            <i className={`iconfont icon-fanhui ${styles.backIcon}`} title="返回" onClick={this.backToList} />
          </span>
        </div>
        <div className={styles.userContent}>
          <div className={styles.leftConfig}>
            <img src={userLogo || '/img/nopic.png'} />
            <div className={styles.eachInfo}>
              <span className={styles.title}>状态</span>
              <span>{this.enterpriseStatusInfo[enterpriseUserStatus] || '--'}</span>
            </div>
            <div className={styles.eachInfo}>
              <span className={styles.title}>注册时间</span>
              <span>{createtime ? moment(createtime).format('YYYY-MM-DD HH:mm') : '--'}</span>
            </div>
          </div>
          <div className={styles.rightContent}>
            {this.userInfoBase.map(e => (
              <React.Fragment key={e[1]} >
                <div className={styles.eachInfo}>
                  <span className={styles.title}>{e[0]}</span>
                  <span className={styles.value}>{userDetailInfo[e[1]] || '--'}</span>
                </div>
                {e[2]}
              </React.Fragment>
            ))}
            <div>
              <div className={styles.enterpriseDepartment}>
                <h4 className={styles.enterpriseTitle}>企业-部门(负责电站)</h4>
                {enterpriseList.map(enterprise => {
                  const { enterpriseName = '--', departmentData } = enterprise || {};
                  const departmentList = departmentData || [];
                  return (
                    <div className={styles.eachEnterprise} key={enterpriseName}>
                      {departmentList.map(depart => { // 企业下部门列表
                        const { departmentName, parentDepartmentName, stationData } = depart || {};
                        const stationList = stationData || [];
                        return ( // 每个部门 负责的电站
                          <section className={styles.eachDepartment} key={departmentName}>
                            <h4 className={styles.departmentTitle}>
                              <span className={styles.enterpriseName}>{`${enterpriseName}-` || ''}</span>
                              <span>{parentDepartmentName ? `${parentDepartmentName}-` : ''}</span>
                              <span>{departmentName || '--'}</span>
                            </h4>
                            <div className={styles.departmentStations}>负责电站: {stationList.map(e => e.stationName).join(', ')}</div>
                          </section>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PersonnelManageSides;
