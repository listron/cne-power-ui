import React, { Component } from 'react';
import { Tree } from 'antd';
import PropTypes from 'prop-types';
import styles from './style.scss';
const { TreeNode } = Tree;

export default class CheckTree extends Component{

  static propTypes = {
    data: PropTypes.array,
    checkedTrees: PropTypes.array,
    onTreeCheck: PropTypes.func,
  }

  onCheck = checkedTrees => {
    this.props.onTreeCheck(checkedTrees);
  };

  renderTreeNodes = data => data.map(item => {
    const { children = [] } = item || {};
    console.log('children',children)
    if (children && children.length > 0) {
      const hasSubChild = children.find(e => e.children && e.children.length > 0);
      return (
        <TreeNode
          title={item.label}
          key={item.value}
          dataRef={item}
          className={!hasSubChild ? styles.noneChild : null}
        >
          {this.renderTreeNodes(children)}
        </TreeNode>
      );
    }
    return <TreeNode {...item} title={item.label} key={item.value} className={styles.lastNode} />;
  });

  render () {
    const { data, checkedTrees } = this.props;
    return (
      <Tree
        checkable
        onCheck={this.onCheck}
        checkedKeys={checkedTrees}
        className={styles.trees}
      >
        {this.renderTreeNodes(data)}
      </Tree>
    );
  }
}
