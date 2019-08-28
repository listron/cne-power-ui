import React, { Component } from "react";
import styles from './realTimeWarning.scss';
import { Input, Button } from 'antd';

import FilterCondition from '../../../Common/FilterCondition/FilterCondition';



class RealTimeWarningFilter extends Component {
  static propTypes = {
  }
  constructor(props, context) {
    super(props, context)
    this.state = {
      value: ''
    };
  }

  onChangeFilter = (value) => {
    const { stationCodes, warningLevel, deviceTypeCode, rangTime, deviceName, durationType, orderField, orderCommand, warningTypeStatus, warningType } = this.props;
    const params = { stationCodes, warningLevel, warningTypeStatus, warningType, deviceTypeCode, rangTime, orderField, orderCommand }
    // this.props.getRealtimeWarning({ ...params, ...value })
    this.props.onSearch({ ...params, ...value })
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
    if (this.props.deviceName) {
      this.props.onSearch({
        deviceName: ''
      });
    }
  }
  onSearch = () => {
    const value = this.state.value;
    this.props.onSearch({
      deviceName: value
    });
  }

  render() {
    const { stations, deviceTypes, theme } = this.props;
    return (
      <div className={styles.realTimeWarningFilter}>
        <FilterCondition
          option={['warningLevel', 'stationName', 'deviceType', 'rangeTime']}
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
    )
  }
}
export default (RealTimeWarningFilter)