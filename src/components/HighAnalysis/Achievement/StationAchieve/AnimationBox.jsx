import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './stationStyle.scss';

export default class AnimationBox extends Component {

  static propTypes = {
    pageName: PropTypes.string,
    children: PropTypes.array,
    changeStore: PropTypes.func,
  }

  toLost = () => {
    const { pageName, changeStore } = this.props;
    if (pageName === 'lost') {
      return;
    }
    changeStore({ pageName: 'lost' });
  }

  toStop = () => {
    const { pageName, changeStore } = this.props;
    if (pageName === 'stop') {
      return;
    }
    changeStore({ pageName: 'stop' });
  }

  toCurve = () => {
    const { pageName, changeStore } = this.props;
    if (pageName === 'curve') {
      return;
    }
    changeStore({ pageName: 'curve' });
  }

  render() {
    const { children, pageName } = this.props;
    return (
      <div className={styles.animationBox}>
        {children}
        <div className={styles.sideToggle}>
          <span
            className={`${styles.eachTab} ${pageName === 'lost' ? styles.active : null}`}
            onClick={this.toLost}
          >损失根源分析</span>
          <span
            className={`${styles.eachTab} ${pageName === 'stop' ? styles.active : null}`}
            onClick={this.toStop}
          >停机数据分析</span>
          <span
            className={`${styles.eachTab} ${pageName === 'curve' ? styles.active : null}`}
            onClick={this.toCurve}
          >功率曲线分析</span>
        </div>
      </div>
    );
  }
}

