import React, { Component } from 'react';
import { Timeline } from 'antd';
import PropTypes from 'prop-types';
import styles from './defectTimeLine.scss';
import moment from 'moment';
import { getHandleStatus } from '../../../../../constants/ticket';

/*
  时间线组件：
  说明：
    1.必须传入属性：流程当前状态status,流程信息progressData
 */

class DefectTimeLine extends Component {
  static propTypes = {
    status: PropTypes.string,
    processData: PropTypes.object,
  }

  constructor(props) {
    super(props);
  }

  getStatus() {
    const { status, processData } = this.props;
    const size = processData.size;
    const handleStatus = processData.getIn([size - 1, 'handleStatus']);
    switch(status){
      case '0':
        return (<span>提交缺陷</span>);
      case '1':
        return (<span>审核工单</span>);
      case '2':
        return (<span>执行工单</span>);
      case '3':
        return (<span>验收工单</span>);
      case '4':
        return (<span>{handleStatus === '7' ? '已关闭' : '已完成'}</span>);
      default:
        return;
    }
  }

  renderIcon(handleStatus) {
    switch(handleStatus){
      case '1':
        return <i className="iconfont icon-begin" />;
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
        return <i className="iconfont icon-review" />;
      case '0':
        return <i className="iconfont icon-doing" />;
      default:
        return;
    }
  }

  renderLastIcon(status) {
    switch(status){
      case '0':
      case '1':
      case '2':
      case '3':
        return null;
      case '4':
        return <i className="iconfont icon-doned" />;
      default:
        return;
    }
  }

  renderItem(item, index) {
    let flowName;
    if(index === 0) {
      flowName = '发现缺陷';
    } else {
      flowName = item.get('flowName');
    }
    return (
      <div className={styles.processItem}>
        <div className={styles.basic}>
          <div className={styles.flowName}>{flowName}</div>
          <div className={styles.operateTime}>{moment(item.get('operateTime')).format('YYYY-MM-DD HH:mm')}</div>
          <div className={styles.operateUser}>{item.get('operateUser')}</div>
        </div>
        <div className={styles.advise}>
          <div className={styles.text}>处理建议</div>
          <div className={styles.status}>{getHandleStatus(item.get("handleStatus"))}</div>
          <div className={styles.defectProposal}>{item.get("defectProposal")}</div>
        </div>
      </div>
    );
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
              <Timeline.Item dot={this.renderIcon(item.get('handleStatus'))} key={'timeline'+index}>
                {this.renderItem(item, index)}               
              </Timeline.Item>
            );
          })}
          <Timeline.Item dot={this.renderLastIcon(status)} className={styles.processStatus}>
            {this.getStatus()}
          </Timeline.Item>
        </Timeline>
      </div> 
    )
  }
}

export default DefectTimeLine;