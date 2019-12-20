import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Select, Switch } from 'antd';
import uiColors from '@constants/ui.js';
import styles from './curve.scss';
const { Option } = Select;

class DevicesCheckTime extends Component {

  static propTypes = {
    curveTopStringify: PropTypes.string,
    curveAllDevice: PropTypes.array,
    curveCheckedDevice: PropTypes.array,
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
    const { curveCheckedDevice } = this.props;
    const isDeviceHide = curveCheckedDevice.includes(device);
    if (isDeviceHide) {
      this.props.changeStore({ curveCheckedDevice: curveCheckedDevice.filter(e => e !== device) });
    } else {
      this.props.changeStore({ curveCheckedDevice: [...curveCheckedDevice, device] });
    }
  }

  onAllChange = (checked) => {
    const { curveAllDevice } = this.props;
    this.props.changeStore({ curveCheckedDevice: checked ? curveAllDevice : [] });
  }

  render() {
    const { curveDevicesTime, curveAllMonths, curveAllDevice, curveCheckedDevice } = this.props;
    const theoryDevice = [], actualDevice = [];
    curveAllDevice.forEach(e => { // 将所有设备分拆未理论和实际， 用于颜色渲染
      (e.includes('理论功率曲线') ? theoryDevice : actualDevice).push(e);
    });
    return (
      <section className={styles.timeSelector}>
        <h3 className={styles.timeTitle}>切换月份</h3>
        <Select
          allowClear={false}
          onChange={this.selectMonth}
          placeholder="请选择月份"
          style={{ width: '120px', marginBottom: '12px' }}
          value={curveDevicesTime}
        >
          {curveAllMonths.map(e => (
            <Option key={e}>{e}</Option>
          ))}
        </Select>
        <ul className={styles.deviceList}>
          {curveAllDevice.map((e) => {
            const active = curveCheckedDevice.includes(e);
            const isTheory = e.includes('理论功率曲线');
            const lineIndex = (isTheory ? theoryDevice : actualDevice).indexOf(e);
            const lineColor = uiColors[isTheory ? 'mainColors' : 'outputColors'][lineIndex];
            const backgroundColor = active ? lineColor : '#fff';
            const border = active ? `1px solid ${lineColor}` : '1px solid rgb(238,238,238)';
            const color = active ? '#353535' : '#d4d4d4';
            return (
              <li
                className={styles.device}
                key={e}
                onClick={() => this.checkDevice(e)}
              >
                <span className={styles.round} style={{ backgroundColor, border }} />
                <span className={styles.deviceText} title={e} style={{ color }}>{e}</span>
              </li>
            );
          })}
        </ul>
        <div className={styles.allHandler}>
          <Switch
            onChange={this.onAllChange}
            checked={curveCheckedDevice.length > 0}
          />
          <span className={styles.allHandlerText}>
            全部{curveCheckedDevice.length === 0 ? '隐藏' : '显示'}
          </span>
        </div>
      </section>
    );
  }
}

export default DevicesCheckTime;

