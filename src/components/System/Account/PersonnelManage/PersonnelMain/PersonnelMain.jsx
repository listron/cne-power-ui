

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
    departmentDrawerKey: PropTypes.string,
    selectedDepartment: PropTypes.object,
    changeStore: PropTypes.func,
  }

  render(){
    const { selectedDepartment } = this.props;
    const { departmentId } = selectedDepartment;
    return (
      <div className={styles.personnelMain}>
        <div className={styles.mainContent}>
          <DepartmentTree {...this.props} />
          <div className={styles.personnelList}>
          <ListDepartmentName {...this.props} />
          {`${departmentId}` !== '1' && <DepartmentStation {...this.props} />}
            <ListSearch {...this.props} />
            <List {...this.props} />
          </div>
          <ExamineDrawer {...this.props} />
          <DepartmentDrawer {...this.props} />
        </div>
      </div>
    );
  }
}

export default PersonnelMain;
