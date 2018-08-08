
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './userSide.scss';
import AddUser from './AddUser';
import UserDetail from './UserDetail';
import EditUser from './EditUser';
import InviteUser from './InviteUser';

class UserSide extends Component {
  static propTypes = {
    showSidePage: PropTypes.string,
  }

  constructor(props){
    super(props);
  }

  render(){
    const { showSidePage } = this.props;
    console.log(showSidePage);
    return (
      <div className={styles.userSide}>
        { showSidePage === 'detail' && <UserDetail {...this.props} /> }
        { showSidePage === 'add' && <AddUser {...this.props} /> }
        { showSidePage === 'edit' && <EditUser {...this.props} /> }
        { showSidePage === 'invite' && <InviteUser {...this.props} /> }
      </div>
    )
  }
}

export default UserSide;
