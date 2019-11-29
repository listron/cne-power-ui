

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Input, Form, Select, Icon } from 'antd';
import PersonnelLogoUploader from './PersonnelLogoUploader';
import styles from './side.scss';

const FormItem = Form.Item;
const Option= Select.Option;

class HandlePersonnelInfo extends Component {
  static propTypes = {
    pageKey: PropTypes.string,
    form: PropTypes.object,
    changeStore: PropTypes.func,
  }

  testBackTolist = () => {
    this.props.changeStore({ pageKey: 'list' });
  }

  // saveUser = () =>{
  //   const { userLogo, enterpriseId } = this.props;
  //   this.props.form.validateFieldsAndScroll((error,values)=>{
  //     if(!error){
  //       this.props.createUserInfo({
  //         email: values.email,
  //         phoneNum: values.phoneNum,
  //         roleId: values.roleId.join(','),
  //         specialRoleId: values.specialRoleId.join(','),
  //         userFullName: values.userFullName,
  //         username: values.username,
  //         userLogo,
  //         enterpriseId,
  //       })
  //       this.props.changeUserStore({
  //         showPage: 'list',
  //       })
  //     }
  //   })
  // }

  render(){
    const { pageKey, form } = this.props;
    const { getFieldDecorator } = form;
    const roleAllList = [], specialRoleList = [];
    // userDetail.username;
    return (
      <div className={styles.sideHandle} style={pageKey === 'detailPersonnel' ? { display: 'none' } : {}}>
        <div className={styles.topTitle}>
          <Button className={styles.topButton} onClick={this.toEdit}>编辑</Button>
          <Icon type="arrow-left" className={styles.backIcon} onClick={this.backToList} />
        </div>
          <Form className={styles.personnelInfoForm}>
            <FormItem label="用户名" className={styles.leftLogo}>
              {getFieldDecorator('userLogo', {})(
                <PersonnelLogoUploader />
              )}
            </FormItem>
            <div className={styles.rightForms}>
              <FormItem label="用户名" className={styles.eachForm} >
                {getFieldDecorator('username', {
                  // initialValue: userDetail && userDetail.username,
                  rules: [{
                    validator: (rule, value, callback) => {
                      const truelyStr = value.trim();
                      const patternRule = /^\S[\s\S]{1,23}\S$/;
                      if (!truelyStr) {
                        callback('请输入字符长度为3-25的用户名');
                      } else if (!patternRule.test(truelyStr)) {
                        callback('用户名需3-25个字符');
                      }
                      callback();
                    },
                    required: true,
                  }],
                })( <Input placeholder="请输入用户名" /> )}
                <span className={styles.instructionText}>(3-25位中文,英文,数字,特殊字符都可)</span>
              </FormItem>
              <FormItem label="真实姓名" className={styles.eachForm} >
                {getFieldDecorator('userFullName', {
                  rules: [
                    { required: true },
                    { validator: (rule, value, callback) => {
                      const exactStr = value.trim();
                      const patternRule = /^[A-Za-z \u4e00-\u9fa5]{0,30}$/;
                      if (!exactStr) {
                        callback('请输入用户名');
                      } else if (!patternRule.test(exactStr)) {
                        callback('请输入小于30字符的真实姓名');
                      }
                      callback();
                    }},
                  ],
                  // initialValue: userDetail && (userDetail.userFullName || '')
                })( <Input placeholder="请输入真实姓名" /> )}
                <span className={styles.instructionText}>(中文/英文/空格 长度小于30个字)</span>
              </FormItem>
              <FormItem label="电话" className={styles.eachForm} >
                {getFieldDecorator('phoneNum', {
                  // initialValue: userDetail && userDetail.phoneNum,
                  rules: [{
                    message: '请输入正确的手机号',
                    pattern: /^1|9\d{10}$/,
                    required: true,
                  }],
                })( <Input placeholder="请输入电话号码" /> )}
                <span className={styles.instructionText}>(11位手机号码)</span>
              </FormItem>
              <FormItem label="邮箱" className={styles.eachForm} >
                {getFieldDecorator('email', {rules: [{
                    message: '请输入正确格式的邮箱',
                    pattern: /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/,
                  }],
                  // initialValue: userDetail && (userDetail.email || '')
                })( <Input placeholder="请输入邮箱" /> )}
                <span className={styles.instructionText}>(可用邮箱找回密码)</span>
              </FormItem>
              <FormItem label="角色" className={styles.eachForm} >
                {getFieldDecorator('roleId', {
                  // initialValue: [],
                })(
                  <Select
                    mode="multiple"
                    placeholder="请选择用户角色"
                    onChange={this.onSelectRoles}
                    className={styles.selectRoles}
                  >
                    {roleAllList.map((e)=>(
                      <Option key={e.roleId} value={e.roleId}>{e.roleDesc}</Option>
                    ))}
                  </Select>
                )}
                <span className={styles.instructionText}>(没有设置角色的用户无法正常使用系统)</span>
              </FormItem>
              <FormItem label="特殊权限" className={styles.eachForm} >
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
                    {specialRoleList.map((e)=>(
                      <Option key={e.roleId} value={e.roleId}>{e.roleDesc}</Option>
                    ))}
                  </Select>
                )}
              </FormItem>
              <div className={styles.buttonRow}>
                <Button onClick={this.saveUser} loading={false} className={styles.saveUser} >保存</Button>
                <Button onClick={this.continueToAdd} loading={false}>保存并继续添加</Button>
              </div>
            </div>
          </Form>
      </div>
    );
  }
}

export default Form.create({})(HandlePersonnelInfo);
