import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'antd';
import styles from './defectFilter.scss';
const CheckboxGroup = Checkbox.Group;

class DeviceTypeFilter extends Component {
  static propTypes = {
    deviceTypes: PropTypes.array,
    deviceTypeCode: PropTypes.string,
    changeDefectStore: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      
    };
  }

  onDeviceTypeSelect = (deviceTypeCode) => {
    this.props.changeDefectStore({deviceTypeCode});
  }

  resetDevieType = () => {
    this.props.changeDefectStore({deviceTypeCode: ''});
  }

  render() {
    const { deviceTypes, deviceTypeCode } = this.props;
    const deviceTypeOptions = deviceTypes.map(e=>({
      label: e.deviceTypeName,
      value: e.deviceTypeCode
    }))
    return (
      <div className={styles.deviceTypeFilter}>
        <span onClick={this.resetDevieType} >不限</span>
        <CheckboxGroup options={deviceTypeOptions} value={deviceTypeCode} onChange={this.onDeviceTypeSelect} />
      </div>
    );
  }

}

export default DeviceTypeFilter;