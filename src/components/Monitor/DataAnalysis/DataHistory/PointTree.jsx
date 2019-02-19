import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tree } from 'antd';
import styles from './historyStyle.scss';

const { TreeNode } = Tree;
const treeData = [{
  title: '0-0',
  key: '0-0',
  children: [{
    title: '0-0-0',
    key: '0-0-0',
    children: [
      { title: '0-0-0-0', key: '0-0-0-0' },
      { title: '0-0-0-1', key: '0-0-0-1' },
      { title: '0-0-0-2', key: '0-0-0-2' },
    ],
  }, {
    title: '0-0-1',
    key: '0-0-1',
    children: [
      { title: '0-0-1-0', key: '0-0-1-0' },
      { title: '0-0-1-1', key: '0-0-1-1' },
      { title: '0-0-1-2', key: '0-0-1-2' },
    ],
  }, {
    title: '0-0-2',
    key: '0-0-2',
  }],
}, {
  title: '0-1',
  key: '0-1',
  children: [
    { title: '0-1-0-0', key: '0-1-0-0' },
    { title: '0-1-0-1', key: '0-1-0-1' },
    { title: '0-1-0-2', key: '0-1-0-2' },
  ],
}, {
  title: '0-2',
  key: '0-2',
}];

class PointTree extends Component {

  static propTypes = {
    // stationCode: PropTypes.number,
    // deviceTypeCode: PropTypes.number,
    // deviceCodes: PropTypes.array,
    // startTime: PropTypes.string,
    // endTime: PropTypes.string,
    pointCodes: PropTypes.array, // 选中的测点
    // timeSpace:  PropTypes.string,
    // historyType:  PropTypes.string,
    
    changeHistoryStore: PropTypes.func,
    getHistory: PropTypes.func,
  };

  pointSelect = (selectedKeys, info) => {
    const {  } = this.props;
    console.log(selectedKeys)
    console.log(info)
  }

  renderTreeNodes = data => data.map((item) => {
    if (item.children) {
      return (
        <TreeNode title={item.title} key={item.key} dataRef={item}>
          {this.renderTreeNodes(item.children)}
        </TreeNode>
      );
    }
    return <TreeNode {...item} />;
  })

  

  render(){
    const { pointCodes } = this.props;
    return (
      <section className={styles.pointTree}>
        <h3>选择测点({pointCodes.length})</h3>
        <Tree
          checkable
          // autoExpandParent={this.state.autoExpandParent}
          onCheck={this.pointSelect}
          // selectedKeys={this.state.selectedKeys}
        >
          {this.renderTreeNodes(treeData)}
        </Tree>
      </section>
    )
  }
}

export default PointTree;