import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { DatePicker } from 'antd';
import { dataFormats } from '@utils/utilFunc';
import styles from './station.scss';
const { MonthPicker } = DatePicker;

class StationDates extends PureComponent{
  static propTypes = {
    month: PropTypes.string,
    stationDatesRate: PropTypes.array,
    // history: PropTypes.object,
    changeOverviewStore: PropTypes.func,
  }

  rateLevel = [
    { text: '0% ~ 20%', color: '#3b85d5' },
    { text: '20% ~ 40%', color: '#599fe7' },
    { text: '40% ~ 60%', color: '#8fc6f6' },
    { text: '60% ~ 80%', color: '#abd8fc' },
    { text: '80% ~ 100%', color: '#e2f2fb' },
  ]

  getMonthDatesInfo = (month) => {
    if (!month || !moment(month).isValid()) {
      return [];
    }
    const datesInfo = [];
    const [monthStart, monthEnd] = [moment(month).startOf('M'), moment(month).endOf('M')];
    const startDate = monthStart.day() === 1 ? monthStart : monthStart.day(1 - 7); // 月初非周一 => 找到上一个周一为开始
    const endDate = monthEnd.day() === 0 ? monthEnd : monthEnd.day(0 + 7); // 月末非周日 => 找到下一个周日为结束
    while(!startDate.isAfter(endDate, 'd')){
      datesInfo.push(startDate.format('YYYY-MM-DD'));
      startDate.add(1, 'd');
    }
    return datesInfo;
  }

  monthCheck = (monthMoment, monthStr) => { // 切换日期
    console.log(monthMoment, monthStr);
  }

  clickDate = (e) => {
    console.log(e.target)
    console.log(e.target.dataset)
    console.log(e.currentTarget)
    console.log(e.currentTarget.dataset)
  }

  render(){
    const { month = [], stationDatesRate = [] } = this.props;
    console.log(stationDatesRate)
    return(
      <div className={styles.dates}>
        <div className={styles.datesTopInfo}>
          <MonthPicker value={month ? moment(month) : null} onChange={this.monthCheck} />
          <span className={styles.ranges}>
            <span className={styles.text}>设备数据完成率平均值</span>
            {this.rateLevel.map(e => (
              <span key={e.text} className={styles.levels} style={{ backgroundColor: e.color }}>{e.text}</span>
            ))}
          </span>
        </div>
        <div className={styles.calendar}>
          <div className={styles.weekdays}>
            {['一', '二', '三', '四', '五', '六', '日'].map(e => (
              <span className={styles.weekdayText} key={e}>{e}</span>
            ))}
          </div>
          <div className={styles.datesList} onClick={this.clickDate}>
            {this.getMonthDatesInfo(month).map(e => {
              const validDate = stationDatesRate.find(rate => moment(rate.date).isSame(e, 'd'));
              const { date, completeRate, stationCode, deviceTypeCode } = validDate || {};
              const rateStr = dataFormats(date, '--', 2, true);
              let backgroundColor = '#f8f8f8';
              rateStr < 0.2 && rateStr >= 0 && (backgroundColor = '#3b85d5');
              rateStr < 0.4 && rateStr >= 0.2 && (backgroundColor = '#599fe7');
              rateStr < 0.6 && rateStr >= 0.4 && (backgroundColor = '#8fc6f6');
              rateStr < 0.8 && rateStr >= 0.6 && (backgroundColor = '#abd8fc');
              rateStr >= 0.8 && (backgroundColor = '#e2f2fb');
              const dayStyle = validDate ? {
                backgroundColor,
                color: '#000',
                cursor: 'pointer',
              } : {};
              return (
                <div className={styles.eachDay} style={{ ...dayStyle }} key={e} data-value={validDate}>
                  <span className={styles.monthDay}>{moment(e).format('D')}</span>
                  {validDate && <span className={styles.rateData}>
                    {dataFormats(rateStr * 100, '--', 2, true)}%
                  </span>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default StationDates;
