import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Form,Input,Button,Icon,} from 'antd';
const FormItem = Form.Item


class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.handleSubmit(values)
      }
    })
  }

  hasErrors = (fieldsError) => {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  }

  render() {
    const {
      getFieldDecorator,
      getFieldsError,
    } = this.props.form
    return (
      <Form onSubmit={this.handleSubmit} className="loginForm">
        <FormItem >
          {getFieldDecorator('phone', {
            validateTrigger:"onBlur",
            rules: [{ pattern:/(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/,required: true, message: '请输入有效手机号'}],
          })(
            <Input prefix={<Icon type="mobile" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="请输入手机号"  />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            validateTrigger:"onBlur",
            rules: [{ required: true, message: '请输入有效密码',pattern:/^[\x21-\x7E]{6,20}$/}],
          })(
            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="请输入密码" />
          )}
        </FormItem>
        <FormItem>
          <Button  type="primary" htmlType="submit" className="loginFormButton" disabled={this.hasErrors(getFieldsError())}>
          登录
          </Button>
        </FormItem>
      </Form>              
    )
  }
}

LoginForm.propTypes = {
  form: PropTypes.object,
  handleSubmit:PropTypes.func,
};
const LoginForms = Form.create()(LoginForm);
export default LoginForms;
