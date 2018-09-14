

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tree, Modal, message, Checkbox, Button } from 'antd';
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
    const checkedKeys = departmentSetInfo.stationDepartments || [];
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

  checkAllDepartment =(e) => {
    if(!e.target.checked){ // 取消全选时清空。
      this.setState({ checkedKeys: [] });
      return
    }
    const { allDepartmentData } = this.props;
    const getAllDepartmentId = (subData) => {
      let selectArray = [];
      subData && subData.length > 0 && subData.forEach(e=>{
        if(e && e.list && e.list.length > 0){
          selectArray.push(...getAllDepartmentId(e.list));
        }
        if(e && e.departmentId){
          selectArray.push(e.departmentId)
        }
      })
      return selectArray;
    }
    const selectDepartment = getAllDepartmentId(allDepartmentData);
    this.setState({ checkedKeys: selectDepartment });
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
        onCancel={this.cancelSetting}
        okText="保存"
        cancelText="取消"
        wrapClassName={styles.departmentSetting}
        width={625}
        footer={<div className={styles.footer}>
          <Button onClick={this.cancelSetting} className={styles.cancel}>取消</Button>
          <Button onClick={this.confirmSetting} className={styles.confirm}>保存</Button>
        </div>}
      >
        <Checkbox onChange={this.checkAllDepartment}>全选</Checkbox>
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
