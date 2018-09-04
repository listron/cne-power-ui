

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import UserSearch from './UserSearch';
import UserList from './UserList';
import Footer from '../../../../Common/Footer';
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
        <div className={styles.userMainContent}>
          <UserSearch {...this.props} />    
          <UserList {...this.props} />
        </div>
        <Footer />
      </div>
    )
  }
}

export default UserMain;
