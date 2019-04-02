
import React, { Component } from 'react';
import { Form, Icon, Input, Button, Checkbox, Card } from 'antd';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import styles from './joinIn.scss';

const FormItem = Form.Item;

class JoinIn extends Component{
  static propTypes = {
    phoneCodeErrorInfo: PropTypes.string,
    phoneNum: PropTypes.string,
    form: PropTypes.object,
    inviteValid: PropTypes.bool,
    joinLoading: PropTypes.bool,
    joinStep: PropTypes.number,
    enterpriseLoading: PropTypes.bool,
    showEnterpriseInfo: PropTypes.bool,
    enterpriseInfo: PropTypes.object,
    loginResponse: PropTypes.object,
    getEnterpriseInfo: PropTypes.func,
    changeLoginStore: PropTypes.func,
    getVerificationCode: PropTypes.func,
    phoneCodeRegister: PropTypes.func,
    resetPassword: PropTypes.func,
    joinEnterprise: PropTypes.func,
  }

  state = {
    timeValue: 0,
    agreementRight: false, // 同意用户协议
  }

  componentDidUpdate(prevProps){
    const { phoneCodeErrorInfo, form } = this.props;
    const prePhoneError = prevProps.phoneCodeErrorInfo;
    if (phoneCodeErrorInfo && phoneCodeErrorInfo !== prePhoneError) { // 手机 + 验证码的验证状态发生变化 => 展示错误信息
      const verificationCode = form.getFieldValue('verificationCode');
      this.props.form.setFields({
        verificationCode: {
          value: verificationCode,
          errors: [new Error(phoneCodeErrorInfo)],
        },
      });
    }
  }

  componentWillUnmount(){ // 清理验证码计时器
    this.intervalTimer && clearInterval(this.intervalTimer);
  }

  toLogin = () => { // 返回登录状态
    const { changeLoginStore } = this.props;
    changeLoginStore({
      showEnterpriseInfo: false,
      enterpriseInfo: {},
      pageTab :'login',
    })
  }

  toCheckEnterprise = () => { // 步骤一 ，检查企业名称并返回企业信息
    const { form, getEnterpriseInfo } = this.props;
    form.validateFields((err,values) => {
      if (!err) {
        getEnterpriseInfo({ enterpriseName: values.enterpriseName });
      }
    })
  }

  toStepTwo = () => { // 确认企业信息并进入步骤二
    const { changeLoginStore } = this.props;
    changeLoginStore({ joinStep: 2 })
  }

  handleCancel = () => { // 返回加入企业的第一步
    const { changeLoginStore } = this.props;
    changeLoginStore({
      showEnterpriseInfo: false,
      enterpriseInfo: {},
    });
  }

  sendCode = () => { // 加入企业第二步：获取手机验证码
    const { getVerificationCode, form } = this.props;
    const phoneNum = form.getFieldValue('phoneNum');
    if (/(^1\d{10}$)/.test(phoneNum)) {
      getVerificationCode({ phoneNum });
      this.verificationCodeInterval(60);
    } else {
      form.setFields({
        phoneNum: {
          value: phoneNum,
          errors: [new Error('手机号格式有误, 无法获取验证码')],
        },
      })
    }
  }

  verificationCodeInterval = (timeValue) => {
    this.setState({ timeValue });
    if (timeValue > 0) {
      this.intervalTimer = setTimeout(() => {
        this.verificationCodeInterval(timeValue - 1);
      }, 1000);
    }
  }

  toStepThree = () => { // 手机 + 验证码 验证 (无用户则会自动注册) => 验证通过后进入步骤三。
    const { form, phoneCodeRegister } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        phoneCodeRegister({
          ...values,
          joinStep: 3,
          pageTab: 'joinIn'
        }); // joinStep 参数标识来源(加入企业)与指定下个步骤(3)
      }
    })
  }

  compareToFirstPassword = (rule, value, callback) => { // 验证密码
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback('密码不一致！');
    }
    callback();
  }

  changeAgreement = (e = {}) => {
    const { checked } = e.target;
    this.setState({ agreementRight: checked });
  }

  joinInEnterprise = () => { // 完成信息填写并提交
    const { form, loginResponse, phoneNum } = this.props;
    form.validateFields((err,values) => {
      if (!err) {
        const { auto, authData, enterpriseId } = loginResponse;
        if (auto === '1') { // 导入的用户 重置密码即可
          this.props.resetPassword({
            phoneNum,
            authData,
            ...values,
          });
        } else { // 普通用户 直接加入企业
          this.props.joinEnterprise({
            phoneNum,
            enterpriseId,
            ...values,
          });
        }
      }
    })
  }

  render(){
    const {
      form, enterpriseInfo, showEnterpriseInfo, enterpriseLoading, joinStep, inviteValid, loginResponse, joinLoading
    } = this.props;
    const { timeValue, agreementRight } = this.state;
    const { getFieldDecorator } = form;
    const { enterpriseName, enterpriseId, enterpriseLogo } = enterpriseInfo || {};
    const { authData, username, userFullname } = loginResponse;
    const defaultLogo = '/img/nopic.png';
    return (
      <div className={styles.joinIn}>
        <div className={styles.joinTop}>
          <span className={styles.toLogin} onClick={this.toLogin}>登录</span>
        </div>
        {joinStep === 1 && <Form className={styles.stepOne}>
          {!showEnterpriseInfo && <FormItem label="企业名称" labelCol={{sm: 8}} wrapperCol={{sm: 16}}>
            {getFieldDecorator('enterpriseName', {
              rules: [{required: true, message: '请输入企业名称/企业域名'}]
            })(
              <Input placeholder="请输入企业名称/企业域名" className={styles.nameInput} />
            )}
          </FormItem>}
          {!showEnterpriseInfo && <Button
            type="primary"
            className={styles.checkName}
            onClick={this.toCheckEnterprise}
            disabled={!form.getFieldValue('enterpriseName')}
            loading={enterpriseLoading}
          >下一步</Button>}
          {showEnterpriseInfo && <Card className={styles.enterpriseInfo} >
            {enterpriseId ? <div>点击确认要加入的企业</div> : <div>没有此企业，请重新输入</div>}
            {enterpriseId && <Button
              className={styles.enterpriseBtn}
              onClick={this.toStepTwo}
            >{enterpriseName}</Button>}
            <div className={styles.enterpriseBack}>
              <Icon type="arrow-left" />
              <span onClick={this.handleCancel}>返回</span>
            </div>
          </Card>}
        </Form>}
        {joinStep === 2 && <div className={styles.stepTwo}>
          <div className={styles.enterpriseLogo} >
            <img src={enterpriseLogo || defaultLogo} width="60px" height="60px" />
            <p>{enterpriseName}</p>
          </div>
          {inviteValid ? <Form>
            <FormItem>
              {getFieldDecorator('phoneNum', {
                rules: [
                  { required: true, message: '请输入手机号' },
                  { pattern: /(^1\d{10}$)/, message: '手机号格式不对' }
                ]
              })(
                <Input addonBefore={<i className="iconfont icon-phone" />}  placeholder="请输入手机号" />
              )}
            </FormItem>
            <div className={styles.checkCodeBox}>
              <FormItem >
                {getFieldDecorator('verificationCode', {
                  rules: [{ required: true, message: '请输入验证码' }]
                })(
                  <Input className={styles.testCode} addonBefore={<i className="iconfont icon-password" />} placeholder="验证码" />
                )}
              </FormItem>
              <Button
                disabled={timeValue > 0}
                onClick={this.sendCode}
                className={styles.queryCode}
                style={timeValue > 0 ? {
                  width: '96px',
                  background:'#f7f7f7',
                  border:'1px solid #dfdfdf',
                  color: '#dfdfdf'
                } : {}}
              >
                {timeValue > 0 ? `获取验证码 ${timeValue}` : "获取验证码"}
              </Button>
            </div>
            <Button type="primary" onClick={this.toStepThree} className={styles.nextStep}>下一步</Button>
            {authData && <p style={{textAlign: 'center'}}>
              <span>您已加入企业，请直接</span>
              <span style={{color:'#199475',cursor: 'pointer'}} onClick={()=>this.changePage('login')}>登录</span>
            </p>}
          </Form> : <div className={styles.inviteInvalid} >
            邀请链接已过7天有效期，需要重新邀请！
          </div>}
        </div>}
        {joinStep === 3 && <div className={styles.stepThree}>
          <div className={styles.enterpriseLogo} >
            <img src={enterpriseLogo || defaultLogo} width="60px" height="60px" />
            <p>{enterpriseName}</p>
          </div>
          <Form className={styles.stepThreeForm}>
            <FormItem label="用户名"  labelCol={{sm: 8}} wrapperCol={{sm: 16}}>
              {getFieldDecorator('username', {
                rules: [
                  {required: true, message: '请输入用户名'},
                  {pattern: /^[A-Za-z0-9~!@#$%^&*()_+.\u4e00-\u9fa5]{3,25}$/gi,message: '请输入字符长度为3-25的用户名'},
                ],
                initialValue: username || '',
              })(
                <Input
                  addonBefore={<i className="iconfont icon-user" />}
                  disabled={username ? true : false}
                  placeholder="请输入用户名"
                />
              )}
            </FormItem>
            <FormItem label="姓名"  labelCol={{sm: 8}} wrapperCol={{sm: 16}}>
              {getFieldDecorator('userFullname', {
                rules: [
                  { validator: (rule, value, callback) => { // 验证密码
                    const exactStr = value.trim();
                    if (!exactStr) {
                      callback('请输入真实姓名');
                    }
                    const patternRule = /^[A-Za-z \u4e00-\u9fa5]{0,30}$/;
                    if (!patternRule.test(exactStr)) {
                      callback('请输入小于30字符的真实姓名');
                    }
                    callback();
                  }}
                ],
                // 中文/英文/空格，小于等于30字符
                initialValue: userFullname || '',
              })(
                <Input
                  addonBefore={<i className="iconfont icon-user" />}
                  disabled={username ? true : false}
                  placeholder="请输入用户名"
                />
              )}
            </FormItem>
            <FormItem label="创建密码"  labelCol={{sm: 8}} wrapperCol={{sm: 16}}>
              {getFieldDecorator('password', {
                rules: [
                  { required: true, message: '请输入密码' },
                  { pattern: /^[A-Za-z0-9~!@#$%^&*()_+.]{6,25}$/, message: '请输入字符长度为6-25的密码' }
                ]
              })(
                <Input addonBefore={<i className="iconfont icon-password" />} type="password" placeholder="输入字符长度为6-25的密码" />
              )}
            </FormItem>
            <FormItem label="确认密码"  labelCol={{sm: 8}} wrapperCol={{sm: 16}}>
              {getFieldDecorator('confirmPwd',{
                rules: [
                  {required: true, message: '请输入密码'},
                  {validator: this.compareToFirstPassword}
                ]
              })(
                <Input addonBefore={<i className="iconfont icon-password"></i>} type="password" placeholder="请再次输入" />
              )}
            </FormItem>
            <div>
              <Checkbox className={styles.userArgee} onChange={this.changeAgreement}>
                <span>同意</span>
                <Link className={styles.userAgreeTip} to="/userAgreement" >用户协议</Link>
              </Checkbox>
            </div>
            <Button
              type="primary"
              onClick={this.joinInEnterprise}
              className={styles.joinButton}
              loading={joinLoading}
              disabled={!agreementRight}
              style={!agreementRight ? {
                background:'#f7f7f7',
                border:'1px solid #dfdfdf',
                color: '#dfdfdf'
              } : {}}
            >加入企业</Button>
          </Form>
        </div>}
      </div>
    )
  }
}

export default Form.create()(JoinIn);
