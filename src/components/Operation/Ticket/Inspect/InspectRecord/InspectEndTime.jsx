import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DatePicker } from 'antd';
import moment from 'moment';


class InspectEndTime extends Component {
  static propTypes = {
    inspectTimeStart: PropTypes.string,
    inspectTimeEnd: PropTypes.string,  
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
      inspectTimeEnd: dateString
    });
  }
  

  disabledStartDate = (current) => {
    const inspectTimeEnd = this.props.inspectTimeEnd;
    if(inspectTimeEnd && current) {
      return current.valueOf() > moment(inspectTimeEnd);
    }
    return false;
  }

  disabledEndDate = (current) => {
    const inspectTimeStart = this.props.inspectTimeStart;
    if(inspectTimeStart && current) {
      return current.valueOf() < moment(inspectTimeStart).valueOf();
    }
    return false;
  }

  render() {
    const { inspectTimeEnd } = this.props;
    return (
      <DatePicker
      disabledDate={this.disabledEndDate}
      value={inspectTimeEnd ? moment(inspectTimeEnd) : null}
      placeholder="截止时间"
      onChange={this.onEndChange}
      />  
    );
  }

}

export default InspectEndTime;