import React, { Component } from 'react';
import { Timeline, Button } from 'antd';
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
    inspectDeviceType: PropTypes.array,
    deviceTypeName: PropTypes.string,
    inspectId: PropTypes.string,
    abnormalItems: PropTypes.object,
    onChangeShowContainer: PropTypes.func,
    getInspectUsers: PropTypes.func,
    getInspectDetailRecord: PropTypes.func,
    changeInspectStore: PropTypes.func,
  }

  constructor(props) {
    super(props);
  }



  renderIcon(flowType) {
    // 2 创建巡检
    // 3 提交验收
    // 4 验收工单
    // 5 执行工单

    switch (flowType) {
      case 2:
        return <i className="iconfont icon-begin" />;
      case 4:
        return <i className="iconfont icon-review" />;
      case 5:
        return <i className="iconfont icon-doing" />;

      default:
        return;
    }
  }


  // renderItem(item, isLast) {
  //   const { trackCount, recordCount } = this.props;
  //   const flowName = item.get('flowName');
  //   if (!isLast) {
  //     return (
  //       <div className={styles.processItem}>
  //         <div className={styles.basic}>
  //           <div className={styles.flowName}>{item.get('flowName') ? item.get('flowName') : ''}</div>
  //           <div className={styles.operateTime}>{item.get('operateTime') ? moment(item.get('operateTime')).format('YYYY-MM-DD HH:mm') : ''}</div>
  //           <div className={styles.operateUser}>{item.get('operateUser') ? item.get('operateUser') : ''}</div>

  //         </div>
  //         {this.renderDetail(item)}
  //       </div>
  //     );
  //   }
  //   return (
  //     <div className={styles.processItem}>
  //       <div className={styles.lastFlowName}>{item.get('flowName')}</div>
  //     </div>
  //   );

  // }

  // renderDetail(item) {
  //   const flowName = item.get('flowName');
  //   const { deviceTypeName, abnormalItems } = this.props;
  //   const abnormalNum = abnormalItems.size;
  //   const transformNum = abnormalItems.filter(item => item.get('isTransform') === '1').size;
  //   if (flowName === '创建巡检') {
  //     return (
  //       <div className={styles.inspectDesc}>
  //         <div className={styles.text}>巡检描述</div>
  //         <div className={styles.content}>{deviceTypeName}</div>
  //       </div>
  //     );
  //   } else if (flowName === '执行工单') {
  //     return (
  //       <div className={styles.inspectDesc}>
  //         <div className={styles.text}>异常设备</div>
  //         <div className={styles.content}>{`${abnormalNum}个`}</div>
  //       </div>
  //     );
  //   } else if (flowName === '验收工单') {
  //     return (
  //       <div className={styles.inspectDesc}>
  //         <div className={styles.text}>已转工单</div>
  //         <div className={styles.content}>{`${transformNum}个`}</div>
  //       </div>
  //     );
  //   }
  // }

  render() {
    const { processData, status } = this.props;
    const flowName = { 2: '创建巡检', 3: '提交验收', 4: '验收工单', 5: '执行工单' };
    //status==='4'，代表着已完成状态

    return (
      <div className={styles.timeLineWrap}>
        <div className={styles.title}>
          <div className={styles.border}></div>
          <div className={styles.text}>流程信息</div>
          <div className={styles.border}></div>
        </div>
        <Timeline className={styles.timeLines} >
          {status === '4' &&
            <Timeline.Item
              dot={<i className="iconfont icon-doned" />}
              key={'已完成'}>
            </Timeline.Item>
          }
          {status === '3' &&
            <Timeline.Item
              dot={<i className="iconfont icon-goon" />}
              key={'待验收'}>
              <div className={styles.flowName}>验收工单</div>

            </Timeline.Item>
          }
          {processData.map((item, index) => {
            return (
              <Timeline.Item
                dot={this.renderIcon(item.flowType)}
                key={'timeline' + index}>
                {/* {this.renderItem(item, index === processData.size)} */}
                <div className={styles.processItem}>
                  <div className={styles.basic}>
                    <div className={styles.flowName}>{flowName[item.flowType]}</div>
                    <div className={styles.operateTime}>{item.startTime}--{item.endTime}</div>
                    <div className={styles.operateUser}>{item.userName}</div>

                  </div>
                  {/* {this.renderDetail(item)} */}
                </div>
              </Timeline.Item>
            );
          })}
        </Timeline>
      </div>
    );
  }
}

export default InspectTimeLine;
