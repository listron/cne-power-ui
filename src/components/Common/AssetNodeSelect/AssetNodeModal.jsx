import React, { Component } from 'react';
import { Modal, Tree, Checkbox } from 'antd';
import styles from './style.scss';
import PropTypes from 'prop-types';
const { TreeNode } = Tree;



/* 
汇总方式弹窗共用控件。
参数：
1.组件接收参数
    hideModal:  必填  隐藏弹窗方法
    showModal: 必填   显示弹窗方法
    handleOK: 必填    数据选择后的回调
    sourceData: 必填  初始数据tree
    assetsIds: 必填        默认所选项
    visiable: 必填    控制弹窗显示隐藏变量
2.tree结构要符合antd要求
*/

class SelectModal extends Component {
  static propTypes = {
    hideModal: PropTypes.func,
    showModal: PropTypes.func,
    handleOK: PropTypes.func,
    sourceData: PropTypes.array,
    assetsIds: PropTypes.array,
    visiable: PropTypes.bool,
  }
  constructor(props) {
    super(props);
    this.state = {
      checkedKeys: [...props.assetsIds],
      checkedName: '',
    }
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ checkedKeys: nextProps.assetsIds });
  }
  onCheck = (checkedKeys, e) => {
    const {multiple}=this.props;
    let dataRef = e.node.props.dataRef;
    let { assetsNames, assetsName } = dataRef;
    let parentNodeName=assetsNames.replace(/,/g,'/');
    
    this.setState({ checkedKeys: multiple?checkedKeys.checked:checkedKeys, checkedName: `${parentNodeName}/${assetsName}` });
  }
  showModal = () => {
    this.props.showModal();
    this.setState({
      assetsIds: [...this.props.assetsIds],
    });
  }
  handleOK = () => {
    const { checkedKeys, checkedName } = this.state;
    this.props.handleOK(checkedKeys, checkedName);
  }

  hideModal = () => {
    this.props.hideModal();
  }
  queryDataType = (value) => {
    this.props.queryDataType(value)
  }
  renderTreeNodes = data => data.map((item) => {
    if (item.childernNodes) {
      return (
        <TreeNode title={item.assetsName} key={item.assetsId} dataRef={item} disableCheckbox={item.isBuild === 1 || item.isMain === 1 || item.assetsType === 1}  >
          {this.renderTreeNodes(item.childernNodes)}
        </TreeNode>
      );
    }
    return <TreeNode title={item.assetsName} key={item.assetsId} dataRef={item} ></TreeNode>;
  })
  render() {
    const { visiable, sourceData, stationType, multiple,stationTypeCount } = this.props;
    const {checkedKeys}=this.state;
    
    return (
      <div className={styles.deviceSelectModal}>
        <i className="iconfont icon-filter" onClick={this.showModal} />
        <Modal
          visible={visiable}
          onOk={this.handleOK}
          onCancel={this.hideModal}
          cancelText="取消"
          okText="确定"
          title="请选择生产资产"
          width={625}
          wrapClassName={styles.deviceModal}
        >
          <div className={styles.deviceContent}>
           {stationTypeCount&& <div className={styles.titleType} >
              <div className={stationType === 1 ? styles.selectPv : styles.pv} onClick={() => { this.queryDataType(1) }} >光伏</div>
              <div className={stationType === 0 ? styles.selectWind : styles.wind} onClick={() => { this.queryDataType(0) }}>风电</div>
            </div>}
            <Tree
              checkable={multiple}
              checkStrictly
              checkedKeys={checkedKeys}
              autoExpandParent={true}
              // defaultExpandAll={true}
              onCheck={this.onCheck}
              onSelect={this.onCheck}
              selectedKeys={multiple?[]:checkedKeys}
              blockNode={false}
              
            >
              {this.renderTreeNodes(sourceData)}
            </Tree>
          </div>
        </Modal>
      </div>
    )

  }
}
export default SelectModal;