import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import DefectBasicInfo from '../DefectBasicInfo/DefectBasicInfo';
import DefectHandleForm from '../DefectHandleForm/DefectHandleForm';
import DefectTimeLine from '../DefectTimeLine/DefectTimeLine';
import WarningTip from '../../../../Common/WarningTip';
import styles from './defectDetailForm.scss';
import { Icon } from 'antd';
// import CommonBreadcrumb from '../../../../../components/Common/CommonBreadcrumb';
// import Footer from '../../../../../components/Common/Footer';

class DefectDetailForm extends Component {
  static propTypes = {
    defectDetail: PropTypes.object,
    commonList: PropTypes.object,
    onClose: PropTypes.func,
    onSend: PropTypes.func,
    onReject: PropTypes.func,
    onHandle: PropTypes.func,
    onCheck: PropTypes.func,
    onCloseDefectDetail: PropTypes.func,
    onNext: PropTypes.func,
    onPrev: PropTypes.func,
    isFromAlarm: PropTypes.bool,
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
    this.props.onCloseDefectDetail({ container: 'list' });  
  }

  onSubmit = (data) => {
    let params = {};
    const { defectDetail, onSend, onReject, onClose, onHandle, onCheck } = this.props;
    const defectId = defectDetail.get('defectId');
    const status = defectDetail.get('defectStatus');
    if(status === '1') {
      switch(data.dealResult) {
        case 'send':
          params = {
            defectId,
            defectProposal: !data.defectProposal ? null : data.defectProposal,
            deadLine: !data.deadLine ? null : data.deadLine.format('YYYY-MM-DD')+' 23:59:59'
          };
          onSend(params);
          break;
        case 'reject':
          params = {
            defectId,
            rejectReason: !data.rejectReason ? null : data.rejectReason
          };
          onReject(params);
          break;
        case 'close':
          params = {
            defectId,
            defectProposal: !data.defectProposal ? null : data.defectProposal
          };
          onClose(params);
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
      onHandle(params);
    } else if(status === '3') {
      params = {
        defectId,
        checkResult: data.checkResult,
        checkInfo: !data.checkInfo ? null : data.checkInfo,
      };
      onCheck(params);
    }
  }

  getSubmitIamges(images) {
    if(!images) {
      return {
        photoSolveAddress: null,
        rotatePhoto: null
      };
    }
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
    const { defectDetail, commonList } = this.props;
    const status = defectDetail.get('defectStatus');
    if(status !== '0' && status !== '4') {
      return (
        <DefectHandleForm 
          commonList={commonList}
          onSubmit={this.onSubmit}
          status={status} />
      )
    } else {
      return null;
    }
  }

  renderTitle() {
    const status = this.props.defectDetail.get('defectStatus');
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
    const defectDetail = this.props.defectDetail;
    const isFromAlarm = this.props.isFromAlarm;
    const processData = defectDetail.get('processData');
    const status = defectDetail.get('defectStatus')
    const { showWarningTip, warningTipText } = this.state;
    const alarmPageStyle = {
      padding: '24px 24px 0',
      backgroundColor: '#ececec',
    }
    return (
      <div className={styles.detailWrap} style={isFromAlarm?alarmPageStyle:{}}>
        {showWarningTip && <WarningTip style={{marginTop:'250px',width: '210px',height:'88px'}} onCancel={this.onCancelWarningTip} onOK={this.onConfirmWarningTip} value={warningTipText} />}
        <div className={styles.defectDetail}>
          <div className={styles.header}>
            <div className={styles.text}>{this.renderTitle()}</div>
            {!isFromAlarm&&<div className={styles.action}>
              <i className="iconfont icon-last" onClick={this.props.onPrev} />
              <i className="iconfont icon-next" onClick={this.props.onNext} />
              <Icon type="arrow-left" className={styles.backIcon} onClick={this.onCancelEdit} />
            </div>}
            {isFromAlarm&&<div className={styles.backBtn}><Link to="/monitor/alarm/transfer">返回</Link></div>}   
          </div>
          <div className={styles.content}>
            <div className={styles.basic}>
              <DefectBasicInfo basicInfo={defectDetail} />
            </div>
            <div className={styles.right}>
              <div className={styles.timeLines}>
                <DefectTimeLine processData={processData} status={status} />
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