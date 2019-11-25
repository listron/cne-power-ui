

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './main.scss';

class PersonnelList extends Component {
  static propTypes = {
    
  }

  render(){
    // const { showSingleAssignModal, selectedDepartment, departmentTree, allBaseUserData, assignUserLoading } = this.props;
    // const { departmentName, parentDepartmentId } = selectedDepartment;
    // const { column, isChecked, tmpInputText, selectedUserRow } = this.state;
    // const parentInfo = ![0, 1].includes(parentDepartmentId) && departmentTree.find(e => e.departmentId === parentDepartmentId);
    // title={
    //   <div className={styles.title}>
    //     <span>分配人员({parentInfo ? `${parentInfo.departmentName} - `: ''}{departmentName})</span>
    //     <Icon className={styles.close} type="close" onClick={this.cancelAssign} />
    //   </div>
    // }
    return (
      <div className={styles.personnelList}>
        <div>选中部门名称</div>
        <div>选中部门对应负责电站</div>
        <div>用户关键字搜索</div>
        <div>添加人员, 操作, 分页器</div>
        <div>表格</div>
        <div>
          <span>
            <span>
              当前选中<span>多少</span>项
            </span>
            <span>取消选择</span>
          </span>
          <span>请选择同一状态下的列表项, 进行操作</span>
        </div>
      </div>
    );
  }
}

export default PersonnelList;
