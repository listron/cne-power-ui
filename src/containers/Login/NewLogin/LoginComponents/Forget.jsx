
import React, { Component } from 'react';
import { Form, Icon, Input, Button, Checkbox, Card } from 'antd';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import styles from './forget.scss';

const FormItem = Form.Item;

class Forget extends Component{
  static propTypes = {
    phoneNum: PropTypes.string,
    loginResponse: PropTypes.object,
    forgetStep: PropTypes.number,
    form: PropTypes.object,
    changeLoginStore: PropTypes.func,
    getVerificationCode: PropTypes.func,
    phoneCodeRegister: PropTypes.func,
    resetPassword: PropTypes.func,
  }

  state = {
    timeValue: 0,
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

  sendCode = () => { // 获取手机验证码
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

  toResetPassword = () => { // 手机 + 验证码
    const { form, phoneCodeRegister } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        phoneCodeRegister({
          ...values,
          forgetStep: 2,
          pageTab: 'forget'
        }); // forgetStep 参数标识来源(忘记密码)与指定下个步骤(2)
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

  confirmReset = () => { // 确认重置密码
    const { form, phoneNum, loginResponse } = this.props;
    const { authData } = loginResponse;
    form.validateFields((err,values) => {
      if (!err) {
        this.props.resetPassword({
          phoneNum,
          authData,
          ...values
        });
      }
    })
  }

  render(){
    const { form, forgetStep } = this.props;
    const { timeValue } = this.state;
    const { getFieldDecorator } = form;
    return (
      <div className={styles.forget}>
        <div className={styles.joinTop}>
          <span className={styles.toLogin} onClick={this.toLogin}>登录</span>
        </div>
        {forgetStep === 2 && <div className={styles.stepOne}>
          <span className={styles.textTip}>找回密码</span>
          <Form>
            <FormItem>
              {getFieldDecorator('phoneNum', {
                rules: [
                  {required: true, message: '请输入手机号'},
                  {pattern: /(^1\d{10}$)/, message: '手机号格式不对'}
                ]
              })(
                <Input addonBefore={<i className="iconfont icon-phone" />} placeholder="请输入手机号" />
              )}
            </FormItem>
            <div className={styles.checkCodeBox}>
              <FormItem>
                {getFieldDecorator('verificationCode', {
                  rules: [{required: true, message: '请输入验证码!'}]
                })(
                  <Input
                    className={styles.verification}
                    addonBefore={<i className="iconfont icon-password" />}
                    placeholder="验证码"
                  />
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
            <Button type="primary" className={styles.nextStep} onClick={this.toResetPassword} >下一步</Button>
          </Form>
        </div>}
        {forgetStep === 1 && <div className={styles.stepTwo}>
          <span className={styles.textTip}>新密码</span>
          <Form>
            <FormItem label="创建密码" labelCol={{sm: 8}} wrapperCol={{sm: 16}}>
              {getFieldDecorator('password',{
                rules: [
                  {required: true, message: '请输入密码'},
                  {pattern: /^[A-Za-z0-9~!@#$%^&*()_+.]{6,25}$/,message: '请输入字符长度为6-25的密码' }
              ]
              })(
                <Input addonBefore={<i className="iconfont icon-password" />} type="password" placeholder="输入字符长度为6-25的密码" />
              )}
            </FormItem>
            <FormItem label="确认密码" labelCol={{sm: 8}} wrapperCol={{sm: 16}}>
              {getFieldDecorator('confirmPwd', {
                rules: [
                  {required: true, message: '请输入确认密码'},
                  {validator: this.compareToFirstPassword, message: '两次密码不一致！'}
                ]
              })(
                <Input addonBefore={<i className="iconfont icon-password" />} type="password" placeholder="请再次输入" />
              )}
            </FormItem>
            <Button onClick={this.confirmReset}>完成</Button>
          </Form>
        </div>}
      </div>
    )
  }
}

export default Form.create()(Forget);
