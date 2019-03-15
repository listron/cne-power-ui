import React, { Component } from 'react';
import { Modal, Tree } from 'antd';
import styles from './styles.scss';
import PropTypes from 'prop-types';
const { TreeNode } = Tree;


class SelectModal extends Component {
  static propTypes = {
    hideModal: PropTypes.func,
    showModal: PropTypes.func,
    handleOK: PropTypes.func,
    sourceData: PropTypes.array,
    list: PropTypes.array,
    visiable: PropTypes.bool,
  }
  constructor(props) {
    super(props);
    this.state = {
      checkedKeys: [...props.list],
      tree: [
        {
          title: '全部',
          key: '-999999',
          children: props.sourceData
        }
      ]
    }

  }
  componentWillReceiveProps(nextProps) {
    this.setState({ checkedKeys: nextProps.list });
  }
  onCheck = (checkedKeys) => {
    this.setState({ checkedKeys });
  }
  showModal = () => {
    this.props.showModal();
    this.setState({
      list: [...this.props.list],
    });
  }
  handleOK = () => {
    let keys = this.delParentNode(this.props.sourceData, [...this.state.checkedKeys]);
    this.props.handleOK(keys);
  }
  //去除选中节点中的父节点 需要递归
  delParentNode = (data, keys) => {
    data.forEach(e => {
      if (e.children) {
        if (keys.indexOf(String(e.key)) !== -1) {
          keys.splice(keys.indexOf(String(e.key)), 1)
        }
        this.delParentNode(e.children, keys)
      }
    })
    return keys
  }
  hideModal = () => {
    this.props.hideModal();
  }

  renderTreeNodes = data => data.map((item) => {
    if (item.children) {
      return (
        <TreeNode title={item.title} key={item.key} dataRef={item}>
          {this.renderTreeNodes(item.children)}
        </TreeNode>
      );
    }
    return <TreeNode {...item} />;
  })



  render() {
    const { visiable } = this.props;
    return (
      <div className={styles.deviceSelectModal}>
        <i className="iconfont icon-filter" onClick={this.showModal} />
        <Modal
          visible={visiable}
          onOk={this.handleOK}
          onCancel={this.hideModal}
          cancelText="取消"
          okText="确定"
          title="请选择"
          width={625}
          wrapClassName={styles.deviceModal}
        >
          <div className={styles.deviceContent}>
            <Tree
              checkable
              autoExpandParent={true}
              onCheck={this.onCheck}
              checkedKeys={this.state.checkedKeys}
              blockNode={false}
            >
              {this.renderTreeNodes(this.state.tree)}
            </Tree>
          </div>
        </Modal>
      </div>
    )

  }
}
export default SelectModal;