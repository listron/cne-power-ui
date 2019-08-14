import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { DatePicker } from 'antd';
import styles from './curve.scss';
const { MonthPicker } = DatePicker;

class DevicesCheckTime extends Component {

  static propTypes = {
    curveTopStringify: PropTypes.string,
    curveDevicesTime: PropTypes.string,
    getCurveDevicesAep: PropTypes.func,
    getCurveDevicesPsd: PropTypes.func,
    changeStore: PropTypes.func,
  }

  checkMonth = (momentValue, stringValue) => {
    const { curveTopStringify } = this.props;
    const searchParam = JSON.parse(curveTopStringify) || {};
    const param = {
      stationCodes: [searchParam.searchCode],
      startTime: stringValue,
      endTime: stringValue,
      deviceFullcodes: searchParam.searchDevice,
    };
    this.props.changeStore({ curveDevicesTime: stringValue });
    this.props.getCurveDevicesAep(param);
    this.props.getCurveDevicesPsd(param);
  }

  render() {
    const { curveDevicesTime } = this.props;
    return (
      <section className={styles.timeSelector}>
        <h3 className={styles.timeTitle}>切换月份</h3>
        <MonthPicker
          value={moment(curveDevicesTime)}
          onChange={this.checkMonth}
          placeholder="请选择月份"
          allowClear={false}
          style={{width: '120px'}}
        />
      </section>
    );
  }
}

export default DevicesCheckTime;

