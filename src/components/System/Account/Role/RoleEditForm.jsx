import React, { Component } from 'react';
import { Button, Input, Form, Radio } from 'antd';
import PropTypes from 'prop-types';
import styles from './role.scss';
import RoleTree from './RoleTree';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;


class RoleEditForm extends Component {
  static propTypes = {
    form: PropTypes.object,
    showPage: PropTypes.string,
    enterpriseId: PropTypes.string,
    selectedRole: PropTypes.array,
    menuData: PropTypes.array,
    defaultMenuData: PropTypes.array,
    onCreateRole: PropTypes.func,
    onEditRole: PropTypes.func,
    changeRoleStore: PropTypes.func,
    loading: PropTypes.bool,
    continueAdd: PropTypes.bool,
    operatetypeData: PropTypes.array,
  }

  constructor(props){
    super(props);
    this.state = {
      operateType: '执行',
    };
  }

  onSaveRole = () => {
    const { enterpriseId, selectedRole, defaultMenuData, operatetypeData = [], showPage, onCreateRole, onEditRole } = this.props;
    const isEdit = showPage === 'edit';
    const selectedRight = isEdit ? selectedRole[0].rightData : [];
    const allRoleIds = this.getRightIdArr(selectedRight);

    this.props.form.validateFieldsAndScroll((err, values) => {
      if(!err) {
        const { roleDesc, rightId, operateName} = values;
        const outputRightSet = new Set([...rightId, ...allRoleIds]);
        const outputRightArr = [...outputRightSet];

        const selectOperateInfo = operatetypeData.find(e => {
          return e.name === operateName;
        }) || '';
        const operateId = selectOperateInfo.id;
        if(showPage === 'create') {
          onCreateRole({
            roleDesc: roleDesc.trim(),
            rightId: values.rightId.join(','),
            enterpriseId,
            operateId,
            continueAdd: false,
          });
        } else {
          onEditRole({
            roleDesc: roleDesc.trim(),
            rightId: outputRightArr.join(','),
            enterpriseId,
            operateId,
            roleId: selectedRole[0].roleId,
          });
        }
      }
    });
  }

  getRightIdArr = (rightData, treeKey = []) => { // 获取被编辑角色的所有id根节点数组(给后端传菜单的全部rightId)
    rightData && rightData.length > 0 && rightData.forEach(e=>{
      const hasChildRight = e && e.childRightData && e.childRightData.length > 0;
      treeKey.push(e.rightId);
      if(hasChildRight){
        this.getRightIdArr(e.childRightData, treeKey);
      }
    });
    return treeKey;
  }

  getRightId = (rightData) => { // 获取被编辑角色的id根节点数组(剔除中间节点)
    const treeKey = [];
    rightData && rightData.length > 0 && rightData.forEach(e=>{
      const hasChildRight = e && e.childRightData && e.childRightData.length > 0;
      if(hasChildRight){
        treeKey.push(...this.getRightId(e.childRightData));
      }else{
        e.rightId && treeKey.push(e.rightId.toString());
      }
    });
    return treeKey;
  }

  // getDefaultRootMenu = (rightData) => {
  //   const { defaultMenuData } = this.props;
  //   let defaultRootMenu = [];
  //   rightData && rightData.length > 0 && rightData.forEach(e=>{
  //     const hasChildRight = e && e.childRightData && e.childRightData.length > 0;

  //     if(hasChildRight){
  //       defaultRootMenu.push(...this.getDefaultRootMenu(e.childRightData));
  //     }else{
  //       defaultMenuData.includes(e.rightId) && defaultRootMenu.push(e.rightId);
  //     }
  //   })
  //   return defaultRootMenu;
  // }

  onOperatetypeChange = e => {
    this.setState({
      operateType: e.target.value,
    });
  };


  render(){
    const { operateType } = this.state;
    const { getFieldDecorator } = this.props.form;
    const { showPage, loading, continueAdd, selectedRole, menuData } = this.props;
    const isCreate = showPage === 'create';
    const selectedRight = isCreate? [] : selectedRole[0].rightData;
    let initialRightValue = [];
    let initialOperateName = '';
    // const defaultRootMenu = this.getDefaultRootMenu(menuData);
    if(isCreate){
      initialRightValue = [];
      initialOperateName = operateType;
    }else{
      initialRightValue = this.getRightId(selectedRight);
      initialOperateName = selectedRole[0].operateName;
    }
    
    return (     
      <Form onSubmit={this.onSubmit} className={styles.roleEditForm}>
        <FormItem label="角色名称">
          {getFieldDecorator('roleDesc', {
            rules: [{ 
              required: true, message: '请输入角色名称',
            },{
              validator: (rule, value, callback)=>{
                if(value.trim().length > 10){
                  callback('不超过10个字');
                }else{
                  callback();
                }
              }
            }],
            initialValue: (isCreate || !selectedRole[0]) ? '' : selectedRole[0].roleDesc
          })(
            <Input placeholder="请输入..." />
          )}
          <span className={styles.instructionText}>(10字以内)</span>
        </FormItem>
        <FormItem label="权限设置">
          {getFieldDecorator('operateName', {
              rules: [{
                required: true,
                message: '请选择权限',
              }],
              initialValue: initialOperateName,
            })(
              <RadioGroup onChange={this.onOperatetypeChange}>
                <Radio value={'管理'}>管理</Radio>
                <Radio value={'执行'}>执行</Radio>
                <Radio value={'浏览'}>浏览</Radio>
              </RadioGroup>
          )}
        </FormItem>
        <FormItem
          className={styles.dealProposal} 
          label="功能设置">
          {getFieldDecorator('rightId', {
            rules: [{ 
              required: true,
              message: '请勾选功能'
            }],
            initialValue: initialRightValue,
          })(
            <RoleTree treeData={menuData} />
          )}
        </FormItem>
        <div className={styles.buttonGroup}>
          <Button className={styles.save} onClick={this.onSaveRole} loading={!continueAdd&&loading}>保存</Button>
        </div>
        <div style={{marginLeft:410}} className={styles.instructionText}>选择“保存”按钮后将跳转到对应的列表页</div>
      </Form>
    );
  }
}

export default Form.create()(RoleEditForm);
