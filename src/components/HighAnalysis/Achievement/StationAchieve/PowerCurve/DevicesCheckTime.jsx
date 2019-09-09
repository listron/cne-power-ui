import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Select, Switch } from 'antd';
import { outputColors } from '@constants/ui.js';
import styles from './curve.scss';
const { Option } = Select;

class DevicesCheckTime extends Component {

  static propTypes = {
    curveTopStringify: PropTypes.string,
    curveDevices: PropTypes.object,
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
    } catch (error) { console.log(error); }
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

  checkDevice = (device) => {
    console.log(device)
  }

  onAllChange = () => {
    console.log('all change');
  }

  render() {
    const { curveDevicesTime, curveAllMonths, curveDevices } = this.props;
    const { actual = [], theory = [] } = curveDevices;
    const totalCurveData = actual.concat(theory.map(e => ({
      deviceName: '理论功率',
      ...e,
    })));
    return (
      <section className={styles.timeSelector}>
        <h3 className={styles.timeTitle}>切换月份</h3>
        <Select
          allowClear={false}
          onChange={this.selectMonth}
          placeholder="请选择月份"
          style={{width: '120px', marginBottom: '12px'}}
          value={curveDevicesTime}
        >
          {curveAllMonths.map(e => (
            <Option key={e}>{e}</Option>
          ))}
        </Select>
        <ul className={styles.deviceList}>
          {totalCurveData.map((e, index) => {
            // const colorIndex = index % this.monthColors.length;
            // const active = curveCheckedMonths.includes(e);
            // const backgroundColor = active ? this.monthColors[colorIndex] : '#fff';
            // const border = active ? `1px solid ${this.monthColors[colorIndex]}` : '1px solid rgb(238,238,238)';
            // const color = active ? '#666' : '#dfdfdf';
            return (
              <li
                className={styles.device}
                key={e.deviceFullcode}
                onClick={() => this.checkDevice(e)}
              >
                <span className={styles.round} />
                <span className={styles.monthText}>{e.deviceName}</span>
              </li>
            );
          })}
        </ul>
        <div className={styles.allHandler}>
          <Switch
            onChange={this.onAllChange}
            checked={[].length > 0}
          />
          <span className={styles.allHandlerText}>
            全部{[].length === 0 ? '隐藏' : '显示'}
          </span>
        </div>
      </section>
    );
  }
}

export default DevicesCheckTime;

