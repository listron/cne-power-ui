import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import PlanFilter from './PlanFilter/PlanFilter';
import ContentSearch from './PlanList/ContentSearch';
import styles from './plan.scss';
import Lists from './PlanList/Lists';

class WorkPlanList extends PureComponent {

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
