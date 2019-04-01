import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Tabs, message, Form, Input, Button } from 'antd';
import PropTypes from 'prop-types';
import styles from './login.scss';
// import RegisterForm from '../../components/Login/RegisterForm';

const FormItem = Form.Item;
const { TabPane } = Tabs;

class Login extends Component {
  static propTypes = {
    loginLoading: PropTypes.bool,
    loginError: PropTypes.bool,
    loginType: PropTypes.string,
    form: PropTypes.object,
    loginResponse: PropTypes.object,
    // pageTab: PropTypes.string,
    // fetchLogin: PropTypes.func,
    // sendCode: PropTypes.func,
    // checkCodeLogin: PropTypes.func,
    // username: PropTypes.string,
    // enterpriseId: PropTypes.string,
    // history: PropTypes.object,
    // error: PropTypes.object,
    // userEnterpriseStatus: PropTypes.number,
    // inviteUserLink: PropTypes.func,
    // checkLoginPhone: PropTypes.bool,
    changeLoginStore: PropTypes.func,
    phoneCodeLogin: PropTypes.func,
    userNameLogin: PropTypes.func,
    getVerificationCode: PropTypes.func,
  }

  state = { timeValue: 0 }

  // onLogin = () => {
  //   this.props.changeLoginStore({
  //     userEnterpriseStatus: 3,
  //     checkLoginPhone: true,
  //   })
  // }

  componentDidUpdate(preProps){
    const { loginError, form, loginType } = this.props;
    const preLoginError = preProps.loginError;
    if (loginError && !preLoginError) { // 登录失败的错误提示
      if (loginType === 'username') {
        const username = form.getFieldValue('username');
        form.setFields({
          username: {
            value: username,
            errors: [new Error('用户名或密码错误，请重新尝试！')],
          },
        })
      } else {
        const phoneNumber = form.getFieldValue('phoneNumber');
        form.setFields({
          username: {
            value: phoneNumber,
            errors: [new Error('手机号或验证码错误，请重新尝试！')],
          },
        })
      }
    }
  }

  componentWillUnmount(){ // 清理验证码计时器
    this.intervalTimer && clearInterval(this.intervalTimer);
  }

  onUserLogin = (e) => {
    const { form, loginType, userNameLogin, phoneCodeLogin } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        loginType === 'username' ? userNameLogin(values) : phoneCodeLogin(values);
      }
    })
  }

  onLoginTypeToggle = () => {
    const { loginType, changeLoginStore } = this.props;
    changeLoginStore({
      loginType: loginType === 'username' ? 'phoneNumber' : 'username',
      loginError: false,
    })
  }

  sendCode = () => {
    const { getVerificationCode, form } = this.props;
    const phoneNum = form.getFieldValue('phoneNum');
    if (/(^1\d{10}$)/.test(phoneNum)) {
      getVerificationCode({phoneNum});
      this.verificationCodeInterval(60);
    } else {
      form.setFields({
        phoneNum: {
          value: phoneNum,
          errors: [new Error('手机号格式有误, 无法获取验证码')],
        },
      })
    }
  }

  verificationCodeInterval = (timeValue) => {
    this.setState({ timeValue });
    if (timeValue > 0) {
      this.intervalTimer = setTimeout(() => {
        this.verificationCodeInterval(timeValue - 1);
      }, 1000);
    }
  }

  toJoin = () => {
    const { changeLoginStore } = this.props;
    changeLoginStore({ pageTab: 'joinIn', joinStep: 1 });
  }

  toForget = () => {
    console.log('去忘记密码页面')
    
  }

  toFillInfo = () => {
    console.log('个人信息完善')
  }

  render() {
    const { form, loginType, loginError, loginResponse, loginLoading } = this.props;
    const { timeValue } = this.state;
    const { getFieldDecorator } = form;
    const { userEnterpriseStatus = 3, username, authData } = loginResponse; // 用户状态 3：启用，4：禁用，5：待审核，6：审核不通过，7：移除
    const statusDetail = {
      4: '账号异常，请联系管理员！',
      5: '等待管理员审核',
      6: '未通过审核，如有问题，请联系管理员！',
      7: '账号异常，请联系管理员！',
    };
    return (
      <div className={styles.login}>
        <div className={styles.joinTop}>
          <span className={styles.join} onClick={this.toJoin}>
            <i className="iconfont icon-join" />
            <span>加入企业</span>
          </span>
        </div>
        {userEnterpriseStatus === 3 && <h3 className={styles.mainTitle}>登录</h3>}
        {userEnterpriseStatus !== 3 &&
          <div className={userEnterpriseStatus === 5 ? styles.waitExamine : styles.loginAbnormal}>
            <div className={styles.abnormalIcon}><i className="iconfont icon-ha"></i></div>
            <div>{statusDetail[userEnterpriseStatus]}</div>
          </div>
        }
        {<div className={styles.loginForm}>
          <Form>
            {loginType === 'username' && <FormItem className={styles.usernameInput}>
              {getFieldDecorator('username', {
                rules: [{required: true, message: '请输入手机号/用户名'}]
              })(
                <Input addonBefore={<i className="iconfont icon-user" />} placeholder="请输入手机号/用户名" />
              )}
            </FormItem>}
            {loginType === 'username' && <FormItem>
              {getFieldDecorator('password', {
                rules: [{required: true, message: '请输入密码'}]
              })(
                <Input addonBefore={<i className="iconfont icon-password" />} type="password" placeholder="请输入密码" />
              )}
            </FormItem>}
            {loginType === 'phoneNumber' && <FormItem>
              {getFieldDecorator('phoneNum', {
                rules: [{pattern: /(^1\d{10}$)/, required: true, message: '请输入手机号'}]
              })(
                <Input addonBefore={<i className="iconfont icon-phone" />} placeholder="请输入手机号" />
              )}
            </FormItem>}
            {loginType === 'phoneNumber' && <div className={styles.checkCodeBox}>
              <FormItem>
                {getFieldDecorator('verificationCode', {
                  rules: [{required: true, message: '请输入验证码!'}]
                })(
                  <Input
                    className={styles.verification}
                    addonBefore={<i className="iconfont icon-password" />}
                    placeholder="验证码"
                  />
                )}
              </FormItem>
              <Button
                disabled={timeValue > 0}
                onClick={this.sendCode}
                className={styles.queryCode}
                style={timeValue > 0 ? {
                  width: '96px',
                  background:'#f7f7f7',
                  border:'1px solid #dfdfdf',
                  color: '#dfdfdf'
                } : {}}
              >
                {timeValue > 0 ? `获取验证码 ${timeValue}` : "获取验证码"}
              </Button>
            </div>}
          </Form>
          <div className={styles.loginChange}>
            <span onClick={this.onLoginTypeToggle} className={styles.changeText}>
              {loginType === 'username' ? '手机验证码登录' : '密码登录(手机/用户名)'}
            </span>
            <span onClick={this.toForget} className={styles.changeText}>忘记密码</span>
          </div>
          <Button onClick={this.onUserLogin} loading={loginLoading}>登录</Button>
          {loginError && <p className={styles.loginError} >
              {/* <p>如未注册企业，请<span onClick={() => changeLoginStore({pageTab: 'register'})}>注册</span>！</p> */}
              <span>如需加入企业，请</span>
              <span className={styles.text} onClick={this.toJoin}>加入企业</span>！
            </p>
          }
          {authData && !username && <p className={styles.loseUser}>
            <span>个人信息不完善，去完善</span>
            <span onClick={this.toFillInfo} className={styles.text}>个人信息</span>
          </p>}
        </div>}
      </div>
    );
  }
}

export default Form.create()(Login);
