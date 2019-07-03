import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Icon } from 'antd';
import moment from 'moment';

import styles from './sureModal.scss';

const defaultDate = 'YYYY-MM-DD';

export default class SureModal extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    sureFlag: PropTypes.bool,
    sureModalFunc: PropTypes.func,
    getAddWarnTask: PropTypes.func,
    onAddControlFunc: PropTypes.func,
    downLink: PropTypes.object,
    algoOptionList: PropTypes.array,
    actionDiffTime: PropTypes.number,
    endDiffTime: PropTypes.number,
    viewType: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  hideModal = () => {
    const { sureModalFunc } = this.props;
    sureModalFunc(false);
  };

  okModal = () => {
    const {
      getAddWarnTask,
      sureModalFunc,
      onAddControlFunc,
      viewType,
      downLink: {
        modal,
        selectStationName,
        actionTime,
        startTime,
        endTime,
      },
    } = this.props;
    const params = {
      algorithmId: modal,
      viewType,
      stationCode: selectStationName[0].stationCode,
      startTime: moment(startTime).format(defaultDate),
      trainingStartTime: moment(actionTime).format(defaultDate),
      endTime: moment(endTime).format(defaultDate),
      nowTime: moment.utc().format(),
      func: () => {
        // 关闭弹框
        sureModalFunc(false);
        // 返回原来界面
        onAddControlFunc(true);
      },
    };
    getAddWarnTask(params);
  };

  modalFunc = () => {
    const {
      downLink: {
        modal,
      },
      algoOptionList,
    } = this.props;
    let name = '';
    for (let i = 0; i < algoOptionList.length; i++) {
      if (algoOptionList[i].algorithmId === modal) {
        name = algoOptionList[i].algorithmName;
      }
    }
    return name || '';
  };

  render() {
    const {
      sureFlag,
      downLink: {
        modal,
        selectStationName,
        actionTime,
        startTime,
        endTime,
      },
      actionDiffTime,
      endDiffTime,
    } = this.props;
    return (
      <Modal
        visible={sureFlag}
        onOk={this.okModal}
        onCancel={this.hideModal}
        okText="确认"
        width={416}
        cancelText="取消"
      >
        <div className={styles.sureContent}>
          <Icon type="exclamation-circle" /><span>点击"确定"可下发</span>
          <div className={styles.sureBox}>
            <div>
              <span>算法模型：</span>
              <span>{modal && this.modalFunc()}</span>
            </div>
            <div>
              <span>电站名称：</span>
              <span>{selectStationName.length !== 0 ? selectStationName[0].stationName : ''}</span>
            </div>
            <div>
              <span>检测开始日期：</span>
              <span>{moment(startTime).format(defaultDate)}</span>
            </div>
            <div>
              <span>训练开始日期：</span>
              <span>{moment(actionTime).format(defaultDate)}</span>
              <span>{`（训练时长${actionDiffTime}天）`}</span>
            </div>
            <div>
              <span>检测结束日期：</span>
              <span>{moment(endTime).format(defaultDate)}</span>
              <span>{`（检测时长${endDiffTime}天）`}</span>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}
