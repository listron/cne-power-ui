
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Icon, Switch } from 'antd';
import TitleHandle from './TitleHandle';
import PlanTypeFilter from './PlanTypeFilter';
import PlanStations from './PlanStations';
import PlanCircleFilter from './PlanCircleFilter';
import PlanEnable from './PlanEnable';
import styles from './planFilter.scss';

class PlanFilter extends PureComponent {

  static propTypes = {
    stations: PropTypes.array,
    planParams: PropTypes.object,
    planListPageParams: PropTypes.object,
    changeStore: PropTypes.object,
    getWorkPlanList: PropTypes.object,
  };

  state = {
    seletedTitle: '', // 选中条件项'planTypeCode计划类型,stationCodes适用电站,cycleTypeCode周期,planStatus启用状态'
  }

  changeTitle = (conditionName) => { // 条件点击
    const { seletedTitle } = this.state;
    this.setState({ seletedTitle: seletedTitle === conditionName ? '' : conditionName });
  }

  onConditionChange = (values) => {
    const { planParams, planListPageParams } = this.props;
    const newPlanParams = { ...planParams, ...values };
    const newPageParams = {
      ...planListPageParams,
      pageNum: 1,
      pageSize: 10,
    };
    this.props.changeStore({ // 修改参数
      planParams: newPlanParams,
      planListPageParams: newPageParams,
    });
    this.props.getWorkPlanList({ // 请求列表
      ...newPlanParams,
      ...newPageParams,
    });
  }

  render(){
    const { planParams, stations } = this.props;
    const { seletedTitle } = this.state;
    const { planTypeCode = [], stationCodes = [], cycleTypeCode = [], planStatus = [], isMined = true, isOverTime = false} = planParams;
    return (
      <div>
        <TitleHandle
          isMined={isMined}
          isOverTime={isOverTime}
          seletedTitle={seletedTitle}
          changeTitle={this.changeTitle}
          onConditionChange={this.onConditionChange}
        />
        <PlanTypeFilter
          onConditionChange={this.onConditionChange}
          planTypeCode={planTypeCode}
        />
        <PlanStations
          stationCodes={stationCodes}
          stations={stations}
          onConditionChange={this.onConditionChange}
        />
        <PlanCircleFilter
          cycleTypeCode={cycleTypeCode}
          onConditionChange={this.onConditionChange}
        />
        <PlanEnable
          planStatus={planStatus}
          onConditionChange={this.onConditionChange}
        />
      </div>
    );
  }
}

export default PlanFilter;
