import React, { Component } from 'react';
import { Tree } from 'antd';
import PropTypes from 'prop-types';
import Cookie from 'js-cookie';
import styles from './manageCommon.scss';

const { TreeNode } = Tree;

export default class AssetsSelectTree extends Component {

  static propTypes = {
    originInsertInfo: PropTypes.object,
    value: PropTypes.array,
    assetsTree: PropTypes.array,
    mainDeviceEditCodes: PropTypes.array,
    onChange: PropTypes.func,
    changeManufactorRight: PropTypes.func,
  }

  onSelect = (selectedKeys, { node = {} }) => {
    const { mainDeviceEditCodes, changeManufactorRight } = this.props;
    const enterpriseCode = Cookie.get('enterpriseCode');
    const tmpNodeProps = node.props || {};
    const nodeInfo = { ...tmpNodeProps }; // 数据结构调整, 解构取值。
    const isMain = nodeInfo.isMain;
    const addManuRight = !isMain || mainDeviceEditCodes.find(e => `${e}` === enterpriseCode); // 非主设备或有主设备修改权限者 可添加厂家
    changeManufactorRight(!!addManuRight);
    this.props.onChange(selectedKeys);
  }

  findNode = (treeNodes, key) => { // 选中的节点数据重新获取
    let nodeResult;
    treeNodes.find(e => {
      if (e.assetsId === key) {
        nodeResult = e;
        return true;
      }
      const innerNodes = e.childernNodes || [];
      if (innerNodes.length > 0) {
        nodeResult = this.findNode(innerNodes, key);
        return !!nodeResult;
      }
    });
    return nodeResult;
  }

  renderNodes = (nodesInfo = []) => nodesInfo.map(info => {
    const { childernNodes } = info;
    if (childernNodes && childernNodes.length > 0) { // 有子节点
      return (
        <TreeNode title={info.assetsName} key={info.assetsId} isMain={info.isMain}>
          {this.renderNodes(childernNodes)}
        </TreeNode>
      );
    }
    return (
      <TreeNode title={info.assetsName} key={info.assetsId} isMain={info.isMain} />
    );
  })

  render(){
    const { assetsTree, value, originInsertInfo } = this.props;
    return (
      <div className={styles.assetsSelectTree}>
        {(assetsTree.length === 0 || !!originInsertInfo) && <div
          className={styles.noDataText}
          title={originInsertInfo ? originInsertInfo.assetsPath : '生产资产'}
        >
          {originInsertInfo ? originInsertInfo.assetsPath : '生产资产'}
        </div>}
        {assetsTree.length > 0 && <Tree
          selectedKeys={value}
          onSelect={this.onSelect}
        >
          {this.renderNodes(assetsTree)}
        </Tree>}
      </div>
    );
  }
}
