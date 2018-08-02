import React, {Component} from 'react';
import {Form, Icon, Input, Button, Steps, Checkbox} from 'antd';
import PropTypes from 'prop-types';
import styles from './registerForm.scss';

const FormItem = Form.Item;
const Step = Steps.Step;


class RegisterForm extends Component {
  static propTypes = {
    form: PropTypes.object,
    sendCode: PropTypes.func,
    registerStep: PropTypes.number,
    checkEnterpriseDomain: PropTypes.func,
    registerEnterprise: PropTypes.func,
    domainIsRegister: PropTypes.string,
    nameIsRegister: PropTypes.string,
    phoneCodeRegister: PropTypes.func,
    enterpriseId: PropTypes.string,
    error: PropTypes.object,
    history: PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.state = {
      timeValue: 0,
      agreeChecked: false,
    }
  }

  componentWillUnmount = () => {
    this.setState = (timeValue, current)=>{
      return;
    };
  }
  

  onEnterpriseInfo = (e) => {
    e.preventDefault();
    this.props.form.validateFields(['enterpriseDomain', 'enterpriseName', 'userAgreement'], (err, values) => {
      if (!err) {
        setTimeout(() => {
          if(this.props.domainIsRegister === '0') {
            this.props.form.setFields({
              enterpriseDomain: {
                value: values.enterpriseDomain,
                errors: [new Error('当前域名无效')],
              },
            });
          }
          if(this.props.nameIsRegister === '0') {
            this.props.form.setFields({
              enterpriseName: {
                value: values.enterpriseName,
                errors: [new Error('当前企业名已注册，不能重复注册')],
              },
            });
          }
        }, 500);
        this.props.checkEnterpriseDomain({
          enterpriseDomain: values.enterpriseDomain+'.cneclound.com',
          enterpriseName: values.enterpriseName,
        });
      }
    })
  }

  

  onRegisterEnterprise = () => {
    this.props.form.validateFields(['username','password','confirmPwd'],(err, values) => {
      if(!err){
        setTimeout(() => {
          if(this.props.error && this.props.error.get('code') === '20015') {
            this.props.form.setFields({
              username: {
                value: values.username,
                errors: [new Error('用户名已存在')],
              },
            });
          }
        }, 500);
        this.props.registerEnterprise({
          ...values,
          history: this.props.history
        });
      }
    })
  }

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if(value && value !== form.getFieldValue('password')){
      callback('密码不一致！');
    }else{
      callback();
    }
  } 

  phoneCodeRegister = (e) =>{
    e.preventDefault();
    this.props.form.validateFields(['phoneNum','verificationCode'],(err, values) => {
      if(!err){
        setTimeout(() => {
          if(this.props.error && this.props.error.get('code') === '20001') {
            this.props.form.setFields({
              phoneNum: {
                value: values.phoneNum,
                errors: [new Error('此手机号已加入企业，请更换手机号')],
              },
            });
          }
          // server validate
          if(this.props.error && (this.props.error.get('message') === '验证码错误' || this.props.error.get('message') === '验证码已失效')) {
            this.props.form.setFields({
              verificationCode: {
                value: values.verificationCode,
                errors: [new Error(this.props.error.get('message'))],
              },
            });
          }      
        }, 500);
        this.props.phoneCodeRegister({...values,registerStep: 2, isNotLogin: 1 });
      }
    })
  }

  // 点击获取验证码
  sendCode = () => {
    this.props.form.validateFields(['phoneNum'], (err, values) => {
      if (!err) {
        this.props.sendCode(values);
        this.setState({timeValue: 60})
        this.timeDecline();
      }
    })
  }

  timeDecline = () => {
    let timeCount = setInterval(() => {
      this.setState({timeValue: this.state.timeValue - 1})
      if (this.state.timeValue < 0) {
        clearInterval(timeCount);
        this.setState({timeValue: 0})
      }
    }, 1000);
  }

  render(){
    const { getFieldDecorator } = this.props.form;
    const { enterpriseId } = this.props;
    const { timeValue } =this.state;
    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 8},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 16},
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };
    const steps = [
      {
        title: '账户验证',
        content:
          (
            <div>
              <Form onSubmit={this.phoneCodeRegister} className={styles.verificationCode}>
                <div className={styles.phoneInput}>
                  <FormItem>
                    {getFieldDecorator('phoneNum', {
                      rules: [
                        {required: true, message: '请输入手机号'},
                        {pattern: /(^1\d{10}$)/, message: '手机号格式不对'}
                      ]
                    })(
                      <Input className={styles.mobileNumber} prefix={<Icon type="mobile" />} placeholder="请输入手机号" />
                    )}
                  </FormItem>
                </div>
                <div className={styles.checkCodeBox}>
                  <FormItem>
                    {getFieldDecorator('verificationCode', {
                      rules: [
                        {required: true, message: '请输入验证码'},
                      ]
                    })(
                      <Input className={styles.testCode} prefix={<Icon type="lock" />} placeholder="验证码" />
                    )}
                  </FormItem>
                  <Button type="primary" disabled={timeValue !== 0} onClick={this.sendCode} className={timeValue !== 0 ? styles.queryCodeClick : styles.queryCode}>
                    {timeValue !== 0 ? `获取验证码 ${timeValue}` : "获取验证码"}
                  </Button>
                </div>
                <FormItem>
                  <Button type="primary" htmlType="submit" className="login-form-button">下一步</Button>
                </FormItem>
                {(enterpriseId !== null && enterpriseId.length > 0) ? <p>您已加入企业，请直接登录</p> : null}
              </Form>
            </div>
          ),
      },
      {
        title: '企业信息',
        content:
          (
            <div>
              <Form onSubmit={this.onEnterpriseInfo}  className={styles.enterpriseInfor}>
                <FormItem label="企业域名"  {...formItemLayout}>
                  {getFieldDecorator('enterpriseDomain', {
                    rules: [
                      {required: true, message: '请输入企业域名'},
                    ]
                  })(
                    <Input placeholder="请输入企业域名" style={{width: '200px'}} addonAfter=".cneclound.com" />
                  )}
                </FormItem>
                <FormItem label="企业名称" {...formItemLayout}>
                  {getFieldDecorator('enterpriseName', {
                    rules: [
                      {required: true, message: '请输入企业名称'},
                      {max: 30, message: '企业名称最长不超过30个字符'},
                    ]
                  })(
                    <Input placeholder="请输入企业名称" />
                  )}
                </FormItem>
                <FormItem {...tailFormItemLayout} >
                  {getFieldDecorator('userAgreement', {
                    rules:[
                      {required: true, message: '请同意用户协议！'},
                      
                    ]
                  })(
                    <Checkbox className={styles.userArgee}  >同意<span>用户协议</span></Checkbox>
                  )}
                </FormItem>
                <FormItem {...tailFormItemLayout} >
                  <Button type="primary" htmlType="submit" className="login-form-button">下一步</Button>
                </FormItem>
              </Form>
            </div>
          ),
      },
      {
        title: '完善个人信息',
        content:
          (
            <div>
              <Form onSubmit={this.onRegisterEnterprise}>
                <FormItem label="用户名" {...formItemLayout}>
                  {getFieldDecorator('username', {
                    rules: [
                      {required: true, message: '请输入用户名'},
                      {min: 3, max: 8, message: '请输入3到8位中文、英文、数字都可'}
                    ]
                  })(
                    <Input prefix={<Icon type="user" />} placeholder="3-8位中文、英文、数字都可" />
                  )}
                </FormItem>
                <FormItem label="创建密码" {...formItemLayout}>
                  {getFieldDecorator('password',{
                    rules: [
                      {required: true, message: '请输入密码'},
                      {pattern: /^[a-zA-Z\d]{6,8}$/, message: '请输入6-8位数字或英文' }
                    ]
                  })(
                    <Input prefix={<Icon type="lock" />} type="password" placeholder="6-8位数字或英文" />
                  )}
                </FormItem>
                <FormItem label="确认密码" {...formItemLayout}>
                  {getFieldDecorator('confirmPwd',{
                    rules: [
                      {required: true, message: '请输入密码'},
                      {validator: this.compareToFirstPassword}
                    ]
                  })(
                    <Input prefix={<Icon type="lock" />} type="password" placeholder="请再次输入" />
                  )}
                </FormItem>
                <FormItem>
                  <Button type="primary" htmlType="submit" className="login-form-button">进入企业账号</Button>
                </FormItem>
            </Form>
          </div>
        ),
    }];
    const step = this.props.registerStep - 1;
    return (
      <div>
        <Steps current={step}>
          {steps.map(item => <Step key={item.title} title={item.title} />)}
        </Steps>
        <div className="steps-content">{steps[step].content}</div>
      </div>
    );
  }
}

const RegisterForms = Form.create()(RegisterForm);
export default RegisterForms;
