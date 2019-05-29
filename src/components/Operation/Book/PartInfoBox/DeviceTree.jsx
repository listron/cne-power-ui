import React from "react";
import PropTypes from "prop-types";
import { Tree } from 'antd';
const { TreeNode } = Tree;

class DeviceTree extends React.Component {
  constructor(props, context) {
    super(props, context)
  }
  onLoadData = (treeNode) => {
    const { stationCode } = this.props;
    return new Promise(resolve => {
      if (treeNode.props.children) {
        this.props.getDeviceTypeList({
          stationCode,
          deviceCode: 11,
          type: 1
        })
        resolve();
        return;
      }
      setTimeout(() => {
        this.props.getDeviceTypeList({
          stationCode,
          deviceCode: '',
          type: 1
        })
      }, 10)
    })


  }
  selectNode = (selectedKeys, e) => {
    console.log(' e: ', e);
    console.log('selectedKeys: ', selectedKeys);
    let selectData=selectedKeys.join();
    let deviceCode=selectData.split('_')[0];
    let type=selectData.split('_')[1];
    const { stationCode } = this.props;
    // this.props.getDeviceTypeList({
    //   stationCode,
    //   deviceCode: '11',
    //   type: 1
    // })
    this.props.changePartInfoStore({
      stationCode,
      deviceCode,
      type
    })
    this.props.getDevicePartInfo({
      deviceFullcode:deviceCode
    })

  }

  renderTreeNodes = data => data.map((item) => {
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
    const { undefinedDevices, boostDevices, collectorDevices } = this.props;

    return (
      <div>
        <Tree
          autoExpandParent={true}
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
    )
  }
}
export default (DeviceTree)