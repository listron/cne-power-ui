import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Icon } from 'antd';

import styles from './cancelModal.scss';

export default class CancelModal extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    cancelFlag: PropTypes.bool,
    onAddControlFunc: PropTypes.func,
    cancelModalFunc: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  hideModal = () => {
    const { cancelModalFunc } = this.props;
    cancelModalFunc(false);
  };

  okModal = () => {
    const { onAddControlFunc } = this.props;
    onAddControlFunc(true);
  };

  render() {
    const { cancelFlag } = this.props;
    return (
      <Modal
        visible={cancelFlag}
        onOk={this.okModal}
        width={230}
        onCancel={this.hideModal}
        okText="确认"
        cancelText="取消"
      >
        <div className={styles.cancelContent}>
          <Icon type="exclamation-circle" /><span>您确定要退出么？</span>
        </div>
      </Modal>
    );
  }
}
