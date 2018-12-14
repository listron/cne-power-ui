
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './cleanStyle.scss';
// import StationManageDetail from './StationManageDetail';
// import StationManageEdit from './StationManageEdit';
import Footer from '../../../Common/Footer';

class CleanWarningSide extends Component {
  static propTypes = {
    showSidePage: PropTypes.string,
  }

  render(){
    const { showSidePage } = this.props;
    return (
      <div className={styles.stationManageSide}>
        相关内容侧边。
        <Footer />
      </div>
    )
  }
}

export default CleanWarningSide;
