
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './deviceSide.scss';
import AddDevice from './AddDevice/AddDevice';
import DetailDevice from './DetailDevice/DetailDevice';
import EditDevice from './EditDevice/EditDevice';

import Footer from '../../../../components/Common/Footer';

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
    const { showSidePage,queryParams } = this.props;
    return (
      <div className={styles.deviceSide}>
        { showSidePage === 'detail' && <DetailDevice {...this.props}  /> }
        { showSidePage === 'add' && <AddDevice {...this.props} /> } 
        { showSidePage === 'edit' && <EditDevice {...this.props} /> }
      
       
      </div>
    )
  }
}

export default UserSide;
