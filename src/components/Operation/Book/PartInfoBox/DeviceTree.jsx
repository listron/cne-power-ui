import React from "react";
import PropTypes from "prop-types";
import { Tree } from 'antd';
const { TreeNode } = Tree;

class DeviceTree extends React.Component {
  static propTypes = {
    changePartInfoStore: PropTypes.func,
    getDeviceTypeList: PropTypes.func,
    getDeviceComList: PropTypes.func,
    undefinedDevices: PropTypes.array,
    boostDevices: PropTypes.array,
    collectorDevices: PropTypes.array,
    stationCode: PropTypes.num,

  }
  constructor(props, context) {
    super(props, context)
    this.state={
      selectedKeys:[]
    }
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
  this.setState({selectedKeys})
    const{changePartInfoStore,getDeviceComList}=this.props;
    let selectData=selectedKeys.join();
    let deviceCode=selectData.split('_')[0];
    let type=selectData.split('_')[1];
    let deviceName=selectData.split('_')[2];
    const { stationCode } = this.props;
    changePartInfoStore({stationCode,deviceCode,type,deviceName})
    getDeviceComList({//获得设备的部件列表
      // deviceCode:'2M201M1M19',
      deviceCode,
      orderField:'1',
      orderMethod:'desc'
    })
  }
  renderTreeNodes = data => data.map((item) => {
    if (item.children) {
      return (
        <TreeNode title={item.deviceName} key={`${item.deviceCode}_${item.type}_${item.deviceName}`} dataRef={item} loadData={this.onLoadData}>
          {this.renderTreeNodes(item.children)}
        </TreeNode>
      );
    }
    return <TreeNode {...item} title={item.deviceName} key={`${item.deviceCode}_${item.type}_${item.deviceName}`} dataRef={item} loadData={this.onLoadData} ></TreeNode>;
  })
  render() {
    const { undefinedDevices, boostDevices, collectorDevices } = this.props;
    const {selectedKeys } = this.state;

    return (
      <div>
        <Tree
          autoExpandParent={true}
          loadData={this.onLoadData}
          onCheck={this.onCheck}
          blockNode={false}
          onSelect={this.selectNode}
          selectedKeys={selectedKeys}
          showIcon
        >
          {this.renderTreeNodes(collectorDevices)}
        </Tree>
        <Tree
          autoExpandParent={true}
          loadData={this.onLoadData}
          onCheck={this.onCheck}
          blockNode={false}
          onSelect={this.selectNode}
          selectedKeys={selectedKeys}
        >
          {this.renderTreeNodes(boostDevices)}
        </Tree>
        <Tree
          autoExpandParent={true}
          loadData={this.onLoadData}
          selectedKeys={selectedKeys}
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