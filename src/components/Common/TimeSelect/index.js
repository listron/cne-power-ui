import React from "react";
import PropTypes from "prop-types";
import { DatePicker, Radio } from 'antd';
import styles from './styles.scss';
import moment from 'moment';
/* 

1.年、月、日，年和月默认存在，日day选填，值类型为布尔，如day={ture}

*/

class TimeSelect extends React.Component {
  static propTypes = {
    startTime: PropTypes.string,
    endTime: PropTypes.string,
    changeAllStationStore: PropTypes.func,
  }
  constructor(props, context) {
    super(props, context)
    this.state = {
      timeType: 'month',
      mode: ['year', 'year'],
      value: '',
      open: false,
      dateValue: ''
    }
  }


  onHandleDay = (date, dateString) => {
    let data = new Date(date._d)
    console.log(dateString);
    this.props.changeAllStationStore({ year: [`${dateString}`] })
  }


  onHandleTime = (e) => {
    this.setState({
      timeType: e.target.value,
    })
    this.props.changeAllStationStore({ dateType: e.target.value })
  }


  onPanelChange = (value, mode) => { // shijian
    let data = new Date(value._d).getFullYear()
    console.log('date', data)
    this.setState({ open: false, dateValue: data })
    this.props.changeAllStationStore({ year: [`${data}`] })

  };
  onStartTimeOpenChange = () => {
    this.setState({ open: true })
  }
  onOpenChange = () => {
    this.setState({ open: true })
  };
  handlePanelChange = (value, mode) => {
    console.log(moment(value[0]).format('YYYY'), moment(value[1]).format('YYYY'));
    const selectYear = [Number(moment(value[0]).format('YYYY')), Number(moment(value[1]).format('YYYY'))];
    let rangeYear = [];
    for (let i = selectYear[0]; i < selectYear[1]+1; i++) {
      rangeYear.push(i.toString())
    }
    this.setState({
      value,
      mode: [
        'year', 'year'
      ],
    });
    this.props.changeAllStationStore({ year: rangeYear })

  }


  render() {
    const { MonthPicker, RangePicker } = DatePicker;
    const { value, mode } = this.state;
    const { dateType, } = this.props;
    const dateFormat = 'YYYY';
    const format = 'YYYY:MM';
    const currentYear = moment();
    const rangeYear = [moment().subtract(5, 'year'), moment()]


    return (
      <div className={styles.timeSelect}>
        <div className={styles.textStyle}>{this.props.text}</div>
        <div className={styles.buttonStyle}>
          <Radio.Group defaultValue="month" buttonStyle="solid" onChange={this.onHandleTime}>
            <Radio.Button value="year">年</Radio.Button>
            <Radio.Button value="month">月</Radio.Button>
            {this.props.day ? <Radio.Button value="day" >日</Radio.Button> : ''}
          </Radio.Group>
        </div>
        {this.state.timeType === "year" ? <RangePicker
        defaultValue={rangeYear}
          format={dateFormat}
          placeholder={['开始年份', '结束年份']}
          format="YYYY"
          value={value}
          //value={this.state.value?moment(this.state.value, dateFormat):rangeYear}
          mode={mode}
          onPanelChange={this.handlePanelChange}
        /> : ''}

        {this.state.timeType === "month" ?
          <DatePicker
            // defaultValue={moment(currentYear, dateFormat)}
            format={dateFormat}
            mode="year"
            open={this.state.open}
            focus={this.focus}
            value={this.state.dateValue ? moment(this.state.dateValue, dateFormat) : currentYear}
            onChange={(...rest) => (this.onPanelChange(...rest))}
            onOpenChange={this.onOpenChange}
            onPanelChange={(value, mode) => (this.onPanelChange(value, mode))}
          />
          : ''}
        {this.state.timeType === "day" ? <MonthPicker onChange={this.onHandleDay} placeholder="选择月份" /> : ''}
        <br />
      </div>
    )
  }
}
export default TimeSelect




