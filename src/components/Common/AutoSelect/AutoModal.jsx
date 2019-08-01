
import React, { Component } from 'react';
import { Checkbox, Modal, Tree } from 'antd';
import CheckTree from './CheckTree';
import styles from './style.scss';
import PropTypes from 'prop-types';

// todo 弹框组件因单选ui及交互未定, 暂不实现
// todo 嵌套判定暂时做两层处理, 多层级因checkbox的选中递归数据层级不确定且数据传输不同及ui也未指定。
class AutoModal extends Component {
  static propTypes = {
    multiple: PropTypes.bool,
    holderText: PropTypes.string,
    data: PropTypes.array,
    checkedList: PropTypes.array,
    onValueCheck: PropTypes.func,
  }

  state = {
    isShow: false,
  }

  showModal = () => this.setState({ isShow: true });

  hideModal = () => this.setState({ isShow: false });



  render() {
    const { data } = this.props;
    const { isShow } = this.state;
    return (
      <div>
        <i className="iconfont icon-filter" onClick={this.showModal} />
        <Modal
          visible={isShow}
          // onOk={this.handleOK}
          onCancel={this.hideModal}
          cancelText="取消"
          okText="确定"
          title="请选择"
          width={625}
          // wrapClassName={styles.stationModal}
        >
          <section className={styles.checkModal}>
            <h3></h3>
            <CheckTree data={data} />
          </section>
        </Modal>
      </div>
    );
  }
}
export default AutoModal;
