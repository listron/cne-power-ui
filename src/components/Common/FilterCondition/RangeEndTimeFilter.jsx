import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DatePicker } from 'antd';
import moment from 'moment';
import styles from './filterCondition.scss';
const { RangePicker } = DatePicker;

class RangeEndTimeFilter extends Component {
  static propTypes = {
    endTime: PropTypes.array,
    onChangeFilter: PropTypes.func,
  }

  constructor(props) {
    super(props);
  }



  onChange = (date, dateString) => {
    if (date.length === 0) {
      this.props.onChangeFilter({
        endTime: date,
      });
    } else {
      this.props.onChangeFilter({
        endTime: [date[0].hour(0).minute(0).second(0).toISOString(), date[1].hour(23).minute(59).second(59).toISOString()],
      });
    }
  }

  onReset = () => {
    this.props.onChangeFilter({
      endTime: [],
    });
  }

  render() {
    const { endTime } = this.props;
    return (
      <div className={styles.filterItem}>
        <span onClick={this.onReset} className={endTime.length === 0 ? styles.selected : styles.all}>不限</span>
        <span ref={'datePicker'} />
        <RangePicker
          value={[endTime[0] ? moment(endTime[0]) : null, endTime[1] ? moment(endTime[1]) : null]}
          onChange={this.onChange}
          getCalendarContainer={() => this.refs.datePicker}
        />
      </div>
    );
  }

}

export default RangeEndTimeFilter;
