import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import PlanFilter from './PlanFilter/PlanFilter';
import ContentSearch from './PlanList/ContentSearch';
import styles from './plan.scss';
import Lists from './PlanList/Lists';

class WorkPlanList extends PureComponent {

  static propTypes = {
    planPageKey: PropTypes.string,
  };

  state = { listShow: true }

  componentWillReceiveProps(nextProps){
    const { planPageKey } = nextProps;
    const prePageKey = this.props.planPageKey;
    if (planPageKey === 'list' && prePageKey !== 'list') { // 侧边页返回list页面
      this.setState({ listShow: true });
    }
    if (planPageKey !== 'list' && prePageKey === 'list') { // 主页去侧边页
      setTimeout(() => {
        this.setState({ listShow: false });
      }, 500);
    }
  }

  render(){
    const { listShow } = this.state;
    return (
      <div
        className={styles.workPlanList}
        style={{
          display: listShow ? 'block' : 'none',
        }}
      >
        <PlanFilter {...this.props} />
        <ContentSearch {...this.props} />
        <Lists {...this.props} />
      </div>
    );
  }
}

export default WorkPlanList;
