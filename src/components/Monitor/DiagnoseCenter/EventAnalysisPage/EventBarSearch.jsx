import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Icon, DatePicker } from 'antd';
import styles from './eventAnalysis.scss';
import moment from 'moment';

class EventBarSearch extends PureComponent {

  static propTypes = {
    analysisEvent: PropTypes.object,
    getEventsAnalysis: PropTypes.func,
  };

  onDateChange = (momentTime, beginTime) => {
    const { analysisEvent } = this.props;
    this.props.getEventsAnalysis({ ...analysisEvent, beginTime });
  }

  prevMonth = () => this.onMonthChange('subtract')

  nextMonth = () => this.onMonthChange('add')

  onMonthChange = (method) => {
    const { analysisEvent } = this.props;
    const { beginTime } = analysisEvent || {};
    const newMonthStr = moment(beginTime)[method](1, 'month').format('YYYY-MM-DD');
    this.props.getEventsAnalysis({ ...analysisEvent, beginTime: newMonthStr });
  }

  render(){
    const { analysisEvent } = this.props;
    const { beginTime } = analysisEvent || {};
    return (
        <div className={styles.analysisBarSearch}>
          <h3 className={styles.searchText}>发电量对比图</h3>
          <div className={styles.searchParts}>
            <span className={styles.barTips}>
              <span className={styles.acValue}>逆变器直流发电量(kWh)</span>
              <span className={styles.theoryValue}>方阵理论发电量(kWh)</span>
              <span className={styles.rateValue}>
                <span className={styles.lineTip}>
                  <span className={styles.line}></span>
                  <span className={styles.rect}></span>
                </span>
                <span>对比差值(%)</span>
              </span>
            </span>
            <span className={styles.dateCheck}>
              <Icon className={styles.leftIcon} type="left" onClick={this.prevMonth} />
              <DatePicker
                value={beginTime? moment(beginTime) : null}
                className={styles.dateSelect}
                onChange={this.onDateChange}
                allowClear={false}
              />
              <Icon className={styles.rightIcon} type="right" onClick={this.nextMonth} />
            </span>
          </div>
        </div>
    );
  }
}

export default EventBarSearch;


