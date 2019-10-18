import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Icon, Button, Radio, Table } from 'antd';
import styles from './workPage.scss';
import { dataFormats } from '@utils/utilFunc';

class PlanList extends PureComponent {

  static propTypes = {
    theme: PropTypes.string,

  };

  constructor(props){
    super(props);
    const planMonth = moment().format('YYYY-MM');
    this.state = {
      planMonth,
      datesInfo: this.getMonthDatesInfo(planMonth),
    };
  }

  weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

  onAdd = () => {
    console.log('add plan');
  }

  getMonthDatesInfo = (month) => { // weekdays中, 周日为一周的起始
    if (!month || !moment(month).isValid()) {
      return [];
    }
    const datesInfo = [];
    const [monthStart, monthEnd] = [moment(month).startOf('month'), moment(month).endOf('month')];
    const startDate = monthStart.day(0); // 月初日期所在周的周日为起点
    const endDate = monthEnd.day(6); // 月末所在周的周六为终点
    while(!startDate.isAfter(endDate, 'd')){
      datesInfo.push(startDate.format('YYYY-MM-DD'));
      startDate.add(1, 'd');
    }
    return datesInfo;
  }

  checkPreMonth = () => {
    console.log('上一个月');
  }

  checkNextMonth = () => {
    console.log('下一个月');
  }

  render(){
    const { theme } = this.props;
    const { planMonth, datesInfo } = this.state;
    const monthReduceUnable = moment(planMonth).isSame(moment(), 'M'); // 当前月不可往前选月
    // console.log(planMonth, monthReduceUnable)
    // 不属于本月的日期: 禁止选择灰色不触发, 本月日期: hover浅色, 选中深色, 默认无色
    return (
      <div className={`${styles.planList} ${styles[theme]}`}>
        <div className={styles.topPlanHandle}>
          <Button className={styles.addPlanBtn} type="add" onClick={this.onAdd} >
            <i>+</i>
            <span className={styles.addPlanBtnText}>添加计划</span>
          </Button>
          <span className={styles.monthHandler}>
            <Icon
              type="left" className={styles.monthIcon}
              style={monthReduceUnable && {
                cursor: 'not-allowed',
                color: '#999',
              }}
              onClick={!monthReduceUnable ? this.checkPreMonth : null}
            />
            <span className={styles.monthText}>{moment(planMonth).format('YYYY年M月')}</span>
            <Icon className={styles.monthIcon} type="right" onClick={this.checkNextMonth} />
          </span>
        </div>
        <div className={styles.datesList}>
          <div className={styles.weekTop}>
            {this.weekdays.map(e => (
              <span className={styles.eachWeekdays} key={e}>{e}</span>
            ))}
          </div>
          <div className={styles.datesBottom}>
            {datesInfo.map(e => (
              <span
                className={styles.eachDate}
                key={e}
                style={{flexBasis: '14%'}}
              >
                {moment(e).format('D')}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default PlanList;
