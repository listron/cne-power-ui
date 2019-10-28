
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from './plan.scss';

class HandleWorkPlan extends PureComponent {

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
        className={styles.handleWorkPlan}
        style={{ transform: ['add', 'edit'].includes(planPageKey) ? 'translateX(0)' : 'translateX(100%)' }}
        
      >
        编辑或者新增计划页面
        <button onClick={this.backToList}>返回</button>
      </div>
    );
  }
}

export default HandleWorkPlan;
