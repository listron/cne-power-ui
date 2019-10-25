
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Icon, Switch } from 'antd';
import TitleHandle from './TitleHandle';
import styles from './planFilter.scss';

class PlanFilter extends PureComponent {

  static propTypes = {
    planParams: PropTypes.object,
  };

  state = {
    seletedTitle: '', // 选中条件项'planTypeCode计划类型,stationCodes适用电站,cycleTypeCode周期,planStatus启用状态'
  }

  changeTitle = (conditionName) => { // 条件点击
    const { seletedTitle } = this.state;
    this.setState({ seletedTitle: seletedTitle === conditionName ? '' : conditionName });
  }

  checkCondition = (values) => {
    console.log(values);
  }

  render(){
    const { planParams } = this.props;
    const { seletedTitle } = this.state;
    return (
      <div>
        <TitleHandle
          seletedTitle={seletedTitle}
          changeTitle={this.changeTitle}
          checkCondition={this.checkCondition}
        />

      </div>
    );
  }
}

export default PlanFilter;
