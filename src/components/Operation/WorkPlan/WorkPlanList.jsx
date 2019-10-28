import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import PlanFilter from './PlanFilter/PlanFilter';
import ContentSearch from './PlanList/ContentSearch';
import styles from './plan.scss';
import Lists from './PlanList/Lists';

class WorkPlanList extends PureComponent {

  static propTypes = {
    planParams: PropTypes.object,
    planListPageParams: PropTypes.object,
    changeStore: PropTypes.func,
    getWorkPlanList: PropTypes.func,
  };

  componentDidMount(){
    const { planParams, planListPageParams } = this.props;
    this.props.getWorkPlanList({ ...planParams, ...planListPageParams });
  }

  seeDetail = () => { // 查看详情
    this.props.changeStore({ planPageKey: 'detail' });
  }

  addNewPlan = () => { // 添加新计划
    this.props.changeStore({ planPageKey: 'add' });
  }

  editPlan = () => { // 编辑计划
    this.props.changeStore({ planPageKey: 'edit' });
  }

  render(){
    return (
      <div className={styles.workPlanList}>
        <PlanFilter {...this.props} />
        <ContentSearch {...this.props} />
        <Lists {...this.props} />
      </div>
    );
  }
}

export default WorkPlanList;
