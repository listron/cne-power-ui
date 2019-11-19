import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styles from './defect.scss';
import BasicInfo from './BasicInfo';
import OperateLine from './OperateLine';
import { Form, Button } from 'antd';
import DefectFormReview from './DefectFormReview';// 审核
import DefectProcessForm from './DefectProcessForm'; // 执行
import DefectCheckForm from './DefectCheckForm'; // 验收


class DetailContiner extends Component {

  static propTypes = {
    theme: PropTypes.string,
    history: PropTypes.object,
    getDefectDetail: PropTypes.func,
    getDefectCommonList: PropTypes.func,
    changeStore: PropTypes.func,
    defectDetail: PropTypes.object,
    getRelevancedocket: PropTypes.func,
    processData: PropTypes.array,
    form: PropTypes.object,
    defectId: PropTypes.string,
    sendDefect: PropTypes.func,
    closeDefect: PropTypes.func,
    rejectDefect: PropTypes.func,
    handleDefect: PropTypes.func,
    checkDefect: PropTypes.func,
  };


  constructor() {
    super();
  }


  onReset = () => {
    this.props.form.resetFields();
  }

  handleSubmit = () => {
    const { defectStatus } = this.props.defectDetail;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('values', values);
        defectStatus === '1' && this.toReview(values);
        defectStatus === '2' && this.toProcess(values);
        defectStatus === '3' && this.toCheck(values);
      }
    });
  };

  callBackTableList = () => { // 返回列表页
    const { history } = this.props;
    const { pathname } = history.location;
    history.push(`${pathname}?page=list&tab=defect`);
  }

  getSubmitIamges(images) { // 照片提交
    if (!images) {
      return { photoSolveAddress: '', rotatePhoto: '' };
    }
    const solveAddress = [], rotate = [];
    images.map(item => {
      solveAddress.push(item.thumbUrl);
      rotate.push(item.rotate);
    });
    return {
      photoSolveAddress: solveAddress.join(','),
      rotatePhoto: rotate.join(','),
    };
  }


  toReview = (values) => { // 审核缺陷
    const { defectId, sendDefect, closeDefect, rejectDefect } = this.props;
    const { status, deadLine, defectProposal, rejectReason } = values;
    const initDeadLine = deadLine && deadLine.format('YYYY-MM-DD HH:mm:ss') || '';
    status === 'send' && sendDefect({ defectId, defectProposal, deadLine: initDeadLine, func: this.callBackTableList });
    status === 'reject' && rejectDefect({ defectId, rejectReason, func: this.callBackTableList });
    status === 'close' && closeDefect({ defectId, defectProposal, func: this.callBackTableList });
  }


  toProcess = (values) => { // 执行缺陷
    const { defectId, handleDefect } = this.props;
    const { photoData, ...rest } = values;
    const submitImages = this.getSubmitIamges(photoData);
    handleDefect({ defectId, ...rest, ...submitImages, func: this.callBackTableList });
  }


  toCheck = (values) => { // 验收缺陷
    const { defectId, checkDefect } = this.props;
    checkDefect({ defectId, ...values, func: this.callBackTableList });
  }



  render() {
    const { theme = 'light', defectDetail, processData, form, commonList } = this.props;
    const { defectStatus } = defectDetail; // defectStatus  当前的流程状态
    // 0 待提交 1 审核缺陷 2 处理缺陷 3 验收缺陷  4 已完成
    const rightHandler = localStorage.getItem('rightHandler');
    const reviewDefectRight = rightHandler && rightHandler.split(',').includes('workExamine_defect_review');
    const checkDefectRight = rightHandler && rightHandler.split(',').includes('workExamine_defect_check');
    console.log('defectStatus', defectStatus);
    return (
      <div className={styles.baseInfoCont}>
        <BasicInfo {...this.props} />
        <div className={styles.rightCont}>
          <div className={styles.process}>
            <div className={styles.titleText}>
              <div className={styles.border} />
              <div className={styles.text}>{['审核', '处理结果', '消缺验收'][defectStatus - 1]}</div>
            </div>
            <Form className={styles.handleForm}>
              {defectStatus === '1' && reviewDefectRight && <DefectFormReview form={form} />}
              {defectStatus === '2' && checkDefectRight && <DefectProcessForm form={form} commonList={commonList} />}
              {defectStatus === '3' && checkDefectRight && <DefectCheckForm form={form} />}
            </Form>
            <div className={styles.actionBar}>
              <Button className={styles.cancelBtn} onClick={this.onReset}>重置</Button>
              <Button type="primary" onClick={this.handleSubmit}>提交</Button>
            </div>
          </div>
          <OperateLine processData={processData} defectStatus={defectStatus} />
        </div>
      </div >
    );
  }
}


export default Form.create()(DetailContiner);
