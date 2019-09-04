import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import styles from './curve.scss';
const { Option } = Select;

class DevicesCheckTime extends Component {

  static propTypes = {
    curveTopStringify: PropTypes.string,
    curveDevicesTime: PropTypes.string,
    curveAllMonths: PropTypes.array,
    getCurveDevices: PropTypes.func,
    getCurveDevicesAep: PropTypes.func,
    getCurveDevicesPsd: PropTypes.func,
    changeStore: PropTypes.func,
  }

  selectMonth = (curveDevicesTime) => {
    const { curveTopStringify } = this.props;
    let searchParam = {};
    try {
      searchParam = JSON.parse(curveTopStringify) || {};
    } catch (error) { null; }
    const param = {
      stationCodes: [searchParam.code],
      startTime: curveDevicesTime,
      endTime: curveDevicesTime,
      deviceFullcodes: searchParam.device,
    };
    this.props.changeStore({ curveDevicesTime });
    this.props.getCurveDevices(param);
    this.props.getCurveDevicesAep(param);
    this.props.getCurveDevicesPsd(param);
  }

  render() {
    const { curveDevicesTime, curveAllMonths } = this.props;
    return (
      <section className={styles.timeSelector}>
        <h3 className={styles.timeTitle}>切换月份</h3>
        <Select
          allowClear={false}
          onChange={this.selectMonth}
          placeholder="请选择月份"
          style={{width: '120px'}}
          value={curveDevicesTime}
        >
          {curveAllMonths.map(e => (
            <Option key={e}>{e}</Option>
          ))}
        </Select>
      </section>
    );
  }
}

export default DevicesCheckTime;

