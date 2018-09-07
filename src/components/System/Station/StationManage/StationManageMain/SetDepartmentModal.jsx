

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tree, Modal, message } from 'antd';
import styles from './stationMain.scss'
const { TreeNode } = Tree;

class SetDepartmentModal extends Component { // 电站管理列表页
  static propTypes = {
    allDepartmentData: PropTypes.array,
    departmentSetInfo: PropTypes.object,
    closeDepartmentModal: PropTypes.func,
  }

  constructor(props){
    super(props);
    const { departmentSetInfo } = props;
    const checkedKeys = departmentSetInfo.stationDepartments && departmentSetInfo.stationDepartments.length > 0 || [];
    this.state = {
      checkedKeys,
    }
  }

  componentDidMount(){
    const { allDepartmentData } = this.props;
    if(!allDepartmentData || !(allDepartmentData.length > 0)){
      message.error('未获取部门信息，请刷新重试!')
    }
  }
  
  onCheckDepartment = (checkedKeys) => {
    console.log('onCheck', checkedKeys);
    this.setState({ checkedKeys });
  }

  confirmSetting= () => {
    const { checkedKeys } = this.state;
    const { departmentSetInfo } = this.props;
    this.props.closeDepartmentModal({
      stationCode: departmentSetInfo.stationCode,
      stationName: departmentSetInfo.stationName,
      departmentIds: checkedKeys,
    });
  }

  cancelSetting = () => {
    this.props.closeDepartmentModal()
  }

  renderTreeNodes = (allDepartmentData) => { // 递归渲染节点层级关系
    return allDepartmentData.map((item) => {
      if (item.list) {
        return (
          <TreeNode title={item.departmentName} key={item.departmentId}>
            {this.renderTreeNodes(item.list)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.departmentName} key={item.departmentId} />;
    });
  }


  render(){
    const { departmentSetInfo, allDepartmentData } = this.props;
    const { checkedKeys } = this.state;
    return (
      <Modal
        title={<span>部门设置({departmentSetInfo.stationName})</span>}
        visible={true}
        onOk={this.confirmSetting}
        onCancel={this.cancelSetting}
        okText="保存"
        cancelText="取消"
        wrapClassName={styles.departmentSetting}
      >
        <Tree
          checkable
          autoExpandParent
          onCheck={this.onCheckDepartment}
          checkedKeys={checkedKeys}
        >
          {this.renderTreeNodes(allDepartmentData)}
        </Tree>
      </Modal>
    )
  }
}

export default SetDepartmentModal;
