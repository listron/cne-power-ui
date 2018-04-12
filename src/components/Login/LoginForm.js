// import React, {Component} from 'react';
// import {Form,Input,Button,notification,Icon,Avatar,message,} from 'antd';
// import {hashHistory,Link} from 'react-router';

// // import {fetchLoginForm,userInfo} from 'actions/common';
// import actions from '../actions/common';

// const FormItem = Form.Item
// @Form.create()
// class LoginForm extends Component {
//   // 初始化页面常量 绑定事件方法
//   constructor(props, context) {
//     super(props)
//     this.handleSubmit = this.handleSubmit.bind(this)
//   }

//   handleSubmit(e) {
//     e.preventDefault();
//     this.props.form.validateFields((err, values) => {
//       if (!err) {
//         this.props.handleSubmit(values)
//       }
//     })
//   }

//   // 组件已经加载到dom中
//   componentDidMount() {
//   }
//   componentWillReceiveProps(nextProps){
//   }
//   hasErrors = (fieldsError) => {
//     return Object.keys(fieldsError).some(field => fieldsError[field]);
//   }

//   render() {
//     const {
//       getFieldDecorator,
//       getFieldsError,
//       getFieldError,
//       isFieldTouched
//     } = this.props.form
//     return (
//       <div className="loginpagewrap">
//             <img src="../images/logo.png" alt="logo"/>
//             <a href="#" className="right">返回官网</a>
//         <div className="box">
//             <div className="title">登录</div>
//             <div className="triangle"></div>
//             <div className="avatar"><span className="icon-user"></span><p>{this.props.company?this.props.company:''}</p></div>
//             <div className="loginWrap">
//                 <Form onSubmit={this.handleSubmit} className="loginForm">
//                     <FormItem >
//                       {getFieldDecorator('phone', {
//                         validateTrigger:"onBlur",
//                         rules: [{ pattern:/(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/,required: true, message: '请输入有效手机号'}],
//                       })(
//                         <Input prefix={<Icon type="mobile" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="请输入手机号"  />
//                       )}
//                     </FormItem>
//                     <FormItem>
//                       {getFieldDecorator('password', {
//                         validateTrigger:"onBlur",
//                         rules: [{ required: true, message: '请输入有效密码',pattern:/^[\x21-\x7E]{6,20}$/}],
//                       })(
//                         <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="请输入密码" />
//                       )}
//                     </FormItem>
//                     <FormItem>
//                       <Button loading={this.props.loading} type="primary" htmlType="submit" className="loginFormButton" disabled={this.hasErrors(getFieldsError())}>
//                       登录
//                       </Button>
//                       <Link className="loginFormForgot" to="/forget">忘记密码</Link>
//                     </FormItem>
//                 </Form>
//             </div>
//         </div>
//       </div>

//     )
//   }
// }
// export default LoginForm;
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {Form,Input,Button,notification,Icon,Avatar,message,} from 'antd';
// import {hashHistory,Link} from 'react-router-dom';
import { Link, Route } from 'react-router-dom';
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
      getFieldError,
      isFieldTouched
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
const LoginForms = Form.create()(LoginForm);
export default LoginForms;
