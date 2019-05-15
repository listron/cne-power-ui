import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import DefectBasicInfo from './DefectBasicInfo';
import DefectHandleForm from './DefectHandleForm/DefectHandleForm';
import DefectTimeLine from './DefectTimeLine';
import WarningTip from '../../../Common/WarningTip';
import styles from './workOrder.scss';
import { Icon, message } from 'antd';

class DefectDetailForm extends Component {
  static propTypes = {
    defectDetail: PropTypes.object,
    commonList: PropTypes.array,
    closeDefect: PropTypes.func,
    sendDefect: PropTypes.func,
    rejectDefect: PropTypes.func,
    handleDefect: PropTypes.func,
    checkDefect: PropTypes.func,
    onCloseDefectDetail: PropTypes.func,
    onNext: PropTypes.func,
    onPrev: PropTypes.func,
    isFromAlarm: PropTypes.bool,
    defectTypes: PropTypes.object,
    pageName: PropTypes.string,
    defectIdList: PropTypes.array,
    onChange: PropTypes.func,
    defectId: PropTypes.string,
    resetStore: PropTypes.func,
    getDefectDetail: PropTypes.func,
    getKnowledgebase: PropTypes.func,
    knowledgebaseList: PropTypes.array,
    likeKnowledgebase: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      showWarningTip: false,
      warningTipText: '',
      warningTipText: '退出后信息无法保存!',
    }
  }

  componentWillUnmount() {
    this.props.resetStore()
  }


  onCancelEdit = () => {
    const data = this.props;
    const { pageName, onChange, modify } = this.props;
    modify && this.setState({ showWarningTip: true, });
    if (!modify || data.defectDetail.defectStatus === '4') {//已完成的状态
      this.setState({ showWarningTip: false, });
      onChange({ pageName });  //  退回到之前的页面
    }
  }

  onCancelWarningTip = () => { //取消
    this.setState({
      showWarningTip: false,
    });
  }

  onConfirmWarningTip = () => {  //确定
    this.setState({
      showWarningTip: false,
    });
    const { pageName, onChange } = this.props;
    onChange({ pageName });  //  退回到之前的页面
  }



  onPrev = () => { // 向前
    const { defectIdList, defectId } = this.props;
    let index = defectIdList.findIndex(e => e === defectId);
    if (index > -1) {
      if (index === 0) {
        message.destroy();
        message.config({
          top: 130,
          duration: 2,
          maxCount: 1,
        });
        message.info('已经是第一条');
      } else {
        this.props.getDefectDetail({ defectId: defectIdList[index - 1] });
      }
    }
  }

  onNext = () => { // 向后
    const { defectIdList, defectId } = this.props;
    let index = defectIdList.findIndex(e => e === defectId);
    if (index > -1) {
      if (index === defectIdList.length - 1) {
        message.destroy();
        message.config({
          top: 130,
          duration: 2,
          maxCount: 1,
        });
        message.info('已经是最后一条');
      } else {
        this.props.getDefectDetail({ defectId: defectIdList[index + 1] });
      }
    }
  }


  renderTitle(status) { // 渲染标题 根据状态
    let result = '';
    // 0 待提交 1 审核缺陷 2 处理缺陷 3 验收缺陷  4 已完成
    switch (status) {
      case '1': result = '审核缺陷'; break;
      case '2': result = '处理缺陷'; break;
      case '3': result = '验收缺陷'; break;
      default:
        result = '缺陷详情'; break;
    }
    return result;
  }




  render() {
    const { defectTypes, defectDetail, isFromAlarm, commonList, otherFrom, modify,getKnowledgebase,knowledgebaseList } = this.props;
    const { showWarningTip, warningTipText } = this.state;
    const processData = defectDetail.processData;
    const status = defectDetail.defectStatus;
    const handleData = defectDetail.handleData;
    return (
      <React.Fragment>
        {showWarningTip && <WarningTip onCancel={this.onCancelWarningTip} onOK={this.onConfirmWarningTip} value={warningTipText} />}
        <div className={styles.defectDetail}>
          <div className={styles.header}>
            <div className={styles.text}>{this.renderTitle(status)}</div>
            <div className={styles.arrowBox}>
              {!otherFrom && <div className={styles.action}>
                <i className="iconfont icon-last" onClick={this.onPrev} />
                <i className="iconfont icon-next" onClick={this.onNext} />
              </div>}
              <Icon type="arrow-left" className={styles.backIcon} onClick={this.onCancelEdit} />
            </div>
          </div>
          <div className={styles.content}>
            <div className={styles.basic}>
              <DefectBasicInfo 
              basicInfo={defectDetail} 
              defectTypes={defectTypes} 
              getKnowledgebase={getKnowledgebase} 
              knowledgebaseList={knowledgebaseList}
              likeKnowledgebase={this.props.likeKnowledgebase}
              />
            </div>
            <div className={styles.right}>
              <div className={styles.timeLines}>
                <DefectTimeLine processData={processData} handleData={handleData} />
              </div>
              <div className={styles.form}>
                {status !== '0' && status !== '4' &&
                  <DefectHandleForm commonList={commonList} status={status} {...this.props} />
                }
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default DefectDetailForm;
