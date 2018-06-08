import React, { Component } from 'react';
import { Timeline, Icon } from 'antd';
import PropTypes from 'prop-types';
import styles from './WorkListTimeLine.scss';
class WorkListTimeLine extends Component {
  static propTypes = {
    status: PropTypes.number,
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
          <div>
            <div>
              <b>{item.flowName}</b>
              <span>{item.operateTime}</span>
              {item.operateUser}
            </div>
            <div><b>处理建议</b>{item.defectProposal}</div>
          </div>
          );
      case "审核工单":
        return (
          <div>
            <div>
              <b>{item.flowName}</b>
              <span>{item.operateTime}</span>
              {item.operateUser}
            </div>
            <div><b>处理建议</b>{item.defectProposal}</div>
          </div>
          );
      case "执行工单":
        return (
          <div>
            <div>
              <b>{item.flowName}</b>
              <span>{item.operateTime}</span>
              {item.operateUser}
            </div>
            <div><b>处理建议</b>{item.defectProposal}</div>
          </div>
          );
      case "验收工单":
        return (
          <div>
            <div>
              <b>{item.flowName}</b>
              <span>{item.operateTime}</span>
              {item.operateUser}
            </div>
            <div><b>处理建议</b>{item.defectProposal}</div>
          </div>
          );
      default: 
        return ;
    }
  }

  render() {
    const processData = [{
      "flowID": 1,
      "flowName": "发现缺陷",
      "operateTime": "2018-03-12 12:00",
      "operateUser": "李丽",
      "defectProposal": "来源于创建缺陷的描述来源于创建缺陷的描述",
      "photoAddress": ["", "", ""]
    },
    {
      "flowID": 2,
      "flowName": "发现缺陷",
      "operateTime": "2018-03-12 12:00",
      "operateUser": "李丽",
      "defectProposal": "来源于创建缺陷的描述来源于创建缺陷的描述",
      "photoAddress": ["", "", ""]
    },
    {
      "flowID": 3,
      "flowName": "发现缺陷",
      "operateTime": "2018-03-12 12:00",
      "operateUser": "李丽",
      "defectProposal": "来源于创建缺陷的描述来源于创建缺陷的描述",
      "photoAddress": ["", "", ""]
    },
    {
      "flowID": 4,
      "flowName": "发现缺陷",
      "operateTime": "2018-03-12 12:00",
      "operateUser": "李丽",
      "defectProposal": "来源于创建缺陷的描述来源于创建缺陷的描述",
      "photoAddress": ["", "", ""]
    }];
    
    return (
      <div>
        <Timeline className={styles.WorkListTimeLine} >
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

export default WorkListTimeLine;