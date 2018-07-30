import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DatePicker } from 'antd';
import styles from './defectFilter.scss';

class DefectTable extends Component {
  static propTypes = {
    
  }

  constructor(props) {
    super(props);
    this.state = {
      
    };
  }

  render() {
    return (
      <div>
        <span>不限</span>
        <DatePicker
          // disabledDate={this.disabledStartDate}
          // showTime
          // format="YYYY-MM-DD HH:mm:ss"
          // value={startValue}
          // placeholder="Start"
          // onChange={this.onStartChange}
          // onOpenChange={this.handleStartOpenChange}
        />
        <DatePicker
          // disabledDate={this.disabledEndDate}
          // showTime
          // format="YYYY-MM-DD HH:mm:ss"
          // value={endValue}
          // placeholder="End"
          // onChange={this.onEndChange}
          // open={endOpen}
          // onOpenChange={this.handleEndOpenChange}
        />
      </div>
    );
  }

}

export default DefectTable;