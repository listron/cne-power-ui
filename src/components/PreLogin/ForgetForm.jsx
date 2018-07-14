import React, {Component} from 'react';
import {Form, Icon, Input, Button} from 'antd';
import PropTypes from 'prop-types';
import styles from './forgetForm.scss';

const FormItem = Form.Item;

class ForgetForm extends Component{
  static propTypes = {
    form: PropTypes.object,
    phoneCheck: PropTypes.number,
    changePage: PropTypes.func,
    sendCode: PropTypes.func,
    checkPhoneCode: PropTypes.func,
    resetPassword: PropTypes.func,
  }

  constructor(props){
    super(props);
    this.state = {
      checkFirst: true,
      timeValue: 0,
    }
  }

  onHandleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err,values) => {
      if(!err){
        console.log('Received values of form: ', values);
      }
    })
  }

  onResetPassword = () => {
    this.props.form.validateFields(['password','confirmPwd'], (err,values) => {
      if(!err){
        this.props.resetPassword(values);
      }
    })
  }

  // 点击获取验证码
  sendCode = () => {
    this.props.form.validateFields(['phoneNum'], (err, values) => {
      if(!err){
        this.props.sendCode(values);
        this.setState({ timeValue: 10 })
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

  checkPhoneCode = () => {
    this.props.form.validateFields(['phoneNum','verificationCode'], (err, values) => {
      if(!err){
        this.props.checkPhoneCode(values);

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
    const { checkFirst, timeValue } = this.state;
    const { phoneCheck } = this.props;
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
      <div>
        <div><span>登录</span>|<span>注册</span></div>
        {!phoneCheck &&
          <div>
            <span>找回密码</span>
            <Form onSubmit={this.checkPhoneCode} >
              <div>
                <FormItem>
                  {getFieldDecorator('phoneNum', {
                    rules: [{pattern: /(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/, required: true, message: '请输入手机号'}]
                  })(
                    <Input prefix={<Icon type="mobile" />} placeholder="请输入手机号" />
                  )}
                </FormItem>
              </div>
              <div>
                <FormItem  >
                  {getFieldDecorator('verificationCode',{
                    rules: [{required: true, message: '请输入验证码'}]
                  })(
                    <Input prefix={<Icon type="lock" />} placeholder="验证码" />
                  )}
                </FormItem>
                <Button type="primary" disabled={timeValue !== 0} onClick={this.sendCode} >
                  {timeValue !== 0 ? `${timeValue}秒后可重发` : "点击获取验证码"}
                </Button>
              </div>
              <FormItem>
                <Button type="primary" htmlType="submit">下一步</Button>
              </FormItem>
            </Form>
          </div>
        }
        {phoneCheck &&
          <div>
            <Form onSubmit={this.onResetPassword}  >
              <FormItem label="创建密码" {...formItemLayout}>
                {getFieldDecorator('password',{
                  rules: [{required: true, message: '请输入密码', min: 8,}]
                })(
                  <Input prefix={<Icon type="lock" />} type="password" placeholder="请输入密码" />
                )}
              </FormItem>
              <FormItem label="确认密码" {...formItemLayout}>
                {getFieldDecorator('confirmPwd',{
                  rules: [{required: true, message: '两次密码不一致！', min: 8, validator: this.compareToFirstPassword,}]
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