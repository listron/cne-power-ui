import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tabs } from 'antd';
import styles from './loginLayout.scss';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import LoginForm from '../../components/Login/LoginForm';
import RegisterForm from '../../components/Login/RegisterForm';
import { loginAction } from '../../constants/actionTypes/loginAction';
const { TabPane } = Tabs;

class Register extends Component {
  static propTypes = {
    pageTab: PropTypes.string,
    changeLoginStore: PropTypes.func,
    sendCode: PropTypes.func,
    registerStep: PropTypes.number,
    checkEnterpriseDomain: PropTypes.func,
    domainIsRegister: PropTypes.string,
    nameIsRegister: PropTypes.string,
    phoneNum: PropTypes.string,
    enterpriseDomain: PropTypes.string,
    enterpriseName: PropTypes.string,
    registerEnterprise: PropTypes.func,
    phoneCodeRegister: PropTypes.func,
    enterpriseId: PropTypes.string,
    error: PropTypes.object,
    history: PropTypes.object,
  }
  constructor(props) {
    super(props);
  }
  changePage = (pageTab) =>{
    this.props.changeLoginStore({pageTab, registerStep: 1, joinStep: 1,enterpriseId: ''})
  }
  registerEnterprise = (data) => {
    let params = {
      phoneNum: this.props.phoneNum,
      enterpriseDomain: this.props.enterpriseDomain,
      enterpriseName: this.props.enterpriseName,
      username: data.username,
      password: data.password,
      confirmPwd: data.confirmPwd,
    }
    this.props.registerEnterprise(params);
  } 

  toSeeAgreement = () => {
    this.props.changeLoginStore({pageTab: 'agreement'})
  }

  toContactUs = () => {
    this.props.changeLoginStore({pageTab: 'contact'})
  }
  render() {
    const { pageTab, history } = this.props;
    return (
      <div className={styles.registerContent}>
        <div className={styles.joinTop}>
          <div className={styles.fontIcon}>
            <i className="iconfont icon-join" />
          </div>
          <div className={styles.join} onClick={()=>this.changePage('joinIn')}>加入企业</div>
        </div>
        <div className={styles.loginContent}>
          <Tabs onChange={this.changePage} animated={false} activeKey={pageTab}>
            <TabPane tab="登录" key="login">
              <LoginForm changeLoginStore={this.props.changeLoginStore} />
            </TabPane>
            <TabPane tab="注册企业" key="register">
              <RegisterForm 
                {...this.props}
                history={history}
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
  enterpriseDomain: state.login.get('enterpriseDomain'),
  enterpriseName: state.login.get('enterpriseName'),
  enterpriseId: state.login.get('enterpriseId'),
  error: state.login.get('error'),
})
const mapDispatchToProps = (dispatch) => ({
  sendCode: params => dispatch({type: loginAction.SEND_CODE_SAGA, params}),
  checkEnterpriseDomain: params => dispatch({ type: loginAction.CHECK_ENTERPRISE_DOMAIN_SAGA, params}),
  registerEnterprise: params => dispatch({ type: loginAction.REGISTER_ENTERPRISE_SAGA, params}),
  phoneCodeRegister: params => dispatch({ type: loginAction.PHONE_CODE_REGISTER_SAGA, params}),
})
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Register));
