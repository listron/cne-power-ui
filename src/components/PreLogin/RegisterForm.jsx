import React, { Component } from 'react';
import {Form, Icon, Input, Button, Steps, message, Checkbox} from 'antd';
import PropTypes from 'prop-types';
import styles from './registerForm.scss';

const FormItem = Form.Item;
const Step = Steps.Step;


class RegisterForm extends Component{
  static propTypes = {
    form: PropTypes.object,
    signupSendCode: PropTypes.func,
    signupCount: PropTypes.number,
  }

  constructor(props){
    super(props);
    this.state = {
      current: 0,
    }
    this.onCheckMobile = this.onCheckMobile.bind(this);
    this.onCreateEnterprise = this.onCreateEnterprise.bind(this);
  }

  onCheckMobile(e){
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if(!err){
        console.log(values);
        this.props.signupSendCode(values);
        // this.next();
      }
    })
    
  }

  onCreateEnterprise(){
    this.next();
  }

  next = () => {
    const current = this.state.current + 1;
    this.setState({ current })
  }

  render(){
    const { getFieldDecorator } = this.props.form;
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
    const steps = [{
      title: '账户验证',
      content: 
        (
          <div>
            <Form onSubmit={this.onCheckMobile}  className={styles.verificationCode} >
              <div>
                <FormItem>
                  {getFieldDecorator('mobileNumber', {
                    rules: [{required: true, message: '请输入手机号'}]
                  })(
                    <Input className={styles.mobileNumber} prefix={<Icon type="mobile" />} placeholder="请输入手机号" />
                  )}
                </FormItem>
              </div>
              <div>
                <FormItem  >
                  {getFieldDecorator('checkCode',{
                    rules: [{required: true, message: '请输入验证码'}]
                  })(
                    <Input className={styles.checkCode} prefix={<Icon type="lock" />} placeholder="验证码" />
                  )}
                </FormItem>
                <Button type="primary" 
                  disabled={(this.props.signupCount !== 0).toString()} 
                  onClick={this.signupSendCode} >
                  {this.props.signupCount !== 0 ? `${this.props.signupCount}秒后可重新获取` : "点击获取验证码"}
                </Button>
              </div>
              <FormItem>
                <Button type="primary" htmlType="submit" className="login-form-button"  >下一步</Button>
              </FormItem>
            </Form>
          </div>
        ),
    }, {
      title: '企业信息',
      content: 
        (
          <div>
            <Form onSubmit={this.onCreateEnterprise}  >
              <FormItem label="企业域名"  {...formItemLayout}>
                {getFieldDecorator('enterpriseDomain', {
                  rules: [{required: true, message: '请输入企业域名'}]
                })(
                  <Input placeholder="请输入企业域名"  addonAfter=".cneclound.cn" />
                )}
              </FormItem>
              <FormItem label="企业名称" {...formItemLayout}>
                {getFieldDecorator('enterpriseName',{
                  rules: [{required: true, message: '请输入企业名称'}]
                })(
                  <Input placeholder="请输入企业名称" />
                )}
              </FormItem>
              <FormItem {...tailFormItemLayout} >
                {getFieldDecorator('agreement',{
                  valuePropName: 'checked',
                })(
                  <Checkbox>同意<a href="#">用户协议</a></Checkbox>
                )}
              </FormItem>
              <FormItem {...tailFormItemLayout} >
                <Button type="primary" htmlType="submit" className="login-form-button"  >创建企业</Button>
              </FormItem>
            </Form>
          </div>
        ),
    }, {
      title: '完善个人信息',
      content: 
        (
          <div>
            <Form onSubmit={this.onLogin}  >
              <FormItem label="用户名" {...formItemLayout}>
                {getFieldDecorator('userName', {
                  rules: [{required: true, message: '请输入用户名'}]
                })(
                  <Input prefix={<Icon type="user" />} placeholder="请输入用户名" />
                )}
              </FormItem>
              <FormItem label="创建密码" {...formItemLayout}>
                {getFieldDecorator('password',{
                  rules: [{required: true, message: '请输入密码'}]
                })(
                  <Input prefix={<Icon type="lock" />} type="password" placeholder="请输入密码" />
                )}
              </FormItem>
              <FormItem label="确认密码" {...formItemLayout}>
                {getFieldDecorator('rePassword',{
                  rules: [{required: true, message: '请输入密码'}]
                })(
                  <Input prefix={<Icon type="lock" />} type="password" placeholder="请再次输入密码" />
                )}
              </FormItem>
              <FormItem {...tailFormItemLayout} >
                <Button type="primary" htmlType="submit" className="login-form-button"  >进入企业账号</Button>
              </FormItem>
            </Form>
          </div>
        ),
    }];
    const { current } = this.state;
    return (
      <div>
        <Steps current={current}>
          {steps.map(item => <Step key={item.title} title={item.title} />)}
        </Steps>
        <div className="steps-content">{steps[current].content}</div>
        
      </div>
    );
  }
}

const RegisterForms = Form.create()(RegisterForm);
export default RegisterForms;