import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DatePicker } from 'antd';
import moment from 'moment';
import styles from './filterCondition.scss';
const { RangePicker } = DatePicker;

class RangeDateFilter extends Component {
  static propTypes = {
    rangTime: PropTypes.array,
    onChangeFilter: PropTypes.func,
  }

  constructor(props) {
    super(props);
  }



  onChange = (date, dateString) => {
    if (date.length === 0) {
      this.props.onChangeFilter({
        rangTime: date,
      });
    } else {
      this.props.onChangeFilter({
        rangTime: [date[0].hour(0).minute(0).second(0).toISOString(), date[1].hour(23).minute(59).second(59).toISOString()],
      });
    }
  }

  onReset = () => {
    this.props.onChangeFilter({
      rangTime: [],
    });
  }

  render() {
    const { rangTime } = this.props;
    return (
      <div className={styles.filterItem}>
        <span onClick={this.onReset} className={rangTime.length === 0 ? styles.selected : styles.all}>不限</span>
        <span ref={'datePicker'} />
        <RangePicker
          value={[rangTime[0] ? moment(rangTime[0]) : null, rangTime[1] ? moment(rangTime[1]) : null]}
          onChange={this.onChange}
          getCalendarContainer={() => this.refs.datePicker}
        />
      </div>
    );
  }

}

export default RangeDateFilter;
