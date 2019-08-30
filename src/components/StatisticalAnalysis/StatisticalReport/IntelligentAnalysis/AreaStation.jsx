import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './intelligentAnalysis.scss';
import AreaStationSearch from './AreaStationSearch';
import AreaStationReport from './AreaStationReport';

class AreaStation extends Component {
  static propTypes = {
    reportShow: PropTypes.bool,
    theme: PropTypes.string,
  }

  render() {
    const { reportShow, theme } = this.props;
    return (
      <div className={`${styles.areaStation} ${styles[theme]}`}>
        <AreaStationSearch {...this.props} />
        {reportShow ? <AreaStationReport {...this.props} /> : <div className={styles.nodata} ><img src="/img/nodata.png" /></div>}
      </div>
    );
  }
}

export default AreaStation;
