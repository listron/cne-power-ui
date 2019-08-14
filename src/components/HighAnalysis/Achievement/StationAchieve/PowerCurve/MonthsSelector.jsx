import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { DatePicker, Switch } from 'antd';
import styles from './curve.scss';

class MonthsSelector extends Component {

  static propTypes = {
    // curveTopStringify: PropTypes.string,
    // curveDevicesTime: PropTypes.string,
    // getCurveDevicesAep: PropTypes.func,
    // getCurveDevicesPsd: PropTypes.func,
    // changeStore: PropTypes.func,
    curveCheckedMonths: PropTypes.array, // 环比分析各月选中时间
    curveAllMonths: PropTypes.array, // 环比分析所有月
  }

  monthColors = [
    'rgb(80,227,194)', 'rgb(126,211,33)', 'rgb(184,233,134)', 'rgb(160,255,235)',
    'rgb(255,108,238)', 'rgb(159,152,255)', 'rgb(255,120,120)', 'rgb(255,0,128)',
    'rgb(255,0,0)', 'rgb(255,144,0)', 'rgb(255,197,129)', 'rgb(255,253,0)',
  ]

  monthCheck = (month) => {
    console.log(month);
  }

  onAllChange = (checked) => {
    console.log(checked);
    // const { curveTopStringify } = this.props;
    // const searchParam = JSON.parse(curveTopStringify) || {};
    // const param = {
    //   stationCodes: [searchParam.searchCode],
    //   startTime: stringValue,
    //   endTime: stringValue,
    //   deviceFullcodes: searchParam.searchDevice,
    // };
    // this.props.changeStore({ curveDevicesTime: stringValue });
    // this.props.getCurveDevicesAep(param);
    // this.props.getCurveDevicesPsd(param);
  }

  getColorStyle = (index, curveAllMonths, curveCheckedMonths) => {
    const colorIndex = index % (curveAllMonths.length + 1);
    const active = curveCheckedMonths.includes(curveAllMonths[index]);
    return {
      backgroundColor: active ? this.monthColors[colorIndex] : '#fff',
      border: active ? `1px solid ${this.monthColors[colorIndex]}` : '1px solid rgb(238,238,238)',
    };
  }

  render() {
    const { curveCheckedMonths, curveAllMonths } = this.props;

    return (
      <section className={styles.timeSelector}>
        <h3 className={styles.timeTitle}>显示月份</h3>
        <div>
          {curveCheckedMonths.map((e, i) => (<div key={e} onClick={() => this.monthCheck(e)}>
            <span style={this.getColorStyle(i, curveAllMonths, curveCheckedMonths)} />
            <span>{e}</span>
          </div>))}
        </div>
        <Switch onChange={this.onAllChange} checked={curveCheckedMonths.length === curveAllMonths.length} />
      </section>
    );
  }
}

export default MonthsSelector;

