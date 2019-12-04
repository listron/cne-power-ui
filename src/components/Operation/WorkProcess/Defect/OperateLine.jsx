import React, { Component } from 'react';
import { Timeline } from 'antd';
import PropTypes from 'prop-types';
import styles from './defect.scss';
import moment from 'moment';
import ImgUploader from '../../../Common/Uploader/ImgUploader';

/** 
 * 时间线组件：
 * 说明：1.必须传入属性：流程当前状态defectStatus ,流程信息progressData
*/

class OperateLine extends Component {
  static propTypes = {
    processData: PropTypes.array,
    defectStatus: PropTypes.string,
    defectDetail: PropTypes.object,
  }

  shouldComponentUpdate = (nextProps) => {
    const { defectId } = nextProps.defectDetail;
    if (defectId !== this.props.defectDetail.defectId) {
      return true;
    }
    return false;
  }

  getStatus(status, handleStatus) {
    // 0 待提交 1 审核缺陷 2 处理缺陷 3 验收缺陷  4 已完成
    let result = '';
    switch (status) {
      case '0': result = { label: '提交缺陷', icon: 'goon' }; break;
      case '1': result = { label: '审核工单', icon: 'goon' }; break;
      case '2': result = { label: '执行工单', icon: 'goon' }; break;
      case '3': result = { label: '验收工单', icon: 'goon' }; break;
      case '4': result = { label: handleStatus === '7' ? '已关闭' : '已完成', icon: 'doned' }; break;
      default: result = { label: '', icon: 'goon' }; break;
    }
    return result;
  }
  renderItem = (item) => { // 时间线中的内容 
    const photoAddressArr = item.photoAddress ? item.photoAddress.split(',') : [];
    //  10  新建缺陷 22 关闭缺陷 21 下发缺陷 23 驳回缺陷 31 提交缺陷 51 验收缺陷 41 处理缺陷
    return (
      <div className={styles.processItem}>
        <div className={styles.lineBasic}>
          <div className={styles.flowName}>{item.flowCode === 10 && '新建工单' || item.flowName}</div>
          <div className={styles.status}>{['已解决', '未解决', '', '下发', '驳回', '不合格', '合格', '关闭'][item.handleStatus]}</div>
        </div>
        <div className={styles.processCont}>
          <div className={styles.processMsg}>
            <div className={styles.operateTime}>{moment(item.operateTime).format('YYYY-MM-DD HH:mm:ss')}</div>
            <div className={styles.operateUser}>{item.userFullname || item.operateUser}</div>
          </div>
          <div className={styles.defectProposal}>
            {item.reasonDesc && <div className={styles.reason} ><span>【产生原因】</span> {item.reasonDesc} </div>}
            {item.defectProposal && <div className={styles.reason}> <span>{item.handleStatus === '3' && '【驳回原因】' || '【处理建议】'}  </span>{item.defectProposal}</div>}
            {item.defectProcess && <div className={styles.reason}><span>【处理过程】</span>{item.defectProcess}</div>}
            {item.replaceParts && <div className={styles.reason}><span>【更换备件】</span>{item.replaceParts}</div>}
            {item.photoAddress && <div className={styles.imgBox}>
              <ImgUploader editable={false} data={photoAddressArr.map(item => ({
                uid: `${item}?${Math.random()}`,
                rotate: 0,
                thumbUrl: `${item}?${Math.random()}`,
              }))}
              />
            </div>}
          </div>
        </div>
      </div>
    );
  }
  render() {
    const { processData, defectStatus } = this.props;
    const lastStatus = (processData.length > 0 && processData[processData.length - 1].handleStatus) || '';
    return (
      <div className={styles.timeLineWrap}>
        <div className={styles.titleText}>
          <div className={styles.border} />
          <div className={styles.text}>流程信息</div>
        </div>
        <div className={styles.timeLine}>
          <Timeline className={styles.timeLines}>
            <Timeline.Item dot={<i className={`${'iconfont'} icon-${this.getStatus(defectStatus).icon}`} />} >
              <div className={styles.lastFlowName}> {this.getStatus(defectStatus, lastStatus).label}</div>
            </Timeline.Item>
            {processData.map((item, index) => {
              return (
                <Timeline.Item dot={<i className={`${'iconfont'} ${styles.lineIcon} icon-${['doing', 'begin'][item.handleStatus] || 'review'}`} />} key={'timeline' + index}>
                  {this.renderItem(item)}
                </Timeline.Item>
              );
            })}
          </Timeline>
        </div>
      </div>
    );
  }
}

export default OperateLine;
