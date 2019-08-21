import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DatePicker } from 'antd';
import moment from 'moment';
import styles from './filterCondition.scss';
const { RangePicker } = DatePicker;

class RangeDateFilter extends Component {
  static propTypes = {
    option: PropTypes.object,
    onChangeFilter: PropTypes.func,
  }

  constructor(props) {
    super(props);
  }



  onChange = (date, dateString) => {
    const { option = {} } = this.props;
    const [startTime, endTime] = dateString;
    option.checkedValue = dateString;
    this.props.onChangeFilter({ option });
  }

  onReset = () => {
    const { option = {} } = this.props;
    option.checkedValue = [];
    this.props.onChangeFilter({ option });
  }

  render() {
    const { option = {} } = this.props;
    const { checkedValue = [] } = option;
    const [startTime, endTime] = checkedValue;
    console.log('option', option);
    return (
      <div className={styles.filterItem}>
        <span onClick={this.onReset} className={checkedValue.length === 0 ? styles.selected : styles.all}>不限</span>
        <RangePicker
          value={[startTime ? moment(startTime) : null, endTime ? moment(endTime) : null]}
          onChange={this.onChange}
        />
      </div>
    );
  }

}

export default RangeDateFilter;
