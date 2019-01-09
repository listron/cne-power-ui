import React, { Component } from "react";
import styles from "./customize.scss";
import PropTypes from 'prop-types';
import { Select, DatePicker } from 'antd';
import moment from 'moment';
import StationSelect from "../../../Common/StationSelect";
import CustomizeTable from './CustomizeTable';
const Option = Select.Option;
const { RangePicker } = DatePicker;

class Customize extends Component {
  static propTypes = {
    changeCustomizeStore: PropTypes.func
  }

  constructor(props, context) {
    super(props, context)
  }

  timeSelect = (date, dateString) => {
    console.log(date, dateString)
    this.props.changeCustomizeStore({ startDate: dateString[0], endDate: dateString[1] })
  }

  render() {
    const currentYearDay = moment().year() + '/01/01';
    const { } = this.props;
    return (
      <div className={styles.customizeBox}>
        <div className={styles.search}>
          <span>条件查询</span>
          <Select defaultValue="逆变器" style={{ width: 200, marginLeft: 15 }}  >
            <Option value="逆变器">逆变器</Option>
          </Select>
          <RangePicker
            defaultValue={[moment(currentYearDay, 'YYYY-MM-DD'), moment(moment(), 'YYYY-MM-DD')]}
            format={'YYYY-MM-DD'}
            style={{ width: 200, marginLeft: 15, marginRight: 15 }}
            onChange={this.timeSelect}
          />
        </div>
        <CustomizeTable {...this.props} />
      </div>
    )
  }
}

export default Customize