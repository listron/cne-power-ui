import React from "react";
import PropTypes from "prop-types";
import { Modal, Icon } from "antd";

import styles from "./sureModal.scss"

export default class SureModal extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    sureFlag: PropTypes.bool,
    onAddControlFunc: PropTypes.func,
    sureModalFunc: PropTypes.func
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
    const { onAddControlFunc } = this.props;
    onAddControlFunc(true);
  };

  render() {
    const { sureFlag } = this.props;
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
              <span>发发电机轴承检测和诊断</span>
            </div>
            <div>
              <span>电站名称：</span>
              <span>肥西</span>
            </div>
            <div>
              <span>检测开始日期：</span>
              <span>2019-01-20</span>
            </div>
            <div>
              <span>训练开始日期：</span>
              <span>2018-11-20</span>
              <span>（训练时长90天）</span>
            </div>
            <div>
              <span>检测结束日期：</span>
              <span>2019-01-27</span>
              <span>（检测时长7天）</span>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}
