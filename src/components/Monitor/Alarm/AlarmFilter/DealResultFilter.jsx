import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'antd';
import styles from './alarmFilter.scss';
const CheckboxGroup = Checkbox.Group;

class DealResultFilter extends Component {
  static propTypes = {
    warningStatus: PropTypes.array,
    onChangeFilter: PropTypes.func,
  }

  constructor(props) {
    super(props);
  }

  onChange = (value) => {
    this.props.onChangeFilter({
      warningStatus: value
    });
  }

  onReset = () => {
    this.props.onChangeFilter({
      warningStatus: []
    });
  }

  render() {
    const { warningStatus } = this.props;
    const options = [
      {value:'1', label:'自动解除'},
      {value:'2', label:'手动解除'},
      {value:'3', label:'转工单'}
    ];
    return (
      <div className={styles.alarmFilterItem}>
        <span onClick={this.onReset} className={warningStatus.length===0?styles.selected:styles.all}>不限</span>
        <CheckboxGroup options={options} value={warningStatus} onChange={this.onChange} />
      </div>
    );
  }
}

export default DealResultFilter;