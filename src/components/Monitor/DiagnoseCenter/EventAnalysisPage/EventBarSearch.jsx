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

  prevDay = () => this.onDayChange('subtract')

  nextDay = () => this.onDayChange('add')

  onDayChange = (method) => {
    const { analysisEvent } = this.props;
    const { beginTime } = analysisEvent || {};
    const newDayStr = moment(beginTime)[method](1, 'day').format('YYYY-MM-DD');
    this.props.getEventsAnalysis({ ...analysisEvent, beginTime: newDayStr });
  }

  disabledDateFunc = (cur) => moment().isBefore(cur, 'day')

  render(){
    const { analysisEvent } = this.props;
    const { beginTime } = analysisEvent || {};
    const forbidNextDay = !moment().isAfter(moment(beginTime), 'day');
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
              <Icon className={styles.leftIcon} type="left" onClick={this.prevDay} />
              <DatePicker
                value={beginTime? moment(beginTime) : null}
                className={styles.dateSelect}
                onChange={this.onDateChange}
                allowClear={false}
                disabledDate={this.disabledDateFunc}
              />
              <Icon
                className={`${styles.rightIcon} ${forbidNextDay ? styles.forbidDay : ''}`}
                type="right"
                onClick={forbidNextDay ? null : this.nextDay}
              />
            </span>
          </div>
        </div>
    );
  }
}

export default EventBarSearch;


