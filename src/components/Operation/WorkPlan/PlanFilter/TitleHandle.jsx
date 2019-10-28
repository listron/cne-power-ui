
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Icon, Switch } from 'antd';
import styles from './planFilter.scss';

class TitleHandle extends PureComponent {

  static propTypes = {
    isMined: PropTypes.bool,
    isOverTime: PropTypes.bool,
    seletedTitle: PropTypes.string,
    changeTitle: PropTypes.func,
    onConditionChange: PropTypes.func,
  };

  filterInfo = [
    {
      key: 'planTypeCode',
      title: '计划类型',
    }, {
      key: 'stationCodes',
      title: '适用电站',
    }, {
      key: 'cycleTypeCode',
      title: '周期',
    }, {
      key: 'planStatus', // 1 启用 2停用 3删除 
      title: '启用状态',
    },
  ]

  clickCondition = (condition) => {
    this.props.changeTitle(condition);
  }

  checkMine = (isMined) => {
    this.props.onConditionChange({ isMined });
  }

  checkNotEfficacy = (isOverTime) => {
    this.props.onConditionChange({ isOverTime });
  }

  render(){
    const { seletedTitle, isMined, isOverTime } = this.props;
    return (
      <div className={styles.titleHandle}>
        <span>筛选条件</span>
        {this.filterInfo.map(e => (
          <span key={e.key} onClick={() => this.clickCondition(e.key)} className={styles.eachHandlerTitle}>
            <span className={styles.titleTip}>{e.title}</span>
            <Icon className={styles.titleIcon} type={seletedTitle === e.key ? 'up' : 'down'} />
          </span>
        ))}
        <span className={styles.eachSwtich}>
          <Switch onChange={this.checkMine} checked={isMined} />
          <span>我制定的</span>
        </span>
        <span className={styles.eachSwtich}>
          <Switch onChange={this.checkNotEfficacy} checked={isOverTime} />
          <span>已失效计划</span>
        </span>
      </div>
    );
  }
}

export default TitleHandle;
