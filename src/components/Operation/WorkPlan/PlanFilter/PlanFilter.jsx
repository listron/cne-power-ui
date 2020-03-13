
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import TitleHandle from './TitleHandle';
import PlanTypeFilter from './PlanTypeFilter';
import PlanStations from './PlanStations';
import PlanCircleFilter from './PlanCircleFilter';
import PlanEnable from './PlanEnable';
import CheckedConditionHandler from './CheckedConditionHandler';
import styles from './planFilter.scss';

class PlanFilter extends PureComponent {

  static propTypes = {
    theme: PropTypes.string,
    stations: PropTypes.array,
    planParams: PropTypes.object,
    planListPageParams: PropTypes.object,
    changeStore: PropTypes.func,
    getWorkPlanList: PropTypes.func,
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
    const { planParams, stations, planListPageParams, theme } = this.props;
    const { seletedTitle } = this.state;
    const { planTypeCode = [], stationCodes = [], cycleTypeCode = [], planStatus = [], isMined = true, isOverTime = false} = planParams;
    return (
      <div className={`${styles.planFilter} ${styles[theme]}`}>
        <TitleHandle
          isMined={isMined}
          isOverTime={isOverTime}
          seletedTitle={seletedTitle}
          changeTitle={this.changeTitle}
          onConditionChange={this.onConditionChange}
        />
        {seletedTitle === 'planTypeCode' && <PlanTypeFilter
          onConditionChange={this.onConditionChange}
          planTypeCode={planTypeCode}
        />}
        {seletedTitle === 'stationCodes' && <PlanStations
          stationCodes={stationCodes}
          stations={stations.filter(e => (e.stationType === 1 && e.isConnected === 1))}
          onConditionChange={this.onConditionChange}
        />}
        {seletedTitle === 'cycleTypeCode' && <PlanCircleFilter
          cycleTypeCode={cycleTypeCode}
          onConditionChange={this.onConditionChange}
        />}
        {seletedTitle === 'planStatus' && <PlanEnable
          planStatus={planStatus}
          onConditionChange={this.onConditionChange}
        />}
        <CheckedConditionHandler
          stations={stations}
          planParams={planParams}
          planListPageParams={planListPageParams}
          changeStore={this.props.changeStore}
          getWorkPlanList={this.props.getWorkPlanList}
        />
      </div>
    );
  }
}

export default PlanFilter;
