

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import UserSearch from './UserSearch';
import UserList from './UserList';
import styles from './userList.scss';

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
