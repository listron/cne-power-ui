import React, { Component } from 'react';
import { Timeline, Icon } from 'antd';
import PropTypes from 'prop-types';
import styles from './style.scss';

/*
  时间线组件：
  说明：
    1.必须传入属性：流程当前状态status,流程数据progressData
 */

class TimeLines extends Component {
  static propTypes = {
    status: PropTypes.number,
    processData: PropTypes.array,
  }

  static defaultProps={
    status: 0,
    processData: [{
      "flowID": 1,
      "flowName": "发现缺陷",
      "operateTime": "2018-03-12 12:00",
      "operateUser": "李丽",
      "defectProposal": "来源于创建缺陷的描述来源于创建缺陷的描述",
      "photoAddress": ["", "", ""]
    }],
  }

  constructor(props) {
    super(props);
    this.state = {

    }
  }

  getStatus(){
    const processStatus=this.props.status;
    switch(processStatus){
      case 0:
        return (<span>提交工单</span>);
      case 1:
        return (<span>审核工单</span>);
      case 2:
        return (<span>执行工单</span>);
      case 3:
        return (<span>验收工单</span>);
      case 4:
        return (<span>已完成</span>);
      default:
        return (<span>所有工单</span>);
    }
  }

  getItem(item) {
    switch (item.flowName) {
      case "发现缺陷":
        return (
          <div className={styles.processWrap}>
            <div>
              <b>{item.flowName}</b>
              <span>{item.operateTime}</span>
              {item.operateUser}
            </div>
            <div><b>处理建议</b>{item.processResult} | {item.defectProposal}</div>
          </div>
          );
      case "审核工单":
        return (
          <div className={styles.processWrap}>
            <div>
              <b>{item.flowName}</b>
              <span>{item.operateTime}</span>
              {item.operateUser}
            </div>
            <div><b>处理建议</b>{item.processResult} | {item.defectProposal}</div>
          </div>
          );
      case "执行工单":
        return (
          <div className={styles.processWrap}>
            <div>
              <b>{item.flowName}</b>
              <span>{item.operateTime}</span>
              {item.operateUser}
            </div>
            <div><b>处理过程</b>{item.processResult} | {item.defectProposal}</div>
          </div>
          );
      case "验收工单":
        return (
          <div className={styles.processWrap}>
            <div>
              <b>{item.flowName}</b>
              <span>{item.operateTime}</span>
              {item.operateUser}
            </div>
            <div><b>处理建议</b>{item.processResult} | {item.defectProposal}</div>
          </div>
          );
      default: 
        return ;
    }
  }

  render() {
    const processData=this.props.processData;
    return (
      <div>
        <Timeline className={styles.TimeLines}  >
          {processData.map((item, index)=>{
            return (
              <Timeline.Item key={"timeline"+index}>
                {this.getItem(item)}               
              </Timeline.Item>
            );
          })}
          <Timeline.Item className={styles.processStatus} >{this.getStatus()}</Timeline.Item>
        </Timeline>
      </div> 
    )
  }
}

export default TimeLines;