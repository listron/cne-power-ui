import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './realTimeWarning.scss';
import { Input } from 'antd';
import CneButton from '@components/Common/Power/CneButton';
import FilterCondition from '../../../Common/FilterCondition/FilterCondition';



class RealTimeWarningFilter extends Component {
  static propTypes = {
    history: PropTypes.object,
    stationTypeCount: PropTypes.string,
  }
  constructor(props, context) {
    super(props, context);
    this.state = {
      value: '',
    };
  }

  onChangeFilter = (value) => {
    const { stationCodes, warningLevel, deviceTypeCode, rangTime, deviceName, durationType, orderField, orderCommand, warningTypeStatus, warningType } = this.props;
    const params = { stationCodes, warningLevel, warningTypeStatus, warningType, deviceTypeCode, rangTime, orderField, orderCommand };
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
    const searchInfo = this.props.history.location.search;//拿到路径中的电站编码
    const stationCode = searchInfo.substring(searchInfo.indexOf('=') + 1);
    const stationCodes = stationCode ? [+stationCode] : null;
    const pathParams = this.props.history.location.state || {};
    const { stationType = '', deviceName = '' } = pathParams;
    const { stations, deviceTypes, stationTypeCount, theme } = this.props;
    const option = stationTypeCount === 'multiple' ? ['alarmLevel', 'stationType', 'stationName', 'deviceType', 'rangeTime'] : ['alarmLevel', 'stationName', 'deviceType', 'rangeTime'];
    return (
      <div className={styles.realTimeWarningFilter}>
        <FilterCondition
          option={option}
          stations={stations || []}
          deviceTypes={deviceTypes || []}
          theme={theme}
          onChange={this.onChangeFilter}
          defaultValue={{
            stationCodes,
            stationType,
          }}
        />

        <div className={styles.deviceNameSearch}>
          <span>设备名称</span>
          <Input className={styles.deviceName} value={this.state.value} placeholder="请输入..." onChange={this.onChange} />
          <CneButton
            lengthMode="short"
            onClick={this.onSearch}
          >
            查询
          </CneButton>
          {this.state.value !== '' && <span onClick={this.onReset}>重置</span>}
        </div>
      </div>
    );
  }
}
export default (RealTimeWarningFilter);
