

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Tree} from 'antd';
import styles from './enterprise.scss';
const TreeNode = Tree.TreeNode;

class RoleTree extends Component {
  static propTypes = {
    treeData: PropTypes.array,
    value: PropTypes.string,
    onChange: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      expandKeys: [],
    }
  }

  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys
    });
  }

  onCheck = (checkedKeys) => {
    this.props.onChange(checkedKeys.join(','));
  }

  renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.childRightData) {
        return (
          <TreeNode title={item.rightName} key={item.rightId} dataRef={item}>
            {this.renderTreeNodes(item.childRightData)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.rightName} key={item.rightId} />;
    });
  }

  render(){
    return (
      <Tree
        checkable={true}
        expandKeys={this.state.expandKeys}
        checkedKeys={this.props.value.split(',')}
        onExpand={this.onExpand}
        onCheck={this.onCheck}
      >
        {this.renderTreeNodes(this.props.treeData)}
      </Tree>
    );
  }
}

export default RoleTree;
