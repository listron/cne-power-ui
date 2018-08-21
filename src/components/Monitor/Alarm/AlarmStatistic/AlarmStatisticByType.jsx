import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'antd';
import styles from './alarmStatistic.scss';

class AlarmStatisticByType extends Component {
  static propTypes = {
    stationType: PropTypes.string,
  }

  constructor(props) {
    super(props);
  }

  render() {
    return null;
  }
}

export default AlarmStatisticByType;