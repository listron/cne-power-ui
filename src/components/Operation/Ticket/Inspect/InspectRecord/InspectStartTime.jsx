import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DatePicker } from 'antd';
import moment from 'moment';


class InspectStartTime extends Component {
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
    const { inspectTimeStart } = this.props;
    return (
        <DatePicker
        disabledDate={this.disabledStartDate}
        value={inspectTimeStart ? moment(inspectTimeStart) : null}
        placeholder="开始时间"
        onChange={this.onStartChange}
      />  
    );
  }

}

export default InspectStartTime;