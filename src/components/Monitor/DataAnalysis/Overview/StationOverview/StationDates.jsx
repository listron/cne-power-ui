import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { DatePicker } from 'antd';
import searchUtil from '@utils/searchUtil';
import { dataFormats } from '@utils/utilFunc';
import styles from './station.scss';
const { MonthPicker } = DatePicker;

class StationDates extends PureComponent{
  static propTypes = {
    stationParam: PropTypes.object,
    stationTopData: PropTypes.object,
    stationDatesRate: PropTypes.array,
    history: PropTypes.object,
    changeOverviewStore: PropTypes.func,
    getOverviewDates: PropTypes.func,
    getPoints: PropTypes.func,
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
    const [monthStart, monthEnd] = [moment(month).startOf('month'), moment(month).endOf('month')];
    const startDate = monthStart.day() === 0 ? monthStart.day(1 - 7) : monthStart.day(1); // 月初周日 => 找上周一, 否则本周一
    const endDate = monthEnd.day() === 0 ? monthEnd : monthEnd.day(0 + 7); // 月末非周日 => 下一个周日为结束
    while(!startDate.isAfter(endDate, 'd')){
      datesInfo.push(startDate.format('YYYY-MM-DD'));
      startDate.add(1, 'd');
    }
    return datesInfo;
  }

  monthCheck = (monthMoment, monthStr) => { // 切换日期 => 替换stationParam, 重新getOverviewDates, 替换路径
    const { stationParam, history } = this.props;
    const { stationCode, deviceTypeCode } = stationParam;
    const { pathname, search } = history.location;
    const newParam = {
      stationCode, deviceTypeCode, month: monthStr,
    };
    const newSearch = searchUtil(search).replace({
      station: JSON.stringify(newParam),
    }).stringify();

    this.props.changeOverviewStore({ stationParam: newParam });
    this.props.getOverviewDates(newParam);
    history.push(`${pathname}?${newSearch}`); // 替换station信息
  }

  clickDate = (e) => {
    const { dataset } = e.target;
    const { date } = dataset;
    if (date) {
      const { stationParam, history, stationTopData } = this.props;
      const { stationCode, deviceTypeCode } = stationParam;
      const { pathname, search } = history.location;
      const { pages = '' } = searchUtil(search).parse();
      const allPages = pages.split('_').filter(e => !!e); // 开启的tab页面
      !allPages.includes('device') && allPages.push('device');
      const deviceParam = { // 请求参数
        stationCode,
        deviceTypeCode,
        dateType: 1,
        date,
        pointCodes: [], // 默认所有
      };
      this.props.changeOverviewStore({ // 已经得到的电站基础信息传入设备页 - 减少一次不必要请求
        tab: 'device', // 激活的tab页, station, device, points
        pages: allPages, // 开启的tab页面
        deviceTopData: stationTopData,
        deviceParam, // 请求参数保存
      });
      this.props.getPoints({
        params: {
          stationCode, deviceTypeCode, pointTypes: 'YC,YM',
        },
        actionName: 'afterDeviceTypePointGet',
        resultName: 'devicePointsList',
      });
      const newSearch = searchUtil(search).replace({ // 路径 替换/添加 device信息
        device: JSON.stringify(deviceParam),
        pages: allPages.join('_'), // 激活项添加
        tab: 'device', // 激活页切换
      }).stringify();
      history.push(`${pathname}?${newSearch}`); // 替换station信息
    }
  }

  render(){
    const { stationParam = {}, stationDatesRate = [] } = this.props;
    const { month } = stationParam;
    return(
      <div className={styles.dates}>
        <div className={styles.datesTopInfo}>
          <MonthPicker
            allowClear={false}
            value={month ? moment(month) : null}
            onChange={this.monthCheck}
          />
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
              const { date, completeRate } = validDate || {};
              const rateStr = dataFormats(completeRate, '--', 2, true);
              let backgroundColor = '#f8f8f8';
              rateStr < 20 && rateStr >= 0 && (backgroundColor = '#3b85d5');
              rateStr < 40 && rateStr >= 20 && (backgroundColor = '#599fe7');
              rateStr < 60 && rateStr >= 40 && (backgroundColor = '#8fc6f6');
              rateStr < 80 && rateStr >= 60 && (backgroundColor = '#abd8fc');
              rateStr >= 80 && (backgroundColor = '#e2f2fb');
              const dayStyle = moment(e).isSame(month, 'M') ? {
                backgroundColor,
                color: '#000',
                cursor: 'pointer',
              } : {};
              return (
                <div className={styles.eachDay} style={{ ...dayStyle }} key={e} data-date={date}>
                  <span className={styles.monthDay}>{moment(e).format('D')}</span>
                  {validDate && <span className={styles.rateData}>
                    {dataFormats(rateStr, '--', 2, true)}%
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
