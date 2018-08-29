

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Tree, Checkbox} from 'antd';
import styles from './role.scss';
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

  onCheck = (checkedKeys, e) => {
    this.props.onChange(checkedKeys.join(','));
  }

  onCheckAll = (e) => {
    const checkedKeys = [];
    const { treeData } = this.props;
    const checked = e.target.checked;
    if(checked) {
      this.getAllKeys(treeData, checkedKeys);
    }
    this.props.onChange(checkedKeys.join(','));
  }

  getAllKeys(data, arr) {
    for(var i = 0; i < data.length; i++) {
      const item = data[i];
      arr.push(item.rightId.toString());
      if(!(item.childRightData === null || (item.childRightData instanceof Array && item.childRightData.length === 0))) {
        this.getAllKeys(item.childRightData, arr);
      }
    }
  }

  renderTreeNodes = (data) => {
    return data.map((item) => {
      if(item.childRightData === null || (item.childRightData instanceof Array && item.childRightData.length === 0)) {
        return <TreeNode title={item.rightName} key={item.rightId.toString()} />;
      }
      return (
        <TreeNode title={item.rightName} key={item.rightId.toString()} dataRef={item}>
          {this.renderTreeNodes(item.childRightData)}
        </TreeNode>
      );
    });
  }

  render(){
    const checkedKeys = [];
    const { treeData, value } = this.props;
    this.getAllKeys(treeData, checkedKeys);
    return (
      <div>
        <Checkbox style={{marginLeft: 26}} onChange={this.onCheckAll} 
        checked={this.props.value === checkedKeys.join(',')}>全选</Checkbox>
        <Tree
          checkable={true}
          expandKeys={this.state.expandKeys}
          checkedKeys={value === '' ? []: this.props.value.split(',')}
          onExpand={this.onExpand}
          onCheck={this.onCheck}
        >
          {this.renderTreeNodes(this.props.treeData)}
        </Tree>
      </div>
    );
  }
}

export default RoleTree;
