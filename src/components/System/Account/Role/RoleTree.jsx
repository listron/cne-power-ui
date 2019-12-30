

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Tree, Checkbox, Icon} from 'antd';
import styles from './role.scss';
const TreeNode = Tree.TreeNode;

class RoleTree extends Component {
  static propTypes = {
    treeData: PropTypes.array,
    value: PropTypes.array,
    defaultRootMenu: PropTypes.array,
    onChange: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      expandedKeys: [],
      checkedKeys: props.value,
    }
  }

  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys
    });
  }

  onCheck = (checkedKeys, e) => {
    // const { defaultRootMenu } = this.props;
    const checkedKeyResult = [...checkedKeys];
    this.props.onChange([...checkedKeyResult, ...e.halfCheckedKeys]);
    this.setState({ checkedKeys: checkedKeyResult});
  }

  onCheckAll = (e) => {
    const { treeData, defaultRootMenu } = this.props;
    const checked = e.target.checked;
    if(checked) {
      const allKeys = this.getAllKeys(treeData);
      this.setState({ checkedKeys: allKeys });
      this.props.onChange(allKeys);
    }else{ // 全不选时恢复默认设定权限。
      // const defaultChecked = defaultRootMenu.map(e=>`${e}`)
      this.setState({ checkedKeys: [] });
      // this.props.onChange(defaultChecked);
    }
  }

  getAllKeys(treeArray) { // 根据数组遍历集合内部权限id生成数组。
    const treeKey = [];
    treeArray && treeArray.length > 0 &&treeArray.forEach(e=>{
      const hasChildRight = e && e.childRightData && e.childRightData.length > 0;
      e.rightId && treeKey.push(e.rightId.toString());
      if(hasChildRight){
        treeKey.push(...this.getAllKeys(e.childRightData));
      }
    })
    return treeKey
  }

  renderTreeNodes = (treeData) => {
    const { expandedKeys } = this.state;
    return treeData.map((item) => {
      const hasChild = item && item.childRightData && item.childRightData.length > 0;
      if(hasChild) {
        const nodeExpanded =  expandedKeys.includes(item.rightId.toString());
        const TreeNodeTitle = (<span className={styles.treeNodeTitle}>
          {item.rightName}
          <Icon type={nodeExpanded?"up":"down"} className={nodeExpanded?styles.upIcon:styles.downIcon} theme="outlined" />
        </span>)
        return (
          <TreeNode title={TreeNodeTitle} key={item.rightId.toString()} >
            {this.renderTreeNodes(item.childRightData)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.rightName} key={item.rightId.toString()} />;
    });
  }

  render(){
    const { treeData } = this.props;
    const { checkedKeys, expandKeys } = this.state;
    const allKeys = this.getAllKeys(treeData);
    const checkedAll = allKeys.length === checkedKeys.length;
    return (
      <div>
        <Checkbox style={{marginLeft: 26}} onChange={this.onCheckAll} checked={checkedAll}>全选</Checkbox>
        <Tree
          checkable
          expandKeys={expandKeys}
          checkedKeys={checkedKeys}
          onExpand={this.onExpand}
          onCheck={this.onCheck}
        >
          {this.renderTreeNodes(treeData)}
        </Tree>
      </div>
    );
  }
}

export default RoleTree;
