

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DepartmentTree from './DepartmentTree';
import DepartmentDrawer from './Drawers/DepartmentDrawer';
import ExamineDrawer from './Drawers/ExamineDrawer';
import DepartmentStation from './PersonnelList/DepartmentStation';
import ListSearch from './PersonnelList/ListSearch';
import List from './PersonnelList/List';
import { ListDepartmentName } from './PersonnelList/PureFunc';
import styles from './main.scss';

class PersonnelMain extends Component {
  static propTypes = {
    showPersonnelDrawer: PropTypes.bool,
    departmentDrawerKey: PropTypes.string,
    changeStore: PropTypes.func,
  }

  // 注: pageKey: 'list', // list列表-addPersonnel添加人员-editPersonnel编辑人员-detailPersonnel人员信息详情
  toExamine = () => {
    this.props.changeStore({ showPersonnelDrawer: true });
  }
  testCloseUserExamine = () => {
    this.props.changeStore({ showPersonnelDrawer: false });
  }

  render(){
    return (
      <div className={styles.personnelMain}>
        <div className={styles.mainContent}>
          <DepartmentTree {...this.props} />
          <div className={styles.personnelList}>
            <ListDepartmentName {...this.props} />
            <DepartmentStation {...this.props} />
            <ListSearch {...this.props} />
            <List {...this.props} />
            <button onClick={this.toExamine}>用户审核抽屉</button>
          </div>
          <ExamineDrawer {...this.props} />
          <DepartmentDrawer {...this.props} />
        </div>
      </div>
    );
  }
}

export default PersonnelMain;
