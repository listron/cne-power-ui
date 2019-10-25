import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from './plan.scss';

class PlanDetail extends PureComponent {

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
      <div className={styles.planDetail} style={{ transform: planPageKey === 'detail' ? 'translateX(0)' : 'translateX(100%)' }}>
        详情页面在此！妖魔邪道速速退让
        <button onClick={this.backToList}>返回列表</button>
      </div>
    );
  }
}

export default PlanDetail;
