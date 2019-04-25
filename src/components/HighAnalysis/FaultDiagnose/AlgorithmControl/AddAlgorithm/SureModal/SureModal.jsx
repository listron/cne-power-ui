import React from "react";
import PropTypes from "prop-types";
import { Modal, Icon } from "antd";

import styles from "./sureModal.scss"

export default class SureModal extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    sureFlag: PropTypes.bool,
    sureModalFunc: PropTypes.func,
    getAddWarnTask: PropTypes.func,
    downLink: PropTypes.object
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
      downLink: {
        modal,
        selectStationName,
        actionTime,
        startTime,
        endTime
      }
    } = this.props;
    const params = {
      algorithmId: modal,
      stationCode: selectStationName,
      startTime,
      trainingStartTime: actionTime,
      endTime,
      nowTime: new Date()
    };
    getAddWarnTask(params);
  };

  render() {
    const { sureFlag, downLink: {
      modal,
      selectStationName,
      actionTime,
      startTime,
      endTime
    } } = this.props;
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
              <span>{modal}</span>
            </div>
            <div>
              <span>电站名称：</span>
              <span>{selectStationName}</span>
            </div>
            <div>
              <span>检测开始日期：</span>
              <span>{startTime}</span>
            </div>
            <div>
              <span>训练开始日期：</span>
              <span>{actionTime}</span>
              <span>（训练时长90天）</span>
            </div>
            <div>
              <span>检测结束日期：</span>
              <span>{endTime}</span>
              <span>（检测时长7天）</span>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}
