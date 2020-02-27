import React, {Component} from 'react';
import {Form, Icon, Input, Button,Checkbox, Card } from 'antd';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import styles from './joinInForm.scss';
import Cookie from 'js-cookie';

const FormItem = Form.Item;

class JoinInForm extends Component{
  static propTypes = {
    form: PropTypes.object,
    userFullName: PropTypes.string,
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
    importUser: PropTypes.bool,
    enterpriseLogo: PropTypes.string,
    userEnterpriseStatus: PropTypes.number,
    enterpriseInfo: PropTypes.object,
    locatoion: PropTypes.object,
    inviteUserLink: PropTypes.func,
    inviteValid: PropTypes.bool,
    username: PropTypes.string,
    importEnterpriseName: PropTypes.string,
    importEnterpriseLogo: PropTypes.string,
    importEnterpriseId: PropTypes.string,
    resetPassword: PropTypes.func,
    tmpAuthData: PropTypes.string,
    toShowAgreement: PropTypes.func,
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
    this.props.changeLoginStore({
      loginData: {},
      userEnterpriseStatus: 3,
    });
  }

  onJoinEnterprise = () => {
    this.props.form.validateFields(['username', 'userFullname', 'password','confirmPwd','userAgreement',],(err,values) => {
      if(!err){
        if(values.userAgreement){
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
          let { phoneNum, enterpriseId, history,importEnterpriseId,importUser,tmpAuthData } =this.props;
          const enterpriseIds = enterpriseId || importEnterpriseId;
          if(importUser){//导入用户 重置密码
            let params = {
              phoneNum,
              tmpAuthData,
              ...values,
            };
            this.props.resetPassword(params);
          }else{//普通用户 加入企业
            let params = {
              phoneNum,
              enterpriseId: enterpriseIds,
              history,
              ...values,
            }
            this.props.joinEnterprise(params);
          }
          
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
  getEnterpriseInfo = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err,values) => {
      if(!err){
        this.props.getEnterpriseInfo({enterpriseName: values.enterpriseName});
        this.setState({ showEnterpriseInfo: true,  });
      }
    })
  }
  
  handleCancel = () => {
    this.setState({ showEnterpriseInfo: false, });
  }

  timeDecline = () => {
    let timeCount = setInterval(() => {
      this.setState({ timeValue: this.state.timeValue-1 });
      if(this.state.timeValue < 0){
        clearInterval(timeCount);
        this.setState({ timeValue: 0 })
      }
    },1000);
  }

  // 点击获取验证码
  sendCode = () => {
    this.props.form.validateFields(['phoneNum'], (err, values) => {
      if(!err){
        this.props.sendCode(values);
        this.setState({ timeValue: 60 });
        this.timeDecline();
      }
    })
  }

  phoneCodeRegister = () => {
    this.props.form.validateFields(['phoneNum','verificationCode',], (err, values) => {
      console.log(err);
      if(!err){
        setTimeout(() => {
          if(this.props.error && (this.props.error.get('message') === '验证码错误' || this.props.error.get('message') === '验证码已失效')) {
            this.props.form.setFields({
              verificationCode: {
                value: values.verificationCode,
                errors: [new Error(this.props.error.get('message'))],
              },
            });
          }      
        }, 500);
        this.props.phoneCodeRegister({...values,joinStep: 3, isNotLogin: 1});
        
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
  
  changePage = (pageTab) =>{
    this.props.changeLoginStore({pageTab, registerStep: 1, joinStep: 1,enterpriseId: ''})
  }

  renderStepOne(formItemLayout, tailFormItemLayout) {
    const { getFieldDecorator, getFieldsError } = this.props.form;
    const { enterpriseName, enterpriseInfo } = this.props;
    const { showEnterpriseInfo } = this.state;
    return (
      <Form className={styles.joinStepOne} >
        <FormItem label="企业名称" {...formItemLayout}>
          {getFieldDecorator('enterpriseName',{
            rules: [{required: true, message: '请输入企业名称/企业域名'}]
          })(
            <Input placeholder="请输入企业名称/企业域名"  />
          )}
        </FormItem>
        <FormItem {...tailFormItemLayout}>
          <Button type="primary" onClick={this.getEnterpriseInfo} disabled={this.hasErrors(getFieldsError())} >下一步</Button>
        </FormItem>
        {showEnterpriseInfo && <Card className={styles.enterpriseInfo} >
          {enterpriseName === null ? <div>没有此企业，请重新输入</div> : <div>点击确认要加入的企业</div>}
          {Object.keys(enterpriseInfo).length>0 && enterpriseName === null ? <div></div> : <Button className={styles.enterpriseBtn} onClick={this.changeJoinStep }>{enterpriseName}</Button>}
          <div className={styles.enterpriseBack} ><Icon type="arrow-left" /><span  onClick={this.handleCancel}>返回</span></div>
        </Card>}
      </Form>
    );
  }

  renderStepTwo() {
    const { getFieldDecorator } = this.props.form;
    const { enterpriseIdToken,enterpriseName, enterpriseLogo,inviteValid } = this.props;
    const { timeValue } = this.state;
    const defaultLogo = "/img/nopic.png";
    return (
      <div className={styles.joinCheckCode} >
        <div className={styles.enterpriseBrief} >
          <div className={styles.enterpriseLogo} ><img src={enterpriseLogo || defaultLogo} width="60px" height="60px" /></div>
          <div>{enterpriseName}</div>
        </div>
        {inviteValid ? 
          <Form >
            <div>
              <FormItem>
                {getFieldDecorator('phoneNum', {
                  rules: [
                    {required: true, message: '请输入手机号'},
                    {pattern: /(^1\d{10}$)/, message: '手机号格式不对'}
                  ]
                })(
                  <Input addonBefore={<i className="iconfont icon-phone"></i>}  placeholder="请输入手机号" />
                )}
              </FormItem>
            </div>
            <div className={styles.checkCodeBox}>
              <FormItem >
                {getFieldDecorator('verificationCode',{
                  rules: [{required: true, message: '请输入验证码'}]
                })(
                  <Input className={styles.testCode} addonBefore={<i className="iconfont icon-password"></i>} placeholder="验证码" />
                )}
              </FormItem>
              <Button className={timeValue !== 0 ? styles.queryCodeClick : styles.queryCode} type="primary" disabled={timeValue !== 0} onClick={this.sendCode} >
                {timeValue !== 0 ? `获取验证码 ${timeValue}` : "获取验证码"}
              </Button>
            </div>
            <FormItem>
              <Button type="primary" onClick={this.phoneCodeRegister}>下一步</Button>
            </FormItem>
            {(enterpriseIdToken !== null && enterpriseIdToken !== undefined) ? <p style={{textAlign: 'center'}}>您已加入企业，请直接<span style={{color:'#199475',cursor: 'pointer'}}  onClick={()=>this.changePage('login')}>登录</span></p> : null}
          </Form>
        :
          <div className={styles.inviteInvalid} >
            邀请链接已过<span>7天有效期</span>，需要重新邀请！
          </div>
        }
        
      </div>
    );
  }
  renderStepThree(formItemLayout, tailFormItemLayout) {
    const { getFieldDecorator } = this.props.form;
    const { userEnterpriseStatus, userFullName, enterpriseName, enterpriseLogo,username,importUser,importEnterpriseName,importEnterpriseLogo } = this.props;
    const defaultLogo = "/img/nopic.png";
    if(userEnterpriseStatus === 5) {
      return (
        <div className={styles.waitExamine}>
          <div className={styles.waitExamineIcon}><i className="iconfont icon-ha"></i></div>
          <div className={styles.waitExamineTip}>等待管理员审核</div>
        </div>
      );
    } else if(userEnterpriseStatus === 6) {
      return (
        <div className={styles.loginAbnormal}>
          <div className={styles.abnormalIcon}><i className="iconfont icon-ha"></i></div>
          <div className={styles.abnormalTip}>未通过审核，如有问题，请联系管理员！</div>
        </div>
      );
    } else if(userEnterpriseStatus===3 || userEnterpriseStatus===null) {
      return (
        <div className={styles.userInfo} >
          <div className={styles.enterpriseBrief} >
            <div className={styles.enterpriseLogo} ><img src={(importUser ? importEnterpriseLogo : enterpriseLogo) || defaultLogo} width="60px" height="60px" /></div>
            <div>{importUser ? importEnterpriseName : enterpriseName}</div>
          </div>
          <Form >
            <FormItem label="用户名" {...formItemLayout}>
              {getFieldDecorator('username', {
                rules: [
                  {required: true, message: '请输入用户名'},
                  {pattern: /^[A-Za-z0-9~!@#$%^&*()-_+.\u4e00-\u9fa5]{3,25}$/gi,message: '请输入字符长度为3-25的用户名'},
                ],
                initialValue: username || '',
              })(
                <Input addonBefore={<i className="iconfont icon-user"></i>} disabled={username ? true : false} placeholder="请输入用户名" />
              )}
            </FormItem>
            <FormItem label="姓名"  labelCol={{sm: 8}} wrapperCol={{sm: 16}}>
              {getFieldDecorator('userFullname', {
                rules: [
                  {required: true, message: '请输入真实姓名'},
                  { validator: (rule, value, callback) => {
                    const exactStr = value.trim();
                    const patternRule = /^[A-Za-z \u4e00-\u9fa5]{0,30}$/;
                    // if (!patternRule.test(exactStr)) {
                    if(exactStr.length>=30){
                      callback('请输入小于30字符的真实姓名');
                    }
                    callback();
                  }}
                ],
                // 中文/英文/空格，小于等于30字符
                initialValue: userFullName || '',
              })(
                <Input
                  addonBefore={<i className="iconfont icon-user" />}
                  disabled={userFullName ? true : false}
                  placeholder="请输入真实姓名"
                />
              )}
            </FormItem>
            <FormItem label="创建密码" {...formItemLayout}>
              {getFieldDecorator('password',{
                rules: [
                  {required: true, message: '请输入密码'},
                  {pattern: /^[A-Za-z0-9~!@#$%^&*()_+.]{6,25}$/, message: '请输入字符长度为6-25的密码' }
                ]
              })(
                <Input addonBefore={<i className="iconfont icon-password"></i>} type="password" placeholder="输入字符长度为6-25的密码" />
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
            <FormItem {...tailFormItemLayout} className={styles.agreementItem}>
              {getFieldDecorator('userAgreement', {
              })(
                <Checkbox className={styles.userArgee}  >
                  同意
                </Checkbox>
              )}
              <span className={styles.userAgreeTip} onClick={this.props.toShowAgreement} >用户协议</span>
            </FormItem>
            <FormItem {...tailFormItemLayout} >
              <Button type="primary" onClick={this.onJoinEnterprise} className="login-form-button"  >加入企业</Button>
            </FormItem>
          </Form>
        </div>
      );
    }
  }
  
  render(){
    const { joinStep } = this.props;
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
      <div className={styles.comName}>
        {joinStep === 1 && this.renderStepOne(formItemLayout, tailFormItemLayout)}
        {joinStep === 2 && this.renderStepTwo()}
        {joinStep === 3 && this.renderStepThree(formItemLayout, tailFormItemLayout)}
      </div>
    );
  }
}
export default Form.create()(JoinInForm);