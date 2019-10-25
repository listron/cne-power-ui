import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from './plan.scss';

class PlanDetail extends PureComponent {

  static propTypes = {
    // editModalShow: PropTypes.bool,
  };

  backToList = () => { // 返回主列表页
    
  }

  render(){
    return (
      <div className={styles.workPlanList}>
        详情页面在此！妖魔邪道速速退让
        <button onClick={this.backToList}>返回列表</button>
      </div>
    );
  }
}

export default PlanDetail;
