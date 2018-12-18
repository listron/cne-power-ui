import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'antd';
import styles from './filterCondition.scss';
const CheckboxGroup = Checkbox.Group;

class AlarmTypeFilter extends Component {
  static propTypes = {
    onChangeFilter: PropTypes.func,
    warningConfigName: PropTypes.array,
  }

  constructor(props) {
    super(props);
  }

  onChange = (warningConfigName) => {
    this.props.onChangeFilter({ warningConfigName });
  }

  onReset = () => {
    this.props.onChangeFilter({
      warningConfigName: []
    });
  }

  render() {
    const {warningConfigName } = this.props;
    const options = [{label:'事件告警',value:'事件告警'}]
    return (
      <div className={styles.filterItem}>
        <span onClick={this.onReset} className={warningConfigName.length===0?styles.selected:styles.all}>不限</span>
        <CheckboxGroup options={options} value={warningConfigName} onChange={this.onChange} />
      </div>
    );
  }

}

export default AlarmTypeFilter;