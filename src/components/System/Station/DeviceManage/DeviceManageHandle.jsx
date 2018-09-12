import React, { Component } from 'react';
import styles from './deviceManage.scss';
import PropTypes from 'prop-types';

class DeviceManageHandle extends Component {
  static propTypes = {
    
  }
  constructor(props) {
    super(props);
    this.state = {
      
    }
  }

  render() {
    return (
      <div className={styles.deviceManageHandle}>
        DeviceManageHandle区域
      </div>
    );
  }
}

export default DeviceManageHandle;
