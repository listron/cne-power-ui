
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Icon, Switch } from 'antd';
import styles from './planFilter.scss';

class TitleHandle extends PureComponent {

  static propTypes = {
    seletedTitle: PropTypes.string,
    changeTitle: PropTypes.func,
    checkCondition: PropTypes.func,
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
    this.props.checkCondition({ isMined });
  }

  checkNotEfficacy = (isOverTime) => {
    this.props.checkCondition({ isOverTime });
  }

  render(){
    const { seletedTitle } = this.props;
    return (
      <div>
        <span>筛选条件</span>
        {this.filterInfo.map(e => (
          <span key={e.key} onClick={() => this.clickCondition(e.key)}>
            <span>{e.title}</span>
            {seletedTitle === e.key ? <Icon type="up" /> : <Icon type="down" />}
          </span>
        ))}
        <span>
          <Switch onChange={this.checkMine} />
          <span>我制定的</span>
        </span>
        <span>
          <Switch onChange={this.checkNotEfficacy} />
          <span>已失效计划</span>
        </span>
      </div>
    );
  }
}

export default TitleHandle;
