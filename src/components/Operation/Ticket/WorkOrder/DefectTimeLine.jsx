import React, { Component } from 'react';
import { Timeline } from 'antd';
import PropTypes from 'prop-types';
import styles from './workOrder.scss';
import moment from 'moment';
import ImgListModal from '../../../Common/Uploader/ImgListModal';
import { getHandleStatus } from '../../../../constants/ticket';

/*
  时间线组件：
  说明：
    1.必须传入属性：流程当前状态status,流程信息progressData
 */

class DefectTimeLine extends Component {
  static propTypes = {
    status: PropTypes.string,
    processData: PropTypes.array,
    handleData: PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.state = {
      showImgModal: false,
      currentImgIndex: 0,
      images: []
    }
  }

  getStatus(status, handleStatus) {
    let result = '';
    switch (status) {
      case '0':
        result = (<span>提交缺陷</span>); break;
      case '1':
        result = (<span>审核工单</span>); break;
      case '2':
        result = (<span>执行工单</span>); break;
      case '3':
        result = (<span>验收工单</span>); break;
      case '4':
        result = (<span>{handleStatus === '7' ? '已关闭' : '已完成'}</span>); break;
      default:
        result = ''; break;
    }
    return result;
  }

  showImgs = (photoAddressArr) => { // 查看图片详情
    const images = photoAddressArr.map((item, index) => {
      return {
        uid: index,
        rotate: 0,
        thumbUrl: item
      }
    });
    this.setState({ showImgModal: true, images });
  }

  closeImgs = () => { // 关闭图片
    this.setState({ showImgModal: false });
  }

  changeCurrentImgIndex = (index) => {
    this.setState({
      currentImgIndex: index
    });
  }

  renderIcon(handleStatus) { // 图标
    let result = '';
    switch (handleStatus) {
      case '1': result = <i className="iconfont icon-begin" />; break;
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
        result = <i className="iconfont icon-review" />; break;
      case '0':
        result = <i className="iconfont icon-doing" />; break;
      default:
        result = ''
    }
    return result
  }

  renderLastIcon(status) { // 最后的一个图标
    let result = '';
    switch (status) {
      case '0':
      case '1':
      case '2':
      case '3':
        result = <i className="iconfont icon-goon" />; break;
      case '4':
        result = <i className="iconfont icon-doned" />; break;
      default:
        result = '';
    }
    return result;
  }

  renderItem = (item, index, handleData) => {
    let flowName = index === 0 ? '发现缺陷' : item.flowName;
    const photoAddress = item.photoAddress;
    const handleStatus = item.handleStatus;
    const photoAddressArr = photoAddress ? photoAddress.split(',') : [];
    const defectProposal = item.defectProposal;
    const splitIndex = defectProposal.indexOf('：');
    let proccessTitle = '', proccessText = '', refuseText = ['4'], suggestText = ['1', '2', '3', '5', '6'], doneText = ['0', '7'];

    splitIndex > 0 && (proccessText = defectProposal.slice(splitIndex + 1));
    refuseText.includes(handleStatus) && (proccessTitle = '驳回原因');
    suggestText.includes(handleStatus) && (proccessTitle = '处理建议');
    doneText.includes(handleStatus) && (proccessTitle = '处理过程');

    return (
      <div className={styles.processItem}>
        <div className={styles.lineBasic}>
          <div className={styles.flowName}>{flowName}</div>
          <div className={styles.operateTime}>{moment(item.operateTime).format('YYYY-MM-DD HH:mm')}</div>
          <div className={styles.operateUser}>{item.operateUser}</div>
        </div>
        <div className={styles.advise}>
          {/* <div className={styles.text}>{proccessTitle}</div> */}
          <div className={styles.status}>{getHandleStatus(handleStatus)}</div>
          <div className={styles.defectProposal}>
            {/* <span>{proccessText}</span>
            <span>{item.replaceParts ? item.replaceParts : null}</span> */}
            {item.reasonDesc && <div><span>产生原因</span>{item.reasonDesc}</div>}
            {/* {item.defectProposal && <div><span> {proccessTitle}</span>{item.defectProposal}</div>} */}
            {item.defectProposal && <div>{item.defectProposal}</div>}
            {item.photoAddress && <div className={styles.imgBox}>
              <span>处理照片</span>
              {photoAddressArr.length > 0 && <div className={styles.imgList} onClick={() => this.showImgs(photoAddressArr)}>{`有图${photoAddressArr.length}`}</div> || '无'}
            </div>}
            {handleData.replaceParts && <div><span>更换备件</span>{handleData.replaceParts}</div>}
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { processData, handleData } = this.props;
    const { currentImgIndex, showImgModal, images } = this.state;
    const lastStatus = (processData.length > 0 && processData[processData.length - 1].handleStatus) || '';
    const status = handleData && handleData.status;
    return (
      <div className={styles.timeLineWrap}>
        <ImgListModal
          data={images}
          imageListShow={showImgModal}
          hideImg={this.closeImgs}
          currentImgIndex={currentImgIndex}
          changeCurrentImgIndex={this.changeCurrentImgIndex} />
        <div className={styles.title}>
          <div className={styles.border}></div>
          <div className={styles.text}>流程信息</div>
          <div className={styles.border}></div>
        </div>
        <Timeline className={styles.timeLines} pending={status !== '4'}>
          {processData.map((item, index) => {
            return (
              <Timeline.Item dot={this.renderIcon(item.handleStatus)} key={'timeline' + index}>
                {this.renderItem(item, index, handleData)}
              </Timeline.Item>
            );
          })}
          <Timeline.Item dot={this.renderLastIcon(status)} className={styles.processStatus}>
            {this.getStatus(status, lastStatus)}
          </Timeline.Item>
        </Timeline>
      </div>
    )
  }
}

export default DefectTimeLine;
