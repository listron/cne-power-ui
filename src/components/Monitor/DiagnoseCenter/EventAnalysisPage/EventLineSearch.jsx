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
    changeStore: PropTypes.func,
    showEmptyDataTip: PropTypes.bool,
    pageKey: PropTypes.string,
  };

  state = {
    showTip: false,
  }

  componentWillReceiveProps(nextProps){
    const { showEmptyDataTip } = nextProps;
    const preTip = this.props.showEmptyDataTip;
    if (!preTip && showEmptyDataTip) { //无数据
      this.props.changeStore({ showEmptyDataTip: false });
      this.setState({ showTip: true });
      if (this.dataTipTimer) {
        clearTimeout(this.dataTipTimer);
      }
      this.dataTipTimer = setTimeout(() => {
        this.setState({ showTip: false });
      }, 3000);
    }
  }

  onIntervalChange = (interval) => {
    const { analysisEvent } = this.props;
    this.props.getEventsAnalysis({ ...analysisEvent, interval }); // 默认十分钟数据
  }

  onDateChange = (momentTime, updateTime) => {
    const { analysisEvent } = this.props;
    this.props.getEventsAnalysis({ ...analysisEvent, updateTime });
  }

  prevDay = () => this.onDayChange('subtract')

  nextDay = () => this.onDayChange('add')

  onDayChange = (method) => {
    const { analysisEvent } = this.props;
    const { eventTime } = analysisEvent || {};
    const newMonthStr = moment(eventTime)[method](1, 'day').format('YYYY-MM-DD');
    this.props.getEventsAnalysis({ ...analysisEvent, updateTime: newMonthStr });
  }

  disabledDateFunc = (cur) => moment().isBefore(cur, 'day')

  render(){
    const { analysisEvent, pageKey } = this.props;
    const { showTip } = this.state;
    const { eventTime, interval, eventCode } = analysisEvent || {};
    const noSecondEvent = ['NB1038', 'NB1040', 'NB1036', 'NB1037', 'NB2035', 'NB2036'].includes(eventCode); // 电压异常、并网延时、组串低效、固定物遮挡、高值异常、低值异常没有5秒数据
    const forbidNextDay = !moment().isAfter(moment(eventTime), 'day');
    return (
        <div className={styles.analysisLineSearch}>
          {showTip && <div className={styles.tipText}>数据不存在，请选择其他周期</div>}
          <strong className={styles.searchText}>告警诊断指标时序图</strong>
          <span className={styles.searchParts}>
            <span className={styles.intervalText}>数据时间间隔</span>
            <Select
              className={styles.intervalSelect}
              onChange={this.onIntervalChange}
              value={interval}
            >
              <Option value={1}>10分钟</Option>
              <Option value={3}>1分钟</Option>
              {(!noSecondEvent && pageKey !== 'data') && <Option value={2}>5秒钟</Option> }
            </Select>
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
    );
  }
}

export default EventLineSearch;


