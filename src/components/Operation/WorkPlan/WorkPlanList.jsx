import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from './plan.scss';

class WorkPlanList extends PureComponent {

  static propTypes = {
    changeStore: PropTypes.func,
  };

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
        <div>筛选区域</div>
        <div>内容制定人选择</div>
        <div>添加计划 批量删除 分页器</div>
        <div>表格</div>
        <div>当前选中项 取消选择</div>
        <button onClick={this.seeDetail}>查看详情</button>
        <button onClick={this.addNewPlan}>添加新计划</button>
        <button onClick={this.editPlan}>编辑计划</button>
      </div>
    );
  }
}

export default WorkPlanList;
