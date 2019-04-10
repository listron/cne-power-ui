import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './defectHandleForm.scss';
import DefectReviewForm from './DefectReviewForm';
import DefectProcessForm from './DefectProcessForm';
import DefectCheckForm from './DefectCheckForm';

class DefectHandleForm extends Component {
  static propTypes = {
    onSubmit: PropTypes.func,
    status: PropTypes.string,
    commonList: PropTypes.array,
    sendDefect: PropTypes.func,
    rejectDefect: PropTypes.func,
    handleDefect: PropTypes.func,
    checkDefect: PropTypes.func,
    onCloseDefectDetail: PropTypes.func,
    defectDetail: PropTypes.object,
    closeDefect: PropTypes.func,
  }

  constructor(props) {
    super(props);
  }

  componentWillUnmount(){
    this.props.changeWorkOrderStore({modify:false})
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
    if (status === '2') { // 处理结果  执行中
      let submitImages = this.getSubmitIamges(data.photoData);
      params = {
        defectId,
        defectSolveResult: data.defectSolveResult,
        defectSolveInfo: !data.defectSolveInfo ? null : data.defectSolveInfo,
        replaceParts: !data.replaceParts ? null : data.replaceParts,
        reasonDesc: !data.reasonDesc ? null : data.reasonDesc,
        ...submitImages
      };
      handleDefect(params);
    }
    if (status === '3') { // 验收缺陷 待提交
      params = {
        defectId,
        checkResult: data.checkResult,
        checkInfo: !data.checkInfo ? null : data.checkInfo,
      };
      checkDefect(params);
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


  getDefaultTitle = (status) => { // 标题
    let result = '';
    switch (status) {
      case '1': result = '审核'; break;
      case '2': result = '处理结果'; break;
      case '3': result = '消缺验收'; break;
      default: result = ''; break;
    }
    return result;
  }




  render() {
    const rightHandler = localStorage.getItem('rightHandler');
    const reviewDefectRight = rightHandler && rightHandler.split(',').includes('workExamine_defect_review');
    const checkDefectRight = rightHandler && rightHandler.split(',').includes('workExamine_defect_check');
    const { status, changeWorkOrderStore,defectId } = this.props;
    return (
      <div className={styles.handleForm}>
        <div className={styles.title}>
          <div className={styles.border}></div>
          <div className={styles.text}>{this.getDefaultTitle(status)}</div>
          <div className={styles.border}></div>
        </div>
        {status === '1' && reviewDefectRight &&
          <DefectReviewForm 
          onSubmit={this.onSubmit} 
          changeWorkOrderStore={changeWorkOrderStore} 
          defectId={defectId}
          />}
        {status === '2' &&
          <DefectProcessForm
            commonList={this.props.commonList}
            onSubmit={this.onSubmit}
            defectId={defectId}
            changeWorkOrderStore={changeWorkOrderStore} />}
        {status === '3' && checkDefectRight &&
          <DefectCheckForm 
          onSubmit={this.onSubmit} 
          changeWorkOrderStore={changeWorkOrderStore} 
          defectId={defectId}
          />}
      </div>
    );
  }
}

export default DefectHandleForm;