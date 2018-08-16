import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'antd';
import styles from './alarmFilter.scss';
const CheckboxGroup = Checkbox.Group;

class AlarmLevelFilter extends Component {
  static propTypes = {
    warningConfigName: PropTypes.string,
    onChangeFilter: PropTypes.func,
  }

  constructor(props) {
    super(props);
  }

  onChange = (value) => {
    this.props.onChangeFilter({
      warningConfigName: value.join(',')
    });
  }

  onReset = () => {
    this.props.onChangeFilter({
      warningConfigName: ''
    });
  }

  render() {
    const { warningConfigName } = this.props;
    const options = [{label:'事件告警',value:'事件告警'}]
    return (
      <div className={styles.alarmFilterItem}>
        <span onClick={this.onReset} >不限</span>
        <CheckboxGroup options={options} value={warningConfigName.split(',')} onChange={this.onChange} />
      </div>
    );
  }
}

export default AlarmLevelFilter;