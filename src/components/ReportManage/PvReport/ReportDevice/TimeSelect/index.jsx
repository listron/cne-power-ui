import React from 'react';
import styles from './timeSelect.scss';
import PropType from 'prop-types';
import moment from 'moment';
import { DatePicker, Radio, Button } from 'antd';
const { MonthPicker, RangePicker } = DatePicker;


/** 
 * 1  onChange 必填  回调函数 返回到结构为 {dateType:'hour',startaTime:Moment,endTime:Moment} 
 * 2  showHourPick  选填  是否显示分时的tab  默认为true
 * 3  showDayPick  选填  是否显示按日的tab  默认为true
 * 4  showMonthPick  选填  是否显按月时的tab  默认为true
 * 5  defaultDateType  选填  默认显示哪一个tab  默认为分时
 * 6  showLable  选填  是否显示tab 默认false
 * 7  hourDefaultTime 选填 分时的默认时间  传入的时间 默认是昨天
 * 8  dayDefaultTime 选填 日的默认时间  传入的时间 默认是[今年的第一天，昨天]
 * 9  monthDefaultTime 选填 月时的默认时间  传入的时间  默认是[今年的第一个月，上一个月]
*/
class TimeSelect extends React.PureComponent {
  static propTypes = {
    defaultDateType: PropType.string,
    showHourPick: PropType.bool,
    showMonthPick: PropType.bool,
    showDayPick: PropType.bool,
    showLable: PropType.bool,
    hourDefaultTime: PropType.any,
    dayDefaultTime: PropType.array,
    monthDefaultTime: PropType.array,
    onChange: PropType.func,
    theme: PropType.string,
  }

  static defaultProps = {
    showHourPick: true, //  分时
    showMonthPick: true, // 按日
    showDayPick: true, // 按月
    defaultDateType: 'hour', //默认是分时
    showLable: true, // 是否显示tab
    hourDefaultTime: moment().subtract(1, 'day'),
    dayDefaultTime: [moment().startOf('year'), moment().subtract(1, 'day')],
    monthDefaultTime: [moment().startOf('year'), moment().subtract(1, 'day')],
    theme: 'light',

  }

  constructor(props) {
    super(props);
    this.state = {
      timeStyle: props.defaultDateType,
      monthRangeTime: props.monthDefaultTime,
    };
  }

  onTimeStyleChange = (e) => { // 时间模式选择  切换类型的时候发生一次转换
    const timeStyle = e.target.value;
    this.setState({ timeStyle });
    let startTime = null, endTime = null;
    const { hourDefaultTime, dayDefaultTime, monthDefaultTime } = this.props;
    if (timeStyle === 'hour') {
      startTime = moment(hourDefaultTime).format('YYYY-MM-DD');
      endTime = moment(hourDefaultTime).format('YYYY-MM-DD');
    }
    if (timeStyle === 'day') {
      startTime = moment(dayDefaultTime[0]).format('YYYY-MM-DD');
      endTime = moment(dayDefaultTime[1]).format('YYYY-MM-DD');
    }
    if (timeStyle === 'month') {
      startTime = moment(monthDefaultTime[0]).format('YYYY-MM');
      endTime = moment(monthDefaultTime[1]).format('YYYY-MM');
    }
    this.props.onChange({ dateType: timeStyle, startTime, endTime });

  }


  disabledDate = (current) => { // 不可以选择的时间
    return current > moment().subtract(1, 'day');
  }

  timeSelect = (value, dateString) => {
    const { timeStyle } = this.state;
    this.props.onChange({ dateType: timeStyle, startTime: moment(value).format('YYYY-MM-DD'), endTime: moment(value).format('YYYY-MM-DD') });
  }

  dayTimeSelect = (value, dateString) => {
    const { timeStyle } = this.state;
    this.props.onChange({ dateType: timeStyle, startTime: moment(value[0]).format('YYYY-MM-DD'), endTime: moment(value[1]).format('YYYY-MM-DD') });
  }

  handlePanelChange = (value, mode) => { // 日的时间发生变化
    this.setState({ monthRangeTime: value });
    const [startTime, endTime] = value;
    const { timeStyle } = this.state;
    this.props.onChange({ dateType: timeStyle, startTime: moment(startTime).format('YYYY-MM'), endTime: moment(endTime).format('YYYY-MM') });
  }



  render() {
    const { showHourPick, showDayPick, showMonthPick, showLable, hourDefaultTime, dayDefaultTime, theme } = this.props;
    const { timeStyle, monthRangeTime } = this.state;
    return (
      <div className={`${styles.timeSelectWrap} ${styles[theme]}`}>
        {showLable &&
          <Radio.Group buttonStyle="solid" onChange={this.onTimeStyleChange} value={timeStyle}>
            {showMonthPick && <Radio.Button value="month">按月</Radio.Button>}
            {showDayPick && <Radio.Button value="day" >按日</Radio.Button>}
            {showHourPick && <Radio.Button value="hour">分时</Radio.Button>}
          </Radio.Group> || ''}
        <span ref={'timeSelect'} className={styles.timeModal} />
        {timeStyle === 'hour' &&
          <DatePicker
            defaultValue={moment(hourDefaultTime, 'YYYY-MM-DD')}
            placeholder="选择日期"
            getCalendarContainer={() => this.refs.timeSelect}
            disabledDate={this.disabledDate}
            allowClear={false}
            onChange={this.timeSelect}
          />}
        {timeStyle === 'day' &&
          <RangePicker
            defaultValue={[moment(dayDefaultTime[0], 'YYYY-MM-DD'), moment(dayDefaultTime[1], 'YYYY-MM-DD')]}
            placeholder={['Start', 'End']}
            getCalendarContainer={() => this.refs.timeSelect}
            disabledDate={this.disabledDate}
            allowClear={false}
            onChange={this.dayTimeSelect}
          />}
        {
          timeStyle === 'month' &&
          <RangePicker
            value={monthRangeTime}
            format={'YYYY-MM'}
            placeholder={['Start', 'End']}
            mode={['month', 'month']}
            allowClear={false}
            onPanelChange={this.handlePanelChange}
          />
        }

      </div>
    );
  }

}

export default TimeSelect;
