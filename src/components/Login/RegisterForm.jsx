import React, {Component} from 'react';
import {Form, Input, Button, Steps, Checkbox} from 'antd';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import styles from './registerForm.scss';

const FormItem = Form.Item;
const Step = Steps.Step;


class RegisterForm extends Component {
  static propTypes = {
    form: PropTypes.object,
    sendCode: PropTypes.func,
    registerStep: PropTypes.number,
    checkEnterpriseDomain: PropTypes.func,
    registerEnterprise: PropTypes.func,
    domainIsRegister: PropTypes.string,
    nameIsRegister: PropTypes.string,
    phoneCodeRegister: PropTypes.func,
    enterpriseId: PropTypes.string,
    error: PropTypes.object,
    history: PropTypes.object,
    changeLoginStore: PropTypes.func,
    phoneNum: PropTypes.string,
    enterpriseDomain: PropTypes.string,
    enterpriseName: PropTypes.string,
  }

  constructor(props) {
    super(props);
    this.state = {
      timeValue: 0,
      agreeChecked: false,
    }
  }

  componentWillUnmount = () => {
    this.setState = (timeValue, current)=>{
      return;
    };
    this.props.changeLoginStore({
      userEnterpriseStatus: 3,
    });
  }

  onEnterpriseInfo = (e) => {
    e.preventDefault();
    this.props.form.validateFields(['enterpriseDomain', 'enterpriseName', 'userAgreement'], (err, values) => {
      if (!err) {
        if(values.userAgreement){
          setTimeout(() => {
            if(this.props.domainIsRegister === '0') {
              this.props.form.setFields({
                enterpriseDomain: {
                  value: values.enterpriseDomain,
                  errors: [new Error('企业域名已注册！')],
                },
              });
            }
            if(this.props.nameIsRegister === '0') {
              this.props.form.setFields({
                enterpriseName: {
                  value: values.enterpriseName,
                  errors: [new Error('当前企业名已注册，不能重复注册！')],
                },
              });
            }
          }, 500);
          this.props.checkEnterpriseDomain({
            enterpriseDomain: values.enterpriseDomain+'.cnecloud.com',
            enterpriseName: values.enterpriseName,
          });
        }else{
          this.props.form.setFields({
            userAgreement: {
              value: values.userAgreement,
              errors: [new Error('请同意用户协议！')],
            },
          });
        }
      }
    })
  }
  
  onRegisterEnterprise = () => {
    this.props.form.validateFields(['username','password','confirmPwd'],(err, values) => {
      if(!err){
        setTimeout(() => {
          if(this.props.error && this.props.error.get('code') === '20015') {
            this.props.form.setFields({
              username: {
                value: values.username,
                errors: [new Error('用户名已存在')],
              },
            });
          }
        }, 500);
        this.props.registerEnterprise({
          ...values,
          phoneNum: this.props.phoneNum,
          enterpriseDomain: this.props.enterpriseDomain,
          enterpriseName: this.props.enterpriseName,
          history: this.props.history
        });
      }
    })
  }

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if(value && value !== form.getFieldValue('password')){
      callback('密码不一致！');
    }else{
      callback();
    }
  } 

  phoneCodeRegister = (e) =>{
    e.preventDefault();
    this.props.form.validateFields(['phoneNum','verificationCode',],(err, values) => {
      if(!err){
        setTimeout(() => {
          if(this.props.error && this.props.error.get('code') === '20001') {
            this.props.form.setFields({
              phoneNum: {
                value: values.phoneNum,
                errors: [new Error('此手机号已注册过企业，请更换手机号！')],
              },
            });
          }
          // server validate
          if(this.props.error && (this.props.error.get('message') === '验证码错误' || this.props.error.get('message') === '验证码已失效')) {
            this.props.form.setFields({
              verificationCode: {
                value: values.verificationCode,
                errors: [new Error(this.props.error.get('message'))],
              },
            });
          }      
        }, 500);
        this.props.phoneCodeRegister({...values,registerStep: 2, isNotLogin: 1 });
      }
    })
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

  timeDecline = () => {
    let timeCount = setInterval(() => {
      this.setState({timeValue: this.state.timeValue - 1})
      if (this.state.timeValue < 0) {
        clearInterval(timeCount);
        this.setState({timeValue: 0})
      }
    }, 1000);
  }

  renderStepOne(getFieldDecorator, enterpriseId){
    const { timeValue } =this.state;
    return (
      <div>
        <Form className={styles.verificationCode}>
          <div className={styles.phoneInput}>
            <FormItem>
              {getFieldDecorator('phoneNum', {
                rules: [
                  {required: true, message: '请输入手机号'},
                  {pattern: /(^1\d{10}$)/, message: '手机号格式不对'}
                ]
              })(
                <Input className={styles.mobileNumber} addonBefore={<i className="iconfont icon-phone"></i>} placeholder="请输入手机号" />
              )}
            </FormItem>
          </div>
          <div className={styles.checkCodeBox}>
            <FormItem>
              {getFieldDecorator('verificationCode', {
                rules: [
                  {required: true, message: '请输入验证码'},
                ]
              })(
                <Input className={styles.testCode} addonBefore={<i className="iconfont icon-password"></i>} placeholder="验证码" />
              )}
            </FormItem>
            <Button type="primary" disabled={timeValue !== 0} onClick={this.sendCode} className={timeValue !== 0 ? styles.queryCodeClick : styles.queryCode}>
              {timeValue !== 0 ? `获取验证码 ${timeValue}` : "获取验证码"}
            </Button>
          </div>
          <FormItem>
            <Button type="primary" onClick={this.phoneCodeRegister} className="login-form-button">下一步</Button>
          </FormItem>
          {/* {(enterpriseId !== null && enterpriseId.length>0) ? <p>您已加入企业，请直接登录</p> : <div></div>} */}
        </Form>
      </div>
    );
  }

  renderStepTwo(getFieldDecorator, formItemLayout, tailFormItemLayout){
    return (
      <div>
        <Form className={styles.enterpriseInfor}>
          <FormItem label="企业域名"  {...formItemLayout}>
            {getFieldDecorator('enterpriseDomain', {
              rules: [
                {required: true, message: '请输入企业域名'},
                {pattern: /[a-zA-Z0-9]{3,}/, message: '英文、数字组合，3个字以上'}
              ]
            })(
              <div className={styles.domain} >
                <Input placeholder="英文、数字组合，3个字以上"  />
                <span>.cnecloud.com</span>
              </div>
            )}
          </FormItem>
          <FormItem label="企业名称" {...formItemLayout}>
            {getFieldDecorator('enterpriseName', {
              rules: [
                {required: true, message: '请输入企业名称'},
                {pattern: /^[a-zA-Z0-9\u4E00-\u9FA5]{1,30}$/, message: '企业名称最长不超过30个字符'}
              ]
            })(
              <Input placeholder="30字以内" />
            )}
          </FormItem>
          <FormItem {...tailFormItemLayout} >
            {getFieldDecorator('userAgreement', {
            })(
              <Checkbox className={styles.userArgee}  >
                同意
                <Link className={styles.userAgreeTip} to="/userAgreement" >用户协议</Link>
              </Checkbox>
            )}
          </FormItem>
          <FormItem {...tailFormItemLayout} >
            <Button onClick={this.onEnterpriseInfo} type="primary" className="login-form-button">下一步</Button>
          </FormItem>
        </Form>
      </div>
    );
  }

  renderStepThree(getFieldDecorator, formItemLayout,tailFormItemLayout){
    return (
      <div className={styles.userInfor}>
        <Form>
          <FormItem label="用户名" {...formItemLayout}>
            {getFieldDecorator('username', {
              rules: [
                {required: true, message: '请输入用户名'},
                {pattern: /^[a-zA-Z0-9~!@#$%^&*()-_+.\u4E00-\u9FA5]{3,25}$/gi,message: '请输入字符长度为3-25的用户名'}
              ]
            })(
              <Input addonBefore={<i className="iconfont icon-user"></i>} />
            )}
          </FormItem>
          <FormItem label="创建密码" {...formItemLayout}>
            {getFieldDecorator('password',{
              rules: [
                {required: true, message: '请输入密码'},
                {pattern: /^[A-Za-z0-9~!@#$%^&*()_+.]{6,25}$/,message: '请输入字符长度为6-25的密码' }
              ]
            })(
              <Input addonBefore={<i className="iconfont icon-password"></i>} type="password" />
            )}
          </FormItem>
          <FormItem label="确认密码" {...formItemLayout}>
            {getFieldDecorator('confirmPwd',{
              rules: [
                {required: true, message: '请输入密码'},
                {validator: this.compareToFirstPassword}
              ]
            })(
              <Input addonBefore={<i className="iconfont icon-password"></i>} type="password" placeholder="请再次输入" />
            )}
          </FormItem>
          <FormItem {...tailFormItemLayout}>
            <Button onClick={this.onRegisterEnterprise} type="primary" className="login-form-button">进入企业账号</Button>
          </FormItem>
      </Form>
    </div>
    );
  }

  render(){
    const { getFieldDecorator } = this.props.form;
    const { enterpriseId } = this.props;
    
    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 8},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 16},
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };
    const steps = [
      {
        title: '账户验证',
        content:
          (
            this.renderStepOne(getFieldDecorator, enterpriseId)
          ),
      },
      {
        title: '企业信息',
        content:
          (
            this.renderStepTwo(getFieldDecorator, formItemLayout, tailFormItemLayout)
          ),
      },
      {
        title: '完善个人信息',
        content:
        (
          this.renderStepThree(getFieldDecorator, formItemLayout,tailFormItemLayout)
        ),
    }];
    const step = this.props.registerStep - 1;
    return (
      <div className={styles.registerBox} >
        <Steps current={step}  className={styles.registerStepBox}>
          {steps.map(item => <Step key={item.title} title={item.title} />)}
        </Steps>
        <div className="steps-content">{steps[step].content}</div>
      </div>
    );
  }
}

const RegisterForms = Form.create()(RegisterForm);
export default RegisterForms;
