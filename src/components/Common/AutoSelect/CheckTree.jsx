import React, { Component } from 'react';
import { Tree } from 'antd';
import PropTypes from 'prop-types';
import styles from './style.scss';
const { TreeNode } = Tree;

export default class CheckTree extends Component{

  static propTypes = {
    data: PropTypes.array,
    multiple: PropTypes.bool,
    checkedTrees: PropTypes.array,
    onTreeCheck: PropTypes.func,
  }

  onCheck = values => {
    const { multiple, checkedTrees } = this.props;
    if (!multiple && values.length > 1) { // 单选模式
      const singleValue = values.filter(e => !checkedTrees.includes(e));
      this.props.onTreeCheck(singleValue);
    } else { // 多选模式 或 values长度不超出1个。
      this.props.onTreeCheck(values);
    }
  };

  renderTreeNodes = data => data.map(item => {
    const { children = [] } = item || {};
    if (children && children.length > 0) {
      const hasSubChild = children.find(e => e.children && e.children.length > 0);
      return (
        <TreeNode
          title={item.label}
          key={item.value}
          dataRef={item}
          className={!hasSubChild ? styles.noneChild : null}
          disabled={!this.props.multiple}
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
