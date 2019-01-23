import React, { Component } from "react";
import PropTypes from 'prop-types';
import styles from './realTimeWarning.scss';
import { Input, Button } from 'antd';
import FilterCondition from '../../../Common/FilterCondition/FilterCondition';


class RealTimeWarningFilter extends Component {
  static propTypes = {
    history: PropTypes.object,
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
    const searchInfo = this.props.history.location.search;//拿到路径中的电站编码
    const stationCode = searchInfo.substring(searchInfo.indexOf('=') + 1);
    const { stations, deviceTypes, } = this.props;
    return (
      <div className={styles.realTimeWarningFilter}>
        <FilterCondition
          option={['alarmLevel','stationType', 'stationName', 'deviceType', 'rangeTime']}
          stations={stations || []}
          deviceTypes={deviceTypes || []}
          onChange={this.onChangeFilter}
          defaultValue={{
            stationCodes:[+stationCode],
          }}
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