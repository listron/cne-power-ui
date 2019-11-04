
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import PlanDetail from './Detail/PlanDetail';
import AddEditPlan from './AddEdit/AddEditPlan';
import styles from './plan.scss';

class WorkPlanSide extends PureComponent {

  static propTypes = {
    planPageKey: PropTypes.string,
  };

  render(){
    const { planPageKey } = this.props;
    return (
      <div
        className={styles.workPlanSide}
        style={{ transform: ['add', 'edit', 'detail'].includes(planPageKey) ? 'translateX(0)' : 'translateX(100%)' }}
      >
        {planPageKey === 'detail' && <PlanDetail {...this.props} />}
        {['add', 'edit'].includes(planPageKey) && <AddEditPlan {...this.props} />}
      </div>
    );
  }
}

export default WorkPlanSide;
