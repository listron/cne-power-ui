import React, {Component} from 'react';
import { connect } from 'react-redux';
import { CHECK_PHONE_SU_SAGA ,CHECK_CODE_SAGA} from '../../constants/actionTypes/Login';
import {Form,Input,Icon,Button,Row,Col} from 'antd';
const FormItem = Form.Item;
import PropTypes from 'prop-types';

class SignupForm1 extends Component {
  static propTypes = {
    checkCode:PropTypes.func,
    form:PropTypes.func,
    count: PropTypes.number,
    checkPhone:PropTypes.func,
    phone:PropTypes.object,
    code:PropTypes.object,
  }
  // 初始化页面常量 绑定事件方法
  constructor(props, context) {
    super(props)
    this.state = {
      loading: false,
      seconds: 59,
      btnText: "点击获取验证码",
      disabled: false,
      form1: "block",
      form2: "none",
      next:true,
    }
  }
  
  //获取验证码
  getCode = (e) => {
    let phone = this.props.form.getFieldValue ('phone');
    if(phone){
      this.props.checkPhone(phone);
    }else{
      this.props.form.setFields({
        phone: {
          value: phone,
          errors: [new Error('手机号为空')],
        },
      });
    }
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.checkCode(values);
      }
    })
  }
  

  hasErrors = (fieldsError) => {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  }
  render() {
    const {
      getFieldDecorator,
    } = this.props.form;
    return (
      <Form hideRequiredMark={false} onSubmit={this.handleSubmit} className="loginForm">
        <FormItem label="" >
          {getFieldDecorator('phone', {
            rules: [{  pattern:/(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/,required: true, message: '请输入有效手机号' }],
          })(
            <Input prefix={<Icon type="mobile" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="请输入11位手机号"  />
          )}
        </FormItem>
        <FormItem >
          <Row gutter={8}>
            <Col span={18}>
              {getFieldDecorator('captcha', {
                rules: [{ required: true, message: '请输入有效验证码' }],
              })(
                <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="请输入6位数字验证码" />
              )}
            </Col>
            <Col span={6}>
              <Button className="captcha" type="default" disabled={this.props.count !== 0} onClick={this.getCode}>{this.props.count !== 0 ? `${this.props.count}秒后可重新获取` : "点击获取验证码"}</Button>
            </Col>
          </Row>
        </FormItem>
        <FormItem>
          <Button type="primary" htmlType="submit" className="loginFormButton"  >
           下一步
          </Button>
        </FormItem>
      </Form>
    )
  }
}
const SignupForms = Form.create(options)(SignupForm1);

const options = {
  mapPropsToFields: (props) => {
    return {
      phone: Form.createFormField({
        value: props.phone.get('value')
      }),
      captcha: Form.createFormField({
        value: props.code.get('value')
      })
    };
  }
}

export default SignupForms