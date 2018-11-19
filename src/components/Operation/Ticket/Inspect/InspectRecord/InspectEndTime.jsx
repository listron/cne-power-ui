import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DatePicker } from 'antd';
import moment from 'moment';


class InspectEndTime extends Component {
  static propTypes = {
    startDate: PropTypes.string,
    endDate: PropTypes.string,  
    onChangeFilter: PropTypes.func,
  }

  constructor(props) {
    super(props);
  }

  onStartChange = (date,dateString) => {
    this.props.onChangeFilter({
      createTimeStart: dateString,
    });
  }
  onEndChange = (date,dateString) => {
    this.props.onChangeFilter({
      endDate: dateString
    });
  }
  

  disabledStartDate = (current) => {
    const endDate = this.props.endDate;
    if(endDate && current) {
      return current.valueOf() > moment(endDate);
    }
    return false;
  }

  disabledEndDate = (current) => {
    const startDate = this.props.startDate;
    if(startDate && current) {
      return current.valueOf() < moment(startDate).valueOf();
    }
    return false;
  }

  render() {
    const { endDate } = this.props;
    return (
      <DatePicker
      disabledDate={this.disabledEndDate}
      value={endDate ? moment(endDate) : null}
      placeholder="截止时间"
      onChange={this.onEndChange}
      />  
    );
  }

}

export default InspectEndTime;