




import React, { Component } from 'react';
import { Button, Input, Form, Select } from 'antd'; 
import PropTypes from 'prop-types';
import styles from './userSide.scss';
const FormItem = Form.Item;
const Option= Select.Option;
class EditForm extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    form: PropTypes.object,
    userDetail: PropTypes.object,
    editUserInfo: PropTypes.func,
    userLogo: PropTypes.string,
    enterpriseId: PropTypes.string,
    roleAllList: PropTypes.object,
    specialRoleList: PropTypes.object,
  }

  constructor(props){
    super(props);
  }

  saveUser = () =>{
    const { userLogo, enterpriseId } = this.props;
    this.props.form.validateFieldsAndScroll((error,values)=>{
      if(!error){
        this.props.editUserInfo({
          Email: values.Email,
          phoneNum: values.phoneNum,
          roleId: values.roleId.join(','),
          specialRoleId: values.specialRoleId.join(','),
          userFullName: values.userFullName,
          username: values.username,
          userLogo,
          enterpriseId,
          showPage: 'list',
        })
        
      }
    })
  }

  render(){
    const { getFieldDecorator } = this.props.form;
    const { userDetail, loading, roleAllList, specialRoleList } = this.props;
    return (
      <Form className={styles.editPart}>
        <FormItem label="用户名" >
          {getFieldDecorator('username',{
            initialValue: userDetail && userDetail.get('username'),
            rules: [{
              required : true,
              message: '3-8位数字,字母组合',
              max: 8,
              min: 3,
            }]
          })(
            <Input placeholder="3-8位数字,字母组合" disabled />
          )}
          <span className={styles.instructionText}>(3-8位数字,字母组合)</span>
        </FormItem>
        <FormItem label="真实姓名" >
          {getFieldDecorator('userFullName',{
            rules: [{
              message: '请输入10字以内的真实姓名',
              max: 10,
            }],
            initialValue: userDetail && (userDetail.get('userFullName') || '')
          })(
            <Input placeholder="请输入真实姓名" />
          )}
          <span className={styles.instructionText}>(10字以内)</span>
        </FormItem>
        <FormItem label="电话" >
          {getFieldDecorator('phoneNum',{
            initialValue: userDetail && userDetail.get('phoneNum'),
            rules: [{
              message: '请输入正确的手机号',
              pattern: /^1\d{10}$/,
              required: true,
            }]
          })(
            <Input placeholder="请输入电话号码" disabled />
          )}
          <span className={styles.instructionText}>(11位手机号码)</span>
        </FormItem>
        <FormItem label="邮箱" >
          {getFieldDecorator('Email',{rules:[{
              message: '请输入正确格式的邮箱',
              pattern: /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/,
            }],
            initialValue: userDetail && (userDetail.get('Email') || '')
          })(
            <Input placeholder="请输入邮箱" />
          )}
          <span className={styles.instructionText}>(可用邮箱找回密码)</span>
        </FormItem>
        {/* <FormItem label="账户微信" >
          {getFieldDecorator('webChat',{
            initialValue: userDetail && userDetail.get('webChat')
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
              {roleAllList && roleAllList.toJS().map((item,index)=>(
                <Option key={item.roleId} value={item.roleId}  >{item.roleDesc}</Option>
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
              {specialRoleList && specialRoleList.toJS().map((item,index)=>(
                <Option key={item.roleId} value={item.roleId} >{item.roleDesc}</Option>
              ))}
            </Select>
          )}
        </FormItem>
        <Button onClick={this.saveUser} loading={loading} className={styles.saveUser} >保存</Button>
      </Form>
    )
  }
}

export default Form.create()(EditForm);
