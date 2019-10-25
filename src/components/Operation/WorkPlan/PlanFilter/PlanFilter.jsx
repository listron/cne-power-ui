
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Icon, Switch } from 'antd';
import TitleHandle from './TitleHandle';
import PlanTypeFilter from './PlanTypeFilter';
import PlanStations from './PlanStations';


import styles from './planFilter.scss';

class PlanFilter extends PureComponent {

  static propTypes = {
    stations: PropTypes.array,
    planParams: PropTypes.object,
  };

  state = {
    seletedTitle: '', // 选中条件项'planTypeCode计划类型,stationCodes适用电站,cycleTypeCode周期,planStatus启用状态'
  }

  changeTitle = (conditionName) => { // 条件点击
    const { seletedTitle } = this.state;
    this.setState({ seletedTitle: seletedTitle === conditionName ? '' : conditionName });
  }

  onConditionChange = (values) => {
    console.log(values);
  }

  render(){
    const { planParams, stations } = this.props;
    const { seletedTitle } = this.state;
    return (
      <div>
        <TitleHandle
          seletedTitle={seletedTitle}
          changeTitle={this.changeTitle}
          onConditionChange={this.onConditionChange}
        />
        <PlanTypeFilter onConditionChange={this.onConditionChange} />
        <PlanStations stationCodes={[]} stations={stations} onConditionChange={this.onConditionChange} />
      </div>
    );
  }
}

export default PlanFilter;
