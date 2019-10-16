import React from 'react';
import styles from './timeSelect.scss';
import PropType from 'prop-types';
import moment from 'moment';

class TimeSelect extends React.PureComponent {
  static propsType = {


  }

  // 需要的功能
  //  1 时间选择 不是固定的 label
  // 传回的是什么字段 time:{type:类型,}

  static defaultProps = {
    timerText: '统计时间选择',
    showHourPick: true, //  分时
    showMonthPick: true, // 按日
    showDayPick: true, // 按月
    value: {
      timeStyle: 'month',
      startTime: moment().format('YYYY-MM-DD'), // 默认今年
      endTime: moment().format('YYYY-MM-DD'),
    },
  }

  constructor() {
    super();
  }

  render() {
    return (
      <div className={styles.timeSelectWrap}>

      </div>
    );
  }

}

export default TimeSelect;
