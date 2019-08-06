import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './lost.scss';

class LostAnalysis extends Component {

  static propTypes = {
    active: PropTypes.bool,
  }

  render() {
    const { active } = this.props;
    return (
      <div className={`${styles.lostAnalysis} ${styles.eachPage} ${active ? styles.active : styles.inactive}`}>
        <div>
          <div>
            风机pba排名图
          </div>
        </div>
        <div>
          <div>pba趋势图</div>
          <div>损失电量分解图</div>
        </div>
      </div>
    );
  }
}

export default LostAnalysis;

