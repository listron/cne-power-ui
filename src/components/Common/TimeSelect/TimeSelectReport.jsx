
import React from "react";
import PropTypes from "prop-types";
import { DatePicker, Radio } from 'antd';
import YearSelect from './YearSelect';
import styles from './styles.scss';
import moment from 'moment';

const { RangePicker } = DatePicker;
const defaultStartTime = {//默认展示起始时间
  day: moment().format('DD') === '01' ? moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD') : moment().startOf('month').format('YYYY-MM-DD'),
  year: moment().subtract(5, 'year').format('YYYY'),
  month: moment().subtract(5, 'month').format('YYYY-MM'),
  custom: moment().format('DD') === '01' ? moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD') : moment().startOf('month').format('YYYY-MM-DD'),
};
const defaultEndTime = {//默认展示结束时间
  day: moment().subtract(1, 'day').format('YYYY-MM-DD'),
  year: moment().format('YYYY'),
  month: moment().format('YYYY-MM'),
  custom: moment().subtract(1, 'day').format('YYYY-MM-DD'),
};
/* 
时间选择共用控件。可自由选择按年，按月，按日，自定义。
参数：
1.组件接收参数
    timeStyle: ,
2.接收必填的组件输出函数onChange = (timObj)=>{}输出timObj格式同上;
3.可选参数输入showYearPick(默认true) , showMonthPick(默认true), showDayPick(默认true),showCustomPick(默认true); 均为bool
4.可选展示参数timerText: string; 默认'选择时间'
5、按月选择目前不支持设置不可用日期-->如需支持需要用两个monthPicker进行设置
*/

class TimeSelectReport extends React.Component {

  static propTypes = {
    timerText: PropTypes.string,
    timeStyle: PropTypes.string,
    showYearPick: PropTypes.bool,
    showMonthPick: PropTypes.bool,
    showDayPick: PropTypes.bool,
    showCustomPick: PropTypes.bool,
    onChange: PropTypes.func,
    style: PropTypes.object,
  }

  static defaultProps = {
    timerText: '选择时间',
    showYearPick: true,
    showMonthPick: true,
    showDayPick: true,
    showCustomPick: true,
    timeStyle: 'day',
  }

  constructor(props) {
    super(props);
    this.state = {
      timeStyle: props.timeStyle,
      mode: ['month', 'month'],
      startTime: defaultStartTime[props.timeStyle],
      endTime: defaultEndTime[props.timeStyle],
    }
  }

  onTimeStyleChange = (e) => { // 时间模式选择
    const timeStyle = e.target.value;
    const params = { timeStyle, startTime: defaultStartTime[timeStyle], endTime: defaultEndTime[timeStyle] };
    this.setState({ ...params });
    this.props.onChange({ ...params });
  }

  onDaySelect = (dateMoment, dateString) => { // 按日选择
    const { timeStyle } = this.state;
    const params = {
      timeStyle,
      startTime: dateString[0],
      endTime: dateString[1],
    }
    this.setState({ ...params });
    this.props.onChange({ ...params });
  }

  onStartYearSelect = ({ selectedYear }) => { // 按年选择
    this.setState({ startTime: selectedYear });
  }

  onEndYearSelect = ({ selectedYear }) => { // 按年选择
    const { timeStyle, startTime } = this.state;
    const params = {
      timeStyle,
      startTime,
      endTime: selectedYear,
    }
    this.setState({ ...params });
    this.props.onChange({ ...params });
  }

  handlePanelChange = (value, mode) => {// 按月选择
    const { timeStyle } = this.state;
    const params = {
      timeStyle,
      startTime: moment(value[0]).format('YYYY-MM'),
      endTime: moment(value[1]).format('YYYY-MM'),
      mode: [
        mode[0] === 'date' ? 'month' : mode[0],
        mode[1] === 'date' ? 'month' : mode[1],
      ],
    }
    this.setState({ ...params });
  }

  handleOpenChange = (visiable) => {
    if (!visiable) {
      this.props.onChange({ ...this.state });
    }
  }

  disabledDate = (current) => { // 不可以选择的时间
    return current > moment().endOf('day');
  }

  render() {
    const { timerText, showYearPick, showMonthPick, showDayPick, showCustomPick, style } = this.props;
    const { timeStyle, startTime, endTime } = this.state;
    return (
      <div className={styles.timeSelect} style={style}>
        <div className={styles.textStyle}>{timerText}</div>
        <div className={styles.buttonStyle}>
          <Radio.Group buttonStyle="solid" onChange={this.onTimeStyleChange} value={timeStyle} >
            {showDayPick && <Radio.Button value="day" >按日</Radio.Button>}
            {showMonthPick && <Radio.Button value="month">按月</Radio.Button>}
            {showYearPick && <Radio.Button value="year">按年</Radio.Button>}
            {showCustomPick && <Radio.Button value="custom">自定义</Radio.Button>}
          </Radio.Group>
        </div>
        {timeStyle === 'day' && <RangePicker
          value={[moment(startTime), moment(endTime)]}
          onChange={this.onDaySelect}
          placeholder={['Start day', 'End day']}
          allowClear={false}
          disabledDate={this.disabledDate}
        />}
        {timeStyle === 'month' && <RangePicker
          value={[moment(startTime), moment(endTime)]}
          placeholder={['Start month', 'End month']}
          format="YYYY-MM"
          mode={['month', 'month']}
          allowClear={false}
          onOpenChange={this.handleOpenChange}
          onPanelChange={this.handlePanelChange}
        />}
        {timeStyle === 'year' && <span>
          <YearSelect yearValue={startTime} onYearSelect={this.onStartYearSelect} />
          <span > - </span>
          <YearSelect yearValue={endTime} onYearSelect={this.onEndYearSelect} />
        </span>}
        {timeStyle === 'custom' && <RangePicker
          value={[moment(startTime), moment(endTime)]}
          onChange={this.onDaySelect}
          placeholder={['Start day', 'End day']}
          allowClear={false}
          disabledDate={this.disabledDate}
        />}
      </div>
    )
  }
}
export default TimeSelectReport

