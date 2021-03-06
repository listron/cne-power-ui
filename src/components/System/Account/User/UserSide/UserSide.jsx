
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './userSide.scss';
import AddUser from './AddUser';
import UserDetail from './UserDetail';
import EditUser from './EditUser';
import InviteUser from './InviteUser';
import Footer from '../../../../Common/Footer';

class UserSide extends Component {
  static propTypes = {
    showSidePage: PropTypes.string,
    getRoleAllList: PropTypes.func,
    enterpriseId: PropTypes.string,
  }

  constructor(props){
    super(props);
  }

  render(){
    const { showSidePage } = this.props;
    return (
      <div className={styles.userSide}>
        { showSidePage === 'detail' && <UserDetail {...this.props} /> }
        { showSidePage === 'add' && <AddUser {...this.props} /> } 
        { showSidePage === 'edit' && <EditUser {...this.props} /> }
        { showSidePage === 'invite' && <InviteUser {...this.props} /> }
        <Footer />
      </div>
    )
  }
}

export default UserSide;
