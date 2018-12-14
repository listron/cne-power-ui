

import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import StationManageSearch from './StationManageSearch';
// import StationManageTable from './StationManageTable';
import Footer from '../../../Common/Footer';
import styles from './stationMain.scss'

class CleanWarningMain extends Component { // 电站管理列表页
  static propTypes = {
    
  }

  constructor(props){
    super(props);
  }

  render(){
    return (
      <div className={styles.stationMain}>
        <div className={styles.stationContent}>
          这里是树叶。
        </div>
        <Footer />
      </div>
    )
  }
}

export default CleanWarningMain;
