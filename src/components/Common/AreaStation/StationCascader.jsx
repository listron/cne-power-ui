
import React, { Component } from 'react';
import { Cascader } from 'antd';
import styles from './style.scss';
import PropTypes from 'prop-types';

class StationCascader extends Component {
  static propTypes = {
    data: PropTypes.array,
    onChange: PropTypes.func,
  }

  static defaultProps = {
    data: [],
  }

  render() {
    const { data } = this.props;
    const options = [];
    return (
      <Cascader options={options} onChange={this.props.onChange} />
    );
  }
}
export default StationCascader;
