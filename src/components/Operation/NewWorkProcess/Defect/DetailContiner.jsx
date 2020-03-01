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
import searchUtil from '@utils/searchUtil';
import { handleRights } from '@utils/utilFunc';


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
        defectStatus === '1' && this.toReview(values);
        defectStatus === '2' && this.toProcess(values);
        defectStatus === '3' && this.toCheck(values);
      }
    });
  };

  callBackTableList = () => { // 返回列表页
    const { history } = this.props;
    history.push('/operation/workProcess/view?page=list&tab=defect&listSearch={"sortField":"modify_time"}');
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
    const { status, deadLine, defectProposal = '', rejectReason } = values;
    const initDeadLine = deadLine && deadLine.format('YYYY-MM-DD HH:mm:ss') || null;
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
    // 审核 验收 执行
    const hasRight = handleRights([
      'workExamine_defect_review', 'workExamine_defect_excute', 'workExamine_defect_check',
    ])[defectStatus - 1];

    // const hasRight = rightArr.includes(['workExamine_defect_review', 'workExamine_defect_excute', 'workExamine_defect_check'][defectStatus - 1]);
    return (
      <div className={`${styles.baseInfoCont} ${styles[theme]}`}>
        <BasicInfo {...this.props} />
        <div className={styles.rightCont}>
          {hasRight && <div className={`${styles.process} ${defectStatus === '1' && styles.review}`}>
            <div className={styles.titleText}>
              <div className={styles.border} />
              <div className={styles.text}>{['审核', '处理结果', '消缺验收'][defectStatus - 1]}</div>
            </div>
            <Form className={`${styles.handleForm}`}>
              {defectStatus === '1' && <DefectFormReview form={form} />}
              {defectStatus === '2' && <DefectProcessForm form={form} commonList={commonList} />}
              {defectStatus === '3' && <DefectCheckForm form={form} />}
            </Form>
            <div className={styles.actionBar}>
              <Button className={styles.cancelBtn} onClick={this.onReset}>重置</Button>
              <Button type="primary" onClick={this.handleSubmit}>提交</Button>
            </div>
          </div>
          }
          <OperateLine processData={processData} defectStatus={defectStatus} defectDetail={defectDetail} />
        </div>
      </div >
    );
  }
}


export default Form.create({
  onFieldsChange(props) {
    props.changeStore({ hasModify: true });
  },
})(DetailContiner);
