import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Tabs, message } from 'antd';
import PropTypes from 'prop-types';
import styles from './preLogin.scss';
import LoginForm from '../../components/PreLogin/LoginForm';
import RegisterForm from '../../components/PreLogin/RegisterForm';
import { PreLoginAction } from '../../constants/actionTypes/preLoginAction';
const { TabPane } = Tabs;

class LoginContainer extends Component {
  static propTypes = {
    pageTab: PropTypes.string,
    changePreLoginPage: PropTypes.func,
    fetchLogin: PropTypes.func,
    fetchCompanyInfo: PropTypes.func,
    error: PropTypes.string,
    domain: PropTypes.object,
    loginSuccess: PropTypes.bool,
    count: PropTypes.number,
    sendCode: PropTypes.func,
    checkCodeLogin: PropTypes.func,
  }
  constructor(props) {
    super(props);
  }
  componentWillMount(){
    // const damain = document.domain.split('.')[0];
    const domain = 'test';
    this.props.fetchCompanyInfo(domain);
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.error && !this.props.error){
      message.error(nextProps.error);
    }
    if(nextProps.loginSuccess){
      message.success('登录成功');
    }
  }

  changePage = (pageTab) =>{
    this.props.changePreLoginPage({pageTab})
  }

  render() {
    const { pageTab } = this.props;
    return (
      <div className={styles.login}>
        <div className={styles.loginTop}>
          <span onClick={()=>this.changePage('joinIn')}>加入企业</span>
        </div>
        登录页面!!!!!
        <div className={styles.loginContent}>
          <Tabs onChange={this.changePage} animated={false} activeKey={pageTab} >
            <TabPane tab="登录" key="login">
              <LoginForm 
                changePage={this.props.changePreLoginPage} 
                fetchLogin={this.props.fetchLogin} 
                loginSuccess={this.props.loginSuccess}
                sendCode={this.props.sendCode}
                checkCodeLogin={this.props.checkCodeLogin}
              />
            </TabPane>
            <TabPane tab="注册企业" key="register">
              <RegisterForm  />
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  // domain: state.login.get('domain'),
  loginSuccess: state.preLogin.loginReducer.get('loginSuccess'),
});

const mapDispatchToProps = (dispatch) => ({
  fetchCompanyInfo: params => dispatch({type: PreLoginAction.GET_COMPINFO_SAGA, params}),
  fetchLogin: params => dispatch({type: PreLoginAction.GET_LOGIN_SAGA, params}),
  sendCode: params => dispatch({ type: PreLoginAction.SEND_CODE_SAGA, params}),
  checkCodeLogin: params => dispatch({ type: PreLoginAction.CHECK_CODE_SAGA, params}),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginContainer);
