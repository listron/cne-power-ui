import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter} from 'react-router-dom';
import { SIGNUP_SAGA } from '../../constants/actionTypes/Login';
import { Form, Input, Button } from 'antd';
const FormItem = Form.Item;
import PropTypes from 'prop-types';

class SignupForm2 extends Component {
  static propTypes = {
    history:PropTypes.array,
    form:PropTypes.func,
    signup:PropTypes.func,
    info:PropTypes.object,
    code:PropTypes.object,
    getSignup:PropTypes.func,
    visible:PropTypes.sting,
  }
  // 初始化页面常量 绑定事件方法
  constructor(props, context) {
    super(props)
    this.state={
      confirmDirty: false,
      autoCompleteResult: [],
    }
  }

  componentWillReceiveProps(nextProps){    
    if(nextProps.signup.fetched&&!this.props.signup.fetched){
      this.props.history.push('/');
    }
    if(nextProps.signup.error&&!this.props.signup.error){
      this.props.form.setFields({
        confirmPwd: {
          value: '******',
          errors: [new Error(nextProps.signup.msg)],
        } 
      });
    }
  }
  //比较两次输入密码
  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('密码不一致');
    } else {
      callback();
    }
  }
  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({
      confirmDirty: this.state.confirmDirty || !!value
    });
  }
  handleSubmit = (e) => {
    e.preventDefault();    
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let parmas={...values,phone:this.props.code.phone,captcha:this.props.code.code,enterpriseId:this.props.info.id,}
        this.props.getSignup(parmas);
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
    } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 4
        },
        md: {span:4}, lg: {span:4}
      },
      wrapperCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 16
        },
        md: {span:16}, lg: {span:16}
      },
    };
    return (
      <Form hideRequiredMark={false} onSubmit={this.handleSubmit} className="loginForm"  style={{display:this.props.visible}}>
        <FormItem
          {...formItemLayout}
          label="真实姓名"
          extra="2~20个字符"
        >
          {getFieldDecorator('realName', {
            rules: [{
              required: true, message: '请输入真实姓名',min:2,max:20
            }],
          })(
            <Input type="text" placeholder="请输入" />
          )}
        </FormItem>     
      <FormItem
        {...formItemLayout}
        label="新密码"
        extra="6~20位英文字符、数字"
      >
        {getFieldDecorator('password', {
          rules: [{
            required: true, message: '请输入有效密码',
            pattern:/^[\x21-\x7E]{6,20}$/,
          }],
        })(
          <Input type="password" placeholder="请输入" />
        )}
      </FormItem>
      <FormItem {...formItemLayout} label="确认密码" >
          {getFieldDecorator('confirmPwd', {
            rules: [{
              required: true, message: '密码不一致',
            }, {
              validator: this.compareToFirstPassword,
            }],
          })(
            <Input type="password" onBlur={this.handleConfirmBlur} placeholder="请输入" />
          )}
      </FormItem>                    
        <FormItem>
          <Button type="primary" htmlType="submit" className="loginFormButton" disabled={this.hasErrors(getFieldsError())}>
          完成注册
          </Button>
        </FormItem>
      </Form>
    )
  }
}
const SignupFormS = Form.create()(SignupForm2);
// export default SignupFormS;
const mapStateToProps = (state) => ({
  signup:state.login.signup,
  code:state.login.code,
  info: state.login.info,  
});

const mapDispatchToProps = (dispatch) => ({
  getSignup: (parmas) => dispatch({ type: SIGNUP_SAGA,parmas:parmas }),  
});
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SignupFormS));