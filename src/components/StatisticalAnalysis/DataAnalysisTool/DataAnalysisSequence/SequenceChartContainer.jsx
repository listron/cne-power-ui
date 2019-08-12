import React from 'react';
import PropTypes from 'prop-types';
import styles from './sequenceStyles.scss';
import SequenceChart from './SequenceChart';

class SequenceChartContainer extends React.Component {
  constructor(props, context) {
    super(props, context);
  }
  render() {
    const { deviceList, sequenceData } = this.props;
    console.log('sequenceData: ', sequenceData);
    return (
      <div className={styles.chartsContainer}>
        {sequenceData.map((e, i) => (
          <div className={styles.chartStyle} key={i}>
            <div className={styles.sequenceChart} >
              {e.deviceFullCode}
              {/* <img src={e.likeStatus ? '/img/mark.png' : '/img/unmark.png'} alt="" /> */}
              <SequenceChart {...this.props} allChartData={e} index={i} />
            </div>
            <div></div>
          </div>
        ))}
      </div>
    );
  }
}
export default (SequenceChartContainer)
  ;
