import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import CneTips from '@components/Common/Power/CneTips';
import PassAlert from '@components/Operation/WorkProcess/Common/PassAlert/PassAlert';
import RejectAlert from '@components/Operation/WorkProcess/Common/RejectAlert/RejectAlert';
import styles from './meterTop.scss';
import searchUtil from '@utils/searchUtil';

export default class MeterTop extends React.Component {
  static propTypes = {
    processActionData: PropTypes.array,
    history: PropTypes.object,
    getSubmitAction: PropTypes.func,
    meterBaseData: PropTypes.object,
    thisReadTimeFlag: PropTypes.bool,
    readMeterData: PropTypes.object,
    changeStore: PropTypes.func,
    getReceiveAction: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      showWarningTip: false,
      passVisible: false,
      rejectVisible: false,
      warningTipText: '',
      actionCode: '',
    };
  }

  // 退出
  onCancelEdit = () => {
    this.setState({
      showWarningTip: true,
      actionCode: '',
      warningTipText: '返回后修改内容将不会保存，确认返回吗？',
    });
  };

  // 领取
  getWorkProcess = () => {
    this.setState({
      showWarningTip: true,
      actionCode: '2',
      warningTipText: '确认领取此工单？',
    });
  };

  // 提交验收
  submitWorkProcess = () => {
    const {
      readMeterData: {
        onlineDatas,
        generationDatas,
      },
      changeStore,
    } = this.props;
    let flag = true;
    // 要判断所有点表止码是否为空
    // 上网表
    const onlineArr = onlineDatas.map(cur => {
      if(cur.totalEndCode === '' || cur.totalEndCode === null){
        cur.errorFlag1 = true;
        flag = false;
      }
      if(cur.topEndCode === '' || cur.topEndCode === null) {
        cur.errorFlag2 = true;
        flag = false;
      }
      if(cur.peakEndCode === '' || cur.peakEndCode === null) {
        cur.errorFlag3 = true;
        flag = false;
      }
      if(cur.flatEndCode === '' || cur.flatEndCode === null) {
        cur.errorFlag4 = true;
        flag = false;
      }
      if(cur.lowEndCode === '' || cur.lowEndCode === null){
        cur.errorFlag5 = true;
        flag = false;
      }
      return cur;
    });
    // 计量表
    const generationArr = generationDatas.map(cur => {
      if(cur.totalEndCode === '' || cur.totalEndCode === null){
        cur.errorFlag1 = true;
        flag = false;
      }
      if(cur.topEndCode === '' || cur.topEndCode === null) {
        cur.errorFlag2 = true;
        flag = false;
      }
      if(cur.peakEndCode === '' || cur.peakEndCode === null) {
        cur.errorFlag3 = true;
        flag = false;
      }
      if(cur.flatEndCode === '' || cur.flatEndCode === null) {
        cur.errorFlag4 = true;
        flag = false;
      }
      if(cur.lowEndCode === '' || cur.lowEndCode === null){
        cur.errorFlag5 = true;
        flag = false;
      }
      return cur;
    });
    // 判断有空的现象
    if(!flag) {
      const { readMeterData } = this.props;
      changeStore({
        readMeterData: {
          ...readMeterData,
          onlineDatas: onlineArr,
          generationDatas: generationArr,
        },
      });
    }
    // 都没有空的弹出二次确认
    if(flag) {
      this.setState({
        showWarningTip: true,
        actionCode: '5',
        warningTipText: '确认将此工单提交验收？',
      });
    }
  };

  // 验收通过
  submitPass = () => {
    this.setState({
      passVisible: true,
      actionCode: '6',
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
    const {
      getSubmitAction,
      history,
      processActionData,
      meterBaseData: {
        stateId,
      },
      getReceiveAction,
    } = this.props;
    const { search, pathname } = history.location;
    const { meterId, params } = searchUtil(search).parse(); // 抄表详情页
    const { actionCode } = this.state;
    this.setState({
      showWarningTip: true,
    }, () => {
      // 返回
      if(actionCode === '') {
        history.push(`${pathname}?page=list&tab=meter&params=${params}`);
      }

      // 提交验收
      if(actionCode === '5') {
        processActionData.forEach(cur => {
          if(cur.actionCode === '5') {
            getSubmitAction({
              docketId: meterId,
              actionCode: cur.actionCode,
              stateId,
              func: () => {
                this.setState({
                  actionCode: '',
                  showWarningTip: false,
                });
              },
            });
          }
        });
      }

      // 领取
      if(actionCode === '2') {
        processActionData.forEach(cur => {
          if(cur.actionCode === '2') {
            getReceiveAction({
              docketId: meterId,
              actionCode: cur.actionCode,
              stateId,
              func: () => {
                this.setState({
                  actionCode: '',
                  showWarningTip: false,
                });
              },
            });
          }
        });
      }
    });
  };

  // 取消通过
  onCancelPass = () => {
    this.setState({
      passVisible: false,
    });
  };

  // 验收通过
  onConfirmPass = (value, callback) => {
    const {
      getSubmitAction,
      processActionData,
      history,
      meterBaseData: {
        stateId,
      },
    } = this.props;
    const { search } = history.location;
    const { meterId } = searchUtil(search).parse(); // 抄表详情页
    processActionData.forEach(cur => {
      if(cur.actionCode === '6') {
        getSubmitAction({
          docketId: meterId,
          actionCode: cur.actionCode,
          stateId,
          handleDesc: value || null,
          func: () => {
            callback();
            this.setState({
              actionCode: '',
              passVisible: false,
            });
          },
        });
      }
    });
  };

  // 驳回
  submitReject = () => {
    this.setState({
      rejectVisible: true,
      actionCode: '7',
    });
  };

  // 取消驳回
  onCancelReject = () => {
    this.setState({
      rejectVisible: false,
    });
  };

  // 确认驳回
  onConfirmReject = (value, callback) => {
    const {
      getSubmitAction,
      processActionData,
      history,
      meterBaseData: {
        stateId,
      },
    } = this.props;
    const { search } = history.location;
    const { meterId } = searchUtil(search).parse(); // 抄表详情页
    processActionData.forEach(cur => {
      if(cur.actionCode === '7') {
        getSubmitAction({
          docketId: meterId,
          actionCode: cur.actionCode,
          stateId,
          handleDesc: value || null,
          func: () => {
            callback();
            this.setState({
              actionCode: '',
              rejectVisible: false,
            });
          },
        });
      }
    });
  };

  render() {
    const { showWarningTip, warningTipText, passVisible, rejectVisible } = this.state;
    const { processActionData, thisReadTimeFlag } = this.props;
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
              {processActionData.map(cur => cur.actionCode).includes('7') && (
                <Button
                  className={`${styles.btnGreen} ${styles.am} ${styles.amGreenScale}`}
                  onClick={this.submitReject}
                >
                  <span style={{marginRight: '7px'}}>
                    <i style={{marginRight: '15px'}} className="iconfont icon-wrong" />
                    <span>驳回</span>
                  </span>
                </Button>
              )}
              {processActionData.map(cur => cur.actionCode).includes('2') && (
                <Button
                  className={`${styles.btnOrange} ${styles.am} ${styles.amOrangeScale}`}
                  onClick={this.getWorkProcess}
                >
                  <span style={{marginRight: '7px'}}>
                    <i style={{marginRight: '15px'}} className="iconfont icon-lingqu" />
                    <span>领取</span>
                  </span>
                </Button>
              )}
              {processActionData.map(cur => cur.actionCode).includes('5') && (
                <Button
                  className={thisReadTimeFlag ? `${styles.disableBtnOrange}` : `${styles.btnOrange} ${styles.am} ${styles.amOrangeScale}`}
                  onClick={thisReadTimeFlag ? () => {} : this.submitWorkProcess}
                >
                  <span>
                    <i style={{marginRight: '6px'}} className="iconfont icon-checkup" />
                    <span>提交验收</span>
                  </span>
                </Button>
                )}
              {processActionData.map(cur => cur.actionCode).includes('6') && (
                <Button
                  className={`${styles.btnOrange} ${styles.am} ${styles.amOrangeScale}`}
                  onClick={this.submitPass}
                >
                  <span>
                    <i style={{marginRight: '6px'}} className="iconfont icon-checkend" />
                    <span>验收通过</span>
                  </span>
                </Button>
              )}
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
