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

  render(){
    const {  } = this.props;
    const { planMonth, datesInfo } = this.state;
    return (
      <div>
        <div>
          <Button className={styles.addPlan} type="add" onClick={this.onAdd} >
            <i>+</i>
            <span>添加工作记事</span>
          </Button>
          <span>
            <Icon type="left" />
            <span>{planMonth}</span>
            <Icon type="right" />
          </span>
        </div>
        <div>
          <div>
            {this.weekdays.map(e => (
              <span key={e}>{e}</span>
            ))}
          </div>
          <div style={{display: 'flex', flexWrap: 'wrap'}}>
            {datesInfo.map(e => (
              <span key={e} style={{flexBasis: '14%'}}>{e}</span>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default PlanList;
