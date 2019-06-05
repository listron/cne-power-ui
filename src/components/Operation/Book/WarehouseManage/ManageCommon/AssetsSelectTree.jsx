import React, { Component } from 'react';
import { Tree } from 'antd';
import PropTypes from 'prop-types';
import styles from './manageCommon.scss';

const { TreeNode } = Tree;

export default class AssetsSelectTree extends Component {

  static propTypes = {
    assetsTree: PropTypes.array,
  }

  onSelect = (selectedKeys, info) => {
    console.log(selectedKeys, info);
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
    const { assetsTree } = this.props;
    return (
      <div className={styles.assetsSelectTree}>
        {assetsTree.length === 0 && <div>生产资产</div>}
        {assetsTree.length > 0 && <Tree
          onSelect={this.onSelect}
        >
          {this.renderNodes(assetsTree)}
        </Tree>}
      </div>
      
    )
  }
}
