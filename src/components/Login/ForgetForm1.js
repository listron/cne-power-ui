import React, {Component} from 'react';
import {Form,Input,Button,notification,Icon,Avatar,message,Row,Col} from 'antd';
// import axios from 'axios';
// const api  = "http://10.10.24.56:8080";
// import {axiosPost} from '../utils'
// import {fetchForgetForm1,userInfo} from 'actions/common';
// import actions from '../actions/common';
const FormItem = Form.Item
// @Form.create()
// @connect((state, props) => ({
//   login: state.Login,
//   // loginResponse: state.tabListResult,
// }))
class ForgetForm1 extends Component {
  // 初始化页面常量 绑定事件方法
  constructor(props, context) {
    super(props)
    this.state = {
      loading: false,
      seconds: 59,
      btnText: "点击获取验证码",
      disabled: true,
      form1: "block",
      form2: "none",
      next:true,
    }
    // this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.dispatch(()=>{
          axios.post(api+'/api/v3/user/validateCaptcha',`phone=${values.phone}&captcha=${values.captcha}`)
          .then((response)=>{
            if(response.data.success){
              this.props.nextForm(values.phone);
            }else{
              this.props.form.setFields({
                captcha: {
                  value: values.captcha,
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
  //获取验证码
  getCode = (e) => {
    this.setState({
      disabled: true,
    })
    let phone = this.props.form.getFieldValue ('phone');
    this.props.dispatch(() => {
      axios.post(api+'/api/v3/user/validateEnterpriseRegPhoneNum',`phone=${phone}`)
      .then((response) => {
        if(response.data.success){//未注册
          this.props.form.setFields({
            phone: {
              value: phone,
              errors: [new Error('手机号未注册')],
            },
          });
        }else{
          if(response.data.error == '手机号已注册'){
            axios.post(api+'/api/v3/common/requestSmsCode',`phone=${phone}`)
            .then((response=>{
              let siv = setInterval(() => {
                this.setState({
                  seconds: this.state.seconds - 1,
                  btnText: `${this.state.seconds}秒后可重新获取`,
                }, () => {
                  if (this.state.seconds == -1) {
                    this.setState({
                      seconds: 5,
                      btnText: "点击获取验证码",
                      disabled: false,
                    })
                    clearInterval(siv);
                  }
                });
                }, 1000);
              }))
            .catch((error) => {message.error(error)})
          }
        }
      })
      .catch((error) => {message.error(error)})
    })
  }
  componentDidMount() {
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
    // const access = this.props.login;
    // const errors = access.success&&access.error?access.msg:'';
    // console.log(access.success&&errors,errors)
    return (
      <Form hideRequiredMark={false} onSubmit={this.handleSubmit} className="loginForm"  style={{display:this.props.visible}}>
        <FormItem label=""
          // validateStatus={errors?'error':''}
          // help={errors}
        >
          {getFieldDecorator('phone', {
            rules: [{  pattern:/(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/,required: true, message: '请输入有效手机号' }],
          })(
            <Input onChange={this.ifCode} prefix={<Icon type="mobile" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="请输入11位手机号"  />
          )}
        </FormItem>
        <FormItem >
          <Row gutter={8}>
            <Col span={18}>
              {getFieldDecorator('captcha', {
                rules: [{ required: true, message: '请输入有效验证码' }],
              })(
                <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="请输入6位数字验证码"/>
              )}
            </Col>
            <Col span={6}>
              <Button className="captcha" type="default" disabled={this.state.disabled} onClick={this.getCode}>{this.state.btnText}</Button>
            </Col>
          </Row>
        </FormItem>
        <FormItem>
          <Button type="primary" htmlType="submit" className="loginFormButton"  onClick={this.nextForm} disabled={!this.state.next}>
           下一步
          </Button>
        </FormItem>
      </Form>
    )
  }
}
const ForgetForms = Form.create()(ForgetForm1);
export default ForgetForms;