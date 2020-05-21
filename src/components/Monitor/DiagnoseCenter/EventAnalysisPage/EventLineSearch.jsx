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

  componentDidMount(){
    const { showEmptyDataTip } = this.props;
    if (showEmptyDataTip) {
      this.emptyDataTip();
    }
  }

  componentWillReceiveProps(nextProps){
    const { showEmptyDataTip } = nextProps;
    const preTip = this.props.showEmptyDataTip;
    if (!preTip && showEmptyDataTip) { // 无数据
      this.props.changeStore({ showEmptyDataTip: false });
      this.emptyDataTip();
    }
  }

  emptyDataTip = () => { // 无数据 需提示
    this.setState({ showTip: true });
    if (this.dataTipTimer) {
      clearTimeout(this.dataTipTimer);
    }
    this.dataTipTimer = setTimeout(() => {
      this.setState({ showTip: false });
    }, 3000);
  }

  onIntervalChange = (interval) => {
    const { analysisEvent } = this.props;
    this.props.getEventsAnalysis({ ...analysisEvent, interval }); // 默认十分钟数据
  }

  onDateChange = (momentTime, timeStr) => {
    // 告警事件,数据事件使用发生时间, 诊断事件优先使用更新日期其次使用发生日期
    const { analysisEvent } = this.props;
    const { updateTime } = analysisEvent;
    const timeKey = updateTime ? 'updateTime' : 'beginTime';
    this.props.getEventsAnalysis({ ...analysisEvent, [timeKey]: timeStr });
  }

  prevDay = () => this.onDayChange('subtract')

  nextDay = () => this.onDayChange('add')

  onDayChange = (method) => {
    // 告警事件,数据事件使用发生时间, 诊断事件优先使用更新日期其次使用发生日期
    const { analysisEvent } = this.props;
    const { updateTime } = analysisEvent;
    const timeKey = updateTime ? 'updateTime' : 'beginTime';
    const newDayStr = moment(analysisEvent[timeKey])[method](1, 'day').format('YYYY-MM-DD');
    this.props.getEventsAnalysis({ ...analysisEvent, [timeKey]: newDayStr });
  }

  disabledDateFunc = (cur) => moment().isBefore(cur, 'day')

  render(){
    const { analysisEvent, pageKey } = this.props;
    const { showTip } = this.state;
    const { interval, eventCode, updateTime } = analysisEvent || {};
    const timeKey = updateTime ? 'updateTime' : 'beginTime';
    const noSecondEvent = ['NB1035', 'NB1036', 'NB1037', 'NB1038', 'NB1235', 'NB1236', 'NB1237', 'NB1238', 'NB1239'].includes(eventCode) || pageKey === 'data'; //诊断事件(5组串事件) 没有5秒数据， 所有的数据事件pageKey = 'data'也没有5s数据。
    const eventTime = analysisEvent[timeKey]; // 告警事件,数据事件使用发生时间, 诊断事件优先使用更新日期其次使用发生日期
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
              {!noSecondEvent && <Option value={2}>5秒钟</Option> }
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


