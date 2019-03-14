import React, { Component } from 'react';
import { Modal, Select,Tree   } from 'antd';
import styles from './styles.scss';
import PropTypes from 'prop-types';
const { TreeNode } = Tree;


const treeData = [{
  title: '全部',
  key: '01',
  children: [
    {
      title: '0-0',
      key: '0-0',
      children: [{
        title: '0-0-0',
        key: '0-0-0',
        children: [
          { title: '0-0-0-0', key: '0-0-0-0' },
          { title: '0-0-0-1', key: '0-0-0-1' },
          { title: '0-0-0-2', key: '0-0-0-2' },
        ],
      }, {
        title: '0-0-1',
        key: '0-0-1',
        children: [
          { title: '0-0-1-0', key: '0-0-1-0' },
          { title: '0-0-1-1', key: '0-0-1-1' },
          { title: '0-0-1-2', key: '0-0-1-2' },
        ],
      }, {
        title: '0-0-2',
        key: '0-0-2',
      }],
    }, {
      title: '0-1',
      key: '0-1',
      children: [
        { title: '0-1-0-0', key: '0-1-0-0' },
        { title: '0-1-0-1', key: '0-1-0-1' },
        { title: '0-1-0-2', key: '0-1-0-2' },
      ],
    }, {
      title: '0-2',
      key: '0-2',
    }
    
  ],
}];

class SelectModal extends Component {
  static propTypes = {
  
  }
  constructor(props) {
    super(props);
    this.state = {
    expandedKeys: ['0-0-0', '0-0-1'],
    autoExpandParent: true,
    checkedKeys: ['0-0-0-1'],
    selectedKeys: [],
    }
  }


  showModal = () => {
    this.props.showModal();
  }


  handleOK = () => {
    this.props.handleOK(this.state.checkedKeys);
  }

  hideModal = () => {
    this.props.hideModal(); 
  }
 
  onExpand = (expandedKeys) => {
    console.log('onExpand', expandedKeys);
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  }

  onCheck = (checkedKeys) => {
    console.log('onCheck', checkedKeys);
    this.setState({ checkedKeys });
  }

  onSelect = (selectedKeys, info) => {
    console.log('onSelect', info);
    this.setState({ selectedKeys });
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
    const { visiable} = this.props;
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
            onExpand={this.onExpand}
            expandedKeys={this.state.expandedKeys}
            autoExpandParent={this.state.autoExpandParent}
            onCheck={this.onCheck}
            checkedKeys={this.state.checkedKeys}
            onSelect={this.onSelect}
            selectedKeys={this.state.selectedKeys}
          >
            {this.renderTreeNodes(treeData)}
          </Tree>
          </div>
        </Modal>
      </div>
    )
    
  }
}
export default SelectModal;