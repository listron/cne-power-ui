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
        const { stationCode, warningLevel, stationType, deviceTypeCode, warningConfigName, startTime, deviceName, isTransferWork, isRelieveAlarm, orderField, orderCommand,warningStatus } = this.props;
        const params = { stationCode, warningLevel, stationType, deviceTypeCode, warningConfigName, startTime, deviceName, isTransferWork, isRelieveAlarm, orderField, orderCommand,warningStatus }
        this.props.getRealtimeWarning({ ...params, ...value })
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
        if (this.props.deviceName !== '') {
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
        const { stations, deviceTypes } = this.props;
        return (
            <div className={styles.realTimeWarningFilter}>
                <FilterCondition
                    option={['alarmLevel', 'stationName', 'deviceType', 'time']}
                    stations={stations || []}
                    deviceTypes={deviceTypes || []}
                    onChange={this.onChangeFilter}
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