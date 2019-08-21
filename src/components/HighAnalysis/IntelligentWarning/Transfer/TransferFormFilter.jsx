import React, { Component } from "react";
import PropTypes from 'prop-types';
import styles from './transferForm.scss';
import { Input, Button } from 'antd';
import FilterCondition from '../../../Common/FilterCondition/FilterCondition';

class TransferFormFilter extends Component {
  static propTypes = {
    getTransferFormStatistic: PropTypes.func,
    getTransferForm: PropTypes.func,
    onSearch: PropTypes.func,
    pageSize: PropTypes.number,
    pageNum: PropTypes.number,
    warningStatus: PropTypes.string,
    warningType: PropTypes.string,
    deviceTypeCode: PropTypes.array,
    warningTypeStatus: PropTypes.string,
    deviceTypes: PropTypes.array,
    warningLevel: PropTypes.array,
    rangTime: PropTypes.array,
    stationCodes: PropTypes.array,
    orderField: PropTypes.string,
    orderCommand: PropTypes.string,
    deviceName: PropTypes.string,
    durationType: PropTypes.string,
    stations: PropTypes.array,
  }
  constructor(props, context) {
    super(props, context)
    this.state = {
      value: ''
    };
  }

  onChangeFilter = (value) => {
    const { stationCodes, warningLevel, deviceTypeCode, rangTime, deviceName, durationType, warningTypeStatus, warningType } = this.props;
    const params = { stationCodes, warningLevel, warningTypeStatus, warningType, deviceTypeCode, rangTime, deviceName }
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
export default (TransferFormFilter)