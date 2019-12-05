

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Select } from 'antd';
import WarningTip from '@components/Common/WarningTip';
import CommonPagination from '@components/Common/CommonPagination';
import styles from './list.scss';

const { Option } = Select;

class ListHandle extends Component {
  static propTypes = {
    logoutSuccess: PropTypes.bool,
    userListPageInfo: PropTypes.object,
    userListTotalNum: PropTypes.number,
    selectedRowKeys: PropTypes.array,
    userList: PropTypes.array,
    changeStore: PropTypes.func,
    getUserList: PropTypes.func,
    setUserStatus: PropTypes.func,
    assignDeparts: PropTypes.func,
  }

  state = {
    showLogout: false,
  }

  componentWillReceiveProps(nextProps){
    const { logoutSuccess } = nextProps;
    const preLogout = this.props.logoutSuccess;
    if (logoutSuccess && !preLogout) { // 注销成功
      this.setState({ showLogout: false });
      this.props.changeStore({ logoutSuccess: false }); // 重置注销状态
    }
  }

  toAddUser = () => {
    this.props.changeStore({ pageKey: 'addPersonnel' });
  }

  handleUser = (value) => {
    const { selectedRowKeys, userList } = this.props;
    if (value === 'logout') { // 注销用户前弹框
      this.setState({ showLogout: true });
    }
    if (value === 'examine') { // 将选中项转存至personnelDrawerIds, 开启弹框
      this.props.changeStore({ personnelDrawerIds: selectedRowKeys });
    }
    if (value === 'assign') {
      const assignDepartUsers = userList.filter(e => selectedRowKeys.includes(e.userId));
      this.props.assignDeparts(assignDepartUsers);
    }
  }

  logoutUser = () => { // 注销用户
    const { selectedRowKeys } = this.props;
    this.props.setUserStatus({
      userId: selectedRowKeys.join(','),
      enterpriseUserStatus: '7',
    });
  }

  cancelLogout = () => { // 取消用户注销
    this.setState({ showLogout: false });
  }

  paginationChange = ({ pageSize, currentPage }) => {
    const { userListPageInfo } = this.props;
    const newPageInfo = {
      ...userListPageInfo,
      pageNum: currentPage,
      pageSize,
    };
    this.props.changeStore({ userListPageInfo: newPageInfo });
    this.props.getUserList({ ...newPageInfo });
  }

  render(){
    const { showLogout } = this.state;
    const { userListPageInfo, userListTotalNum, userList, selectedRowKeys } = this.props;
    const { pageNum, pageSize } = userListPageInfo;
    const selectedUserStatus = userList.filter(e => selectedRowKeys.includes(e.userId)).map(e => e.enterpriseStatus);
    const statusSet = new Set(selectedUserStatus);
    const handleDisable = statusSet.size !== 1; // 统一状态选中，才能操作
    const examinDisable = !(statusSet.has(5) || statusSet.has(6)); // 选中的有已审核 / 审核不通过用户 => 不可审核
    const assignDisable = statusSet.has(5) || statusSet.has(6); // 选中项中有带审核 / 审核不通过用户 => 不可分配
    const rights = localStorage.getItem('rightHandler');
    const userCreateRight = rights && rights.split(',').includes('account_user_create'); // 新增
    const userAssignRight = rights && rights.split(',').includes('account_department_user'); // 部门 - 用户 分配
    const userDeleteRight = rights && rights.split(',').includes('account_user_delete'); // 注销
    const userAuditRight = rights && rights.split(',').includes('account_user_audit'); // 审核
    const hasSelectRights = userAssignRight || userDeleteRight || userAuditRight;
    return (
      <div className={styles.listHandle}>
        <span className={styles.leftHandle}>
          {userCreateRight && <Button type="add" onClick={this.toAddUser}><i>+</i>添加人员</Button>}
          {hasSelectRights && <Select
            onChange={this.handleUser}
            style={{width: '80px', margin: '0 28px 0 10px'}}
            value="操作"
            dropdownMatchSelectWidth={false}
            disabled={handleDisable}
          >
            {userAssignRight && <Option key="assign" disabled={assignDisable}>
              <span className={`iconfont icon-bumenx ${styles.icon}`} />分配部门
            </Option>}
            {userAuditRight && <Option key="examine" disabled={examinDisable}>
              <span className={`iconfont icon-examine1 ${styles.icon}`} />审核人员
            </Option>}
            {userDeleteRight && <Option key="logout">
              <span className={`iconfont icon-remove ${styles.icon}`} />注销人员
            </Option>}
          </Select>}
        </span>
        <CommonPagination
          total={userListTotalNum}
          pageSize={pageSize}
          currentPage={pageNum}
          onPaginationChange={this.paginationChange}
        />
        {showLogout && <WarningTip
          style={{ width: '310px', height: '115px' }}
          onOK={this.logoutUser}
          onCancel={this.cancelLogout}
          value="注销后用户不再属于任何部门，会被移出系统。您确定注销该人员吗？"
        />}
      </div>
    );
  }
}

export default ListHandle;
