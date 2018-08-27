import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input, Button } from 'antd';
import styles from './deviceNameSearch.scss';

class DeviceNameSearch extends Component {
  static propTypes = {
    deviceName: PropTypes.string,
    onSearch: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      value: ''
    };
  }

  onSearch = () => {
    const value = this.state.value;
    this.props.onSearch({
      deviceName: value
    });
  }

  onChange = (e) => {
    this.setState({
      value: e.target.value
    });
  }

  onReset = () => {
    this.setState({
      value: ''
    });
    if(this.props.deviceName !== '') {
      this.props.onSearch({
        deviceName: ''
      });
    }
  }


  render() {
    return (
      <div className={styles.deviceNameSearch}>
        <span>设备名称</span>
        <Input className={styles.deviceName} value={this.state.value} placeholder="请输入..." onChange={this.onChange} />
        <Button onClick={this.onSearch}>查询</Button>
        {this.state.value!==''&& <span onClick={this.onReset}>重置</span>}
      </div>
    );
  }
}

export default DeviceNameSearch;