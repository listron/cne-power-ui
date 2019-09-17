import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { DatePicker } from 'antd';
import styles from './station.scss';
const { MonthPicker } = DatePicker;

class StationDates extends PureComponent{
  static propTypes = {
    month: PropTypes.string,
    stationDatesRate: PropTypes.array,
    // history: PropTypes.object,
    changeOverviewStore: PropTypes.func,
  }

  getMonthDatesInfo = (month) => {
    console.log(moment('moment').isValid())
    console.log(moment('2018-18-11').isValid())
    console.log(moment('2018-10-11').isValid())
    if (!month || !moment(month).isValid()) {
      return [];
    }
    const datesInfo = [];
    const [monthStart, monthEnd] = [moment(month).startOf('M'), moment(month).endOf('M')];
    console.log([monthStart.format('YYYY-MM-DD'), monthEnd.format('YYYY-MM-DD')])
    let startDate = monthStart.day() === 1 ? monthStart : monthStart.day(1 - 7); // 月初非周一 => 找到上一个周一为开始
    const endDate = monthEnd.day() === 0 ? monthEnd : monthEnd.day(0 + 7); // 月末非周日 => 找到下一个周日为结束
    // let index = 0;
    while(startDate.isBefore(endDate, 'd')){
      datesInfo.push(startDate.format('YYYY-MM-DD'));
      startDate.add(1, 'd');
    }
    console.log(datesInfo);
    return datesInfo;
  }

  render(){
    const { month = [], stationDatesRate = [] } = this.props;
    this.getMonthDatesInfo(month)
    return(
      <div className={styles.dates}>
        <div>
          <MonthPicker />
          <span>
            <span>设备数据完成率平均值</span>
            <span>0% ~ 20%</span>
            <span>20% ~ 40%</span>
            <span>40% ~ 60%</span>
            <span>60% ~ 80%</span>
            <span>80% ~ 100%</span>
          </span>
        </div>
        <div>
          各个日期啊
        </div>
      </div>
    );
  }
}

export default StationDates;
