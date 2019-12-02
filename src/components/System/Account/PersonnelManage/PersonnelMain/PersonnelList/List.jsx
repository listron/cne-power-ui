

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'antd';
import ListHandle from './ListHandle';
import WarningTip from '@components/Common/WarningTip';
import DepartmentAssignModal from '../Modals/DepartmentAssignModal';
import { ListFooter } from './PureFunc';

import styles from './list.scss';

class List extends Component {
  static propTypes = {
    userListLoading: PropTypes.bool,
    logoutSuccess: PropTypes.bool,
    userList: PropTypes.array,
    selectedRowKeys: PropTypes.array,
    departmentTree: PropTypes.array,
    getUserDetailInfo: PropTypes.func,
    setUserStatus: PropTypes.func,
    changeStore: PropTypes.func,
  }

  state = {
    showLogout: false,
    logoutUserId: null,
    assignDepartUsers: [], // 分配部门弹框的用户信息对象数组
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
        render: (text) => text || '--',
      }, {
        title: '角色',
        dataIndex: 'roleName',
        render: (text) => <div className={styles.roleName} title={text}>{text || '--'}</div>,
      }, {
        title: '用户状态',
        dataIndex: 'enterpriseStatus',
        render: (text) => {
          const statusText = this.enterpriseStatusInfo[text];
          return <span className={statusText === '待审核' ? styles.toExamine : styles.status}>{statusText || '--'}</span>;
        },
        sorter: true,
      }, {
        title: '操作',
        dataIndex: 'handle',
        render: (text, record) => {
          const { enterpriseStatus } = record;
          return (
            <span className={styles.handle}>
              <i className="iconfont icon-edit" title="编辑" onClick={() => this.editUser(record)} />
              <i className="iconfont icon-remove" title="注销" onClick={() => this.logoutWarning(record)} />
              {parseFloat(enterpriseStatus) === 5 && <i
                className="iconfont icon-examine1"
                title="审核"
                onClick={() => this.examineUser(record)}
              /> /*需审核*/}
              {parseFloat(enterpriseStatus) !== 5 && <i
                title="分配"
                className="iconfont icon-bumenx"
                onClick={() => this.assignDeparts([record])}
              /> /*分配*/}
            </span>
          );
        },
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
  }

  assignDeparts = (assignDepartUsers) => this.setState({ assignDepartUsers }) // 去分配用户的部门

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

  cancelSelectRow = () => {
    this.props.changeStore({ selectedRowKeys: [] });
  }

  render(){
    const { userList, userListLoading, selectedRowKeys, departmentTree } = this.props;
    const { column, showLogout, assignDepartUsers } = this.state;
    return (
      <div className={styles.personnelMain}>
        <ListHandle {...this.props} assignDeparts={this.assignDeparts} />
        <Table
          dataSource={userList}
          columns={column}
          pagination={false}
          loading={userListLoading}
          className={styles.listMain}
          rowSelection={{
            onChange: this.rowSelect,
            selectedRowKeys,
          }}
        />
        <DepartmentAssignModal
          departmentTree={departmentTree}
          value={[]}
          onChange={(ids) => console.log(ids)}
          username={assignDepartUsers.map(e => e.username)}
          hiddenIcon={true}
          modalShowControl={assignDepartUsers.length > 0}
        />
        {showLogout && <WarningTip
          onOK={this.logoutUser}
          style={{ width: '310px', height: '115px' }}
          onCancel={this.cancelLogout}
          value="注销后用户不再属于任何部门，会被移出系统。您确定注销该人员吗？"
        />}
        <ListFooter selectedLength={selectedRowKeys.length} cancel={this.cancelSelectRow} />
      </div>
    );
  }
}

export default List;


// class DepartmentAssignModal extends Component { 
//   static propTypes = {
//     departmentTree: PropTypes.array,
//     value: PropTypes.array,
//     onChange: PropTypes.func,
//     username: PropTypes.string,
//     hiddenIcon: PropTypes.bool,
//     modalShowControl: PropTypes.bool,
//   }
