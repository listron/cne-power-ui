import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Icon, Button } from 'antd';
import styles from './workPage.scss';

class PlanList extends PureComponent {

  static propTypes = {
    planMonth: PropTypes.string,
    activePlanDate: PropTypes.string,
    theme: PropTypes.string,
    stageStations: PropTypes.array,
    changeStore: PropTypes.func,
    getPlanList: PropTypes.func,
  };

  constructor(props){
    super(props);
    const planMonth = moment().format('YYYY-MM');
    this.state = {
      datesInfo: this.getMonthDatesInfo(planMonth),
    };
  }

  weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

  onAdd = () => {
    this.props.changeStore({
      showModal: true, // 弹框
      modalKey: 'addPlan',
    });
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

  checkPreMonth = () => { // 上个月
    const { stageStations, planMonth } = this.props;
    const prePlanMonth = moment(planMonth).subtract(1, 'month').format('YYYY-MM');
    this.setState({ datesInfo: this.getMonthDatesInfo(prePlanMonth) });
    this.props.changeStore({ planMonth: prePlanMonth });
    this.props.getPlanList({
      stationCodes: stageStations.map(e => e.stationCode),
      planMonth: prePlanMonth,
    }); // 计划日历
  }

  checkNextMonth = () => { // 下个月
    const { stageStations, planMonth } = this.props;
    const nextPlanMonth = moment(planMonth).add(1, 'month').format('YYYY-MM');
    this.setState({ datesInfo: this.getMonthDatesInfo(nextPlanMonth) });
    this.props.changeStore({ planMonth: nextPlanMonth });
    this.props.getPlanList({
      stationCodes: stageStations.map(e => e.stationCode),
      planMonth: nextPlanMonth,
    }); // 计划日历
  }

  render(){
    const { theme, planMonth, activePlanDate } = this.props;
    const { datesInfo } = this.state;
    const monthReduceUnable = moment(planMonth).isSame(moment(), 'M'); // 当前月不可往前选月
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
              style={monthReduceUnable ? {
                cursor: 'not-allowed',
                color: '#999',
              } : {}}
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
            {datesInfo.map(e => {
              const dateClassNames = [
                `${styles.eachDate}`,
                `${moment(planMonth).isSame(e, 'month') ? '' : styles.limitedDates}`,
                `${moment(activePlanDate).isSame(e, 'day') ? styles.activeDate : ''}`,
                `${styles.noPlanDate}`,
              ];
              return (
                <span
                  className={dateClassNames.join(' ')}
                  key={e}
                >
                  <div className={styles.datesTips}>
                    <span className={styles.momentDate}>{moment(e).format('D')}</span>
                    {moment().isSame(e, 'day') && <span className={styles.today}>今天</span>}
                  </div>
                  <div className={styles.datesPlan}>
                    <span className="iconfont icon-jxjh" />
                    <span className={styles.planNumber}>{moment(e).format('D')}</span>
                  </div>
                </span>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default PlanList;
