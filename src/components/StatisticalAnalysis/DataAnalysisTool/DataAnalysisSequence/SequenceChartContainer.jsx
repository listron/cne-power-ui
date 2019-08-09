import React from 'react';
import PropTypes from 'prop-types';
import styles from './sequenceStyles.scss';

class SequenceChartContainer extends React.Component {
  constructor(props, context) {
    super(props, context);
  }
  render() {
    const { deviceList } = this.props;
    return (
      <div className={styles.chartsContainer}>
        {deviceList.map((e, i) => (
          <div className={styles.chartStyle} key={i}>
            <div>
              {e.deviceName}
              <img src={e.likeStatus ? '/img/mark.png' : '/img/unmark.png'} alt="" />
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
