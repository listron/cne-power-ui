import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Icon, Button, Spin } from 'antd';
import EachDate from './PlanModals/EachDate';
import styles from './workPage.scss';
import { handleRight } from '@utils/utilFunc';
import CneButton from '@components/Common/Power/CneButton';


class PlanList extends PureComponent {

  static propTypes = {
    pageLoading: PropTypes.bool,
    planListLoading: PropTypes.bool,
    planMonth: PropTypes.string,
    activePlanDate: PropTypes.string,
    theme: PropTypes.string,
    stageStations: PropTypes.array,
    planList: PropTypes.array,
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

  showDatePlanList = (curPlan) => {
    const { list = [] } = curPlan || {};
    this.props.changeStore({
      showModal: true, // 弹框
      modalKey: 'handlePlan',
      activePlanDate: curPlan.reportDate,
      datePlans: list.map(e => ({ ...e, key: e.planDetailId })),
    });
  }

  render(){
    const { theme, planMonth, planList, pageLoading, planListLoading } = this.props;
    const { datesInfo } = this.state;
    const addRight = handleRight('workStation_add');
    const monthReduceUnable = moment(planMonth).isSame(moment(), 'M'); // 当前月不可往前选月
    // 不属于本月的日期: 禁止选择灰色不触发, 本月日期: hover浅色, 选中深色, 默认无色
    return (
      <div className={`${styles.planList} ${styles[theme]}`}>
        <div className={styles.topPlanHandle}>
          {addRight ? <CneButton className={styles.addPlanBtn} iconname="icon-newbuilt" lengthMode="short" onClick={this.onAdd} lengthMode="short">添加计划</CneButton> : <span />}
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
          <Spin spinning={planListLoading && !pageLoading}>
            <div className={styles.datesBottom}>
              {datesInfo.map(e => {
                const curPlan = planList.find(m => moment(m.reportDate).isSame(e, 'day'));
                return (
                  <EachDate key={e} {...this.props} curPlan={curPlan} curDate={e} showDatePlanList={this.showDatePlanList} />
                );
              })}
            </div>
          </Spin>
        </div>
      </div>
    );
  }
}

export default PlanList;
