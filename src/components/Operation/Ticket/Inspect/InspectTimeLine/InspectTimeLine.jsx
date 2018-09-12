import React, { Component } from 'react';
import { Timeline } from 'antd';
import PropTypes from 'prop-types';
import styles from './inspectTimeLine.scss';
import moment from 'moment';

/*
  时间线组件：
  说明：
    1.必须传入属性：流程当前状态status,流程信息progressData
 */

class InspectTimeLine extends Component {
  static propTypes = {
    status: PropTypes.string,
    processData: PropTypes.object,
    deviceTypeName: PropTypes.string,
    abnormalItems: PropTypes.object,
  }

  constructor(props) {
    super(props);
  }

  renderIcon(item, isLast) {
    if(isLast) {
      return null;
    }
    const flowName = item.get('flowName');
    switch(flowName){
      case '创建巡检':
        return <i className="iconfont icon-begin" />;
      case '执行工单':
        return <i className="iconfont icon-doing" />;
      case '验收工单':
        return <i className="iconfont icon-review" />;
      case '已完成':
        return <i className="iconfont icon-doned" />;
      default:
        return;
    }
  }


  renderItem(item, isLast) {
    if(!isLast) {
      return (
        <div className={styles.processItem}>
          <div className={styles.basic}>
            <div className={styles.flowName}>{item.get('flowName')}</div>
            <div className={styles.operateTime}>{moment(item.get('operateTime')).format('YYYY-MM-DD HH:mm')}</div>
            <div className={styles.operateUser}>{item.get('operateUser')}</div>
          </div>
          {this.renderDetail(item)}
        </div>
      );
    } else {
      return (
        <div className={styles.processItem}>
          <div className={styles.lastFlowName}>{item.get('flowName')}</div>
        </div>
      );
    }
  }

  renderDetail(item) {
    const flowName = item.get('flowName');
    const { deviceTypeName, abnormalItems } = this.props;
    const abnormalNum = abnormalItems.size;
    const transformNum = abnormalItems.filter(item=>item.get('isTransform')==='1').size;
    if(flowName === '创建巡检') {
      return (
        <div className={styles.inspectDesc}>
          <div className={styles.text}>巡检描述</div>
          <div className={styles.content}>{deviceTypeName}</div>
        </div>
      );
    } else if(flowName === '执行工单') {
      return (
        <div className={styles.inspectDesc}>
          <div className={styles.text}>异常设备</div>
          <div className={styles.content}>{abnormalNum}</div>
        </div>
      );
    } else if(flowName === '验收工单') {
      return (
        <div className={styles.inspectDesc}>
          <div className={styles.text}>已转工单</div>
          <div className={styles.content}>{transformNum}</div>
        </div>
      );
    }
  }

  render() {
    const { processData, status } = this.props;
    return (
      <div className={styles.timeLineWrap}>
        <div className={styles.title}>
          <div className={styles.border}></div>
          <div className={styles.text}>流程信息</div>
          <div className={styles.border}></div>
        </div>
        <Timeline className={styles.timeLines} pending={status!=='4'}>
          {processData.map((item, index)=>{
            return (
              <Timeline.Item dot={this.renderIcon(item, index===processData.size-1)} key={'timeline'+index}>
                {this.renderItem(item, index===processData.size-1)}               
              </Timeline.Item>
            );
          })}
        </Timeline>
      </div> 
    )
  }
}

export default InspectTimeLine;