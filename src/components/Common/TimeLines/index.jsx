import React, { Component } from 'react';
import { Timeline, Icon } from 'antd';
import PropTypes from 'prop-types';
import styles from './style.scss';
import {getHandleStatus} from '../../../constants/ticket';

/*
  时间线组件：
  说明：
    1.必须传入属性：流程当前状态status,流程数据progressData
 */

class TimeLines extends Component {
  static propTypes = {
    status: PropTypes.string,
    processData: PropTypes.object,
  }

  static defaultProps = {
  }

  constructor(props) {
    super(props);
    this.state = {

    }
  }

  getStatus(){
    const processStatus = this.props.status;
    let processData = this.props.processData;
    let size = processData.size;
    let status = processData.getIn([size - 1, "handleStatus"]);
    switch(processStatus){
      case "0":
        return (<span>提交缺陷</span>);
      case "1":
        return (<span>审核工单</span>);
      case "2":
        return (<span>执行工单</span>);
      case "3":
        return (<span>验收工单</span>);
      case "4":
        return (<span>{status === "7" ? "已关闭" : "已完成"}</span>);
      default:
        return;
    }
  }

  getItem(item) {
    let text = item.flowName === "执行工单" ? "处理过程" : "处理建议";
    let icon;

    return (
      <div className={styles.processWrap}>
        <div>
          <b>{item.get("flowName")}</b>
          <span>{item.get("operateTime")}</span>
          {item.get("operateUser")}
        </div>
        <div><b>{text}</b>{getHandleStatus(item.get("handleStatus"))} | {item.get("defectProposal")}</div>
      </div>
    );

    // switch (item.flowName) {
    //   case "发现缺陷":
    //     return (
    //       <div className={styles.processWrap}>
    //         <div>
    //           <b>{item.flowName}</b>
    //           <span>{item.operateTime}</span>
    //           {item.operateUser}
    //         </div>
    //         <div><b>{text}</b>{item.processResult} | {item.defectProposal}</div>
    //       </div>
    //       );
    //   case "审核工单":
    //     return (
    //       <div className={styles.processWrap}>
    //         <div>
    //           <b>{item.flowName}</b>
    //           <span>{item.operateTime}</span>
    //           {item.operateUser}
    //         </div>
    //         <div><b>处理建议</b>{item.processResult} | {item.defectProposal}</div>
    //       </div>
    //       );
    //   case "执行工单":
    //     return (
    //       <div className={styles.processWrap}>
    //         <div>
    //           <b>{item.flowName}</b>
    //           <span>{item.operateTime}</span>
    //           {item.operateUser}
    //         </div>
    //         <div><b>处理过程</b>{item.processResult} | {item.defectProposal}</div>
    //       </div>
    //       );
    //   case "验收工单":
    //     return (
    //       <div className={styles.processWrap}>
    //         <div>
    //           <b>{item.flowName}</b>
    //           <span>{item.operateTime}</span>
    //           {item.operateUser}
    //         </div>
    //         <div><b>处理建议</b>{item.processResult} | {item.defectProposal}</div>
    //       </div>
    //       );
    //   default: 
    //     return ;
    // }
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
          <Timeline.Item className={styles.processStatus}>{this.getStatus()}</Timeline.Item>
        </Timeline>
      </div> 
    )
  }
}

export default TimeLines;