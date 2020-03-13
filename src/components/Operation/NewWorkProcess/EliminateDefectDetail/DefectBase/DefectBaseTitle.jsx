import React, { Component } from 'react';
import styles from './baseinfo.scss';
import { localStateName } from '../../Common/processIconCode';

export default class DefectBaseTitle extends Component {

  static propTypes = {

  };

  toCoordinate = () => { // 协调
    console.log('触发协调');
  }

  toOvertime = () => { // 超时
    console.log('超时了！！！');
  }

  render() {
    // 根据状态, 确定后方协调，超时及状态栏目是否展示
    // 新建, 派发: 无;
    // 待审核: button color:#df4b33;
    // 已退回: button color:#df4b33;
    // 执行中: button  color:#199475;
    // 待验收: button  color:#df4b33;
    // 待领取: button  color:#df4b33;
    // 已结单: img  特殊已结单图片
    const { baseInfo = {} } = this.props;
    // const { isOverTime, isCoordinate, stateName } = baseInfo;
    const { isOverTime, isCoordinate } = baseInfo;
    const stateName = '已结单';

    console.log('baseInfo', baseInfo);
    return (
      <div className={styles.defectBaseTitle}>
        <span className={styles.baseTitle}>基本信息</span>
        <span className={styles.statusPart}>
          {isCoordinate &&
            <span
              className={`iconfont icon-xietiao ${styles.coordinate}`}
              onClick={this.toCoordinate}
            />
          }
          {isOverTime === 2 && <span
            className={`iconfont icon-chaoshi ${styles.overtime}`}
            onClick={this.toOvertime}
          />}

          {stateName && localStateName(stateName) !== 'complete' &&
            <span className={styles.statusName} stateName={localStateName(stateName)}>{stateName} </span>}
          {localStateName(stateName) === 'complete' && <span className={`iconfont icon-jiedan ${styles.alreadyFinish}`} />}
        </span>
      </div>
    );
  }
}
