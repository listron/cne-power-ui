

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Icon } from 'antd';
import moment from 'moment';
import styles from './side.scss';

class PersonnelManageSides extends Component {
  static propTypes = {
    pageKey: PropTypes.string,
    userDetailInfo: PropTypes.object,
    changeStore: PropTypes.func,
  }

  backToList = () => {
    this.props.changeStore({ pageKey: 'list' });
  }

  toEdit = () => {
    this.props.changeStore({ pageKey: 'editPersonnel' });
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
    ['特殊权限', 'spcialRoleName', <hr className={styles.doshLine} />],
  ]

  render(){
    const { pageKey, userDetailInfo } = this.props;
    const { userLogo, enterpriseUserStatus, createtime, enterpriseData } = userDetailInfo;
    const enterpriseList = enterpriseData || [];
    return (
      <div className={styles.detail} style={['addPersonnel', 'editPersonnel'].includes(pageKey) ? {display: 'none'} : {}}>
        <div className={styles.topTitle}>
          <Button className={styles.topButton} onClick={this.toEdit}>编辑</Button>
          <Icon type="arrow-left" className={styles.backIcon} onClick={this.backToList} />
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
              <h4>企业-部门(负责电站)</h4>
              {enterpriseList.map(enterprise => {
                const { enterpriseName = '--', departmentData } = enterprise || {};
                const departmentList = departmentData || [];
                return (
                  <div className={styles.eachEnterprise}>
                    <span className={styles.enterpriseName}>{enterpriseName || '--'} : </span>
                    {departmentList.map(depart => {
                      const { departmentName, parentDepartmentName, stationData } = depart || {};
                      const stationList = stationData || [];
                      return (
                        <div className={styles.eachDepartment}>
                          <span>{parentDepartmentName ? `${parentDepartmentName}-` : ''}</span>
                          <span>{departmentName || '--'}</span>
                          <span>(负责电站: {stationList.map(e => e.stationName).join(', ')})</span>
                        </div>
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
