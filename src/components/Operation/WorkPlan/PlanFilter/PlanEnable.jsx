
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'antd';
import styles from './planFilter.scss';

class PlanEnable extends PureComponent {

  static propTypes = {
    planStatus: PropTypes.array,
    onConditionChange: PropTypes.func,
  };

  checkPlanStatus = (planStatus) => {
    this.props.onConditionChange({ planStatus });
  }

  onReset = () => {
    this.props.onConditionChange({ planStatus: [] });
  }

  statusInfo = [
    { label: '启用', value: 1 },
    { label: '停用', value: 2 },
  ]

  render(){
    const { planStatus } = this.props;
    return (
      <div className={styles.filterItem}>
        <span onClick={this.onReset} className={planStatus.length === 0 ? styles.selected : styles.all}>不限</span>
        <Checkbox.Group value={planStatus} options={this.statusInfo} onChange={this.checkPlanStatus} />
      </div>
    );
  }
}

export default PlanEnable;
