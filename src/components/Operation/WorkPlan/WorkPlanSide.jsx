
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import PlanDetail from './Detail/PlanDetail';
// import PlanDetail from './Detail/PlanDetail';
import styles from './plan.scss';

class WorkPlanSide extends PureComponent {

  static propTypes = {
    planPageKey: PropTypes.string,
    changeStore: PropTypes.func,
  };

  backToList = () => { // 返回主列表页
    this.props.changeStore({ planPageKey: 'list' });
  }

  render(){
    const { planPageKey } = this.props;
    return (
      <div
        className={styles.workPlanSide}
        style={{ transform: ['add', 'edit', 'detail'].includes(planPageKey) ? 'translateX(0)' : 'translateX(100%)' }}
      >
        <PlanDetail {...this.props} />
        {/* <PlanDetail {...this.props} /> */}
      </div>
    );
  }
}

export default WorkPlanSide;
