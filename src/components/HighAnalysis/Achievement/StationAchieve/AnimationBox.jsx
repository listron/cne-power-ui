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
          <span onClick={this.toLost}>损失</span>
          <span onClick={this.toStop}>停机</span>
          <span onClick={this.toCurve}>曲线</span>
        </div>
      </div>
    );
  }
}

