import React, {Component} from 'react';
import {Form,Input,Icon,Button,Row,Col} from 'antd';
const FormItem = Form.Item;
import PropTypes from 'prop-types';

class ForgetForm1 extends Component {
  static propTypes = {
    form:PropTypes.object,
    isFetching: PropTypes.bool,
    count: PropTypes.number,
    error: PropTypes.string,
    phone:PropTypes.object,
    code:PropTypes.object,
    checkCode:PropTypes.func,
    sendCode:PropTypes.func
  }
  // 初始化页面常量 绑定事件方法
  constructor(props, context) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this);
    this.sendCode = this.sendCode.bind(this);
  }

  onSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.checkCode(values);
      }
    })
  }

  //获取验证码
  sendCode() {
    this.props.form.validateFields(['phone'], (err, values) => {
      if (!err && this.props.error === '') {
        this.props.sendCode(values);
      }
    })
  }

  render() {
    const {
      getFieldDecorator,
    } = this.props.form;
    return (
      <Form hideRequiredMark={false} onSubmit={this.onSubmit} className="loginForm">
        <FormItem>
          {getFieldDecorator('phone', {
            rules: [{  pattern:/(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/,required: true, message: '请输入有效手机号' }],
          })(
            <Input onChange={this.ifCode} prefix={<Icon type="mobile" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="请输入11位手机号"  />
          )}
        </FormItem>
        <FormItem>
          <Row gutter={8}>
            <Col span={18}>
              {getFieldDecorator('captcha', {
                rules: [{ required: true, message: '请输入有效验证码' }],
              })(
                <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="请输入6位数字验证码" />
              )}
            </Col>
            <Col span={6}>
              <Button className="captcha" type="default" disabled={this.props.count !== 0} onClick={this.sendCode}>
                {this.props.count !== 0 ? `${this.props.count}秒后可重新获取` : "点击获取验证码"}
              </Button>
            </Col>
          </Row>
        </FormItem>
        <FormItem>
          <Button type="primary" htmlType="submit" className="loginFormButton">
           下一步
          </Button>
        </FormItem>
      </Form>
    )
  }
}

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

export default Form.create(options)(ForgetForm1);