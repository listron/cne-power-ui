import React, {Component} from 'react';
import {Form, Icon, Input, Button} from 'antd';
import PropTypes from 'prop-types';
import styles from './loginForm.scss';

const FormItem = Form.Item;

class LoginForm extends Component{
  static propTypes = {
    form: PropTypes.object,
    changePage: PropTypes.func,
    fetchLogin: PropTypes.func,
    loginSuccess: PropTypes.bool,
    count: PropTypes.number,
    error: PropTypes.string,
    sendCode: PropTypes.func,
    checkCodeLogin: PropTypes.func,
  }

  constructor(props){
    super(props);
    this.state = {
      showPasswordLogin: true,
      timeValue: 0,
    }
  }

  onHandleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err,values) => {
      if(!err){
        if(this.state.showPasswordLogin){
          this.props.fetchLogin(values);
        }else{
          this.props.checkCodeLogin(values);
        }
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

  hasErrors = (fieldsError) =>{
    return Object.keys(fieldsError).some(field => fieldsError[field]);
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

  render(){
    const { getFieldDecorator, getFieldsError } = this.props.form;
    let { showPasswordLogin } = this.state;
    return (
      <div>
        {this.props.loginSuccess ? "登录成功！" : 
        <Form onSubmit={this.onHandleSubmit}  >
          {showPasswordLogin &&
            <div>
              <FormItem>
                {getFieldDecorator('userName', {
                  rules: [{required: true, message: '请输入手机号/用户名'}]
                })(
                  <Input prefix={<Icon type="user" />} placeholder="请输入手机号/用户名" />
                )}
              </FormItem>
              <FormItem>
                {getFieldDecorator('password',{
                  rules: [{required: true, message: '请输入密码'}]
                })(
                  <Input prefix={<Icon type="lock" />} type="password" placeholder="请输入密码" />
                )}
              </FormItem>
            </div>
          }
          {!showPasswordLogin &&
            <div className={styles.verificationCode}>
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
                <Button type="primary" disabled={this.state.timeValue !== 0} onClick={this.sendCode} >
                  {this.state.timeValue !== 0 ? `${this.state.timeValue}秒后可重发` : "点击获取验证码"}
                </Button>
              </div>
            </div>
          }
          <FormItem>
            <div className={styles.loginChange} >
              <span onClick={() => this.setState({ showPasswordLogin: !showPasswordLogin })} >
                {showPasswordLogin ? '手机验证码登录' : '密码登录(手机/用户名)'}
              </span>
              <span onClick={() => this.props.changePage({pageTab:'forget'})} >忘记密码</span>
            </div>
            <Button type="primary" htmlType="submit" className="login-form-button" disabled={this.hasErrors(getFieldsError())} >登录</Button>
            <br />
            <span>易巡登录</span>
          </FormItem>
        </Form>}
      </div>
    );
  }
}
const LoginForms = Form.create()(LoginForm);
export default LoginForms;