import React, { Component } from 'react';
import { Tree } from 'antd';
import PropTypes from 'prop-types';
import styles from './manageCommon.scss';

const { TreeNode } = Tree;

export default class AssetsSelectTree extends Component {

  static propTypes = {
    originInsertInfo: PropTypes.object,
    value: PropTypes.array,
    assetsTree: PropTypes.array,
    onChange: PropTypes.func,
  }

  onSelect = (selectedKeys) => {
    this.props.onChange(selectedKeys);
  }

  renderNodes = (nodesInfo = []) => nodesInfo.map(info => {
    const { childernNodes } = info;
    if (childernNodes && childernNodes.length > 0) { // 有子节点
      return (
        <TreeNode title={info.assetsName} key={info.assetsId}>
          {this.renderNodes(childernNodes)}
        </TreeNode>
      )
    }
    return (
      <TreeNode title={info.assetsName} key={info.assetsId} />
    )
  })
  

  render(){
    const { assetsTree, value, originInsertInfo } = this.props;
    return (
      <div className={styles.assetsSelectTree}>
        {(assetsTree.length === 0 || !!originInsertInfo) && <div className={styles.noDataText}>
          {originInsertInfo ? originInsertInfo.assetsPath : '生产资产'}
        </div>}
        {assetsTree.length > 0 && <Tree
          selectedKeys={value}
          onSelect={this.onSelect}
        >
          {this.renderNodes(assetsTree)}
        </Tree>}
      </div>
      
    )
  }
}
