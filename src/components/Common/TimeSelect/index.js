import React from "react";
import { DatePicker, Radio } from 'antd';
import styles from './styles.scss';
import moment from 'moment';
/* 

1.年、月、日，年和月默认存在，日day选填，值类型为布尔，如day={ture}

*/

class TimeSelect extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      timeType: 'month',
      mode: ['year', 'year'],
      value: [],
      open: false,
      dateValue: '2018'
    }
  }


  onHandleDay = (date, dateString) => {
    let data = new Date(date._d)
    console.log( dateString);
  }


  onHandleTime = (e) => {
    this.setState({
      timeType: e.target.value,
    })
    this.props.changeAllStationStore({ dateType: e.target.value })


  }
  onPanelChange = (value, mode) => {
    let data = new Date(value._d).getFullYear()
    console.log('date', data)
    this.setState({ open: false, dateValue: data })
  };
  onStartTimeOpenChange = () => {
    this.setState({ open: true })
  }
  onOpenChange = () => {
    this.setState({ open: true })
  };
  handlePanelChange = (value, mode) => {
    this.setState({
      value,
      mode: [
        'year', 'year'
      ],
    });
  }


  render() {
    const { MonthPicker, RangePicker } = DatePicker;
    const { value, mode } = this.state;
    const { dateType, } = this.props;
    const dateFormat = 'YYYY'


    const format = 'YYYY:MM';
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
          placeholder={['开始年份', '结束年份']}
          format="YYYY"
          value={value}
          mode={mode}
          onPanelChange={this.handlePanelChange}
        /> : ''}

        {this.state.timeType === "month" ?
          <DatePicker
            defaultValue={moment('2015', dateFormat)}
            format={dateFormat}
            mode="year"
            open={this.state.open}
            focus={this.focus}
            value={moment(this.state.dateValue, dateFormat)}
            // onChange={(...rest)=>(this.onPanelChange(...rest))}
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




