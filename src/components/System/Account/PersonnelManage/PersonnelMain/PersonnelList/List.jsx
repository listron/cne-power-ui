

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'antd';
import ListHandle from './ListHandle';
import WarningTip from '@components/Common/WarningTip';
import DepartmentAssignModal from '../Modals/DepartmentAssignModal';
import { ListFooter } from './PureFunc';
import CneTable from '@components/Common/Power/CneTable';

import styles from './list.scss';

class List extends Component {
  static propTypes = {
    userListLoading: PropTypes.bool,
    logoutSuccess: PropTypes.bool,
    userList: PropTypes.array,
    selectedRowKeys: PropTypes.array,
    departmentTree: PropTypes.array,
    userListPageInfo: PropTypes.object,
    getUserDetailInfo: PropTypes.func,
    setUserStatus: PropTypes.func,
    changeStore: PropTypes.func,
    assignUserDepartments: PropTypes.func,
    getUserList: PropTypes.func,
  }

  state = {
    showLogout: false,
    logoutUserId: null,
    assignDepartUsers: [], // 分配部门弹框的用户信息对象数组
    assignDepartChecked: [], // 用于存储部门弹框分配ids的数组
    column: [
      {
        title: '用户名',
        dataIndex: 'username',
        render: (text, record) => (
          <div className={styles.username} title={text} onClick={() => this.showDetail(record)}>{text || '--'}</div>
        ),
      }, {
        title: '真实姓名',
        dataIndex: 'userFullName',
        render: (text) => text || '--',
      }, {
        title: '电话',
        dataIndex: 'phoneNum',
        className: styles.phoneNum,
        render: (text) => text || '--',
      }, {
        title: '角色',
        dataIndex: 'roleName',
        render: (text) => <div className={styles.roleName} title={text}>{text || '--'}</div>,
      }, {
        title: '用户状态',
        dataIndex: 'enterpriseStatus',
        className: styles.enterpriseStatus,
        render: (text) => {
          const statusText = this.enterpriseStatusInfo[text];
          return <span className={statusText === '待审核' ? styles.toExamine : styles.status}>{statusText || '--'}</span>;
        },
        sorter: true,
      },
    ],
  }

  componentWillReceiveProps(nextProps){
    const { logoutSuccess } = nextProps;
    const preLogout = this.props.logoutSuccess;
    if (logoutSuccess && !preLogout) { // 注销成功
      this.setState({ // 重置需注销信息
        showLogout: false,
        logoutUserId: null,
      });
      this.props.changeStore({ logoutSuccess: false }); // 重置注销状态
    }
  }

  enterpriseStatusInfo = {
    3: '启用',
    4: '禁用',
    5: '待审核',
    6: '审核不通过',
    7: '移除',
  }

  showDetail = ({ userId }) => { // 展示用户详情
    this.props.getUserDetailInfo({ userId });
  }

  editUser = ({ userId }) => { // 请求详情并进入编辑
    this.props.getUserDetailInfo({ userId, pageKey: 'editPersonnel' });
  }

  examineUser = ({ userId }) => { // 打开审核
    this.props.changeStore({ personnelDrawerIds: [userId] });
    this.props.getUserDetailInfo({ userId, pageKey: 'list' });
  }

  onDepartChecked = (assignDepartChecked) => this.setState({ assignDepartChecked })

  onAssignOK = () => { // 确定用户分配 => 部门;
    const { assignDepartChecked, assignDepartUsers } = this.state;
    this.props.assignUserDepartments({
      userIds: assignDepartUsers.map(e => e.userId),
      departmentIds: assignDepartChecked,
    });
    this.setState({ // 重置弹框数据
      assignDepartUsers: [],
      assignDepartChecked: [],
    });
  }

  assignDeparts = (assignDepartUsers) => {
    const userDeparts = assignDepartUsers.map(e => e.departmentIds).filter(e => !!e).map(e => e.split(','));
    const userDepartIds = userDeparts.reduce((a, b) => a.concat(b), []);
    this.setState({ // 开启分配部门弹框并初始化弹框选中项
      assignDepartChecked: userDepartIds,
      assignDepartUsers,
    });
  }

  hideDepartModal = () => this.setState({ // 取消分配用户
    assignDepartChecked: [],
    assignDepartUsers: [],
  })

  logoutWarning = ({ userId }) => { // 注销用户前弹框
    this.setState({ showLogout: true, logoutUserId: userId });
  }

  logoutUser = () => { // 注销用户
    const { logoutUserId } = this.state;
    this.props.setUserStatus({
      userId: logoutUserId,
      enterpriseUserStatus: '7',
    });
  }

  cancelLogout = () => { // 取消用户注销
    this.setState({ showLogout: false, logoutUserId: null });
  }

  rowSelect = (selectedRowKeys) => {
    this.props.changeStore({ selectedRowKeys });
  }

  sortList = (pagination, filters, sorter) => {
    const { order /*, field */ } = sorter || {}; // 现只有一列需排序，field暂无用;
    const { userListPageInfo } = this.props;
    let sortField = 'u.create_time', sortMethod = 'desc';
    if (order) {
      sortField = 'eu.enterprise_user_status';
      sortMethod = order === 'ascend' ? 'asc' : 'desc';
    }
    const newPageInfo = {
      ...userListPageInfo,
      sortField,
      sortMethod,
    };
    this.props.changeStore({ userListPageInfo: newPageInfo });
    this.props.getUserList({ ...newPageInfo });
  }

  cancelSelectRow = () => {
    this.props.changeStore({ selectedRowKeys: [] });
  }

  getHandleColumn = (editRight, assignRight, deleteRight, auditRight) => ({
    title: '操作',
    dataIndex: 'handle',
    className: styles.handleBox,
    render: (text, record) => {
      const { enterpriseStatus } = record; // 5待审核，6审核不通过，可继续审核;  其余状态可进行分配操作;
      return (
        <span className={styles.handle}>
          {editRight && <i className="iconfont icon-edit" title="编辑" onClick={() => this.editUser(record)} />}
          {deleteRight && <i className="iconfont icon-remove" title="注销" onClick={() => this.logoutWarning(record)} />}
          {auditRight && [5, 6].includes(enterpriseStatus) && <i
            className="iconfont icon-examine1"
            title="审核"
            onClick={() => this.examineUser(record)}
          /> /*需审核*/}
          {assignRight && ![5, 6].includes(enterpriseStatus) && <i
            title="分配"
            className="iconfont icon-bumenx"
            onClick={() => this.assignDeparts([record])}
          /> /*分配*/}
        </span>
      );
    },
  })

  render(){
    const { userList, userListLoading, selectedRowKeys, departmentTree } = this.props;
    const { column, showLogout, assignDepartUsers, assignDepartChecked } = this.state;
    const rights = localStorage.getItem('rightHandler');
    const editRight = rights && rights.split(',').includes('account_user_edit'); // 编辑
    const assignRight = rights && rights.split(',').includes('account_department_user'); // 部门 - 用户 分配
    const deleteRight = rights && rights.split(',').includes('account_user_delete'); // 注销
    const auditRight = rights && rights.split(',').includes('account_user_audit'); // 审核
    const hasRights = assignRight || deleteRight || auditRight;
    const tableColumn = hasRights ? column.concat(this.getHandleColumn(editRight, assignRight, deleteRight, auditRight)) : column;
    return (
      <div className={styles.personnelMain}>
        <ListHandle {...this.props} assignDeparts={this.assignDeparts} />
        <CneTable
          dataSource={userList}
          columns={tableColumn}
          pagination={false}
          loading={userListLoading}
          className={styles.listMain}
          rowSelection={{
            onChange: this.rowSelect,
            selectedRowKeys,
          }}
          onChange={this.sortList}
        />
        <DepartmentAssignModal
          value={assignDepartChecked}
          onCheck={this.onDepartChecked}
          onChange={this.onAssignOK}
          modalShow={assignDepartUsers.length > 0}
          departmentTree={departmentTree.filter(e => e.departmentId !== '1')}
          username={assignDepartUsers.map(e => e.username).join(',')}
          hideModal={this.hideDepartModal}
        />
        {showLogout && <WarningTip
          onOK={this.logoutUser}
          style={{ width: '310px', height: '115px' }}
          onCancel={this.cancelLogout}
          value="注销后用户不再属于任何部门，会被移出系统。您确定注销该人员吗？"
        />}
        {userList.length > 0 && <ListFooter selectedLength={selectedRowKeys.length} cancel={this.cancelSelectRow} />}
      </div>
    );
  }
}

export default List;
