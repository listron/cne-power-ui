import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'antd';
import styles from './alarmFilter.scss';
const CheckboxGroup = Checkbox.Group;

class AlarmLevelFilter extends Component {
  static propTypes = {
    warningConfigName: PropTypes.array,
    onChangeFilter: PropTypes.func,
  }

  constructor(props) {
    super(props);
  }

  onChange = (value) => {
    this.props.onChangeFilter({
      warningConfigName: value
    });
  }

  onReset = () => {
    this.props.onChangeFilter({
      warningConfigName: []
    });
  }

  render() {
    const { warningConfigName } = this.props;
    const options = [{label:'事件告警',value:'事件告警'}]
    return (
      <div className={styles.alarmFilterItem}>
        <span onClick={this.onReset} className={warningConfigName.length===0?styles.selected:styles.all}>不限</span>
        <CheckboxGroup options={options} value={warningConfigName} onChange={this.onChange} />
      </div>
    );
  }
}

export default AlarmLevelFilter;