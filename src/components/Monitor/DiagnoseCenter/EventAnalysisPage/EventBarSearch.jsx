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

  onDateChange = (momentTime, updateTime) => {
    const { analysisEvent } = this.props;
    this.props.getEventsAnalysis({ ...analysisEvent, updateTime });
  }

  prevDay = () => this.onDayChange('subtract')

  nextDay = () => this.onDayChange('add')

  onDayChange = (method) => {
    const { analysisEvent } = this.props;
    const { eventTime } = analysisEvent || {};
    const newDayStr = moment(eventTime)[method](1, 'day').format('YYYY-MM-DD');
    this.props.getEventsAnalysis({ ...analysisEvent, updateTime: newDayStr });
  }

  disabledDateFunc = (cur) => moment().isBefore(cur, 'day')

  render(){
    const { analysisEvent } = this.props;
    const { eventTime, eventCode } = analysisEvent || {};
    const conversionEfficiency = ['NB1039'].includes(eventCode); // 转换效率偏低事件
    const forbidNextDay = !moment().isAfter(moment(eventTime), 'day');
    return (
        <div className={styles.analysisBarSearch}>
          <div className={styles.searchTop}>
            <h3 className={styles.searchText}>发电量对比图</h3>
            <span className={styles.dateCheck}>
              <Icon className={styles.leftIcon} type="left" onClick={this.prevDay} />
              <DatePicker
                value={eventTime? moment(eventTime) : null}
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
          <div className={styles.searchParts}>
            <span className={styles.barTips}>
              <span className={styles.acValue}>{conversionEfficiency ? '交流侧发电量' : '逆变器直流发电量'}(kWh)</span>
              <span className={styles.theoryValue}>{conversionEfficiency ? '直流侧发电量' : '方阵理论发电量'}(kWh)</span>
              <span className={styles.rateValue}>
                <span className={styles.lineTip}>
                  <span className={styles.line}></span>
                  <span className={styles.rect}></span>
                </span>
                <span>{conversionEfficiency ? '转换效率' : '方阵损耗'}(%)</span>
              </span>
            </span>
          </div>
        </div>
    );
  }
}

export default EventBarSearch;


