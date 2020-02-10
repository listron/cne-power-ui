




import React, { Component } from 'react';
import { Button, Input, Form, Select } from 'antd';
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
    roleAllList: PropTypes.object,
    specialRoleList: PropTypes.object,
    changeUserStore: PropTypes.func,
  }

  constructor(props){
    super(props);
    this.state={
    }
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
          userLogo,
          enterpriseId,
        })
        this.props.changeUserStore({
          showPage: 'list',
        })
      }
    })
  }

  continueToAdd = () =>{
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
          userLogo,
          enterpriseId,
        });
        this.props.changeUserStore({
          showPage: 'add',
        })
        form.resetFields();
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
            initialValue: userDetail && userDetail.username,
            rules: [{
              validator: (rule, value, callback) => {
                let truelyStr = value.trim();
                const patternRule = /^\S[\s\S]{1,23}\S$/;
                if (!truelyStr) {
                  callback('请输入字符长度为3-25的用户名');
                } else if (!patternRule.test(truelyStr)) {
                  callback('用户名需3-25个字符');
                }
                callback();
              },
              required: true
            }]
          })(
            <Input placeholder="请输入用户名" />
          )}
          <span className={styles.instructionText}>(3-25位中文,英文,数字,特殊字符都可)</span>
        </FormItem>
        <FormItem label="真实姓名" >
          {getFieldDecorator('userFullName',{
            rules: [
              { required: true, message: '请输入用户名' },
              { validator: (rule, value, callback) => {
                const exactStr = value.trim();
                const patternRule = /^[A-Za-z \u4e00-\u9fa5]{0,30}$/;
                if (!patternRule.test(exactStr)) {
                  callback('请输入小于30字符的真实姓名');
                }
                callback();
              }}
            ],
            // rules: [{
            //   message: '请输入10字以内的真实姓名',
            //   max: 10,
            // }],
            initialValue: userDetail && (userDetail.userFullName || '')
          })(
            <Input placeholder="请输入真实姓名" />
          )}
          <span className={styles.instructionText}>(中文/英文/空格 长度小于30个字)</span>
        </FormItem>
        <FormItem label="电话" >
          {getFieldDecorator('phoneNum',{
            initialValue: userDetail && userDetail.phoneNum,
            rules: [{
              message: '请输入正确的手机号',
              pattern: /^1|9\d{10}$/,
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
              {roleAllList && roleAllList.toJS().map((item,index)=>(
                <Option key={item.roleId} value={item.roleId}  >{item.roleDesc}</Option>
              ))}
            </Select>
          )}
          <span className={styles.instructionText}>(没有设置角色的用户无法正常使用系统)</span>
        </FormItem>
        {/* <FormItem label="特殊权限" >
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
              {specialRoleList && specialRoleList.toJS().length>0 && specialRoleList.toJS().map((item,index)=>(
                <Option key={item.roleId} value={item.roleId}  >{item.roleDesc}</Option>
              ))}
            </Select>
          )}
        </FormItem> */}
        <Button onClick={this.saveUser} value="save" loading={loading} className={styles.saveUser} >保存</Button>
        <Button onClick={this.continueToAdd} value="continueToAdd" loading={loading} >保存并继续添加</Button>
      </Form>
    )
  }
}

export default Form.create()(AddForm);
