import React, {Component} from 'react';
import {Form, Icon, Input, Button} from 'antd';
import PropTypes from 'prop-types';
import styles from './forgetForm.scss';

const FormItem = Form.Item;

class LoginForm extends Component{
  static propTypes = {
    form: PropTypes.object,
    changePage: PropTypes.func,
  }

  constructor(props){
    super(props);
    this.state = {
      showPasswordLogin: true,
    }
    this.onHandleSubmit = this.onHandleSubmit.bind(this);
  }

  onHandleSubmit(e){
    e.preventDefault();
    this.props.form.validateFields((err,values) => {
      if(!err){
        console.log('Received values of form: ', values);
      }

    })
  }

  render(){
    const { getFieldDecorator } = this.props.form;
    let { showPasswordLogin } = this.state;
    return (
      <div>
        <div><span>登录</span>|<span>注册</span></div>
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
                  <Input prefix={<Icon type="lock" />} placeholder="请输入密码" />
                )}
              </FormItem>
            </div>
          }
          {!showPasswordLogin &&
            <div className={styles.verificationCode}>
              <div>
                <FormItem>
                  {getFieldDecorator('userName', {
                    rules: [{required: true, message: '请输入手机号'}]
                  })(
                    <Input prefix={<Icon type="mobile" />} placeholder="请输入手机号" />
                  )}
                </FormItem>
              </div>
              <div>
                <FormItem  >
                  {getFieldDecorator('password',{
                    rules: [{required: true, message: '请输入验证码'}]
                  })(
                    <Input prefix={<Icon type="lock" />} placeholder="验证码" />
                  )}
                </FormItem>
                <Button type="primary" >点击获取验证码</Button>
              </div>
            </div>
          }
          <FormItem>
            
            <Button type="primary" htmlType="submit" className="login-form-button" >下一步</Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}
const LoginForms = Form.create()(LoginForm);
export default LoginForms;