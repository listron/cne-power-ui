import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'antd';
import styles from './alarmFilter.scss';
const CheckboxGroup = Checkbox.Group;

class AlarmLevelFilter extends Component {
  static propTypes = {
    deviceTypes: PropTypes.object,
    deviceTypeCode: PropTypes.array,
    onChangeFilter: PropTypes.func,
  }

  constructor(props) {
    super(props);
  }

  onChange = (value) => {
    this.props.onChangeFilter({
      deviceTypeCode: value
    });
  }

  onReset = () => {
    this.props.onChangeFilter({
      deviceTypeCode: []
    });
  }

  render() {
    const { deviceTypes, deviceTypeCode } = this.props;
    const options = deviceTypes.map((item,i)=>({
      label: item.get('deviceTypeName'),
      value: item.get('deviceTypeCode').toString()
    })).toJS();
    return (
      <div className={styles.deviceTypeFilter}>
        <span onClick={this.onReset} className={deviceTypeCode.length===0?styles.selected:styles.all}>不限</span>
        <CheckboxGroup options={options} value={deviceTypeCode} onChange={this.onChange} />
      </div>
    );
  }
}

export default AlarmLevelFilter;