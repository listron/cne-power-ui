import React, {Component} from 'react';
import {Form, Icon, Input, Button, Modal, Spin } from 'antd';
import PropTypes from 'prop-types';
import styles from './joinInForm.scss';

const FormItem = Form.Item;

class JoinInForm extends Component{
  static propTypes = {
    loading: PropTypes.bool,
    form: PropTypes.object,
    isExist: PropTypes.number,
    enterpriseName: PropTypes.string,
    isJoined: PropTypes.number,
    getEnterpriseInfo: PropTypes.func,
    sendCode: PropTypes.func,
    checkPhoneCode: PropTypes.func,
    joinEnterprise: PropTypes.func,
    enterpriseId: PropTypes.string,
    phoneNum: PropTypes.string,
    isPhoneRegister: PropTypes.string,
    checkPhoneRegister: PropTypes.func,
    phoneCodeRegister: PropTypes.func,
    username: PropTypes.string,
    joinResult: PropTypes.number,
    changeJoinStep: PropTypes.func,
    joinStepReducer: PropTypes.number,
  }

  constructor(props){
    super(props);
    this.state = {
      timeValue: 0,
      showEnterpriseInfo: false,
      joinInStep: 1,
    }
  }
  componentWillMount(){
    if(this.props.username === null){
      this.setState({
        joinInStep: 3,
      })
    }
  }
  onJoinEnterprise = () => {
    this.props.form.validateFields((err,values) => {
      if(!err){
        console.log(values);
        let { phoneNum, enterpriseId } =this.props;
        let params = {
          phoneNum,
          enterpriseId,
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
        this.props.getEnterpriseInfo({'enterpriseName': values.enterpriseName})
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
        this.setState({ timeValue: 10 })
        this.timeDecline();
      }
    })
  }

  phoneCodeRegister = () => {
    this.props.form.validateFields(['phoneNum','verificationCode'], (err, values) => {
      if(!err){
        this.props.phoneCodeRegister({...values, 'joinStepReducer': 3})
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

  checkPhoneRegister = (e) => {
    this.props.checkPhoneRegister(e.target.value);
  }

  hasErrors = (fieldsError) => {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  }
  changeJoinStep = (e) => {
    e.preventDefault();
    this.props.changeJoinStep({'joinStepReducer': 2})
  }
  render(){
    const { getFieldDecorator, getFieldsError } = this.props.form;
    const { enterpriseName, isPhoneRegister, joinResult, joinStepReducer } = this.props;
    const { showEnterpriseInfo, joinInStep } = this.state;
    console.log(enterpriseName);
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
      <div>
        {joinStepReducer === 1 &&
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
            {/* <Spin spinning={loading}> */}
              <Modal
                visible={showEnterpriseInfo}
                title={enterpriseName === null ? "没有此企业，请重新输入" : "点击确认要加入的企业"}
                footer={null}
                maskClosable={false}
                destroyOnClose={true}
                width={416}
                height={228}
                closable={false}
              >
                {enterpriseName === null ? null : <Button onClick={this.changeJoinStep }>{enterpriseName}</Button>}
                <br /><Icon type="arrow-left" /><span  onClick={this.handleCancel}>返回</span>
              </Modal>
            {/* </Spin> */}
          </Form>
        }
        {joinStepReducer === 2 && 
          <div>
            <span>{enterpriseName}</span>
            <Form onSubmit={this.phoneCodeRegister} >
              <div>
                <FormItem>
                  {getFieldDecorator('phoneNum', {
                    rules: [{pattern: /(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/, required: true, message: '请输入手机号'}]
                  })(
                    <Input prefix={<Icon type="mobile" />}  placeholder="请输入手机号" />
                  )}
                </FormItem>
                {isPhoneRegister === '0' && <span>手机号已经注册，请登录</span>}
              </div>
              <div>
                <FormItem  >
                  {getFieldDecorator('verificationCode',{
                    rules: [{required: true, message: '请输入验证码'}]
                  })(
                    <Input prefix={<Icon type="lock" />} placeholder="验证码" />
                  )}
                </FormItem>
                <Button type="primary" disabled={this.state.timeValue !== 0} onClick={this.sendCode} >
                  {this.state.timeValue !== 0 ? `${this.state.timeValue}秒后可重发` : "点击获取验证码"}
                </Button>
              </div>
              <FormItem>
                <Button type="primary" htmlType="submit">下一步</Button>
              </FormItem>
            </Form>
          </div>
        }
        {joinStepReducer === 3 &&
          (joinResult ? <span>等待管理员审核</span> : 
          <div>
            <span>{enterpriseName}</span>
            <Form onSubmit={this.onJoinEnterprise}  >
              <FormItem label="用户名" {...formItemLayout}>
                {getFieldDecorator('userName', {
                  rules: [{required: true, message: '请输入用户名'}]
                })(
                  <Input prefix={<Icon type="user" />} placeholder="请输入用户名" />
                )}
              </FormItem>
              <FormItem label="创建密码" {...formItemLayout}>
                {getFieldDecorator('password',{
                  rules: [{required: true, message: '请输入密码',min: 8, }]
                })(
                  <Input prefix={<Icon type="lock" />} type="password" placeholder="请输入密码" />
                )}
              </FormItem>
              <FormItem label="确认密码" {...formItemLayout}>
                {getFieldDecorator('confirmPwd',{
                  rules: [{required: true, message: '请输入密码', min: 8, validator: this.compareToFirstPassword}]
                })(
                  <Input prefix={<Icon type="lock" />} type="password" placeholder="请再次输入密码" />
                )}
              </FormItem>
              <FormItem {...tailFormItemLayout} >
                <Button type="primary" htmlType="submit" className="login-form-button"  >进入企业账号</Button>
              </FormItem>
            </Form>
          </div>)
        }
      </div>
    );
  }
}
const JoinInForms = Form.create()(JoinInForm);
export default JoinInForms;