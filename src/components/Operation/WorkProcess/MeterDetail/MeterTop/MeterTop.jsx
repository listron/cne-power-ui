import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import CneTips from '@components/Common/Power/CneTips';
import PassAlert from '@components/Operation/WorkProcess/Common/PassAlert/PassAlert';
import RejectAlert from '@components/Operation/WorkProcess/Common/RejectAlert/RejectAlert';
import styles from './meterTop.scss';

export default class MeterTop extends React.Component {
  static propTypes = {
    meterDetail: PropTypes.object,
    history: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      showWarningTip: false,
      passVisible: false,
      rejectVisible: false,
      warningTipText: '',
    };
  }

  // 退出
  onCancelEdit = () => {
    this.setState({
      showWarningTip: true,
      warningTipText: '返回后修改内容将不会保存，确认返回吗？',
    });
  };

  // 领取
  getWorkProcess = () => {
    this.setState({
      showWarningTip: true,
      warningTipText: '确认领取此工单？',
    });
  };

  // 提交验收
  submitWorkProcess = () => {
    this.setState({
      showWarningTip: true,
      warningTipText: '确认将此工单提交验收？',
    });
  };

  // 验收通过
  submitPass = () => {
    this.setState({
      passVisible: true,
    });
  };

  // 关闭弹框
  onCancelWarningTip = () => {
    this.setState({
      showWarningTip: false,
    });
  };

  // 确认弹框 -- 要做事件区分，区分领取，提交验收，返回等操作
  onConfirmWarningTip = () => {
    this.setState({
      showWarningTip: true,
    }, () => {
      const { history } = this.props;
      const { pathname } = history.location;
      history.push(`${pathname}?page=list&tab=meter`);
    });
  };

  // 取消通过
  onCancelPass = () => {
    this.setState({
      passVisible: false,
    });
  };

  // 验收通过
  onConfirmPass = (value) => {
    console.log(value, 'value');
  };

  // 驳回
  submitReject = () => {
    this.setState({
      rejectVisible: true,
    });
  };

  // 取消驳回
  onCancelReject = () => {
    this.setState({
      rejectVisible: false,
    });
  };

  // 确认驳回
  onConfirmReject = (value) => {
    console.log(value, 'value');
  };

  render() {
    const { showWarningTip, warningTipText, passVisible, rejectVisible } = this.state;
    return (
      <React.Fragment>
        <div className={styles.meterTop} >
          <div className={styles.meterTopTitle}>
            <div className={styles.titleBox}>
              <i className="iconfont icon-gdxq" />
            </div>
            <span>工单详情</span>
          </div>
          <div className={styles.meterTopBtn}>
            <div className={styles.btnBox}>
              <Button
                className={`${styles.btnGreen} ${styles.am} ${styles.amGreenScale}`}
                onClick={this.submitReject}
              >
              <span>
                <i className="iconfont icon-wrong" />
                <span>驳回</span>
              </span>
              </Button>
              <Button
                className={`${styles.btnOrange} ${styles.am} ${styles.amOrangeScale}`}
                onClick={this.getWorkProcess}
              >
              <span>
                <i className="iconfont icon-lingqu" />
                <span>领取</span>
              </span>
              </Button>
              <Button
                className={`${styles.btnOrange} ${styles.am} ${styles.amOrangeScale}`}
                onClick={this.submitWorkProcess}
              >
              <span>
                <i className="iconfont icon-lingqu" />
                <span>提交验收</span>
              </span>
              </Button>
              <Button
                className={`${styles.btnOrange} ${styles.am} ${styles.amOrangeScale}`}
                onClick={this.submitPass}
              >
              <span>
                <i className="iconfont icon-lingqu" />
                <span>验收通过</span>
              </span>
              </Button>
            </div>
            <div className={styles.btnBack} onClick={this.onCancelEdit}>
              <i className="iconfont icon-fanhui" />
            </div>
          </div>
        </div>
        <CneTips
          visible={showWarningTip}
          width={260}
          onCancel={this.onCancelWarningTip}
          onConfirm={this.onConfirmWarningTip}
          tipText={warningTipText}
        />
        <PassAlert
          visible={passVisible}
          width={450}
          onCancel={this.onCancelPass}
          onConfirm={this.onConfirmPass}
        />
        <RejectAlert
          visible={rejectVisible}
          width={450}
          onCancel={this.onCancelReject}
          onConfirm={this.onConfirmReject}
        />
      </React.Fragment>
    );
  }
}
