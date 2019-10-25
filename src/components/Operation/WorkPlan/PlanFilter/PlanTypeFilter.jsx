
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'antd';
import styles from './planFilter.scss';

class PlanTypeFilter extends PureComponent {

  static propTypes = {
    planTypeCode: PropTypes.array,
    onConditionChange: PropTypes.func,
  };

  checkPlanType = (planTypeCode) => {
    this.props.onConditionChange({ planTypeCode });
  }

  planTypes = [
    { label: '巡视计划', value: 100 },
  ]

  render(){
    const { planTypeCode } = this.props;
    return (
      <div>
        <span>不限</span>
        <Checkbox.Group value={planTypeCode} options={this.planTypes} onChange={this.checkPlanType} />
      </div>
    );
  }
}

export default PlanTypeFilter;
