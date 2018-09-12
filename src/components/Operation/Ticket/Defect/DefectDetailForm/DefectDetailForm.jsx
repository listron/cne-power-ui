import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DefectBasicInfo from '../DefectBasicInfo/DefectBasicInfo';
import DefectHandleForm from '../DefectHandleForm/DefectHandleForm';
import TimeLines from '../../../../Common/TimeLines';
import WarningTip from '../../../../Common/WarningTip';
import styles from './defectDetailForm.scss';
import { Icon } from 'antd';

class DefectDetailForm extends Component {
  static propTypes = {
    detail: PropTypes.object,
    loading: PropTypes.bool,
    commonList: PropTypes.object,
    onClose: PropTypes.func,
    onSend: PropTypes.func,
    onReject: PropTypes.func,
    onHandle: PropTypes.func,
    onCheck: PropTypes.func,
    onCloseDetail: PropTypes.func,
    onNext: PropTypes.func,
    onPrev: PropTypes.func
  }

  constructor(props) {
    super(props);
    this.state = {
      showWarningTip: false,
      warningTipText: '',
    }
  }

  onCancelEdit = () => {
    this.setState({
      showWarningTip: true,
      warningTipText: '退出后信息无法保存!'
    });
  }

  onCancelWarningTip = () => {
    this.setState({
      showWarningTip: false,
    });
  }

  onConfirmWarningTip = () => {
    this.setState({
      showWarningTip: false,
    });
    this.props.onCloseDetail({ container: 'list' });  
  }

  onSubmit = (data) => {
    let params = {};
    const defectId = this.props.detail.get('defectId');
    let status = this.props.detail.get('defectStatus');
    if(status === '1') {
      switch(data.dealResult) {
        case 'send':
          params = {
            defectId,
            defectProposal: !data.defectProposal ? null : data.defectProposal,
            deadLine: !data.deadLine ? null : data.deadLine.format('YYYY-MM-DD')+' 23:59:59'
          };
          this.props.onSend(params);
          break;
        case 'reject':
          params = {
            defectId,
            rejectReason: !data.rejectReason ? null : data.rejectReason
          };
          this.props.onReject(params);
          break;
        case 'close':
          params = {
            defectId,
            rejectReason: !data.defectProposal ? null : data.defectProposal
          };
          this.props.onClose(params);
          break;
      }
    } else if(status === '2') {
      let submitImages = this.getSubmitIamges(data.photoData);
      params = {
        defectId,
        defectSolveResult: data.defectSolveResult,
        defectSolveInfo: !data.defectSolveInfo ? null : data.defectSolveInfo,
        replaceParts: !data.replaceParts ? null : data.replaceParts,
        ...submitImages
      };
      this.props.onHandle(params);
    } else if(status === '3') {
      params = {
        defectId,
        checkResult: data.checkResult,
        checkInfo: !data.checkInfo ? null : data.checkInfo,
      };
      this.props.onCheck(params);
    }
    switch(data.dealResult) {
      case 'solve':
      case 'notSolve':
        let submitImages = this.getSubmitIamges(data.photoData);
        params = {
          defectId,
          defectSolveResult: data.dealResult === 'solve' ? '0' : '1',
          defectSolveInfo: !data.defectSolveInfo ? '' : data.defectSolveInfo,
          replaceParts: !data.replaceParts ? '' : data.replaceParts,
          ...submitImages
        };
        this.props.onHandle(params);
        break;
      case 'ok':
      case 'notOk':
        params = {
          defectId,
          checkResult: data.dealResult === 'ok' ? '0' : '1',
          checkInfo: !data.checkInfo ? '' : data.checkInfo,
        };
        this.props.onCheck(params);
        break;
    }
  }

  getSubmitIamges(images) {
    let solveAddress = [];
    let rotate = [];
    for(var i = 0; i < images.length; i++) {
      solveAddress.push(images[i].thumbUrl);
      rotate.push(images[i].rotate);
    }
    return {
      photoSolveAddress: solveAddress.join(','),
      rotatePhoto: rotate.join(',')
    };
  }

  renderForm() {
    let status = this.props.detail.get('defectStatus');
    if(status !== '0' && status !== '4') {
      return (
        <DefectHandleForm 
          commonList={this.props.commonList}
          onSubmit={this.onSubmit}
          onCancel={this.props.onCloseDetail}
          status={status} />
      )
    } else {
      return null;
    }
  }

  renderTitle() {
    const status = this.props.detail.get('defectStatus');
    if(status === '1') {
      return '审核缺陷';
    } else if(status === '2') {
      return '处理缺陷';
    } else if(status === '3') {
      return '验收缺陷';
    } else {
      return '缺陷详情';
    }
  }

  render() {
    let detail = this.props.detail;
    const { showWarningTip, warningTipText } = this.state;
    return (
      <div className={styles.detailWrap}>
        {showWarningTip && <WarningTip style={{marginTop:'250px',width: '210px',height:'88px'}} onCancel={this.onCancelWarningTip} onOK={this.onConfirmWarningTip} value={warningTipText} />}
        <div className={styles.defectDetail}>
          <div className={styles.header}>
            <div className={styles.text}>{this.renderTitle()}</div>
            <div className={styles.action}>
              <i className="iconfont icon-last" onClick={this.props.onPrev} />
              <i className="iconfont icon-next" onClick={this.props.onNext} />
              <Icon type="arrow-left" className={styles.backIcon} onClick={this.onCancelEdit} />
            </div>   
          </div>
          <div className={styles.content}>
            <div className={styles.basic}>
              <DefectBasicInfo basicInfo={detail} />
            </div>
            <div className={styles.right}>
              <div className={styles.timeLines}>
                <TimeLines 
                  processData={detail.get('processData')}
                  status={detail.get('defectStatus')} />
              </div>
              <div className={styles.form}>
                {this.renderForm()}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }  
}

export default DefectDetailForm;