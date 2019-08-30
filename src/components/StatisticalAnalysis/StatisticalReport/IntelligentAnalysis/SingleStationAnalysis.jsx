import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './intelligentAnalysis.scss';
import SingleStationAnalysisSearch from './SingleStationAnalysisSearch';
import SingleStationAnalysisReport from './SingleStationAnalysisReport';

class SingleStationAnalysis extends Component {
  static propTypes = {
    reportShow: PropTypes.bool,
  }

  render() {
    const { reportShow, theme } = this.props;

    return (
      <div className={`${styles.singleStationAnalysis} ${styles[theme]}`}>
        <SingleStationAnalysisSearch {...this.props} />
        {reportShow ? <SingleStationAnalysisReport {...this.props} /> : <div className={styles.nodata} ><img src="/img/nodata.png" /></div>}
      </div>
    );
  }
}

export default SingleStationAnalysis;
