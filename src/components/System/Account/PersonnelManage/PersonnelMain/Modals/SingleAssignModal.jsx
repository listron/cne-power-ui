

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Table, Icon, Switch, Input, Button } from 'antd';
import WarningTip from '@components/Common/WarningTip';
import styles from './modals.scss';
import CneButton from '@components/Common/Power/CneButton';
import CneTable from '@components/Common/Power/CneTable';
const { Search } = Input;


class SingleAssignModal extends Component {
  static propTypes = {
    assignUserLoading: PropTypes.bool,
    assignUserSuccess: PropTypes.bool,
    showSingleAssignModal: PropTypes.bool,
    selectedDepartment: PropTypes.object,
    departmentTree: PropTypes.array,
    departmentAllUsers: PropTypes.array,
    allBaseUserData: PropTypes.array,
    changeStore: PropTypes.func,
    assignDepartmentUsers: PropTypes.func,
  }

  state = {
    isChecked: false,
    tmpInputText: '',
    nameFilterText: '',
    selectedUserRow: [],
    warningText: '', // 删除某个只属于一个部门的用户时候提示
    warningTmpSavedUserRow: [], // 删除某个只属于一个部门的用户时暂存
    column: [
      {
        title: '真实姓名',
        dataIndex: 'userFullName',
        width: 130,
        render: (text) => <div title={text || '--'} className={styles.userFullName}>{text || '--'}</div>,
      }, {
        title: '用户名',
        dataIndex: 'username',
        width: 120,
        render: (text) => <div title={text || '--'} className={styles.username}>{text || '--'}</div>,
      }, {
        title: '电话',
        width: 140,
        dataIndex: 'phoneNum',
      }, {
        title: '所属部门',
        dataIndex: 'departmentNames',
        render: (text) => <div title={text || '--'} className={styles.departmentNames}>{text || '--'}</div>,
      },
    ],
  }

  componentWillReceiveProps(nextProps){
    const { departmentAllUsers, assignUserLoading, assignUserSuccess } = nextProps;
    const preAllUsers = this.props.departmentAllUsers;
    const preLoading = this.props.assignUserLoading;
    if (preAllUsers !== departmentAllUsers) {
      this.setState({ selectedUserRow: departmentAllUsers });
    }
    if (preLoading && !assignUserLoading && assignUserSuccess) { // 分配用户 请求成功；
      this.cancelAssign();
    }
  }

  toSeeChecked = (isChecked) => this.setState({ isChecked })

  changeSearchText = ({ target }) => { // input暂存文字
    const { value } = target || {};
    this.setState({ tmpInputText: value });
  }

  searchName = (nameFilterText) => { // 点击搜索后的搜索项文字
    this.setState({ nameFilterText: nameFilterText ? nameFilterText.trim() : '' });
  }

  checkUser = (selectedKeys, nextSelectedUserRow) => { // 选中
    const { selectedUserRow, nameFilterText } = this.state;
    const totalSelectedUserRow = nextSelectedUserRow;
    if (nameFilterText) { // 有筛选时， 在筛选后表格中展示的选中项; 实际选中项需要加进使用姓名过滤前的选中信息
      selectedUserRow.forEach(e => {
          const hasUsername = e.username && e.username.includes(nameFilterText);
          const hasFullName = e.userFullName && e.userFullName.includes(nameFilterText);
          !hasUsername && !hasFullName && totalSelectedUserRow.push(e);
      });
    }
    if (totalSelectedUserRow.length < selectedUserRow.length) { // 减少, 且减少的这个只有一个部门时，需要提示他将不属于任何部门
      const { departmentAllUsers, selectedDepartment } = this.props;
      const preKeys = totalSelectedUserRow.map(e => e.userId);
      const deleteUser = selectedUserRow.find(e => !preKeys.includes(e.userId));
      const isDeleteUserInThisDepart = departmentAllUsers.find(e => e.userId === deleteUser.userId);
      const { departmentNames, username } = deleteUser || {};
      const departNum = departmentNames ? departmentNames.split(',').length : 0;
      if (isDeleteUserInThisDepart && departNum === 1) { // 欲删除用户正好在当前部门内 且只有一个部门;
        this.setState({
          warningText: `${username} 在 ${selectedDepartment.departmentName} 取消分配后, 不再属于任何部门, 将在未分配部门人员列表中。您确认从${selectedDepartment.departmentName}中移出${username}吗?`,
          warningTmpSavedUserRow: totalSelectedUserRow,
        });
        return;
      }
    }
    this.setState({ selectedUserRow: totalSelectedUserRow });
  }

  confirmRemove = () => {
    const { warningTmpSavedUserRow } = this.state;
    this.setState({
      selectedUserRow: warningTmpSavedUserRow,
      warningText: '',
      warningTmpSavedUserRow: [],
    });
  }

  cancelRemove = () => {
    this.setState({
      warningText: '',
      warningTmpSavedUserRow: [],
    });
  }

  getUserSource = (data) => { // 基于筛选项 获取table表格数据
    const { isChecked, nameFilterText, selectedUserRow } = this.state;
    const selectedIds = selectedUserRow.map(e => e.userId);
    let userSource = data;
    if (isChecked) {
      userSource = userSource.filter(e => selectedIds.includes(e.userId));
    }
    if (nameFilterText) {
      userSource = userSource.filter(e => {
        const hasUsername = e.username && e.username.includes(nameFilterText);
        const hasFullName = e.userFullName && e.userFullName.includes(nameFilterText);
        return hasUsername || hasFullName;
      });
    }
    return userSource;
  }

  cancelAssign = () => {
    const { departmentAllUsers } = this.props;
    this.props.changeStore({ showSingleAssignModal: false });
    this.setState({ // 数据重置
      isChecked: false,
      tmpInputText: '',
      nameFilterText: '',
      selectedUserRow: departmentAllUsers,
    });
  }

  assignUsers = () => {
    const { selectedUserRow } = this.state;
    const { selectedDepartment } = this.props;
    const { departmentId } = selectedDepartment || {};
    this.props.assignDepartmentUsers({
      userIds: selectedUserRow.map(e => e.userId),
      departmentId,
    });
  }

  render(){
    const { showSingleAssignModal, selectedDepartment, departmentTree, allBaseUserData, assignUserLoading } = this.props;
    const { departmentName, parentDepartmentId, departmentId } = selectedDepartment;
    const { column, isChecked, tmpInputText, selectedUserRow, warningText } = this.state;
    let parentInfo; // parentDepartmentId为0代表无父部门, departmentId为1代表未分配部门, 均不用遍历
    if (parentDepartmentId && departmentId !== '1' && parentDepartmentId !== '0') {
      parentInfo = departmentTree.find(e => e.departmentId === parentDepartmentId);
    }
    return (
      <Modal
        title={
          <div className={styles.title}>
            <span>分配人员({parentInfo ? `${parentInfo.departmentName} - `: ''}{departmentName})</span>
            <Icon className={styles.close} type="close" onClick={this.cancelAssign} />
          </div>
        }
        visible={showSingleAssignModal}
        onCancel={this.handleCancel}
        closable={false}
        footer={null}
        width={625}
        wrapClassName={styles.singleModal}
      >
        <div className={styles.filterTop}>
          <span className={styles.tipText}>父部门和子部门从企业中选择用户</span>
          <span className={styles.filterConditions}>
            <Switch className={styles.checkedSwitch} checked={isChecked} onChange={this.toSeeChecked} />
            <span className={styles.switchText}>只看已选</span>
            <Search
              value={tmpInputText}
              onChange={this.changeSearchText}
              placeholder="真实姓名/用户名"
              onSearch={this.searchName}
              className={styles.nameSearch}
              enterButton
            />
          </span>
        </div>
        <CneTable
          columns={column}
          pagination={false}
          dataSource={this.getUserSource(allBaseUserData)}
          rowSelection={{
            onChange: this.checkUser,
            selectedRowKeys: selectedUserRow.map(e => e.userId),
          }}
          className={styles.userTable}
          locale={{ emptyText: <img width="223" height="164" src="/img/nodata.png" />}}
          scroll={{ y: 350 }}
        />
        {warningText && <WarningTip
          onOK={this.confirmRemove}
          style={{ width: '310px', height: '130px' }}
          onCancel={this.cancelRemove}
          value={warningText}
        />}
        <div className={styles.assignFooter}>
          <span className={styles.footerText}>
            已选<span className={styles.footerNum}>{selectedUserRow.length}</span>个
          </span>
          <span className={styles.btns}>
            <CneButton className={styles.cancelAssign} onClick={this.cancelAssign}>取消</CneButton>
            <CneButton onClick={this.assignUsers} loading={assignUserLoading}>确定</CneButton>
          </span>
        </div>
      </Modal>
    );
  }
}

export default SingleAssignModal;
