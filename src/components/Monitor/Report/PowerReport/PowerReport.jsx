import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './powerReport.scss';
import { dataFormat } from '../../../../utils/utilFunc';
import TimeSelect from '../../../Common/TimeSelect/TimeSelectIndex';
import TableList from './table';
import moment from 'moment';

class PowerReport extends Component {
  static propTypes = {
    // getPowerReportList: PropTypes.func,
    // changePowerReportStore: PropTypes.func,
  }

  onTimeChange = (value) => {
    console.log(value)

  }


  render() {

    return (
      <section className={styles.container}>
        <TimeSelect onChange={this.onTimeChange} timerText={'选择时间'} value={{ timeStyle: 'day' }} />
        <TableList {...this.props} />
      </section>
    )
  }
}

export default PowerReport;