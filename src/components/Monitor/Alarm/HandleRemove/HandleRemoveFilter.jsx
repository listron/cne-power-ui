import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input, Button } from 'antd';
import styles from './handleRemove.scss';
import FilterCondition from '../../../Common/FilterCondition/FilterCondition';

class HandleRemoveFilter extends Component {
  static propTypes = {
    theme: PropTypes.string,
  }
  constructor(props, context) {
    super(props, context);
    this.state = {
      value: '',
    };
  }

  onChangeFilter = (value) => {
    const { stationCodes, warningLevel, stationType, deviceTypeCode, rangTime, deviceName, durationType, orderField, orderCommand, warningTypeStatus, warningType } = this.props;
    const params = { stationCodes, warningLevel, stationType, warningTypeStatus, warningType, deviceTypeCode, rangTime, orderField, orderCommand };
    // this.props.getRealtimeWarning({ ...params, ...value })
    this.props.onSearch({ ...params, ...value });
  }

  onChange = (e) => {
    this.setState({
      value: e.target.value,
    });
  }

  onReset = () => {
    this.setState({
      value: '',
    });
    if (this.props.deviceName) {
      this.props.onSearch({
        deviceName: '',
      });
    }
  }
  onSearch = () => {
    const value = this.state.value;
    this.props.onSearch({
      deviceName: value,
    });
  }
  render() {
    const { stations, deviceTypes, theme } = this.props;
    return (
      <div className={styles.realTimeWarningFilter}>
        <FilterCondition
          option={['alarmLevel', 'stationType', 'stationName', 'deviceType', 'rangeTime']}
          stations={stations || []}
          deviceTypes={deviceTypes || []}
          onChange={this.onChangeFilter}
          theme={theme}
        />
        <div className={styles.deviceNameSearch}>
          <span>设备名称</span>
          <Input className={styles.deviceName} value={this.state.value} placeholder="请输入..." onChange={this.onChange} />
          <Button onClick={this.onSearch}>查询</Button>
          {this.state.value !== '' && <span onClick={this.onReset}>重置</span>}
        </div>
      </div>
    );
  }
}
export default (HandleRemoveFilter);
