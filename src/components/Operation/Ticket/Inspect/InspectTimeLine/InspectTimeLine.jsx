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
  onInspectOrbit = () => {
    const { inspectId,getInspectOrbit}=this.props;
    this.props.onChangeShowContainer({ container: 'inspectOrbit' });
    getInspectOrbit({inspectId})
  }
  onInspectRecord = () => {
    const{inspectDeviceType,inspectId,getInspectDetailRecord,changeInspectStore,getStationDeviceTypes,deviceTypeItems,getInspectUsers,stationCode}=this.props;
    this.props.onChangeShowContainer({ container: 'inspectRecord' });
    //在这发巡检记录的请求
    getInspectDetailRecord({inspectId,pageNum:1,pageSize:10})
   
    getInspectUsers()
    getStationDeviceTypes({stationCodes:stationCode})
    changeInspectStore({deviceTypeItems:deviceTypeItems,pageNum:1,pageSize:10,inspectId:inspectId})
  

  }

  renderIcon(item, isLast) {
    const flowName = item.get('flowName');
    if (isLast && flowName !== '已完成') {
      return <i className="iconfont icon-goon" />;
    }
    switch (flowName) {
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
    const{trackCount,recordCount}=this.props;
    const flowName = item.get('flowName');
    if (!isLast) {
      return (
        <div className={styles.processItem}>
          <div className={styles.basic}>
            <div className={styles.flowName}>{item.get('flowName')?item.get('flowName'):''}</div>
            <div className={styles.operateTime}>{item.get('operateTime')?moment(item.get('operateTime')).format('YYYY-MM-DD HH:mm'):''}</div>
            <div className={styles.operateUser}>{item.get('operateUser')?item.get('operateUser'):''}</div>
            {flowName === '执行工单' ?
              <div>
               {trackCount===1? <Button className={styles.viewStandard} onClick={this.onInspectOrbit}>查看巡检轨迹</Button>:''}
               {recordCount===1? <Button className={styles.viewStandard} onClick={this.onInspectRecord}>详细巡检记录</Button>:''}
                
              </div> : ''}
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
    const transformNum = abnormalItems.filter(item => item.get('isTransform') === '1').size;
    if (flowName === '创建巡检') {
      return (
        <div className={styles.inspectDesc}>
          <div className={styles.text}>巡检描述</div>
          <div className={styles.content}>{deviceTypeName}</div>
        </div>
      );
    } else if (flowName === '执行工单') {
      return (
        <div className={styles.inspectDesc}>
          <div className={styles.text}>异常设备</div>
          <div className={styles.content}>{`${abnormalNum}个`}</div>
        </div>
      );
    } else if (flowName === '验收工单') {
      return (
        <div className={styles.inspectDesc}>
          <div className={styles.text}>已转工单</div>
          <div className={styles.content}>{`${transformNum}个`}</div>
        </div>
      );
    }
  }

  render() {
    const { processData, status,trackCount,recordCount } = this.props;
    //console.log(processData.toJS());
    return (
      <div className={styles.timeLineWrap}>
        <div className={styles.title}>
          <div className={styles.border}></div>
          <div className={styles.text}>流程信息</div>
          <div className={styles.border}></div>
        </div>
        <Timeline className={styles.timeLines} pending={status !== '4'}>
          {processData.map((item, index,) => {
            return (
              <Timeline.Item dot={this.renderIcon(item, index === processData.size - 1)} key={'timeline' + index}>
                {this.renderItem(item, index === processData.size - 1,)}
              </Timeline.Item>
            );
          })}
        </Timeline>
      </div>
    )
  }
}

export default InspectTimeLine;