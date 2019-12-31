import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from './eventAnalysis.scss';

class ChartLine extends PureComponent {

  static propTypes = {
    eventAnalysisInfo: PropTypes.object,
  };

  render(){
    const { eventAnalysisInfo } = this.props;
    const { period = [], data = [] } = eventAnalysisInfo || {};
    return (
      <div className={styles.analysisChart}>
        {/* <div>
          <span>告警时段</span>

        </div> */}
        <div ref={(ref) => { this.lineRef = ref; } } />
      </div>
    );
  }
}

export default ChartLine;


