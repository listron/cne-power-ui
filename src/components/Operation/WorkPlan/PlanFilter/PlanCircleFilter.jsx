
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'antd';
import styles from './planFilter.scss';

class PlanCircleFilter extends PureComponent {

  static propTypes = {
    cycleTypeCode: PropTypes.array,
    onConditionChange: PropTypes.func,
  };

  checkCircleType = (cycleTypeCode) => {
    this.props.onConditionChange({ cycleTypeCode });
  }

  onReset = () => {
    this.props.onConditionChange({ cycleTypeCode: [] });
  }

  circleTypes = [
    { label: '单次', value: 151 },
    { label: '每天', value: 152 },
    { label: '每周', value: 153 },
    { label: '每月', value: 154 },
    { label: '每季度', value: 155 },
    { label: '半年', value: 156 },
    { label: '每年', value: 157 },
  ]

  render(){
    const { cycleTypeCode } = this.props;
    return (
      <div className={styles.filterItem}>
        <span onClick={this.onReset} className={cycleTypeCode.length === 0 ? styles.selected : styles.all}>不限</span>
        <Checkbox.Group value={cycleTypeCode} options={this.circleTypes} onChange={this.checkCircleType} />
      </div>
    );
  }
}

export default PlanCircleFilter;
