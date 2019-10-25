
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from './plan.scss';

class HandleWorkPlan extends PureComponent {

  static propTypes = {
    // editModalShow: PropTypes.bool,
  };

  backToList = () => { // 返回主列表页

  }

  render(){
    return (
      <div className={styles.workPlanList}>
        编辑或者新增计划页面
        <button onClick={this.backToList}>返回</button>
      </div>
    );
  }
}

export default HandleWorkPlan;
