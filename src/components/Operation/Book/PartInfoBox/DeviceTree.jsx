import React from "react";
import PropTypes from "prop-types";
import { Tree } from "antd";
const { TreeNode } = Tree;

class DeviceTree extends React.Component {
  static propTypes = {
    changePartInfoStore: PropTypes.func,
    getDeviceTypeList: PropTypes.func,
    getDeviceComList: PropTypes.func,
    undefinedDevices: PropTypes.array,
    boostDevices: PropTypes.array,
    collectorDevices: PropTypes.array,
    stationCode: PropTypes.num
  };
  constructor(props, context) {
    super(props, context);
    this.state = {
      selectedKeys: []
    };
  }
  onLoadData = treeNode => {
    const selectTreeTitle = treeNode.props.title;
    const deviceCategory = ["集电线路", "升压站", "未分组"];
    const dataRef = treeNode.props.eventKey;
    const deviceCode = dataRef ? dataRef.split("_")[0] : "";
    const type = dataRef ? dataRef.split("_")[1] : "";
    const { stationCode } = this.props;
    return new Promise(resolve => {
      if (treeNode.props.children.length > 0) {
        resolve();
        return;
      }
      if (deviceCategory.includes(selectTreeTitle)) {
        resolve();
        return;
      }
      setTimeout(() => {
        this.props.getDeviceTypeList({
          stationCode,
          deviceCode: deviceCode,
          type: type
        });
        resolve();
      }, 1000);
    });
  };

  selectNode = (selectedKeys, e) => {
    this.setState({ selectedKeys });
    const { changePartInfoStore, getDeviceComList } = this.props;
    let selectData = selectedKeys.join();
    let deviceCode = selectData.split("_")[0];
    let type = selectData.split("_")[1];
    let deviceName = selectData.split("_")[2];
    const { stationCode } = this.props;
    changePartInfoStore({ stationCode, deviceCode, type, deviceName });
    getDeviceComList({
      //获得设备的部件列表
      // deviceCode:'2M201M1M19',
      deviceCode,
      orderField: "1",
      orderMethod: "desc"
    });
  };
  renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode
            title={item.deviceName}
            key={`${item.deviceCode}_${item.type}_${item.deviceName}`}
            dataRef={item}
            loadData={this.onLoadData}
          >
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          {...item}
          title={item.deviceName}
          key={`${item.deviceCode}_${item.type}_${item.deviceName}`}
          dataRef={item}
          loadData={this.onLoadData}
        />
      );
    });
  render() {
    const { undefinedDevices, boostDevices, collectorDevices } = this.props;
    const { selectedKeys } = this.state;

    return (
      <div>
        <Tree
          autoExpandParent={true}
          loadData={this.onLoadData}
          onCheck={this.onCheck}
          blockNode={false}
          onSelect={this.selectNode}
          selectedKeys={selectedKeys}
        >
          <TreeNode
            title={"集电线路"}
            key={`集电线路`}
            dataRef={"1"}
            selectable={false}
          >
            {this.renderTreeNodes(collectorDevices)}
          </TreeNode>
        </Tree>
        <Tree
          autoExpandParent={true}
          loadData={this.onLoadData}
          onCheck={this.onCheck}
          blockNode={false}
          onSelect={this.selectNode}
          selectedKeys={selectedKeys}
        >
          <TreeNode
            title={"升压站"}
            key={`升压站`}
            dataRef={"2"}
            selectable={false}
          >
            {this.renderTreeNodes(boostDevices)}
          </TreeNode>
        </Tree>
        <Tree
          autoExpandParent={true}
          loadData={this.onLoadData}
          selectedKeys={selectedKeys}
          onCheck={this.onCheck}
          blockNode={false}
          onSelect={this.selectNode}
        >
          <TreeNode
            title={"未分组"}
            key={`未分组`}
            dataRef={"3"}
            selectable={false}
          >
            {this.renderTreeNodes(undefinedDevices)}
          </TreeNode>
        </Tree>
      </div>
    );
  }
}
export default DeviceTree;
