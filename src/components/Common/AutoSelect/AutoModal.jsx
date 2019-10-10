
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
    theme: PropTypes.string,
    multiple: PropTypes.bool,
    disabled: PropTypes.bool,
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
    const { max, infoLists } = this.props;
    if (!max) {
      return this.setState({ checkedTrees });
    }
    // 因为这里checkedTrees，会包含父节点的value，所以length会出现错误，所以过滤一下
    const checkedArr = infoLists.filter(e => checkedTrees.map(cur => (cur.toString())).includes(`${e.value}`));
    if (checkedArr.length > max) {
      return message.error(`最多选择${max}项`);
    }
    this.setState({ checkedTrees });
  }

  handleOK = () => {
    const { infoLists, onValueCheck } = this.props;
    const { checkedTrees } = this.state;
    // 因为checkedTrees里面值是数字的话会存在不相等的情况，所以把checkedTrees转为了字符串
    const valueResult = infoLists.filter(e => checkedTrees.some(treeNode => `${e.value}` === `${treeNode}`));
    this.setState({ isShow: false });
    onValueCheck(valueResult);
  }

  render() {
    const { data, theme, disabled, multiple } = this.props;
    const { isShow, checkedTrees } = this.state;
    return (
      <div className={styles.autoModal}>
        <i className={`iconfont icon-filter ${styles.handlIcon} ${disabled && styles.disabled}`} onClick={this.showModal} />
        <Modal
          visible={isShow}
          onOk={this.handleOK}
          onCancel={this.hideModal}
          cancelText="取消"
          okText="确定"
          title="请选择"
          width={625}
          wrapClassName={`${styles.autoWrap} ${styles[theme]}`}
        >
          <section className={`${styles.checkModal} ${styles[theme]}`}>
            <h3></h3>
            <CheckTree multiple={multiple} data={data} checkedTrees={checkedTrees} onTreeCheck={this.onTreeCheck} />
          </section>
        </Modal>
      </div>
    );
  }
}
export default AutoModal;
