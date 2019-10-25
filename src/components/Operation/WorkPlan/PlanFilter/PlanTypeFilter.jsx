
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Icon, Switch, Tabs, Checkbox } from 'antd';
import styles from './planFilter.scss';

const TabPane = Tabs.TabPane;

class PlanTypeFilter extends PureComponent {

  static propTypes = {
    checkCondition: PropTypes.func,
  };

  checkPlanType = (planTypeCode) => {
    console.log(planTypeCode)
    this.props.checkCondition({ planTypeCode });
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
