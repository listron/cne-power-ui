import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'antd';
import styles from './alarmFilter.scss';
const CheckboxGroup = Checkbox.Group;

class AlarmLevelFilter extends Component {
  static propTypes = {
    deviceTypes: PropTypes.object,
    deviceTypeCode: PropTypes.string,
    onChangeFilter: PropTypes.func,
  }

  constructor(props) {
    super(props);
  }

  onChange = (value) => {
    this.props.onChangeFilter({
      deviceTypeCode: value.join(',')
    });
  }

  onReset = () => {
    this.props.onChangeFilter({
      deviceTypeCode: ''
    });
  }

  render() {
    const { deviceTypes, deviceTypeCode } = this.props;
    const options = deviceTypes.map((item,i)=>({
      label: item.get('deviceTypeName'),
      value: item.get('deviceTypeCode').toString()
    })).toJS();
    return (
      <div className={styles.alarmFilterItem}>
        <span onClick={this.onReset} >不限</span>
        <CheckboxGroup options={options} value={deviceTypeCode.split(',')} onChange={this.onChange} />
      </div>
    );
  }
}

export default AlarmLevelFilter;