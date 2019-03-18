import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './malfunction.scss';
import TimeSelectReport from '../../../Common/TimeSelect/TimeSelectReport';
import SummaryMode from '../../../Common/SummaryMode';
import TableList from './table';
import moment from 'moment';

class Malfunction extends Component {
  static propTypes = {
    getMalfunctionList: PropTypes.func,
    changeMalfunctionStore: PropTypes.func,
  }

  onTimeChange = (value) => {
    console.log(value)

  }
  onModechange = (value) => {
    console.log(value)
  }


  render() {
    return (
      <div style={{ width: '100%' }}>
        <TimeSelectReport onChange={this.onTimeChange} />
        <SummaryMode onChange={this.onModechange} showStatus={false} {...this.props} />
        <TableList {...this.props} />
      </div>
    )
  }
}

export default Malfunction;