import React, {Component} from 'react';
import {Form, Icon, Input, Button, Steps, message, Alert, Checkbox} from 'antd';
import PropTypes from 'prop-types';
import styles from './registerForm.scss';

const FormItem = Form.Item;
const Step = Steps.Step;


class RegisterForm extends Component {
  static propTypes = {
    form: PropTypes.object,
    sendCode: PropTypes.func,
    signupCount: PropTypes.number,
    registerStep: PropTypes.number,
    phoneRegister: PropTypes.func,
    checkEnterpriseDomain: PropTypes.func,
    getLogin: PropTypes.func,
    registerEnterprise: PropTypes.func,
    domainIsRegister: PropTypes.string,
    nameIsRegister: PropTypes.string,
    checkUserRegister: PropTypes.func,
    checkPhoneRegister: PropTypes.func,
    isPhoneRegister: PropTypes.string,
    isUserRegister: PropTypes.string,
    phoneCodeRegister: PropTypes.func,
    enterpriseId: PropTypes.string,
    pageTab: PropTypes.string,
  }

  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      timeValue: 0,
    }
  }
  
  componentWillReceiveProps(nextProps){
    
    if(nextProps.domainIsRegister === '1' && nextProps.nameIsRegister === '1'){
      this.setState({ current: 1})
    }
  }

  onEnterpriseInfo = (e) => {
    e.preventDefault();
    this.props.form.validateFields(['enterpriseDomain', 'enterpriseName', 'userAgreement'], (err, values) => {
      if (!err) {
        this.props.checkEnterpriseDomain({
          'enterpriseDomain': values.enterpriseDomain+'.cneclound.cn',
          'enterpriseName': values.enterpriseName,
        });
      }
    })
  }

  onRegisterEnterprise = () => {
    this.props.form.validateFields(['userName','password','confirmPwd'],(err, values) => {
      if(!err){
        this.props.registerEnterprise(values);
      }
    })
  }

  phoneCodeRegister = (e) =>{
    e.preventDefault();
    this.props.form.validateFields(['phoneNum','verificationCode'],(err, values) => {
      if(!err){
        this.props.phoneCodeRegister({...values, 'registerStep': 2});
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

  checkUserRegister = (e) => {
    this.props.checkUserRegister(e.target.value);
  }
  checkPhoneRegister = (e) => {
    this.props.checkPhoneRegister(e.target.value);
  }
  // next = () => {
  //   const current = this.state.current !== 2 ? this.state.current + 1 : 2;
  //   this.setState({ current })
  // }
  showDomainBack = (rule, value, callback) => {
    const { domainIsRegister } = this.props;
    if(!domainIsRegister){
      callback('当前域名无效');
    } else{
      callback();
    }
  }

  showNameBack = (rule, value, callback) => {
    const { nameIsRegister } =this.props;
    if(!nameIsRegister){
      callback('当前企业名已注册，不能重复注册');
    } else{
      callback();
    }
  }

  render(){
    const { getFieldDecorator } = this.props.form;
    const { isPhoneRegister, isUserRegister, domainIsRegister, nameIsRegister } = this.props;
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
            <div>
              <Form onSubmit={this.phoneCodeRegister} className={styles.verificationCode}>
                <div className={styles.phoneInput}>
                  <FormItem>
                    {getFieldDecorator('phoneNum', {
                      rules: [{required: true, message: '请输入手机号'}]
                    })(
                      <Input className={styles.mobileNumber} prefix={<Icon type="mobile" />} placeholder="请输入手机号"/>
                    )}
                  </FormItem>
                </div>
                <div className={styles.checkCodeBox}>
                  <FormItem>
                    {getFieldDecorator('verificationCode', {
                      rules: [{required: true, message: '请输入验证码!'}]
                    })(
                      <Input className={styles.testCode} prefix={<Icon type="lock" />} placeholder="验证码!"/>
                    )}
                  </FormItem>
                  <Button type="primary" disabled={this.state.timeValue !== 0} onClick={this.sendCode} className={styles.queryCode}>
                    {this.state.timeValue !== 0 ? `${this.state.timeValue}秒后可重发` : "获取验证码"}
                  </Button>
                </div>
                <FormItem>
                  <Button type="primary" htmlType="submit" className="login-form-button">下一步</Button>
                </FormItem>
              </Form>
            </div>
          ),
      },
      {
        title: '企业信息',
        content:
          (
            <div>
              <Form onSubmit={this.onEnterpriseInfo}>
                <FormItem label="企业域名"  {...formItemLayout}>
                  {getFieldDecorator('enterpriseDomain', {
                    rules: [
                      {required: true, message: '请输入企业域名'},
                      {validator: this.showDomainBack}
                    ]
                  })(
                    <Input placeholder="请输入企业域名" style={{width: '200px'}} addonAfter=".cneclound.com" />
                  )}
                </FormItem>
                <FormItem label="企业名称" {...formItemLayout}>
                  {getFieldDecorator('enterpriseName', {
                    rules: [
                      {required: true, message: '请输入企业名称'},
                      {validator: this.showNameBack}
                    ]
                  })(
                    <Input placeholder="请输入企业名称" />
                  )}
                </FormItem>
                <FormItem {...tailFormItemLayout} >
                  {getFieldDecorator('userAgreement', {
                    valuePropName: 'checked',
                  })(
                    <Checkbox>同意<a href="#">用户协议</a></Checkbox>
                  )}
                </FormItem>
                <FormItem {...tailFormItemLayout} >
                  <Button type="primary" htmlType="submit" className="login-form-button">下一步</Button>
                </FormItem>
              </Form>
            </div>
          ),
      },
      {
        title: '完善个人信息',
        content:
          (
            <div>
              <Form onSubmit={this.onLogin}>
                <FormItem label="用户名" {...formItemLayout}>
                  {getFieldDecorator('userName', {
                    rules: [{required: true, message: '请输入用户名'}]
                  })(
                    <Input prefix={<Icon type="user" />} placeholder="请输入用户名"/>
                  )}
                </FormItem>
                {isPhoneRegister === '0' && <span>手机号已经注册，请登录</span>}
              <div>
                <FormItem  >
                  {getFieldDecorator('verificationCode',{
                    rules: [{required: true, message: '请输入验证码'}]
                  })(
                    <Input prefix={<Icon type="lock" />} type="password" placeholder="请输入密码"/>
                  )}
                </FormItem>
                <Button type="primary" disabled={this.state.timeValue !== 0} onClick={this.sendCode} >
                  {this.state.timeValue !== 0 ? `${this.state.timeValue}秒后可重发` : "点击获取验证码"}
                </Button>
              </div>
              <FormItem>
                <Button type="primary" htmlType="submit" className="login-form-button"  >下一步</Button>
              </FormItem>
            </Form>
          </div>
        ),
    }];
    let { current } = this.state;

    const step = current === 1 ? 1 : this.props.registerStep - 1;
    console.log(step)
    return (
      <div>
        <Steps current={step}>
          {steps.map(item => <Step key={item.title} title={item.title} />)}
        </Steps>
        <div className="steps-content">{steps[step].content}</div>
      </div>
    );
  }
}

const RegisterForms = Form.create()(RegisterForm);
export default RegisterForms;
