import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'antd';
import styles from './defectFilter.scss';
const CheckboxGroup = Checkbox.Group;

class DeviceTypeFilter extends Component {
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
      deviceTypeCode: value.join(','),
    });
  }

  onReset = () => {
    this.props.onChangeFilter({
      deviceTypeCode: '',
    });
  }

  render() {
    const { deviceTypes, deviceTypeCode, theme } = this.props;
    const options = deviceTypes.map((item, i) => ({
      label: item.get('deviceTypeName'),
      value: `${item.get('deviceTypeCode')}`,
    })).toJS();
    const devieceCodeArr = deviceTypeCode === '' ? [] : deviceTypeCode.split(',');
    return (
      <div className={`${styles.filterItem} ${styles[theme]}`}>
        <span onClick={this.onReset} className={deviceTypeCode === '' ? styles.selected : styles.all}>不限</span>
        <CheckboxGroup options={options} value={devieceCodeArr} onChange={this.onChange} />
      </div>
    );
  }
}

export default DeviceTypeFilter;
