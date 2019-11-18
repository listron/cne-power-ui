

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Drawer } from 'antd';
// import UserSearch from './UserSearch';
// import UserList from './UserList';
// import Footer from '../../../../Common/Footer';
import styles from './list.scss';

class PersonnelLists extends Component {
  static propTypes = {
    showPersonnelDrawer: PropTypes.bool,
    showDepartmentDrawer: PropTypes.bool,
    changeStore: PropTypes.func,
  }



  // 注: pageKey: 'list', // list列表-addPersonnel添加人员-editPersonnel编辑人员-detailPersonnel人员信息详情
  toTestDetail = () => {
    this.props.changeStore({ pageKey: 'detailPersonnel' });
  }
  toTestEdit = () => {
    this.props.changeStore({ pageKey: 'editPersonnel' });
  }
  toTestAdd = () => {
    this.props.changeStore({ pageKey: 'addPersonnel' });
  }
  toExamine = () => {
    this.props.changeStore({ showPersonnelDrawer: true });
  }
  toHandleDepartment = () => {
    this.props.changeStore({ showDepartmentDrawer: true });
  }
  testCloseUserExamine = () => {
    this.props.changeStore({ showPersonnelDrawer: false });
  }
  testCloseHandleDepartment = () => {
    this.props.changeStore({ showDepartmentDrawer: false });
  }

  render(){
    const { showPersonnelDrawer, showDepartmentDrawer } = this.props;
    return (
      <div className={styles.personnelLists}>
        <button onClick={this.toTestDetail}>展示详情</button>
        <button onClick={this.toTestEdit}>编辑用户</button>
        <button onClick={this.toTestAdd}>新增用户</button>
        <div>
          <div>导入模板下载， 批量导入</div>
          <div>部门列表： 添加部门 | 分配人员</div>
          <div>部门树</div>
        </div>
        <div>
          <div>部门名称展示</div>
          <div>部门的负责电站展示</div>
          <div>部门用户搜索条</div>
          <div>用户列表表格</div>
          <div>当前选中项 取消选择 请选择同意状态下的列表项，进行操作</div>
          <button onClick={this.toExamine}>用户审核抽屉</button>
          <button onClick={this.toHandleDepartment}>部门处理抽屉</button>
        </div>
        <Drawer
          title="用户审核抽屉"
          placement="right"
          closable={false}
          onClose={this.testCloseUserExamine}
          visible={showPersonnelDrawer}
          getContainer={false}
          style={{ position: 'absolute' }}
        >
          <p>用户审核的相关表单内容</p>
        </Drawer>
        <Drawer
          title="部门"
          placement="right"
          closable={false}
          onClose={this.testCloseHandleDepartment}
          visible={showDepartmentDrawer}
          getContainer={false}
          style={{ position: 'absolute' }}
        >
          <p>新增部门或者编辑部门</p>
        </Drawer>
      </div>
    );
  }
}

export default PersonnelLists;
