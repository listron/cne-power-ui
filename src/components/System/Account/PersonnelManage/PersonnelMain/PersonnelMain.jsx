

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Drawer } from 'antd';
import DepartmentTree from './DepartmentTree';
import DepartmentDrawer from './Drawers/DepartmentDrawer';
// import UserList from './UserList';
// import Footer from '../../../../Common/Footer';
import styles from './main.scss';

class PersonnelMain extends Component {
  static propTypes = {
    showPersonnelDrawer: PropTypes.bool,
    departmentDrawerKey: PropTypes.string,
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
  testCloseUserExamine = () => {
    this.props.changeStore({ showPersonnelDrawer: false });
  }


  hideDepartmentDrawer = () => {
    this.props.changeStore({ departmentDrawerKey: 'hide' });
  }

  render(){
    const { showPersonnelDrawer, departmentDrawerKey, changeStore } = this.props;
    return (
      <div className={styles.personnelMain}>
        <div className={styles.mainContent}>
          <DepartmentTree {...this.props} />
          <div className={styles.personnelList}>
            <button onClick={this.toTestDetail}>展示详情</button>
            <button onClick={this.toTestEdit}>编辑用户</button>
            <button onClick={this.toTestAdd}>新增用户</button>
            <div>部门名称de展示</div>
            <div>部门的负责电站展示</div>
            <div>部门用户搜索条</div>
            <div>用户列表表格</div>
            <div>当前选中项 取消选择 请选择同意状态下的列表项，进行操作</div>
            <button onClick={this.toExamine}>用户审核抽屉</button>
          </div>
          <Drawer
            title="用户审核抽屉"
            placement="right"
            onClose={this.testCloseUserExamine}
            visible={showPersonnelDrawer}
            getContainer={false}
            style={{ position: 'absolute' }}
          >
            <p>用户审核的相关表单内容</p>
          </Drawer>
          <DepartmentDrawer departmentDrawerKey={departmentDrawerKey} changeStore={changeStore} />
        </div>
      </div>
    );
  }
}

export default PersonnelMain;
