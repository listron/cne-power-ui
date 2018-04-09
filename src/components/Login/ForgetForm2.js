import React, {Component} from 'react';
import {Form,Input,Button,notification,Icon,Avatar,message,Row,Col} from 'antd';
import {hashHistory,Link} from 'react-router';
import axios from 'axios';
// const api  = "http://10.10.24.56:8080";

// import {fetchForgetForm1,userInfo} from 'actions/common';
// import actions from '../actions/common';

const FormItem = Form.Item
// @Form.create()
class ForgetForm2 extends Component {
  // 初始化页面常量 绑定事件方法
  constructor(props, context) {
    super(props)
    this.state={
      confirmDirty: false,
      autoCompleteResult: [],
    }
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.dispatch(()=>{
          axios.post(api+'/api/v3/user/changeUserPassword',`phone=${this.props.phone}&password=${values.password}&confirmPwd=${values.confirmPwd}`)
          .then((response)=>{
            if(response.data.success){
              hashHistory.push('/');
            }else{
              this.props.form.setFields({
                password: {
                  value: values.password,
                  errors: [new Error(response.data.error)],
                },
              });
            }
          })
          .catch((error)=>{
            message.error(error)
          })
        })
      }
    })
  }

  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({
      confirmDirty: this.state.confirmDirty || !!value
    });
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
  // 组件已经加载到dom中
  componentDidMount() {
  }
  componentWillReceiveProps(nextProps){
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
    console.log(this.props)
    return (
      <Form hideRequiredMark={false} onSubmit={this.handleSubmit} className="loginForm"  style={{display:this.props.visible}}>
        <Row>
          <Col span={4} style={{textAlign:"right",color:'rgba(0, 0, 0, 0.85)',marginBottom:"1em"}} className="ant-form-item-required">手机号码：</Col>
          <Col span={20} style={{color:"#999"}}>{this.props.phone}</Col>
        </Row>
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
              <Input type="password" placeholder="请输入"/>
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
              <Input type="password" onBlur={this.handleConfirmBlur} placeholder="请输入"/>
            )}
        </FormItem>
        <FormItem>
          <Button type="primary" htmlType="submit" className="loginFormButton">
           重置密码
          </Button>
          <Link className="loginFormForgot" to="/login">去登录</Link>
        </FormItem>
      </Form>
    )
  }
}
const LoginForms = Form.create()(ForgetForm2);
export default LoginForms;