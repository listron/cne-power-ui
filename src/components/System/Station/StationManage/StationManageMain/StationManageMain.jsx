

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import StationManageSearch from './StationManageSearch';
import StationManageTable from './StationManageTable';
import Footer from '../../../../Common/Footer';
import styles from './stationMain.scss'

class StationManageMain extends Component { // 电站管理列表页
  static propTypes = {

  }

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={styles.stationMain}>
        <div className={styles.stationContent}>
          {/* <StationManageSearch {...this.props} />     */}
          <StationManageTable {...this.props} />
        </div>
        <Footer />
      </div>
    )
  }
}

export default StationManageMain;
