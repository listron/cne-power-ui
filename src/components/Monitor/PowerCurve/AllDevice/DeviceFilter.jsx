import React, { Component } from "react";
import PropTypes from "prop-types";
import { Select } from 'antd';
import moment from 'moment';
import styles from "./allDeviceCurve.scss";
import StationSelect from '../../../Common/StationSelect';
const { Option } = Select;
class DeviceFilter extends Component {
  static propTypes = {
  }
  constructor(props, context) {
    super(props, context)
  }
  selectStation = (selectedStationInfo) => { // 电站选择。
    const { getStationDeviceTypes } = this.props;
    const { stationCode } = selectedStationInfo[0];
    getStationDeviceTypes({ // 设备类型
      stationCodes: stationCode,
    });
   
  }
  render() {
    const { stationDeviceTypes,stations,stationCode,deviceTypeCode } = this.props;
    return (
      <div className={styles.filterStyle}>
        <div className={styles.searchPart}>
          <div className={styles.stationSelect}>
            <span className={styles.text}>电站名称</span>
            <StationSelect
              data={stations}
              onOK={this.selectStation}
              value={stations.filter(e => e.stationCode === stationCode)}
            />
          </div>
          <div className={styles.typeSelect}>
            <span className={styles.text}>设备类型</span>
            <Select
              style={{ width: '200px' }}
              onChange={this.selectDeviceType}
              value={deviceTypeCode}
              placeholder="请选择设备类型"
              disabled={stationDeviceTypes.length === 0}
            >
              {stationDeviceTypes.map(e => (
                <Option key={e.deviceTypeCode} value={e.deviceTypeCode}>{e.deviceTypeName}</Option>
              ))}
            </Select>
          </div>

        </div>

      </div>
    )
  }
}
export default (DeviceFilter)