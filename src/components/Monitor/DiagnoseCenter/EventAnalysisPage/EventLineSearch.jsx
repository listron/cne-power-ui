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
    isNoDataTip: PropTypes.bool,
    pageKey: PropTypes.string,
  };

  state = {
    showNoDataTip: false,
  }

  componentWillReceiveProps(nextProps){
    const { isNoDataTip } = nextProps;
    const preNoDataTip = this.props.isNoDataTip;
    if (!preNoDataTip && isNoDataTip) { //无数据
      this.props.changeStore({ isNoDataTip: false });
      this.setState({ showNoDataTip: true });
      if (this.dataTipTimer) {
        clearTimeout(this.dataTipTimer);
      }
      this.dataTipTimer = setTimeout(() => {
        this.setState({ showNoDataTip: false });
      }, 3000);
    }
  }

  onIntervalChange = (interval) => {
    const { analysisEvent } = this.props;
    this.props.getEventsAnalysis({ ...analysisEvent, interval, isCycleTip: true }); // 默认十分钟数据
  }

  onDateChange = (momentTime, beginTime) => {
    const { analysisEvent } = this.props;
    this.props.getEventsAnalysis({ ...analysisEvent, beginTime, isDataTip: true });
  }

  prevDay = () => this.onDayChange('subtract')

  nextDay = () => this.onDayChange('add')

  onDayChange = (method) => {
    const { analysisEvent } = this.props;
    const { beginTime } = analysisEvent || {};
    const newMonthStr = moment(beginTime)[method](1, 'day').format('YYYY-MM-DD');
    this.props.getEventsAnalysis({ ...analysisEvent, beginTime: newMonthStr, isDataTip: true });
  }

  disabledDateFunc = (cur) => moment().isBefore(cur, 'day')

  render(){
    const { analysisEvent, pageKey } = this.props;
    const { showNoDataTip } = this.state;
    const { beginTime, interval, eventCode } = analysisEvent || {};
    const noSecondEvent = ['NB1038', 'NB1040', 'NB1036', 'NB1037', 'NB2035', 'NB2036'].includes(eventCode); // 电压异常、并网延时、组串低效、固定物遮挡、高值异常、低值异常没有5秒数据
    const forbidNextDay = !moment().isAfter(moment(beginTime), 'day');
    return (
        <div className={styles.analysisLineSearch}>
          {showNoDataTip && <div className={styles.tipText}>数据不存在，请选择其他周期</div>}
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
    );
  }
}

export default EventLineSearch;


