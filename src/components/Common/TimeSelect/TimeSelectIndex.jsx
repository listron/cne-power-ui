
import React from 'react';
import PropTypes from 'prop-types';
import { DatePicker, Radio } from 'antd';
import YearSelect from './YearSelect';
import styles from './styles.scss';
import moment from 'moment';

const { MonthPicker } = DatePicker;

/* 
时间选择共用控件。可自由选择垮年，各年，各月。
必填参数：
1.组件接收参数value: Object类型{timeStyle: 'year', startTime: '2018', endTime: '2028'};
  不同timeStyle : year, month,day 对应输入输出格式。
  year: 2018 => 2028; 
  month : 2018-01 => 2018-12; 
  day: 2018-02=> 2018-02;
2.接收必填的组件输出函数onChange = (timObj)=>{}输出timObj格式同上;
3.可选参数输入showYearPick(默认true) , showMonthPick(默认true), showDayPick(默认true); 均为bool
4.可选展示参数timerText: string; 默认'统计时间选择'
5 defaultLast:true 默认是去年
6 needDefault(bool: 默认true)代表日期组件是否需要默认值进行展示，若false，切换日期组件/style保持无默认值。
7theme  主题  dark light 默认是light
*/

class TimeSelect extends React.Component {

  static propTypes = {
    timerText: PropTypes.string,
    value: PropTypes.object,
    showYearPick: PropTypes.bool,
    refuseDefault: PropTypes.bool,
    showMonthPick: PropTypes.bool,
    showDayPick: PropTypes.bool,
    defaultLast: PropTypes.bool,
    onChange: PropTypes.func,
    style: PropTypes.object,
    theme: PropTypes.string,
  }

  static defaultProps = {
    timerText: '统计时间选择',
    showYearPick: true,
    showMonthPick: true,
    showDayPick: true,
    defaultLast: false,
    refuseDefault: false,
    value: {
      timeStyle: 'month',
      startTime: moment().format('YYYY-MM-DD'), // 默认今年
      endTime: moment().format('YYYY-MM-DD'),
    },
  }

  constructor(props) {
    super(props);
    this.state = {
      timeStyle: props.value.timeStyle,
      startTime: props.value.startTime,
      endTime: props.value.endTime,
    };
  }

  onTimeStyleChange = (e) => { // 时间模式选择
    const timeStyle = e.target.value;
    const params = { timeStyle };
    const { defaultLast, refuseDefault } = this.props;
    if (refuseDefault) { // 切换时不需要默认值
      params.startTime = params.endTime = null;
    } else if (timeStyle === 'year') { // 默认近五年
      params.startTime = moment().subtract(5, 'year').format('YYYY');
      params.endTime = moment().format('YYYY');
    } else if (timeStyle === 'month') { // 默认今年
      params.endTime = params.startTime = !defaultLast && moment().startOf('year').format('YYYY') || moment().subtract(1, 'year').format('YYYY');
    } else if (timeStyle === 'day') { // 默认本月
      params.endTime = params.startTime = !defaultLast && moment().startOf('month').format('YYYY-MM') || moment().subtract(1, 'month').startOf('month').format('YYYY-MM');
    }
    this.setState({ ...params });
    this.props.onChange({ ...params });
  }

  onMonthSelect = (dateMoment, dateString) => { // 选择月份。
    const { timeStyle } = this.state;

    const params = {
      timeStyle,
      startTime: dateString,
      endTime: dateString,
    };
    this.setState({ ...params });
    this.props.onChange({ ...params });
  }

  onYearSelect = ({ selectedYear }) => { // 选择年份
    const { timeStyle } = this.state;
    const params = {
      timeStyle,
      startTime: selectedYear,
      endTime: selectedYear,
    };
    this.setState({ ...params });
    this.props.onChange({ ...params });
  }

  onStartYearSelect = ({ selectedYear }) => { // 跨年选择： 起始年份确定
    this.setState({ startTime: selectedYear });
  }

  onEndYearSelect = ({ selectedYear }) => { // 跨年选择： 终止年份确定
    const { timeStyle, startTime } = this.state;
    const params = {
      timeStyle,
      startTime,
      endTime: selectedYear,
    };
    this.setState({ ...params });
    this.props.onChange({ ...params });
  }

  disabledDate = (current) => { // 不可以选择的时间
    const { defaultLast } = this.props;
    return !defaultLast ? current > moment().endOf('day') : current > moment().subtract(1, 'month').endOf('day');
  }



  render() {
    const { timerText, showYearPick, showMonthPick, showDayPick, style, theme } = this.props;
    const { timeStyle, startTime, endTime } = this.state;
    return (
      <div className={`${styles.timeSelect} ${styles[theme]}`} style={style}>
        <div className={styles.textStyle}>{timerText}</div>
        <div className={styles.buttonStyle}>
          <Radio.Group buttonStyle="solid" onChange={this.onTimeStyleChange} value={timeStyle} >
            {showYearPick && <Radio.Button value="year">多年</Radio.Button>}
            {showMonthPick && <Radio.Button value="month">年</Radio.Button>}
            {showDayPick && <Radio.Button value="day" >月</Radio.Button>}
          </Radio.Group>
        </div>
        {timeStyle === 'day' && <MonthPicker
          // format="YYYY年MM月"
          value={!startTime ? null : moment(startTime)}
          onChange={this.onMonthSelect}
          placeholder="选择月份"
          allowClear={false}
          disabledDate={this.disabledDate}
        />}
        {timeStyle === 'month' && <YearSelect yearValue={startTime} onYearSelect={this.onYearSelect} />}
        {timeStyle === 'year' && <span>
          <YearSelect yearValue={startTime} onYearSelect={this.onStartYearSelect} />
          <span>—</span>
          <YearSelect yearValue={endTime} onYearSelect={this.onEndYearSelect} />
        </span>}
      </div>
    );
  }
}
export default TimeSelect;

