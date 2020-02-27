

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Input, Form, Select, Icon } from 'antd';
import WarningTip from '@components/Common/WarningTip';
import PersonnelLogoUploader from './PersonnelLogoUploader';
import DepartmentSelector from '../PersonnelMain/Modals/DepartmentSelector';
import styles from './side.scss';

const FormItem = Form.Item;
const Option = Select.Option;

class HandlePersonnelInfo extends Component {
  static propTypes = {
    addUserLoading: PropTypes.bool,
    addUserSuccess: PropTypes.bool,
    pageKey: PropTypes.string,
    userDetailInfo: PropTypes.object,
    form: PropTypes.object,
    roleAllList: PropTypes.array,
    specialRoleList: PropTypes.array,
    departmentTree: PropTypes.array,
    departmentsStationMap: PropTypes.array,
    changeStore: PropTypes.func,
    getUserList: PropTypes.func,
    getDepartmentsStationMap: PropTypes.func,
  }

  state = {
    showWarningTip: false,
    addMode: 'save', // save, continue两种保存方式
  }

  componentWillReceiveProps(nextProps) {
    const { userDetailInfo, pageKey, addUserLoading, addUserSuccess, form } = nextProps;
    const preDetail = this.props.userDetailInfo;
    const preLoading = this.props.addUserLoading;
    if (pageKey === 'editPersonnel' && userDetailInfo !== preDetail) { // 编辑模式且得到新的详情, 将详情set进入formValue
      const { roleAllList, specialRoleList } = this.props;
      const { userLogo, username, userFullName, phoneNum, email, roleName, spcialRoleName, enterpriseData } = userDetailInfo;
      const tmpRoleNameArr = roleName ? roleName.split(',') : [];
      const tmpRoleSpcialArr = spcialRoleName ? spcialRoleName.split(',') : [];
      const roleIds = roleAllList.filter(e => tmpRoleNameArr.includes(e.roleDesc)).map(e => e.roleId);
      const specialRoleIds = specialRoleList.filter(e => tmpRoleSpcialArr.includes(e.roleDesc)).map(e => e.roleId);
      const departmentIds = this.getDepartmentIdsFromDetaiInfo(enterpriseData);
      this.props.getDepartmentsStationMap({ departmentIds }); // 得到该用户的部门/电站分组信息
      form.setFieldsValue({
        userLogo: userLogo || '/img/nopic.png',
        username, userFullName, phoneNum, email, roleIds, specialRoleIds, departmentIds,
      });
    }
    if (!addUserLoading && preLoading && addUserSuccess) { // 信息提交成功;
      const { addMode } = this.state;
      this.props.changeStore({ departmentsStationMap: [] }); // 清空负责电站项
      this.props.getUserList(); // 更新list页面数据
      addMode === 'save' && this.confirmBack(); // 返回列表页
      addMode === 'continue' && form.resetFields(); // 清空form表单, 继续填写
    }
  }

  getDepartmentIdsFromDetaiInfo = (enterpriseData) => {
    const enterpriseList = enterpriseData || [];
    const departList = [];
    enterpriseList.forEach(e => {
      const departmentData = e.departmentData || [];
      departList.push(...departmentData);
    });
    return departList.map(e => e.departmentId);
  }

  warningTip = () => this.setState({ showWarningTip: true })

  confirmBack = () => { // 返回列表页并重置form数据;
    this.props.changeStore({
      pageKey: 'list',
      userDetailInfo: {},
      departmentsStationMap: [],
    });
    this.setState({ addMode: 'save', showWarningTip: false });
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
        if (!err) {
          this.props[methodName]({
            ...values,
            userId: this.props.userDetailInfo.userId,
          });
        }
      });
    });
  }

  pageKeyInfo = {
    addPersonnel: '新增',
    editPersonnel: '编辑',
    detailPersonnel: '详情',
  }

  departsChange = (departmentIds) => {
    const { form } = this.props;
    this.props.getDepartmentsStationMap({ departmentIds });
    form.setFieldsValue({ departmentIds });
  }

  render() {
    const { showWarningTip, addMode } = this.state;
    const { pageKey, form, roleAllList, specialRoleList, departmentTree, addUserLoading, departmentsStationMap } = this.props;
    const { getFieldDecorator } = form;
    // const { enterpriseTexts, departTexts, stationTexts } =pageKey === 'editPersonnel' ? this.getEditEnterpriseDetail() : {};
    const usernamePhoneDisable = pageKey === 'editPersonnel'; // 编辑情况下 用户名 / 电话 置灰。
    return (
      <div className={styles.sideHandle} style={pageKey === 'detailPersonnel' ? { display: 'none' } : {}}>
        <div className={styles.topTitle}>
          <span className={styles.titleName}>{this.pageKeyInfo[pageKey] || ''}</span>
          <i className={`iconfont icon-fanhui ${styles.backIcon}`} title="返回" onClick={this.warningTip} />
        </div>
        <Form className={styles.personnelInfoForm}>
          <FormItem label="" className={styles.leftLogo}>
            {getFieldDecorator('userLogo', {
              initialValue: '/img/nopic.png',
            })(
              <PersonnelLogoUploader />
            )}
          </FormItem>
          <div className={styles.rightForms}>
            <FormItem label="用户名" colon={false} className={styles.eachForm} >
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
              })(<Input placeholder="请输入用户名" style={{ width: '200px' }} disabled={usernamePhoneDisable} />)}
              <span className={styles.instructionText}>(3-25位中文,英文,数字,特殊字符都可)</span>
            </FormItem>
            <FormItem label="真实姓名" colon={false} className={styles.eachForm} >
              {getFieldDecorator('userFullName', {
                rules: [
                  { required: true },
                  {
                    validator: (rule, value, callback) => {
                      const exactStr = value.trim();
                      const patternRule = /^[A-Za-z \u4e00-\u9fa5]{0,30}$/;
                      if (!exactStr) {
                        callback('请输入用户名');
                        //} else if (!patternRule.test(exactStr)) {
                      } else if (exactStr.length >= 30) {
                        callback('请输入小于30字符的真实姓名');
                      }
                      callback();
                    },
                  },
                ],
                initialValue: '',
              })(<Input placeholder="请输入真实姓名" style={{ width: '200px' }} />)}
              <span className={styles.instructionText}>(中文/英文/空格 长度小于30个字)</span>
            </FormItem>
            <FormItem label="电话" colon={false} className={styles.eachForm} >
              {getFieldDecorator('phoneNum', {
                initialValue: '',
                rules: [{
                  message: '请输入正确的手机号',
                  pattern: /^1[123456789]\d{9}$/,
                  required: true,
                }],
              })(<Input placeholder="请输入电话号码" style={{ width: '200px' }} disabled={usernamePhoneDisable} />)}
              <span className={styles.instructionText}>(11位手机号码)</span>
            </FormItem>
            <FormItem label="邮箱" colon={false} className={styles.eachForm} >
              {getFieldDecorator('email', {
                rules: [{
                  message: '请输入正确格式的邮箱',
                  pattern: /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/,
                }],
                initialValue: '',
              })(<Input placeholder="请输入邮箱" style={{ width: '200px' }} />)}
              <span className={styles.instructionText}>(可用邮箱找回密码)</span>
            </FormItem>
            <FormItem label="角色" colon={false} className={styles.eachForm} >
              {getFieldDecorator('roleIds', {
                initialValue: [],
              })(
                <Select
                  mode="multiple"
                  placeholder="请选择用户角色"
                  style={{ width: '200px' }}
                  className={styles.selectRoles}
                >
                  {roleAllList.map((e) => (
                    <Option key={e.roleId} value={e.roleId}>{e.roleDesc}</Option>
                  ))}
                </Select>
              )}
              <span className={styles.instructionText}>(没有设置角色的用户无法正常使用系统)</span>
            </FormItem>
            <FormItem label="所属部门" colon={false} className={styles.eachForm}>
              {getFieldDecorator('departmentIds', {
                initialValue: [],
              })(
                <DepartmentSelector departmentTree={departmentTree.filter(e => e.departmentId !== '1')} onChange={this.departsChange} />
              )}
            </FormItem>
            {departmentsStationMap.length > 0 && <div className={styles.eachForm}>
              <div className={styles.label}>负责电站</div>
              <div className={styles.stationInfos}>
                {departmentsStationMap.map(e => {
                  const { departmentName, stations } = e || {};
                  const stationText = stations ? stations.map(e => e.stationName).join(',') : '--';
                  return (
                    <section key={departmentName} className={styles.eachDepart}>
                      <h4>{departmentName || '--'}</h4>
                      <div className={styles.stationText}>{stationText}</div>
                    </section>
                  );
                })}
              </div>
            </div>}
            {/* <FormItem colon={false} label="特殊权限" className={styles.eachForm} >
                {getFieldDecorator('specialRoleIds', {
                  initialValue: [],
                })(
                  <Select
                    mode="multiple"
                    placeholder="请选择特殊权限"
                    showArrow={true}
                    style={{width: '200px'}}
                    className={styles.specialRoleId}
                  >
                    {specialRoleList.map((e)=>(
                      <Option key={e.roleId} value={e.roleId}>{e.roleDesc}</Option>
                    ))}
                  </Select>
                )}
              </FormItem> */}
            <div className={styles.buttonRow}>
              <Button
                onClick={this.saveUser}
                loading={addMode === 'continue' && addUserLoading}
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
