
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'antd';
import styles from './planFilter.scss';

class PlanTypeFilter extends PureComponent {

  static propTypes = {
    onConditionChange: PropTypes.func,
  };

  checkPlanType = (planTypeCode) => {
    this.props.onConditionChange({ planTypeCode });
  }

  planTypes = [
    { label: '巡视计划', value: 100 },
  ]

  render(){
    return (
      <div>
        <span>不限</span>
        <Checkbox.Group options={this.planTypes} onChange={this.checkPlanType} />
      </div>
    );
  }
}

export default PlanTypeFilter;
