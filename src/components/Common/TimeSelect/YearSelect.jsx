

import React from "react";
import PropTypes from "prop-types";
import { DatePicker } from 'antd';
import styles from './styles.scss';
import moment from 'moment';

class YearSelect extends React.Component {

  static propTypes = {
    yearValue: PropTypes.string, // 接收的指定的年份字符串
    onYearSelect: PropTypes.func,
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
    this.props.onYearSelect({ selectedYear: value.format('YYYY') }) // 输出年份字符串。
  }

  render() {
    const { yearValue } = this.props;
    const { panelOpen } = this.state;
    return (
      <DatePicker
        placeholder="选择年"
        format="YYYY年"
        mode="year"
        open={panelOpen}
        value={yearValue?moment(yearValue):null}
        onOpenChange={this.onOpenChange}
        onPanelChange={this.onPanelChange}
        allowClear={false}
      />
    )
  }
}
export default YearSelect

