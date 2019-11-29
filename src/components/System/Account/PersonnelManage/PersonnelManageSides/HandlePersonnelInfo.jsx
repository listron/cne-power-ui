

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Input, Form, Select, Icon } from 'antd';
import WarningTip from '@components/Common/WarningTip';
import PersonnelLogoUploader from './PersonnelLogoUploader';
import styles from './side.scss';

const FormItem = Form.Item;
const Option= Select.Option;

class HandlePersonnelInfo extends Component {
  static propTypes = {
    addUserLoading: PropTypes.bool,
    addUserSuccess: PropTypes.bool,
    pageKey: PropTypes.string,
    userDetailInfo: PropTypes.object,
    form: PropTypes.object,
    roleAllList: PropTypes.array,
    specialRoleList: PropTypes.array,
    changeStore: PropTypes.func,
  }

  state = {
    showWarningTip: false,
    addMode: 'save', // save, continue两种保存方式
  }

  componentWillReceiveProps(nextProps){
    const { userDetailInfo, pageKey, addUserLoading, addUserSuccess, form } = nextProps;
    const preDetail = this.props.userDetailInfo;
    const preLoading = this.props.addUserLoading;
    if (pageKey === 'editPersonnel' && userDetailInfo !== preDetail) { // 编辑模式且得到新的详情, 将详情set进入formValue
      const { roleAllList, specialRoleList } = this.props;
      const { userLogo, username, userFullName, phoneNum, email, roleName, spcialRoleName } = userDetailInfo;
      const tmpRoleNameArr = roleName ? roleName.split(',') : [];
      const tmpRoleSpcialArr = spcialRoleName ? spcialRoleName.split(',') : [];
      const roleIds = roleAllList.filter(e => tmpRoleNameArr.includes(e.roleDesc)).map(e => e.roleId);
      const specialRoleIds = specialRoleList.filter(e => tmpRoleSpcialArr.includes(e.roleDesc)).map(e => roleId);
      form.setFieldsValue({
        userLogo, username, userFullName, phoneNum, email, roleIds, specialRoleIds,
      });
    }
    if (!addUserLoading && preLoading && addUserSuccess) { // 信息提交成功;
      const { addMode } = this.state;
      addMode === 'save' && this.confirmBack(); // 返回列表页
      addMode === 'continue' && form.resetFields(); // 清空form表单, 继续填写
    }
  }

  warningTip = () => this.setState({ showWarningTip: true })

  confirmBack = () => { // 返回列表页并重置form数据;
    this.props.changeStore({ pageKey: 'list', userDetailInfo: {} });
    this.setState({ addMode: 'save' });
    this.props.form.resetFields();
  }

  cancelBack = () => this.setState({ showWarningTip: false })

  saveUser = () => {
    const { pageKey } = this.props;
    const mothodKeys = {
      addPersonnel: 'addUser',
      editPersonnel: 'editUser',
    }; // this.props.addUser 或 this.props.editUser
    const methodName = mothodKeys[pageKey];
    methodName && this.userInfoSave('save')(methodName);
  }

  saveContinue = () => this.userInfoSave('continue')('addUser')

  userInfoSave = (addMode) => (methodName) => {
    this.setState({ addMode }, () => {
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) { this.props[methodName](values); }
      });
    });
  }

  pageKeyInfo = {
    addPersonnel: '新增',
    editPersonnel: '编辑',
    detailPersonnel: '详情',
  }

  render(){
    const { showWarningTip, addMode } = this.state;
    const { pageKey, form, roleAllList, specialRoleList, addUserLoading } = this.props;
    const { getFieldDecorator } = form;
    return (
      <div className={styles.sideHandle} style={pageKey === 'detailPersonnel' ? { display: 'none' } : {}}>
        <div className={styles.topTitle}>
          <span className={styles.titleName}>{this.pageKeyInfo[pageKey] || ''}</span>
          <Icon type="arrow-left" className={styles.backIcon} onClick={this.warningTip} />
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
                  initialValue: '',
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
                  initialValue: '',
                })( <Input placeholder="请输入真实姓名" /> )}
                <span className={styles.instructionText}>(中文/英文/空格 长度小于30个字)</span>
              </FormItem>
              <FormItem label="电话" className={styles.eachForm} >
                {getFieldDecorator('phoneNum', {
                  initialValue: '',
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
                  initialValue: '',
                })( <Input placeholder="请输入邮箱" /> )}
                <span className={styles.instructionText}>(可用邮箱找回密码)</span>
              </FormItem>
              <FormItem label="角色" className={styles.eachForm} >
                {getFieldDecorator('roleIds', {
                  initialValue: [],
                })(
                  <Select
                    mode="multiple"
                    placeholder="请选择用户角色"
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
                {getFieldDecorator('specialRoleIds', {
                  initialValue: [],
                })(
                  <Select
                    mode="multiple"
                    placeholder="请选择特殊权限"
                    showArrow={true}
                    className={styles.specialRoleId}
                  >
                    {specialRoleList.map((e)=>(
                      <Option key={e.roleId} value={e.roleId}>{e.roleDesc}</Option>
                    ))}
                  </Select>
                )}
              </FormItem>
              <div className={styles.buttonRow}>
                <Button
                  onClick={this.saveUser}
                  loading={addMode === 'continue' && addUserLoading }
                  className={styles.saveUser}
                >保存</Button>
                <Button
                  onClick={this.saveContinue}
                  loading={pageKey === 'save' && addUserLoading}
                >保存并继续添加</Button>
              </div>
            </div>
          </Form>
          {showWarningTip && <WarningTip onCancel={this.cancelBack} onOK={this.confirmBack} value="退出后信息无法保存!" />}
      </div>
    );
  }
}

export default Form.create({})(HandlePersonnelInfo);
