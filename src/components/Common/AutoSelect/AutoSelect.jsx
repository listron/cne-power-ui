
import React, { Component } from 'react';
import { Select } from 'antd';
import styles from './style.scss';
import PropTypes from 'prop-types';

class AutoSelect extends Component {
  static propTypes = {
    multiple: PropTypes.bool,
    holderText: PropTypes.string,
    data: PropTypes.array,
    checkedList: PropTypes.array,
    onValueCheck: PropTypes.func,
  }

  render() {
    return (
      <div
      />
    );
  }
}
export default AutoSelect;
