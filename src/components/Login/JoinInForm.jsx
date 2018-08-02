import React, {Component} from 'react';
import {Form, Icon, Input, Button, Modal, Card } from 'antd';
import PropTypes from 'prop-types';
import styles from './joinInForm.scss';

const FormItem = Form.Item;

class JoinInForm extends Component{
  static propTypes = {
    form: PropTypes.object,
    enterpriseName: PropTypes.string,
    getEnterpriseInfo: PropTypes.func,
    sendCode: PropTypes.func,
    joinEnterprise: PropTypes.func,
    enterpriseId: PropTypes.string,
    phoneNum: PropTypes.string,
    phoneCodeRegister: PropTypes.func,
    changeJoinStep: PropTypes.func,
    joinStep: PropTypes.number,
    changeLoginStore: PropTypes.func,
    enterpriseIdToken: PropTypes.string,
    error: PropTypes.object,
    history: PropTypes.object,
  }

  constructor(props){
    super(props);
    this.state = {
      timeValue: 0,
      showEnterpriseInfo: false,
    }
  }

  componentWillUnmount = () => {
    this.setState = (timeValue)=>{
      return;
    };
  }

  onJoinEnterprise = () => {
    this.props.form.validateFields((err,values) => {
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
        let { phoneNum, enterpriseId, history } =this.props;
        let params = {
          phoneNum,
          enterpriseId,
          history,
          ...values,
        }
        this.props.joinEnterprise(params);
      }
    })
  }
  getEnterpriseInfo = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err,values) => {
      if(!err){
        this.props.getEnterpriseInfo({enterpriseName: values.enterpriseName})
        this.setState({ showEnterpriseInfo: true,  });
      }
    })
  }
  
  handleCancel = () => {
    this.setState({ showEnterpriseInfo: false, })
  }

  timeDecline = () => {
    let timeCount = setInterval(() => {
      this.setState({ timeValue: this.state.timeValue-1 })
      if(this.state.timeValue < 0){
        clearInterval(timeCount);
        this.setState({ timeValue: 0 })
      }
    },1000);
  }

  hasErrors = (fieldsError) =>{
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  }

  // 点击获取验证码
  sendCode = () => {
    this.props.form.validateFields(['phoneNum'], (err, values) => {
      if(!err){
        this.props.sendCode(values);
        this.setState({ timeValue: 60 })
        this.timeDecline();
      }
    })
  }

  phoneCodeRegister = () => {
    this.props.form.validateFields(['phoneNum','verificationCode'], (err, values) => {
      if(!err){
        setTimeout(() => {
          if(this.props.error && this.props.error.get('code') === '20001') {
            this.props.form.setFields({
              phoneNum: {
                value: values.phoneNum,
                errors: [new Error('此手机号已经加入企业，不可加入企业')],
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
        this.props.phoneCodeRegister({...values,joinStep: 3, isNotLogin: 1 })
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

  hasErrors = (fieldsError) => {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  }
  changeJoinStep = (e) => {
    e.preventDefault();
    this.props.changeLoginStore({'joinStep': 2})
  }
  render(){
    const { getFieldDecorator, getFieldsError } = this.props.form;
    const { enterpriseName, joinStep, enterpriseIdToken } = this.props;
    const { showEnterpriseInfo, timeValue } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
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
    return (
      <div  className={styles.comName}>
        {joinStep === 1 &&
          <Form onSubmit={this.getEnterpriseInfo} >
            <FormItem label="企业名称" {...formItemLayout}>
              {getFieldDecorator('enterpriseName',{
                rules: [{required: true, message: '请输入企业名称/企业域名'}]
              })(
                <Input  placeholder="请输入企业名称/企业域名"  />
              )}
            </FormItem>
            <FormItem {...tailFormItemLayout}>
              <Button type="primary" htmlType="submit" disabled={this.hasErrors(getFieldsError())} >下一步</Button>
            </FormItem>
            {showEnterpriseInfo && <Card className={styles.enterpriseInfo} >
              {enterpriseName === null ? <div>没有此企业，请重新输入</div> : <div>点击确认要加入的企业</div>}
              {enterpriseName === null ? null : <Button className={styles.enterpriseBtn} style={{marginTop: '40px'}} onClick={this.changeJoinStep }>{enterpriseName}</Button>}
              <div className={styles.enterpriseBack} ><Icon type="arrow-left" /><span  onClick={this.handleCancel}>返回</span></div>
            </Card>}
          </Form>
        }
        {joinStep === 2 && 
          <div>
            <span>{enterpriseName}</span>
            <Form onSubmit={this.phoneCodeRegister} >
              <div>
                <FormItem>
                  {getFieldDecorator('phoneNum', {
                    rules: [
                      {required: true, message: '请输入手机号'},
                      {pattern: /(^1\d{10}$)/, message: '手机号格式不对'}
                    ]
                  })(
                    <Input prefix={<Icon type="mobile" />}  placeholder="请输入手机号" />
                  )}
                </FormItem>
              </div>
              <div className={styles.checkCodeBox}>
                <FormItem >
                  {getFieldDecorator('verificationCode',{
                    rules: [{required: true, message: '请输入验证码'}]
                  })(
                    <Input className={styles.testCode} prefix={<Icon type="lock" />} placeholder="验证码" />
                  )}
                </FormItem>
                <Button  className={timeValue !== 0 ? styles.queryCodeClick : styles.queryCode} type="primary" disabled={timeValue !== 0} onClick={this.sendCode} >
                  {timeValue !== 0 ? `获取验证码 ${timeValue}` : "获取验证码"}
                </Button>
              </div>
              <FormItem>
                <Button type="primary" htmlType="submit">下一步</Button>
              </FormItem>
              {(enterpriseIdToken !== null && enterpriseIdToken.length > 0) ? <p>您已加入企业，请直接登录</p> : null}
            </Form>
          </div>
        }
        {joinStep === 3 &&
          <div>
            <span>{enterpriseName}</span>
            <Form onSubmit={this.onJoinEnterprise}  >
              <FormItem label="用户名" {...formItemLayout}>
                {getFieldDecorator('username', {
                  rules: [
                    {required: true, message: '请输入用户名'},
                    {min: 3, max: 8, message: '请输入3到8位中文、英文、数字都可'}
                  ]
                })(
                  <Input prefix={<Icon type="user" />} placeholder="3-8位中文、英文、数字都可" />
                )}
              </FormItem>
              <FormItem label="创建密码" {...formItemLayout}>
                {getFieldDecorator('password',{
                  rules: [
                    {required: true, message: '请输入密码'},
                    {pattern: /^[a-zA-Z\d]{6,8}$/, message: '密码格式不对' }
                  ]
                })(
                  <Input prefix={<Icon type="lock" />} type="password" placeholder="6-8位数字或英文" />
                )}
              </FormItem>
              <FormItem label="确认密码" {...formItemLayout}>
                {getFieldDecorator('confirmPwd',{
                  rules: [
                    {required: true, message: '请输入密码'},
                    {validator: this.compareToFirstPassword}
                  ]
                })(
                  <Input prefix={<Icon type="lock" />} type="password" placeholder="请再次输入" />
                )}
              </FormItem>
              <FormItem {...tailFormItemLayout} >
                <Button type="primary" htmlType="submit" className="login-form-button"  >进入企业账号</Button>
              </FormItem>
            </Form>
          </div>
        }
      </div>
    );
  }
}
const JoinInForms = Form.create()(JoinInForm);
export default JoinInForms;