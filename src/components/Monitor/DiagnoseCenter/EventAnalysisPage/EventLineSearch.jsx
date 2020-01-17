import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Icon, Select, DatePicker } from 'antd';
import styles from './eventAnalysis.scss';
import moment from 'moment';
const { Option } = Select;

class EventLineSearch extends PureComponent {

  static propTypes = {
    analysisEvent: PropTypes.object,
    getEventsAnalysis: PropTypes.func,
  };

  onIntervalChange = (interval) => {
    const { analysisEvent } = this.props;
    this.props.getEventsAnalysis({ ...analysisEvent, interval }); // 默认十分钟数据
  }

  onDateChange = (momentTime, beginTime) => {
    const { analysisEvent } = this.props;
    this.props.getEventsAnalysis({ ...analysisEvent, beginTime });
  }

  prevMonth = () => this.onMonthChange('subtract')

  nextMonth = () => this.onMonthChange('add')

  onMonthChange = (method) => {
    const { analysisEvent } = this.props;
    const { beginTime } = analysisEvent || {};
    const newMonthStr = moment(beginTime)[method](1, 'day').format('YYYY-MM-DD');
    this.props.getEventsAnalysis({ ...analysisEvent, beginTime: newMonthStr });
  }

  disabledDateFunc = (cur) => moment().isBefore(cur, 'day')

  render(){
    const { analysisEvent } = this.props;
    const { beginTime, interval } = analysisEvent || {};
    return (
        <div className={styles.analysisLineSearch}>
          <strong className={styles.searchText}>告警诊断指标时序图</strong>
          <span className={styles.searchParts}>
            <span className={styles.intervalText}>数据时间间隔</span>
            <Select
              className={styles.intervalSelect}
              onChange={this.onIntervalChange}
              value={interval}
            >
              <Option value={1}>10分钟</Option>
              <Option value={2}>5秒钟</Option>
            </Select>
            <Icon className={styles.leftIcon} type="left" onClick={this.prevMonth} />
            <DatePicker
              value={beginTime? moment(beginTime) : null}
              className={styles.dateSelect}
              onChange={this.onDateChange}
              allowClear={false}
              disabledDate={this.disabledDateFunc}
            />
            <Icon className={styles.rightIcon} type="right" onClick={this.nextMonth} />
          </span>
        </div>
    );
  }
}

export default EventLineSearch;


