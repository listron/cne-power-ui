import React, { Component } from 'react';
import { Form, Input, Button, Row, Col } from 'antd';
import PropTypes from 'prop-types';

const FormItem = Form.Item;
class ForgetForm2 extends Component {
  static propTypes = {
    code: PropTypes.object,
    phone: PropTypes.object,
    history:PropTypes.array,
    form:PropTypes.func,
    error: PropTypes.string,
    isFetching: PropTypes.bool,
    changePSW:PropTypes.func
  }
  constructor(props) {
    super(props);
    this.compareToFirstPassword = this.compareToFirstPassword.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let parmas={...values,phone:this.props.phone.get('value')}
        this.props.changePSW(parmas);
      }
    })
  }

  //比较两次输入密码
  compareToFirstPassword(rule, value, callback) {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('密码不一致');
    } else {
      callback();
    }
  }

  render() {
    const {
      getFieldDecorator,
    } = this.props.form;
    const {phone} = this.props.phone.get('value');
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
      <Form hideRequiredMark={false} onSubmit={this.onSubmit} className="loginForm">
        <Row>
          <Col span={4} style={{textAlign:"right",color:'rgba(0, 0, 0, 0.85)',marginBottom:"1em"}} className="ant-form-item-required">手机号码：</Col>
          <Col span={20} style={{color:"#999"}}>{!!phone?phone:null}</Col>
        </Row>
        <FormItem {...formItemLayout} label="新密码" extra="6~20位英文字符、数字">
            {getFieldDecorator('password', {
              rules: [{
                required: true, message: '请输入有效密码',
                pattern:/^[\x21-\x7E]{6,20}$/,
              }],
            })(
              <Input type="password" placeholder="请输入" />
            )}
        </FormItem>
          <FormItem
            {...formItemLayout}
            label="确认密码"
          >
            {getFieldDecorator('confirmPwd', {
              rules: [{
                required: true, message: '密码不一致',
              }, {
                validator: this.compareToFirstPassword,
              }],
            })(
              <Input type="password" placeholder="请输入" />
            )}
          </FormItem>
          <FormItem>
            <Button type="primary" htmlType="submit" className="loginFormButton">
            重置密码
            </Button>
          </FormItem>
      </Form>
    )
  }
}
export default Form.create()(ForgetForm2);