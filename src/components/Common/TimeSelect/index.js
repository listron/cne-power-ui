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
    }
   
  }

  onHandleDay = (date, dateString) => {
    console.log(date, dateString);
  }

  onHandleMonth = (date, dateString) => {
    console.log(date, dateString);
  }
  onHandleTime = (e) => {
    this.setState({
      timeType: e.target.value,
    })
  }


  handlePanelChange = (value, mode) => {
    this.setState({
      value,
      mode: [
        mode[0] === 'date' ? 'month' : mode[0],
        mode[1] === 'date' ? 'month' : mode[1],
      ],
    });
  }


  render() {
    const { MonthPicker, RangePicker } = DatePicker;
    const { value, mode } = this.state;
   
    

    const format = 'YYYY:MM';
    return (
      <div className={styles.timeSelect}>
        <div className={styles.textStyle}>统计时间选择</div>
        <div className={styles.buttonStyle}>
          <Radio.Group defaultValue="month" buttonStyle="solid" onChange={this.onHandleTime}>
            <Radio.Button value="year">年</Radio.Button>
            <Radio.Button value="month">月</Radio.Button>
            {this.props.day ? <Radio.Button value="day" >日</Radio.Button> : ''}
          </Radio.Group>
        </div>
        {this.state.timeType==="year"? 
        <RangePicker
        placeholder={['开始年份', '结束年份']}
        format="YYYY"
        value={value}
        mode={mode}
        onPanelChange={this.handlePanelChange}
        />:''}
        {this.state.timeType==="month"?<MonthPicker  defaultValue={moment('2018', 'YYYY')} format={'YYYY'} onChange={this.onHandleMonth} placeholder="选择年份" />:''}
        {this.state.timeType==="day"?<MonthPicker onChange={this.onHandleDay} placeholder="选择月份" />:''}
        <br />
      </div>
    )
  }
}
export default TimeSelect