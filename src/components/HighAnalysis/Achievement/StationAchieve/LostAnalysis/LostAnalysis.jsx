import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ChartLostRank from './ChartLostRank';
import styles from './lost.scss';

class LostAnalysis extends Component {

  static propTypes = {
    active: PropTypes.bool,
  }

  render() {
    const { active } = this.props;
    const lostRank = [1, 2, 3, 4, 5, 6, 7, 8, 9].map(e => ({
      deviceFullcode: `M${e}M`,
      deviceName: `设备名字${e}`,
      deviceModeName: `modeName${e}`,
      indicatorData: parseInt(Math.random() * 10, 10) * e,
    }));
    const lostRankLoading = false;
    return (
      <div className={`${styles.lostAnalysis} ${styles.eachPage} ${active ? styles.active : styles.inactive}`}>
        <ChartLostRank lostRank={lostRank} lostRankLoading={lostRankLoading} />
        <div>
          <div>pba趋势图</div>
          <div>损失电量分解图</div>
        </div>
      </div>
    );
  }
}

export default LostAnalysis;

