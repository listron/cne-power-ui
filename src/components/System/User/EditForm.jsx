




import React, { Component } from 'react';
import { Button, Input, Form } from 'antd';
import InputLimit from '../../Common/InputLimit'; 
import PropTypes from 'prop-types';
import styles from './user.scss';
const FormItem = Form.Item;

class EditForm extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    form: PropTypes.object,
    userDetail: PropTypes.object,
    saveUserInfor: PropTypes.func,
    userLogo: PropTypes.string
  }

  constructor(props){
    super(props);
  }

  saveUser = () =>{
    const { userLogo } = this.props;
    this.props.form.validateFieldsAndScroll((error,values)=>{
      if(!error){
        this.props.saveUserInfor({
          ...values,
          userLogo
        })
      }
    })
  }

  render(){
    const { getFieldDecorator } = this.props.form;
    const { userDetail, loading } = this.props;
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
              pattern: /^1[3|4|5|7|8]\d{9}$/,
            }]
          })(
            <span>{userDetail && userDetail.phoneNum}</span>
          )}
          <span className={styles.instructionText}>(11位手机号码)</span>
        </FormItem>
        <FormItem label="邮箱" >
          {getFieldDecorator('email',{rules:[{
              message: '请输入正确格式的邮箱',
              pattern: /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/,
            }],
            initialValue: userDetail || (userDetail.email || '')
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
          {getFieldDecorator('roleId',{rules:[{
              message: '请输入正确格式的企业电话',
              pattern: /^(\d{7,11})([,](\d{7,11})){0,}([,]?)$/,
            }],
            initialValue: userDetail && (userDetail.roleId || '')
          })(
            <Input />
          )}
          <span className={styles.instructionText}>(无角色不能操作系统)</span>
        </FormItem>
        <FormItem label="特殊权限" >
          {getFieldDecorator('specialRoleId', {
            rules: [{
              message: '请选择特殊权限',
            }],
            initialValue: userDetail && (userDetail.specialRoleId || '')
          })(
            <Input />
          )}
        </FormItem>
        <Button onClick={this.saveUser} loading={loading} >保存</Button>
        <Button onClick={this.continueToAdd} loading={loading} >保存并继续添加</Button>
      </Form>
    )
  }
}

export default Form.create()(EditForm);
