import React, { Component } from 'react';
import { Timeline } from 'antd';
import PropTypes from 'prop-types';
import styles from './defectTimeLine.scss';
import moment from 'moment';
import ImgListModal from '../../../../Common/Uploader/ImgListModal';
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
    this.state = {
      showImgModal: false,
      currentImgIndex: 0,
      images: []
    }
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

  showImgs = (photoAddressArr) => {
    const images =  photoAddressArr.map((item, index) => {
      return {
        uid: index,
        rotate: 0,
        thumbUrl: item
      }
    });
    
    this.setState({
      showImgModal: true,
      images
    });
  }

  closeImgs = () => {
    this.setState({
      showImgModal: false
    });
  }

  changeCurrentImgIndex = (index) => {
    this.setState({
      currentImgIndex: index
    });
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
        return <i className="iconfont icon-goon" />;
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
    const photoAddress = item.get('photoAddress');
    const photoAddressArr = !photoAddress ? [] : photoAddress.split(',');
    return (
      <div className={styles.processItem}>
        <div className={styles.basic}>
          <div className={styles.flowName}>{flowName}</div>
          <div className={styles.operateTime}>{moment(item.get('operateTime')).format('YYYY-MM-DD HH:mm')}</div>
          <div className={styles.operateUser}>{item.get('operateUser')}</div>
          {photoAddressArr.length>0 && <div className={styles.imgList} onClick={()=>this.showImgs(photoAddressArr)}>{`有图${photoAddressArr.length}`}</div>}
        </div>
        <div className={styles.advise}>
          <div className={styles.text}>处理建议</div>
          <div className={styles.status}>{getHandleStatus(item.get("handleStatus"))}</div>
          <div className={styles.defectProposal}>
            <span>{item.get("defectProposal")}</span>
            <span>{item.get('replaceParts') ? item.get('replaceParts') : null}</span>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { processData, status } = this.props;
    const { currentImgIndex, showImgModal, images } = this.state;
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