

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import UserSearch from './UserSearch';
import UserList from './UserList';
import styles from './userList.scss'

//部门主页面。部门查询组件，分页及表格组件；
class UserMain extends Component {
  static propTypes = {
  }

  constructor(props){
    super(props);
  }
  
  render(){
    return (
      <div className={styles.userMain}>
        <UserSearch {...this.props} />    
        <UserList {...this.props} />    
      </div>
    )
  }
}

export default UserMain;
