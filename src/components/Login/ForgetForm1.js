import React, {Component} from 'react';
import { connect } from 'react-redux';
import { CHECK_PHONE_SAGA ,CHECK_CODE_SAGA} from '../../constants/actionTypes/Login';
import {Form,Input,Icon,Button,Row,Col} from 'antd';
const FormItem = Form.Item;
import PropTypes from 'prop-types';

class ForgetForm1 extends Component {
  static propTypes = {
    form:PropTypes.object,
    checkPhone:PropTypes.func,
    checkCode:PropTypes.func,
    phone:PropTypes.object,
    code:PropTypes.object,
    nextForm:PropTypes.func,
    visible:PropTypes.string,
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
  componentWillReceiveProps (nextProps,nextState) {
    if(nextProps.phone.error&&!this.props.phone.error){
      this.props.form.setFields({
        phone: {
          value: nextProps.phone.phone,
          errors: [new Error(nextProps.phone.msg)],
        }
      });
    }
    if(nextProps.code.fetched&&!this.props.code.fetched){//验证码发送成功
      let siv = setInterval(() => {
        this.setState({
          seconds: this.state.seconds - 1,
          btnText: `${this.state.seconds}秒后可重新获取`,
          disabled: true,          
        }, () => {
          if (this.state.seconds === -1) {
            this.setState({
              seconds: 59,
              btnText: "点击获取验证码",
              disabled: false,
            })
            clearInterval(siv);
          }
        });
      }, 1000);
    }
    if(nextProps.code.error&&!this.props.code.error){//验证码发送失败
      this.props.form.setFields({
        captcha: {
          value: nextProps.phone.phone,
          errors: [new Error(nextProps.phone.msg)],
        } 
      });
    }
    if(nextProps.code.isRight&&!this.props.code.isRight){//验证码验证成功
      this.props.nextForm();
    }
    if(!nextProps.code.isRight&&nextProps.code.error&&!this.props.code.error){
      this.props.form.setFields({
        captcha: {
          value: nextProps.code.code,
          errors: [new Error(nextProps.code.msg)],
        },
      });
    }
  }
  
  //获取验证码
  getCode = (e) => {
    let phone = this.props.form.getFieldValue ('phone');
    // this.setState({
    //   phone:phone,
    // })
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
      <Form hideRequiredMark={false} onSubmit={this.handleSubmit} className="loginForm"  style={{display:this.props.visible}}>
        <FormItem label="">
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
                <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="请输入6位数字验证码" />
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
const mapStateToProps = (state) => ({
  phone: state.login.phone,
  error:state.login.error,
  msg:state.login.msg,
  code:state.login.code
});

const mapDispatchToProps = (dispatch) => ({
  checkPhone: (parmas) => dispatch({ type: CHECK_PHONE_SAGA,parmas:parmas }),
  checkCode: (parmas) => dispatch({type: CHECK_CODE_SAGA,parmas:parmas})
});
export default connect(mapStateToProps, mapDispatchToProps)(ForgetForms)