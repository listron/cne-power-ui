import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './stationStyle.scss';

export default class AnimationBox extends Component {

  static propTypes = {
    active: PropTypes.string,
    children: PropTypes.array,
    changeStore: PropTypes.func,
  }

  toLost = () => {
    const { active, changeStore } = this.props;
    if (active === 'lost') {
      return;
    }
    changeStore({ active: 'lost' });
  }

  toStop = () => {
    const { active, changeStore } = this.props;
    if (active === 'stop') {
      return;
    }
    changeStore({ active: 'stop' });
  }

  toCurve = () => {
    const { active, changeStore } = this.props;
    if (active === 'curve') {
      return;
    }
    changeStore({ active: 'curve' });
  }

  render() {
    const { children, active } = this.props;
    return (
      <div className={styles.animationBox}>
        {children}
        <div className={styles.sideToggle}>
          <span
            className={`${styles.eachTab} ${active === 'lost' ? styles.active : null}`}
            onClick={this.toLost}
          >损失根源分析</span>
          <span
            className={`${styles.eachTab} ${active === 'stop' ? styles.active : null}`}
            onClick={this.toStop}
          >停机数据分析</span>
          <span
            className={`${styles.eachTab} ${active === 'curve' ? styles.active : null}`}
            onClick={this.toCurve}
          >功率曲线分析</span>
        </div>
      </div>
    );
  }
}

