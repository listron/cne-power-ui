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
  }

  constructor(props){
    super(props);
    this.state = {
      operateType: 'implement',
    }
  }

  onSaveRole = () => {
    const { enterpriseId, selectedRole, defaultMenuData, operatetypeData = [] } = this.props;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if(!err) {
        const { roleDesc, rightId, operateName} = values;
        const tmpDefault = defaultMenuData.map(e=>`${e}`);
        const outputRightSet = new Set([...rightId,...tmpDefault]);
        const outputRightArr = [...outputRightSet];
        const operateId = operatetypeData.length > 0 ? operatetypeData.find(e => {
          return e.name === operateName;
        }) : '';
        if(this.props.showPage === 'create') {
          this.props.onCreateRole({
            roleDesc: roleDesc.trim(),
            rightId: outputRightArr.join(','),
            enterpriseId,
            continueAdd: false,
            operateId,
          });
        } else {
          this.props.onEditRole({
            roleDesc: roleDesc.trim(),
            rightId: outputRightArr.join(','),
            roleId: selectedRole[0].roleId,
            enterpriseId,
            operateId,
          })
        }
      }
    });
  }

  onSaveRoleAndAdd = () => {
    const { enterpriseId } = this.props;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if(!err) {
        this.props.onCreateRole({
          roleDesc: values.roleDesc.trim(),
          rightId: values.rightId.join(','),
          enterpriseId,
          continueAdd: true,
        });
        this.props.form.resetFields();
      }
    });
  }

  getRightIdArr = (rightData) => { // 获取被编辑角色的id根节点数组(剔除中间节点)
    const treeKey = [];
    rightData && rightData.length > 0 && rightData.forEach(e=>{
      const hasChildRight = e && e.childRightData && e.childRightData.length > 0;
      if(hasChildRight){
        treeKey.push(...this.getRightIdArr(e.childRightData));
      }else{
        e.rightId && treeKey.push(e.rightId.toString());
      }
    })
    return treeKey;
  }

  getDefaultRootMenu = (rightData) => {
    const { defaultMenuData } = this.props;
    let defaultRootMenu = [];
    rightData && rightData.length > 0 && rightData.forEach(e=>{
      const hasChildRight = e && e.childRightData && e.childRightData.length > 0;

      if(hasChildRight){
        defaultRootMenu.push(...this.getDefaultRootMenu(e.childRightData));
      }else{
        defaultMenuData.includes(e.rightId) && defaultRootMenu.push(e.rightId);
      }
    })
    return defaultRootMenu;
  }

  onOperatetypeChange = e => {
    this.setState({
      operateType: e.target.value,
    });
  };


  render(){
    const { getFieldDecorator } = this.props.form;
    const { showPage, loading, continueAdd, selectedRole, menuData } = this.props;
    const isCreate = showPage === 'create';
    const selectedRight = isCreate? [] : selectedRole[0].rightData;
    let initialRightValue = [];
    let initialOperateName = '';
    const defaultRootMenu = this.getDefaultRootMenu(menuData);
    if(isCreate){
      initialRightValue = defaultRootMenu.map(e=>`${e}`);
      initialOperateName = 'implement';
    }else{
      initialRightValue = this.getRightIdArr(selectedRight);
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
          {getFieldDecorator('operatetype', {
              rules: [{
                required: true,
              }],
              initialValue: initialOperateName,
            })(
              <RadioGroup onChange={this.onOperatetypeChange} value={initialOperateName}>
                <Radio value={'management'}>管理</Radio>
                <Radio value={'implement'}>执行</Radio>
                <Radio value={'browse'}>浏览</Radio>
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
            <RoleTree treeData={menuData} defaultRootMenu={defaultRootMenu} />
          )}
        </FormItem>
        <div className={styles.buttonGroup}>
          <Button className={styles.save} onClick={this.onSaveRole} loading={!continueAdd&&loading}>保存</Button>
          {isCreate&&<Button onClick={this.onSaveRoleAndAdd} loading={continueAdd&&loading}>保存并继续添加</Button>}
        </div>
        <div style={{marginLeft:410}} className={styles.instructionText}>选择“保存”按钮后将跳转到对应的列表页；选择“保存并继续添加”按钮将会停留在添加页面</div>
      </Form>
    );
  }
}

export default Form.create()(RoleEditForm);
