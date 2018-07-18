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
    phoneRegister: PropTypes.func,
    registerStep: PropTypes.number,
    checkEnterpriseDomain: PropTypes.func,
    getLogin: PropTypes.func,
    domainIsRegister: PropTypes.number,
    nameIsRegister: PropTypes.number,
  }
  constructor(props) {
    super(props);
  }
  changePage = (pageTab) =>{
    this.props.changeLoginPage({pageTab})
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
                phoneRegister={this.props.phoneRegister}
                registerStep={this.props.registerStep}
                checkEnterpriseDomain={this.props.checkEnterpriseDomain}
                getLogin={this.props.getLogin}
                domainIsRegister={this.props.domainIsRegister}
                nameIsRegister={this.props.nameIsRegister}
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
})
const mapDispatchToProps = (dispatch) => ({
  sendCode: params => dispatch({type: LoginAction.SEND_CODE_SAGA, params}),
  phoneRegister: params => dispatch({ type: LoginAction.CHECK_PHONE_REGISTER_SAGA, params }),
  checkEnterpriseDomain: params => dispatch({ type: LoginAction.CHECK_ENTERPRISE_DOMAIN_SAGA, params}),
  getLogin: params => dispatch({type: LoginAction.GET_LOGIN_SAGA, params}),
})
export default connect(mapStateToProps, mapDispatchToProps)(Register);
