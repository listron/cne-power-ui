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
    onChange: PropTypes.func,
    defectIdList: PropTypes.array,
    defectId: PropTypes.string,
  }

  constructor(props) {
    super(props);
    this.state = {
      showWarningTip: false,
      warningTipText: '',
      warningTipText: '退出后信息无法保存!'
    }
  }

  onCancelEdit = () => {
    this.setState({ showWarningTip: true, });
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

  onSubmit = (data) => { // 点击提交的时候
    let params = {};
    const { defectDetail, sendDefect, rejectDefect, closeDefect, handleDefect, checkDefect } = this.props;
    const defectId = defectDetail.defectId; //缺陷ID
    const status = defectDetail.defectStatus; // 缺陷状态
    if (status === '1') { // 审核缺陷
      switch (data.dealResult) {
        case 'send':
          params = {
            defectId,
            defectProposal: data.defectProposal ? data.defectProposal : null,
            deadLine: data.deadLine ? data.deadLine.format('YYYY-MM-DD') + ' 23:59:59' : null
          };
          sendDefect(params);
          break;
        case 'reject':
          params = {
            defectId,
            rejectReason: !data.rejectReason ? null : data.rejectReason
          };
          rejectDefect(params);
          break;
        case 'close':
          params = {
            defectId,
            defectProposal: !data.defectProposal ? null : data.defectProposal
          };
          closeDefect(params);
          break;
      }
    }
    if (status === '2') { // 处理缺陷
      let submitImages = this.getSubmitIamges(data.photoData);
      params = {
        defectId,
        defectSolveResult: data.defectSolveResult,
        defectSolveInfo: !data.defectSolveInfo ? null : data.defectSolveInfo,
        replaceParts: !data.replaceParts ? null : data.replaceParts,
        ...submitImages
      };
      handleDefect(params);
    }
    if (status === '3') { // 验收缺陷
      params = {
        defectId,
        checkResult: data.checkResult,
        checkInfo: !data.checkInfo ? null : data.checkInfo,
      };
      checkDefect(params);
    }
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
    console.log('defectId',this.props)
    let index = defectIdList.findIndex(e => e === defectId);
    if (index > -1) {
      if (index === defectIdList.length-1) {
        message.destroy();
        message.config({
          top: 130,
          duration: 2,
          maxCount: 1,
        });
        message.info('已经是最后一条');
      } else {
        this.props.getDefectDetail({ defectId: defectIdList[index +1] });
      }
    }
  }


  getSubmitIamges(images) { // 照片提交
    if (!images) {
      return {
        photoSolveAddress: null,
        rotatePhoto: null
      };
    }
    let solveAddress = [];
    let rotate = [];
    for (var i = 0; i < images.length; i++) {
      solveAddress.push(images[i].thumbUrl);
      rotate.push(images[i].rotate);
    }
    return {
      photoSolveAddress: solveAddress.join(','),
      rotatePhoto: rotate.join(',')
    };
  }


  renderTitle(status) { // 渲染标题 根据状态
    let result = '';
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
    const { defectTypes, defectDetail, isFromAlarm, commonList, otherFrom } = this.props;
    const { showWarningTip, warningTipText } = this.state;
    console.log('test', this.props)
    const processData = defectDetail.processData;
    const status = defectDetail.defectStatus;
    const handleData = defectDetail.handleData
    return (
      <div className={styles.detailWrap}>
        {showWarningTip && <WarningTip onCancel={this.onCancelWarningTip} onOK={this.onConfirmWarningTip} value={warningTipText} />}
        <div className={styles.defectDetail}>
          <div className={styles.header}>
            <div className={styles.text}>{this.renderTitle(status)}</div>
            {!otherFrom && <div className={styles.action}>
              <i className="iconfont icon-last" onClick={this.onPrev} />
              <i className="iconfont icon-next" onClick={this.onNext} />
            </div>}
            <Icon type="arrow-left" className={styles.backIcon} onClick={this.onCancelEdit} />
          </div>
          <div className={styles.content}>
            <div className={styles.basic}>
              <DefectBasicInfo basicInfo={defectDetail} defectTypes={defectTypes} />
            </div>
            <div className={styles.right}>
              <div className={styles.timeLines}>
                <DefectTimeLine processData={processData} handleData={handleData} />
              </div>
              <div className={styles.form}>
                {status !== '0' && status !== '4' &&
                  <DefectHandleForm commonList={commonList} onSubmit={this.onSubmit} status={status} />
                }
              </div>
            </div>
          </div>
        </div>

      </div>
    );
  }
}

export default DefectDetailForm;
