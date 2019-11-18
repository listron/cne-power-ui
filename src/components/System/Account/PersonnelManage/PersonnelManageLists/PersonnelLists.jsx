

import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import UserSearch from './UserSearch';
// import UserList from './UserList';
// import Footer from '../../../../Common/Footer';
import styles from './list.scss';

class PersonnelLists extends Component {
  static propTypes = {
  }

  render(){
    return (
      <div className={styles.personnelLists}>
        主要的用户管理列表页面
      </div>
    );
  }
}

export default PersonnelLists;
