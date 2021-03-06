import React from 'react';
import PropTypes from 'prop-types';
import { Button, message } from 'antd';
import CneTips from '@components/Common/Power/CneTips';
import { MyMessage } from '@components/Operation/NewWorkProcess/Common/MyMessage/MyMessage';
import PassAlert from '@components/Operation/NewWorkProcess/Common/PassAlert/PassAlert';
import RejectAlert from '@components/Operation/NewWorkProcess/Common/RejectAlert/RejectAlert';
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
    myMessageFlag: PropTypes.bool,
    editFlag: PropTypes.bool,
    otherReadMeterData: PropTypes.object,
    receiveLoading: PropTypes.bool,
    getCommitAction: PropTypes.func,
    scroll: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.state = {
      showWarningTip: false,
      passVisible: false,
      rejectVisible: false,
      warningTipText: '',
      actionCode: '',
      messageText: '',
    };
  }

  // 退出
  onCancelEdit = () => {
    const { editFlag, history, otherReadMeterData, readMeterData } = this.props;
    // 需要判断编辑状态下是否反生改变
    // 改变就弹出提示，反之，直接返回
    // 因为之前在saga返回的数据的时候做了处理，倒置两个数据进行对比之后，不准确，
    // 所以把数据格式成后端返回的数据格式作对比，
    // 可以修改的处理信息数据readMeterData
    const readObj = {
      ...readMeterData,
      onlineDatas: readMeterData.onlineDatas.map(cur => {
        const obj = {};
        obj.magnification = cur.magnification;
        obj.flatStartCode = cur.flatStartCode;
        obj.meterNumber = cur.meterNumber;
        obj.meterName = cur.meterName;
        obj.totalEndCode = cur.totalEndCode;
        obj.lowStartCode = cur.lowStartCode;
        obj.topEndCode = cur.topEndCode;
        obj.detailId = cur.detailId;
        obj.lowEndCode = cur.lowEndCode;
        obj.peakEndCode = cur.peakEndCode;
        obj.topStartCode = cur.topStartCode;
        obj.peakStartCode = cur.peakStartCode;
        obj.meterImgs = cur.meterImgs;
        obj.totalStartCode = cur.totalStartCode;
        obj.flatEndCode = cur.flatEndCode;
        obj.meterId = cur.meterId;
        return obj;
      }),
      generationDatas: readMeterData.generationDatas.map(cur => {
        const obj = {};
        obj.magnification = cur.magnification;
        obj.flatStartCode = cur.flatStartCode;
        obj.meterNumber = cur.meterNumber;
        obj.meterName = cur.meterName;
        obj.totalEndCode = cur.totalEndCode;
        obj.lowStartCode = cur.lowStartCode;
        obj.topEndCode = cur.topEndCode;
        obj.detailId = cur.detailId;
        obj.lowEndCode = cur.lowEndCode;
        obj.peakEndCode = cur.peakEndCode;
        obj.topStartCode = cur.topStartCode;
        obj.peakStartCode = cur.peakStartCode;
        obj.meterImgs = cur.meterImgs;
        obj.totalStartCode = cur.totalStartCode;
        obj.flatEndCode = cur.flatEndCode;
        obj.meterId = cur.meterId;
        return obj;
      }),
    };
    // 备份的处理信息数据otherReadMeterData
    const otherObj = {
      ...otherReadMeterData,
      onlineDatas: otherReadMeterData.onlineDatas.map(cur => {
        const obj = {};
        obj.magnification = cur.magnification;
        obj.flatStartCode = cur.flatStartCode;
        obj.meterNumber = cur.meterNumber;
        obj.meterName = cur.meterName;
        obj.totalEndCode = cur.totalEndCode;
        obj.lowStartCode = cur.lowStartCode;
        obj.topEndCode = cur.topEndCode;
        obj.detailId = cur.detailId;
        obj.lowEndCode = cur.lowEndCode;
        obj.peakEndCode = cur.peakEndCode;
        obj.topStartCode = cur.topStartCode;
        obj.peakStartCode = cur.peakStartCode;
        obj.meterImgs = cur.meterImgs;
        obj.totalStartCode = cur.totalStartCode;
        obj.flatEndCode = cur.flatEndCode;
        obj.meterId = cur.meterId;
        return obj;
      }),
      generationDatas: otherReadMeterData.generationDatas.map(cur => {
        const obj = {};
        obj.magnification = cur.magnification;
        obj.flatStartCode = cur.flatStartCode;
        obj.meterNumber = cur.meterNumber;
        obj.meterName = cur.meterName;
        obj.totalEndCode = cur.totalEndCode;
        obj.lowStartCode = cur.lowStartCode;
        obj.topEndCode = cur.topEndCode;
        obj.detailId = cur.detailId;
        obj.lowEndCode = cur.lowEndCode;
        obj.peakEndCode = cur.peakEndCode;
        obj.topStartCode = cur.topStartCode;
        obj.peakStartCode = cur.peakStartCode;
        obj.meterImgs = cur.meterImgs;
        obj.totalStartCode = cur.totalStartCode;
        obj.flatEndCode = cur.flatEndCode;
        obj.meterId = cur.meterId;
        return obj;
      }),
    };
    // 编辑状态
    if(editFlag && JSON.stringify(readObj) !== JSON.stringify(otherObj)) {
      return this.setState({
        showWarningTip: true,
        actionCode: '',
        warningTipText: '返回后修改内容将不会保存，确认返回吗？',
      });
    }
    // 非编辑状态
    const { search, pathname } = history.location;
    const { params } = searchUtil(search).parse(); // 抄表详情页
    return history.push(`${pathname}?page=list&tab=meter&params=${params}`);
  };

  // 领取
  getWorkProcess = () => {
    this.setState({
      showWarningTip: true,
      actionCode: '2',
      warningTipText: '确认领取此工单？',
      messageText: '已领取！',
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
      message.error('请填写完整后再提交验收');
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
        messageText: '已提交验收！',
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
      history,
      processActionData,
      meterBaseData: {
        stateId,
      },
      getReceiveAction,
      changeStore,
      getCommitAction,
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
            getCommitAction({
              docketId: meterId,
              actionCode: cur.actionCode,
              stateId,
              func: () => {
                // 改变弹框
                changeStore({
                  myMessageFlag: true,
                });
                setTimeout(() => {
                  changeStore({
                    myMessageFlag: false,
                  });
                }, 2000);
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
                // 改变弹框
                changeStore({
                  myMessageFlag: true,
                });
                setTimeout(() => {
                  changeStore({
                    myMessageFlag: false,
                  });
                }, 2000);
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
    const { showWarningTip, warningTipText, passVisible, rejectVisible, messageText } = this.state;
    const { processActionData, thisReadTimeFlag, myMessageFlag, receiveLoading, scroll } = this.props;
    return (
      <React.Fragment>
        {myMessageFlag && <MyMessage message={messageText} />}
        <div className={styles.meterTop} style={ scroll ? {
          backgroundColor: '#ffffff',
          boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.5)',
        } : {}} >
          <div className={styles.meterTopTitle}>
            <div className={styles.titleBox}>
              <i className="iconfont icon-gdxq" />
            </div>
            <span>工单详情</span>
          </div>
          <div className={styles.meterTopBtn}>
            <div className={styles.btnBox}>
              {processActionData.filter(cur => cur.actionCode === '7' && cur.isPermission === 0).length > 0 && (
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
              {processActionData.filter(cur => cur.actionCode === '2' && cur.isPermission === 0).length > 0 && (
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
              {processActionData.filter(cur => cur.actionCode === '5' && cur.isPermission === 0).length > 0 && (
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
              {processActionData.filter(cur => cur.actionCode === '6' && cur.isPermission === 0).length > 0 && (
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
          onConfirm={receiveLoading ? () => {} : this.onConfirmWarningTip}
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
