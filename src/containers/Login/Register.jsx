import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button,Tabs } from 'antd';
import styles from './login.scss';
import { connect } from 'react-redux';
import LoginForm from '../../components/Login/LoginForm';
import RegisterForm from '../../components/Login/RegisterForm';
import { LoginAction } from '../../constants/actionTypes/loginAction';
const { TabPane } = Tabs;

class Register extends Component {
  static propTypes = {
    pageTab: PropTypes.string,
    changeLoginPage: PropTypes.func,
    sendCode: PropTypes.func,
    signupCount: PropTypes.number,
    registerStep: PropTypes.number,
    checkEnterpriseDomain: PropTypes.func,
    getLogin: PropTypes.func,
    domainIsRegister: PropTypes.string,
    nameIsRegister: PropTypes.string,
    phoneNum: PropTypes.string,
    enterpriseDomian: PropTypes.string,
    enterpriseName: PropTypes.string,
    isUserRegister: PropTypes.string,
    registerEnterprise: PropTypes.func,
    checkPhoneRegister: PropTypes.func,
    isPhoneRegister: PropTypes.string,
    phoneCodeRegister: PropTypes.func,
    enterpriseId: PropTypes.func,
  }
  constructor(props) {
    super(props);
  }
  changePage = (pageTab) =>{
    this.props.changeLoginPage({pageTab})
  }
  registerEnterprise = (data) => {
    let params = {
      phoneNum: this.props.phoneNum,
      enterpriseDomian: this.props.enterpriseDomian,
      enterpriseName: this.props.enterpriseName,
      userName: data.userName,
      password: data.password,
      confirmPwd: data.confirmPwd,
    }
    this.props.registerEnterprise(params);
  } 
  render() {
    const { pageTab } = this.props;
    return (
      <div className={styles.login}>
        <div className={styles.loginTop}>
          <span onClick={()=>this.changePage('joinIn')}>加入企业</span>
        </div>
        这里是企业注册页面!!!!!
        <div className={styles.loginContent}>
          <Tabs onChange={this.changePage} animated={false} activeKey={pageTab}>
            <TabPane tab="登录" key="login">
              <LoginForm changePage={this.props.changeLoginPage} />
            </TabPane>
            <TabPane tab="注册企业" key="register">
              <RegisterForm 
                sendCode={this.props.sendCode}
                registerStep={this.props.registerStep}
                checkEnterpriseDomain={this.props.checkEnterpriseDomain}
                getLogin={this.props.getLogin}
                registerEnterprise={this.registerEnterprise}
                domainIsRegister={this.props.domainIsRegister}
                nameIsRegister={this.props.nameIsRegister}
                isUserRegister={this.props.isUserRegister}
                checkPhoneRegister={this.props.checkPhoneRegister}
                isPhoneRegister={this.props.isPhoneRegister}
                phoneCodeRegister={this.props.phoneCodeRegister}
                enterpriseId={this.props.enterpriseId}
              />
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  registerStep: state.login.get('registerStep'),
  domainIsRegister: state.login.get('domainIsRegister'),
  nameIsRegister: state.login.get('nameIsRegister'),
  phoneNum: state.login.get('phoneNum'),
  enterpriseDomian: state.login.get('enterpriseDomian'),
  enterpriseName: state.login.get('enterpriseName'),
  isUserRegister: state.login.get('isUserRegister'),
  isPhoneRegister: state.login.get('isPhoneRegister'),
  enterpriseId: state.login.get('enterpriseId'),
})
const mapDispatchToProps = (dispatch) => ({
  sendCode: params => dispatch({type: LoginAction.SEND_CODE_SAGA, params}),
  checkEnterpriseDomain: params => dispatch({ type: LoginAction.CHECK_ENTERPRISE_DOMAIN_SAGA, params}),
  getLogin: params => dispatch({type: LoginAction.GET_LOGIN_SAGA, params}),
  registerEnterprise: params => dispatch({ type: LoginAction.REGISTER_ENTERPRISE_SAGA, params}),
  checkUserRegister: params => dispatch({ type: LoginAction.CHECK_USER_REGISTER_SAGA, params}),
  checkPhoneRegister: params => dispatch({ type: LoginAction.CHECK_PHONE_REGISTER_SAGA, params}),
  phoneCodeRegister: params => dispatch({ type: LoginAction.PHONE_CODE_REGISTER_SAGA, params}),
})
export default connect(mapStateToProps, mapDispatchToProps)(Register);
