import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'antd';
import styles from './../filterCondition.scss';

const CheckboxGroup = Checkbox.Group;

class DeviceTypeFilter extends Component {
  static propTypes = {
    deviceTypes: PropTypes.array,
    deviceTypeCode: PropTypes.array,
    onChangeFilter: PropTypes.func,
    theme: PropTypes.string,
  };

  constructor(props) {
    super(props);
  }

  onChange = (value) => {
    this.props.onChangeFilter({
      deviceTypeCode: value,
    });
  };

  onReset = () => {
    this.props.onChangeFilter({
      deviceTypeCode: [],
    });
  };

  render() {
    const { deviceTypes, deviceTypeCode, theme } = this.props;
    const options = deviceTypes.map((item, i) => ({
      label: item.deviceTypeName,
      value: `${item.deviceTypeCode}`,
    }));
    return (
      <div className={`${styles.filterItem} ${styles[theme]}`}>
        <span onClick={this.onReset} className={deviceTypeCode.length === 0 ? styles.selected : styles.all}>不限</span>
        <CheckboxGroup options={options} value={deviceTypeCode} onChange={this.onChange} />
      </div>
    );
  }
}

export default DeviceTypeFilter;
