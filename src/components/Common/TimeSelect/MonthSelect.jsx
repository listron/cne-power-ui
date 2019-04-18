

import React from "react";
import PropTypes from "prop-types";
import { DatePicker } from 'antd';
import styles from './styles.scss';
import moment from 'moment';
const { MonthPicker } = DatePicker;
class MonthSelect extends React.Component {

  static propTypes = {
    monthValue: PropTypes.string, // 接收的指定的月份字符串
    onMonthSelect: PropTypes.func,
  }
  
  constructor(props) {
    super(props);
    this.state = {
      panelOpen: false,
    }
  }

  onOpenChange = (panelOpen) => { // 面板开关控制
    this.setState({ panelOpen });
  }

  onPanelChange = value => {
    this.setState({ panelOpen: false });
    this.props.onMonthSelect({ selectedMonth: value.format('YYYY-MM') }) // 输出月份字符串。
  }
  disabledDate=(current)=>{
    return  current >moment().endOf('day')
  }

  render() {
    const { monthValue } = this.props;
    const { panelOpen } = this.state;
    return (
      <MonthPicker
        className={styles.yearSelectStyle}
        placeholder="选择月"
        format="YYYY年MM月"
        mode="month"
        open={panelOpen}
        disabledDate={this.disabledDate}
        value={monthValue?moment(monthValue):null}
        onOpenChange={this.onOpenChange}
        onPanelChange={this.onPanelChange}
        allowClear={false}
      />
    )
  }
}
export default MonthSelect

