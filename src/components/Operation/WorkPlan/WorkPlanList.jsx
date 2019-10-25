import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from './plan.scss';

class WorkPlanList extends PureComponent {

  static propTypes = {
    // editModalShow: PropTypes.bool,
  };

  seeDetail = () => { // 查看详情

  }

  addNewPlan = () => { // 添加新计划

  }

  editPlan = () => { // 编辑计划
    
  }

  render(){
    return (
      <div className={styles.workPlanList}>
        这个是传说中的工作列表页面
        <button onClick={this.seeDetail}>查看详情</button>
        <button onClick={this.addNewPlan}>添加新计划</button>
        <button onClick={this.editPlan}>编辑计划</button>
      </div>
    );
  }
}

export default WorkPlanList;
