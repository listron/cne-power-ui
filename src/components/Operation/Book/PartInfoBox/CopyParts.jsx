import React from "react";
import PropTypes from "prop-types";
import styles from "./partInfoBox.scss";
import { Modal, Button, Tree, Checkbox } from 'antd';
const { TreeNode } = Tree;
class CopyParts extends React.Component {
  static propTypes = {

    changePartInfoStore: PropTypes.func,
    closeComParts: PropTypes.func,
    detailPartsInfo: PropTypes.object,
    showCopyParts: PropTypes.bool,
  }
  constructor(props, context) {
    super(props, context)
    this.state = {
      checkedKeys: [],
    }
  }


  onCheck = () => {

  }

  onCheckLeft = (checkedKeys) => {
    this.setState({ checkedKeys });
  }
  selectNode = () => {

  }
  selectLeftNode = () => {

  }
  handleCancel = () => {
    this.props.closeComParts()
  }
  confire = () => {
    //确认复制，传参不明确
  }
  checkAll = (e) => {
    if (!e.target.checked) { // 取消全选时清空。
      this.setState({ checkedKeys: [] });
      return
    }
    const { partInfoTree } = this.props;
    const getSelectCode = (data) => {
      let selectArray = []; let selectStation = [];
      data && data.length > 0 && data.forEach(e => {
        if (e && e.assetsData && e.assetsData.length > 0) {
          selectArray.push(...getSelectCode(e.assetsData));//递归
        }
        if (e && e.assetsId) {
          selectArray.push(e.assetsId)
        }
      })
      return selectArray.length > 0 ? selectArray : selectStation;
    }
    const selectDepartment = getSelectCode(partInfoTree);//全部选择的id
    let selectkeys = this.delParentNode(partInfoTree, [...selectDepartment]);//去除所有的父级节点id
    this.setState({ checkedKeys: selectkeys });
  }
  delParentNode = (data, keys) => {//去除上级的id
    data.forEach(e => {
      if (e.assetsData) {
        this.delParentNode(e.assetsData, keys)
        if (keys.indexOf(String(e.assetsId)) !== -1) {
          keys.splice(keys.indexOf(String(e.assetsId)), 1)
        }
      }
    })
    return keys
  }
  renderPartTree = data => data.map((item) => {//左边部件结构树
    if (item.assetsData) {
      return (
        <TreeNode title={item.assetsName} key={item.assetsId} dataRef={item} >
          {this.renderPartTree(item.assetsData)}
        </TreeNode>
      );
    }
    return <TreeNode {...item} title={item.assetsName} key={item.assetsId} dataRef={item} ></TreeNode>;
  })
  renderTreeNodes = data => data.map((item) => {//右侧的设备树
    if (item.children) {
      return (
        <TreeNode title={item.deviceName} key={`${item.deviceCode}_${item.type}`} dataRef={item} loadData={this.onLoadData}>
          {this.renderTreeNodes(item.children)}
        </TreeNode>
      );
    }
    return <TreeNode {...item} title={item.deviceName} key={`${item.deviceCode}_${item.type}`} dataRef={item} ></TreeNode>;
  })
  render() {
    let { showCopyParts, collectorDevices, undefinedDevices, boostDevices, partInfoTree } = this.props;
    console.log('partInfoTree: ', partInfoTree);
    return (
      <div>
        <div className={styles.copyPartsStyle} ref="copyPartsStyle"></div>
        <Modal
          title="复制组件"
          visible={showCopyParts}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          centered={true}
          mask={false}
          footer={null}
          closable
          maskClosable={false}
          getContainer={() => this.refs.copyPartsStyle}
          wrapClassName={'test'}
        >
          <div className={styles.copyPartsBox}>
            <div className={styles.content}>
              <div className={styles.leftTree}>
                请选择部件结构
                <Checkbox onChange={this.checkAll}>全选</Checkbox>
                <Tree
                  autoExpandParent={true}
                  checkable
                  // defaultExpandedKeys={["0"]}
                  // defaultSelectedKeys={["0"]}
                  onCheck={this.onCheckLeft}
                  checkedKeys={this.state.checkedKeys}
                  blockNode={false}
                  onSelect={this.selectLeftNode}
                  showIcon
                >
                  {this.renderPartTree(partInfoTree)}
                </Tree>
              </div>
              <div className={styles.rightTree}>
                请选择应用设备
                <Tree
                  autoExpandParent={true}
                  checkable
                  // defaultExpandedKeys={["0"]}
                  // defaultSelectedKeys={["0"]}
                  loadData={this.onLoadData}
                  onCheck={this.onCheck}
                  blockNode={false}
                  onSelect={this.selectNode}
                  showIcon
                >
                  {this.renderTreeNodes(collectorDevices)}
                </Tree>
                <Tree
                  autoExpandParent={true}
                  checkable
                  // defaultExpandedKeys={["0"]}
                  // defaultSelectedKeys={["0"]}
                  loadData={this.onLoadData}
                  onCheck={this.onCheck}
                  blockNode={false}
                  onSelect={this.selectNode}
                >
                  {this.renderTreeNodes(boostDevices)}
                </Tree>
                <Tree
                  autoExpandParent={true}
                  checkable
                  // defaultExpandedKeys={["0"]}
                  // defaultSelectedKeys={["0"]}
                  loadData={this.onLoadData}
                  onCheck={this.onCheck}
                  blockNode={false}
                  onSelect={this.selectNode}
                >
                  {this.renderTreeNodes(undefinedDevices)}
                </Tree>
              </div>
            </div>
            <div className={styles.footer}>
              <Button onClick={this.handleCancel} >取消</Button>
              <Button className={styles.confire} >确认复制</Button>
            </div>
          </div>
        </Modal>
      </div>
    )
  }
}
export default (CopyParts)