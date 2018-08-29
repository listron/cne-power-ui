import React, {Component} from 'react';
import {Form, Icon, Input, Button} from 'antd';
import PropTypes from 'prop-types';
import styles from './loginForm.scss';

const FormItem = Form.Item;

class LoginForm extends Component {
  static propTypes = {
    form: PropTypes.object,
    changeLoginStore: PropTypes.func,
    fetchLogin: PropTypes.func,
    sendCode: PropTypes.func,
    checkCodeLogin: PropTypes.func,
    enterpriseId: PropTypes.string,
    username: PropTypes.string,
    history: PropTypes.object,
    error: PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.state = {
      showPasswordLogin: true,
      timeValue: 0,
    }
  }
  
  componentWillUnmount = () => {
    this.setState = (timeValue)=>{
      return;
    };
  }

  

  onHandleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (this.state.showPasswordLogin) {
          this.props.fetchLogin({
            ...values,
            history: this.props.history,
          });
        }else{
          setTimeout(() => {
            if(this.props.error && this.props.error.get('code') === '20009') {
              this.props.form.setFields({
                phoneNum: {
                  value: values.phoneNum,
                  errors: [new Error('该用户尚未注册')],
                },
              });
            }
          }, 500);
          this.props.checkCodeLogin({
            ...values,
            history: this.props.history,
            isNotLogin: 0
          });
        }
      }
    })
  }

  timeDecline = () => {
    let timeCount = setInterval(() => {
      this.setState({timeValue: this.state.timeValue - 1})
      if (this.state.timeValue < 0) {
        clearInterval(timeCount);
        this.setState({timeValue: 0})
      }
    }, 1000);
  }

  hasErrors = (fieldsError) => {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  }

  // 点击获取验证码
  sendCode = () => {
    this.props.form.validateFields(['phoneNum'], (err, values) => {
      if (!err) {
        this.props.sendCode(values);
        this.setState({timeValue: 60})
        this.timeDecline();
      }
    })
  }
  jumpPersonalInfo = () => {
    this.props.form.validateFields(['phoneNum', 'verificationCode'], (err, values) => {
      if(!err){
        this.props.changeLoginStore({pageTab:'joinIn', joinStep: 3, registerStep: 1,phoneNum: values.phoneNum, verificationCode: values.verificationCode});
      }
    })
  }
  render(){
    const { getFieldDecorator, getFieldsError } = this.props.form;
    let { showPasswordLogin, timeValue } = this.state;
    let { username, enterpriseId } = this.props;

    return (
      <div className={styles.loginForm}>
        <Form onSubmit={this.onHandleSubmit}>
          {showPasswordLogin &&
          <div>
            <FormItem>
              {getFieldDecorator('username', {
                rules: [{required: true, message: '请输入手机号/用户名'}]
              })(
                <Input prefix={<Icon type="user" />} placeholder="请输入手机号/用户名" />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('password', {
                rules: [{required: true, message: '请输入密码'}]
              })(
                <Input prefix={<Icon type="lock" />} type="password" placeholder="请输入密码" />
              )}
            </FormItem>
          </div>
          }
          {!showPasswordLogin &&
          <div className={styles.verificationCode}>
            <div>
              <FormItem>
                {getFieldDecorator('phoneNum', {
                  rules: [{pattern: /(^1\d{10}$)/, required: true, message: '请输入手机号'}]
                })(
                  <Input prefix={<Icon type="mobile" />} placeholder="请输入手机号" />
                )}
              </FormItem>
              
            </div>
            <div className={styles.checkCodeBox}>
              <FormItem>
                {getFieldDecorator('verificationCode', {
                  rules: [{required: true, message: '请输入验证码!'}]
                })(
                  <Input className={styles.testCode} prefix={<Icon type="lock" />} placeholder="验证码" />
                )}
              </FormItem>
              <Button type="primary" disabled={timeValue !== 0} onClick={this.sendCode} className={timeValue !== 0 ? styles.queryCodeClick : styles.queryCode}>
                {timeValue !== 0 ? `获取验证码 ${timeValue}` : "获取验证码"}
              </Button>
            </div>
          </div>
          }
          <FormItem>
            <div className={styles.loginChange}>
              <span onClick={() => this.setState({showPasswordLogin: !showPasswordLogin})}>
                {showPasswordLogin ? '手机验证码登录' : '密码登录(手机/用户名)'}
              </span>
              <span onClick={() => this.props.changeLoginStore({pageTab: 'forget',showResetPassword: 0})}>忘记密码</span>
            </div>
            <div className={styles.loginBtn}>
              <Button type="primary" htmlType="submit" disabled={this.hasErrors(getFieldsError())}>登录</Button>
              {/* <div className={styles.yiLogin}>易巡登录</div> */}
            </div>
            {enterpriseId === null ? <p>您已注册，请<b onClick={()=>this.props.changeLoginStore({pageTab: 'joinIn'})}>加入企业</b>或<b onClick={()=>this.props.changeLoginStore({pageTab: 'register'})}>注册企业</b></p> : null}
            {username === null ? <p>个人信息不完善，请完善<b onClick={this.jumpPersonalInfo} >个人信息</b></p> : null }
          </FormItem>
        </Form>
      </div>
    );
  }
}

const LoginForms = Form.create()(LoginForm);
export default LoginForms;
