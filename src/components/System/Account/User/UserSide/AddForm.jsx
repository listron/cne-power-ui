




import React, { Component } from 'react';
import { Button, Input, Form, Select, Checkbox } from 'antd';
import PropTypes from 'prop-types';
import styles from './userSide.scss';

const FormItem = Form.Item;
const Option= Select.Option;
class AddForm extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    form: PropTypes.object,
    userDetail: PropTypes.object,
    createUserInfo: PropTypes.func,
    userLogo: PropTypes.string,
    enterpriseId: PropTypes.string,
  }

  constructor(props){
    super(props);
    this.state={
      selectedRoles: new Set(),
    }
  }

  onSelectRoles = (value, item) => {
    console.log(value, item);
    // const { selectedRoles } = this.state;
    // let tmpSelectedRoles = selectedRoles;
    // tmpSelectedRoles.has(value) ? tmpSelectedRoles.delete(value) : tmpSelectedRoles.add(value);
    // this.setState({selectedRoles: tmpSelectedRoles})
  }

  saveUser = () =>{
    const { userLogo, enterpriseId } = this.props;
    this.props.form.validateFieldsAndScroll((error,values)=>{
      if(!error){
        this.props.createUserInfo({
          email: values.email,
          phoneNum: values.phoneNum,
          roleId: values.roleId.join(','),
          specialRoleId: values.specialRoleId.join(','),
          userFullName: values.userFullName,
          username: values.username,
          // userLogo,
          enterpriseId,
          showPage: 'list',
        })
        
      }
    })
  }

  continueAdd = () =>{
    const { userLogo, enterpriseId, form } = this.props;
    this.props.form.validateFieldsAndScroll((error,values)=>{
      if(!error){
        this.props.createUserInfo({
          email: values.email,
          phoneNum: values.phoneNum,
          roleId: values.roleId.join(','),
          specialRoleId: values.specialRoleId.join(','),
          userFullName: values.userFullName,
          username: values.username,
          // userLogo,
          enterpriseId,
          showPage: 'add',
        });
        form.resetFields();
      }
    })
  }
  

  render(){
    const { getFieldDecorator } = this.props.form;
    const { userDetail, loading } = this.props;
    const { selectedRoles } = this.state;
    const roleData = [
      {roleId: '1', roleName: '系统管理员', isPre: 0, rightData:[]},
      {roleId: '2', roleName: '企业管理员', isPre: 0, rightData:[]},
      {roleId: '3', roleName: '生产管理员', isPre: 0, rightData:[]},
      {roleId: '4', roleName: '运维实施工人', isPre: 0, rightData:[]},
      {roleId: '5', roleName: '运维管理员', isPre: 0, rightData:[]},
    ];
    const specialRoleId = [
      {specialRoleId: '1', specialRoleName: '特殊权限1'},
      {specialRoleId: '2', specialRoleName: '特殊权限2'},
      {specialRoleId: '3', specialRoleName: '特殊权限3'},
      {specialRoleId: '4', specialRoleName: '特殊权限4'},
    ]
    return (
      <Form className={styles.editPart}>
        <FormItem label="用户名" >
          {getFieldDecorator('username',{
            initialValue: userDetail && userDetail.username,
            rules: [{
              required : true,
              message: '请输入用户名',
              max: 8,
              min: 3,
            }]
          })(
            <Input placeholder="请输入用户名" />
          )}
          <span className={styles.instructionText}>(3-8位数字,字母组合)</span>
        </FormItem>
        <FormItem label="真实姓名" >
          {getFieldDecorator('userFullName',{
            rules: [{
              message: '请输入10字以内的真实姓名',
              max: 10,
            }],
            initialValue: userDetail && (userDetail.userFullName || '')
          })(
            <Input placeholder="请输入真实姓名" />
          )}
          <span className={styles.instructionText}>(10字以内)</span>
        </FormItem>
        <FormItem label="电话" >
          {getFieldDecorator('phoneNum',{
            initialValue: userDetail && userDetail.phoneNum,
            rules: [{
              message: '请输入正确的手机号',
              pattern: /^1\d{10}$/,
              required: true,
            }]
          })(
            <Input placeholder="请输入电话号码" />
          )}
          <span className={styles.instructionText}>(11位手机号码)</span>
        </FormItem>
        <FormItem label="邮箱" >
          {getFieldDecorator('email',{rules:[{
              message: '请输入正确格式的邮箱',
              pattern: /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/,
            }],
            initialValue: userDetail && (userDetail.email || '')
          })(
            <Input placeholder="请输入邮箱" />
          )}
          <span className={styles.instructionText}>(可用邮箱找回密码)</span>
        </FormItem>
        {/* <FormItem label="账户微信" >
          {getFieldDecorator('webChat',{
            initialValue: userDetail && userDetail.webChat
          })(
            <span>{userDetail.webChat}</span>
          )}
        </FormItem> */}
        <FormItem label="角色" >
          {getFieldDecorator('roleId',{
            initialValue: [],
          })(
            <Select
              mode="multiple"
              placeholder="请选择用户角色"
              showArrow={true}
              onChange={this.onSelectRoles}
              className={styles.selectRoles}
            >
              {roleData.map((item,index)=>(
                <Option key={item.roleId} value={item.roleId}  >{item.roleName}</Option>
              ))}
            </Select>
          )}
          <span className={styles.instructionText}>(无角色不能操作系统)</span>
        </FormItem>
        <FormItem label="特殊权限" >
          {getFieldDecorator('specialRoleId', {
            initialValue: [],
          })(
            <Select
              mode="multiple"
              placeholder="请选择特殊权限"
              showArrow={true}
              onChange={this.specialRoleId}
              className={styles.specialRoleId}
            >
              {specialRoleId.map((item,index)=>(
                <Option key={item.specialRoleId} value={item.specialRoleId}  >{item.specialRoleName}</Option>
              ))}
            </Select>
          )}
        </FormItem>
        <Button onClick={this.saveUser} value="save" loading={loading} className={styles.saveUser} >保存</Button>
        <Button onClick={this.continueAdd} value="continueAdd" loading={loading} >保存并继续添加</Button>
      </Form>
    )
  }
}

export default Form.create()(AddForm);
