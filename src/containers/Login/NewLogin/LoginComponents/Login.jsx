import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Tabs, message, Form, Input, Button } from 'antd';
import PropTypes from 'prop-types';
import styles from '../loginLayout.scss';
// import RegisterForm from '../../components/Login/RegisterForm';

const FormItem = Form.Item;
const { TabPane } = Tabs;

class Login extends Component {
  static propTypes = {
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
  }

  state = { timeValue: 0 }

  // onLogin = () => {
  //   this.props.changeLoginStore({
  //     userEnterpriseStatus: 3,
  //     checkLoginPhone: true,
  //   })
  // }

  onUserLogin = (e) => {
    const { form } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        this.props.phoneCodeLogin(values);
      }
    })
  }

  render() {
    // todo登录的禁用状态disable => loading
    const { form, loginType, changeLoginStore, loginError, loginResponse } = this.props;
    const { timeValue } = this.state;
    const { getFieldDecorator } = form;
    const { userEnterpriseStatus = 3, username } = loginResponse; // 用户状态 3：启用，4：禁用，5：待审核，6：审核不通过，7：移除
    const statusDetail = {
      4: '账号异常，请联系管理员！',
      5: '等待管理员审核',
      6: '未通过审核，如有问题，请联系管理员！',
      7: '账号异常，请联系管理员！',
    }
    return (
      <div className={styles.login}>
        <div className={styles.joinTop}>
          <span className={styles.join} onClick={this.toJoin}>
            <i className="iconfont icon-join" />
            <span>加入企业</span>
          </span>
          {userEnterpriseStatus !== 3 && <span className={styles.toLogin} onClick={this.onLogin}> 登录 </span>}
        </div>
        {userEnterpriseStatus !== 3 &&
          <div className={userEnterpriseStatus === 5 ? styles.waitExamine : styles.loginAbnormal}>
            <div className={styles.abnormalIcon}><i className="iconfont icon-ha"></i></div>
            <div>{statusDetail[userEnterpriseStatus]}</div>
          </div>
        }
        {<div className={styles.loginTab}>
          <Form onSubmit={this.onHandleSubmit}>
            {loginType === 'username' && <FormItem className={styles.usernameInput}>
              {getFieldDecorator('username', {
                rules: [{required: true, message: '请输入手机号/用户名'}]
              })(
                <Input addonBefore={<i className="iconfont icon-user"></i>} placeholder="请输入手机号/用户名" />
              )}
            </FormItem>}
            {loginType === 'username' && <FormItem>
              {getFieldDecorator('password', {
                rules: [{required: true, message: '请输入密码'}]
              })(
                <Input addonBefore={<i className="iconfont icon-password"></i>} type="password" placeholder="请输入密码" />
              )}
            </FormItem>}
            {loginType === 'phoneNumber' && <FormItem>
              {getFieldDecorator('phoneNum', {
                rules: [{pattern: /(^1\d{10}$)/, required: true, message: '请输入手机号'}]
              })(
                <Input addonBefore={<i className="iconfont icon-phone"></i>} placeholder="请输入手机号" />
              )}
            </FormItem>}
            {loginType === 'phoneNumber' && <div className={styles.checkCodeBox}>
              <FormItem>
                {getFieldDecorator('verificationCode', {
                  rules: [{required: true, message: '请输入验证码!'}]
                })(
                  <Input className={styles.testCode} addonBefore={<i className="iconfont icon-password"></i>} placeholder="验证码" />
                )}
              </FormItem>
              <Button type="primary" disabled={timeValue !== 0} onClick={this.sendCode} className={timeValue !== 0 ? styles.queryCodeClick : styles.queryCode}>
                {timeValue !== 0 ? `获取验证码 ${timeValue}` : "获取验证码"}
              </Button>
            </div>}
          </Form>
          <div className={styles.loginChange}>
            <span onClick={() => console.log('login type change')}>
              {loginType === 'username' ? '手机验证码登录' : '密码登录(用户名/密码)'}
            </span>
            <span onClick={() => changeLoginStore({ pageTab: 'forget' })}>忘记密码</span>
          </div>
          <div className={styles.loginBtn}>
            <Button onClick={this.onUserLogin} disabled={false}>登录</Button>
            {/* <div className={styles.yiLogin}>易巡登录</div> */}
          </div>
          {loginError && <div className={styles.checkLoginPhone} >
              {/* <p>如未注册企业，请<span onClick={() => changeLoginStore({pageTab: 'register'})}>注册</span>！</p> */}
              <p>如需加入企业，请<span onClick={() => changeLoginStore({pageTab: 'joinIn'})}>加入企业</span>！</p>
            </div>
          }
          {!username && <p>个人信息不完善，请完善<b onClick={this.jumpPersonalInfo} >个人信息</b></p>}
        </div>}
      </div>
    );
  }
}

export default Form.create()(Login);
