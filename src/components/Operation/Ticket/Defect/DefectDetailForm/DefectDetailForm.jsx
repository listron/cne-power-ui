import React,{ Component } from 'react';
import PropTypes from 'prop-types';
import DefectBasicInfo from '../DefectBasicInfo/DefectBasicInfo';
import DefectHandleForm from '../DefectHandleForm/DefectHandleForm';
import TimeLines from '../../../../Common/TimeLines';
import styles from './defectDetailForm.scss';
import {Icon, Spin} from 'antd';

class DefectDetailForm extends Component {
  static propTypes = {
    detail: PropTypes.object,
    isFetching: PropTypes.bool,
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

  static defaultProps = {
  }

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  onSubmit = (data) => {
    let params = {};
    const defectId = this.props.detail.get('defectId');
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

  render() {
    let detail = this.props.detail;
    return (
      <div className={styles.detailWrap}>
        <Spin spinning={this.props.isFetching} size="large">
          <div className={styles.defectDetail}>
            <div className={styles.header}>
              <Icon type="up" onClick={this.props.onPrev} />
              <Icon type="down" onClick={this.props.onNext} />
              <Icon type="close" onClick={this.props.onCloseDetail} />
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
        </Spin>
      </div>
    );
  }  
}

export default DefectDetailForm;