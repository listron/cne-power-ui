

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Table, Icon, Switch, Input, Button } from 'antd';
import styles from './modals.scss';
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
    assignUsers: PropTypes.func,
  }

  state = {
    isChecked: false,
    tmpInputText: '',
    nameFilterText: '',
    selectedUserRow: [],
    column: [
      {
        title: '真实姓名',
        dataIndex: 'userFullName',
        render: (text) => <div className={styles.userFullName}>{text || '--'}</div>,
      }, {
        title: '电话',
        dataIndex: 'phoneNum',
      }, {
        title: '所属部门',
        dataIndex: 'departmentNames',
        width: 200,
        render: (text) => <div className={styles.departmentNames}>{text || '--'}</div>,
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

  checkUser = (selectedKeys, selectedUserRow) => { // 选中
    this.setState({ selectedUserRow });
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
    this.props.assignUsers({
      userIds: selectedUserRow.map(e => e.userId),
      departmentId: [selectedDepartment.departmentId],
    });
  }

  render(){
    const { showSingleAssignModal, selectedDepartment, departmentTree, allBaseUserData, assignUserLoading } = this.props;
    const { departmentName, parentDepartmentId } = selectedDepartment;
    const { column, isChecked, tmpInputText, selectedUserRow } = this.state;
    const parentInfo = ![0, 1].includes(parentDepartmentId) && departmentTree.find(e => e.departmentId === parentDepartmentId);
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
        <Table
          columns={column}
          pagination={false}
          dataSource={this.getUserSource(allBaseUserData)}
          rowSelection={{
            onChange: this.checkUser,
            selectedRowKeys: selectedUserRow.map(e => e.userId),
          }}
          className={styles.userTable}
          scroll={{ y: 350 }}
        />
        <div className={styles.assignFooter}>
          <span className={styles.footerText}>
            已选<span className={styles.footerNum}>{selectedUserRow.length}</span>个
          </span>
          <span className={styles.btns}>
            <Button onClick={this.cancelAssign}>取消</Button>
            <Button onClick={this.assignUsers} loading={assignUserLoading}>确定</Button>
          </span>
        </div>
      </Modal>
    );
  }
}

export default SingleAssignModal;
