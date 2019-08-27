
import React, { Component } from 'react';
import { Modal, message } from 'antd';
import CheckTree from './CheckTree';
import styles from './style.scss';
import PropTypes from 'prop-types';

// todo 弹框组件因单选ui及交互未定, 暂不实现
class AutoModal extends Component {
  static propTypes = {
    data: PropTypes.array,
    infoLists: PropTypes.array,
    checkedList: PropTypes.array,
    onValueCheck: PropTypes.func,
    max: PropTypes.number,
  }

  state = {
    isShow: false,
    checkedTrees: [],
  }

  showModal = () => {
    const { checkedList = [] } = this.props;
    this.setState({
      checkedTrees: checkedList.map(e => e.value),
      isShow: true,
    });
  }

  hideModal = () => this.setState({
    checkedTrees: [],
    isShow: false,
  });

  onTreeCheck = (checkedTrees) => {
    const { max } = this.props;
    if(!max) {
      return this.setState({ checkedTrees });
    }
    if(checkedTrees.length > max) {
      return message.error(`最多选择${max}个设备`);
    }
    this.setState({ checkedTrees });
  }

  handleOK = () => {
    const { infoLists, onValueCheck } = this.props;
    const { checkedTrees } = this.state;
    const valueResult = infoLists.filter(e => checkedTrees.includes(e.value));
    this.setState({ isShow: false });
    onValueCheck(valueResult);
  }

  render() {
    const { data } = this.props;
    const { isShow, checkedTrees } = this.state;
    return (
      <div className={styles.autoModal}>
        <i className={`iconfont icon-filter ${styles.handlIcon}`} onClick={this.showModal} />
        <Modal
          visible={isShow}
          onOk={this.handleOK}
          onCancel={this.hideModal}
          cancelText="取消"
          okText="确定"
          title="请选择"
          width={625}
          // wrapClassName={styles.stationModal}
        >
          <section className={styles.checkModal}>
            <h3></h3>
            <CheckTree data={data} checkedTrees={checkedTrees} onTreeCheck={this.onTreeCheck} />
          </section>
        </Modal>
      </div>
    );
  }
}
export default AutoModal;