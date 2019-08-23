import React from 'react';
import PropTypes from 'prop-types';
import styles from './sequenceStyles.scss';

import SequenceChartContainer from './SequenceChartContainer';
import HandleSeachData from './HandleSeachData';

class SequenceSingleStation extends React.Component {
  static propTypes = {
    theme: PropTypes.string,
  }
  constructor(props, context) {
    super(props, context);
  }
  // componentWillUnmount() {
  //   this.props.resetStore();
  // }
  render() {
    const { theme } = this.props;
    return (
      <div className={`${styles.singleStationBox} ${styles[theme]}`}>
        <HandleSeachData {...this.props} />
        <div className={styles.sequenceBox}>
          <SequenceChartContainer {...this.props} />
        </div>
      </div>
    );
  }
}
export default (SequenceSingleStation);
