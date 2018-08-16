import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'antd';
import styles from './alarmFilter.scss';
const CheckboxGroup = Checkbox.Group;

class AlarmLevelFilter extends Component {
  static propTypes = {
    warningLevel: PropTypes.string,
    onChangeFilter: PropTypes.func,
  }

  constructor(props) {
    super(props);
  }

  onChange = (value) => {
    this.props.onChangeFilter({
      warningLevel: value.join(',')
    });
  }

  onReset = () => {
    this.props.onChangeFilter({
      warningLevel: ''
    });
  }

  render() {
    const { warningLevel } = this.props;
    const levels = ['一级','二级','三级','四级'];
    const options = levels.map((e,i)=>({
      label: e,
      value: `${i+1}`
    }))
    return (
      <div className={styles.alarmFilterItem}>
        <span onClick={this.onReset} >不限</span>
        <CheckboxGroup options={options} value={warningLevel.split(',')} onChange={this.onChange} />
      </div>
    );
  }
}

export default AlarmLevelFilter;