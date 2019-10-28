import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import styles from './planModals.scss';

class EachDate extends PureComponent {

  static propTypes = {
    curPlan: PropTypes.object,
    curDate: PropTypes.string,
    planMonth: PropTypes.string,
    activePlanDate: PropTypes.string,
    // theme: PropTypes.string,
    showDatePlanList: PropTypes.func,
  };

  showHandleList = () => {
    const { curPlan } = this.props;
    this.props.showDatePlanList(curPlan);
  }

  render(){
    const { planMonth, activePlanDate, curPlan, curDate } = this.props;
    // 不属于本月的日期: 禁止选择灰色不触发, 本月日期: hover浅色, 选中深色, 默认无色
    const { list = [] } = curPlan || {};
    const dateClassNames = [
      `${styles.eachDate}`,
      `${moment(planMonth).isSame(curDate, 'month') ? '' : styles.limitedDates}`,
      `${moment(activePlanDate).isSame(curDate, 'day') ? styles.activeDate : ''}`,
      `${list.length > 0 ? '' : styles.noPlanDate}`,
    ];
    return (
      <span
        className={dateClassNames.join(' ')}
        onClick={curPlan ? this.showHandleList : null}
      >
        <div className={styles.datesTips}>
          <span className={styles.momentDate}>{moment(curDate).format('D')}</span>
          {moment().isSame(curDate, 'day') && <span className={styles.today}>今天</span>}
        </div>
        {curPlan && <div className={styles.datesPlan}>
          <span className="iconfont icon-jxjh" />
          <span className={styles.planNumber}>{list.length}</span>
        </div>}
      </span>
    );
  }
}

export default EachDate;
