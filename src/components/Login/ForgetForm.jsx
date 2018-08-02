import React, {Component} from 'react';
import {Form, Icon, Input, Button} from 'antd';
import PropTypes from 'prop-types';
import styles from './forgetForm.scss';

const FormItem = Form.Item;

class ForgetForm extends Component{
  static propTypes = {
    form: PropTypes.object,
    sendCode: PropTypes.func,
    resetPassword: PropTypes.func,
    phoneNum: PropTypes.string,
    checkCodeLogin: PropTypes.func,
    enterpriseId: PropTypes.string,
    username: PropTypes.string,
    showResetPassword: PropTypes.number,
    error: PropTypes.object,
  }

  constructor(props){
    super(props);
    this.state = {
      checkFirst: true,
      timeValue: 0,
    }
  }

  componentWillUnmount = () => {
    this.setState = (timeValue)=>{
      return;
    };
  }

  onResetPassword = () => {
    this.props.form.validateFields(['password','confirmPwd'], (err,values) => {
      if(!err){
        this.props.resetPassword({
          phoneNum: this.props.phoneNum,
          password: values.password,
          confirmPwd: values.confirmPwd,
        });
      }
    })
  }

  // 点击获取验证码
  sendCode = () => {
    this.props.form.validateFields(['phoneNum'], (err, values) => {
      if(!err){
        this.props.sendCode(values);
        this.setState({ timeValue: 60 })
        this.timeDecline();
      }
    })
  }
  
  timeDecline = () => {
    let timeCount = setInterval(() => {
      this.setState({ timeValue: this.state.timeValue-1 })
      if(this.state.timeValue < 0){
        clearInterval(timeCount);
        this.setState({ timeValue: 0 })
      }
    },1000);
  }

  checkCodeLogin = () => {
    this.props.form.validateFields(['phoneNum','verificationCode'], (err, values) => {
      if(!err){
        setTimeout(() => {
          if(this.props.error && this.props.error.get('code') === '20009') {
            this.props.form.setFields({
              phoneNum: {
                value: values.phoneNum,
                errors: [new Error('该用户尚未注册')],
              },
            });
          }
        }, 500);
        this.props.checkCodeLogin({...values,showResetPassword: 1, isNotLogin: 1});
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

  render(){
    const { getFieldDecorator } = this.props.form;
    const { timeValue } = this.state;
    const { showResetPassword, enterpriseId, username } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
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
    return (
      <div className={styles.forgetPass}>
        {!showResetPassword ?
          <div>
            <span className={styles.findPass}>找回密码</span>
            <Form onSubmit={this.checkCodeLogin} >
              <div>
                <FormItem>
                  {getFieldDecorator('phoneNum', {
                    rules: [
                      {required: true, message: '请输入手机号'},
                      {pattern: /(^1\d{10}$)/, message: '手机号格式不对'}
                    ]
                  })(
                    <Input prefix={<Icon type="mobile" />} placeholder="请输入手机号" />
                  )}
                </FormItem>
              </div>
              <div className={styles.checkCodeBox}>
                <FormItem  >
                  {getFieldDecorator('verificationCode',{
                    rules: [{required: true, message: '请输入验证码'}]
                  })(
                    <Input className={styles.testCode} prefix={<Icon type="lock" />} placeholder="验证码" />
                  )}
                </FormItem>
                <Button type="primary" disabled={timeValue !== 0} onClick={this.sendCode}  className={timeValue !== 0 ? styles.queryCodeClick : styles.queryCode}>
                  {timeValue !== 0 ? `获取验证码 ${timeValue}` : "获取验证码"}
                </Button>
              </div>
              <FormItem>
                <Button type="primary" htmlType="submit">下一步</Button>
              </FormItem>
              {enterpriseId === null ? <p>未加入企业，请加入企业</p> : null}
              {username === null ? <p>未完善个人信息，请尽快完善</p> : null}
            </Form>
          </div>
        :
          <div>
            <Form onSubmit={this.onResetPassword}  >
              <FormItem label="创建密码" {...formItemLayout}>
                {getFieldDecorator('password',{
                  rules: [
                    {required: true, message: '请输入密码'},
                    {pattern: /^[a-zA-Z\d]{6,8}$/, message: '密码格式不对' }
                ]
                })(
                  <Input prefix={<Icon type="lock" />} type="password" placeholder="请输入密码" />
                )}
              </FormItem>
              <FormItem label="确认密码" {...formItemLayout}>
                {getFieldDecorator('confirmPwd',{
                  rules: [
                    {required: true, message: '请输入确认密码'},
                    {validator: this.compareToFirstPassword, message: '两次密码不一致！'}
                  ]
                })(
                  <Input prefix={<Icon type="lock" />} type="password" placeholder="请再次输入密码" />
                )}
              </FormItem>
              <FormItem {...tailFormItemLayout} >
                <Button type="primary" htmlType="submit" className="login-form-button"  >完成</Button>
              </FormItem>
            </Form>
          </div>
        }
      </div>
    );
  }
}
const LoginForms = Form.create()(ForgetForm);
export default LoginForms;