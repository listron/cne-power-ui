import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Tabs, message} from 'antd';
import PropTypes from 'prop-types';
import styles from './loginLayout.scss';
import LoginForm from '../../components/Login/LoginForm';
import RegisterForm from '../../components/Login/RegisterForm';
import {LoginAction} from '../../constants/actionTypes/loginAction';

const {TabPane} = Tabs;

class Login extends Component {
  static propTypes = {
    pageTab: PropTypes.string,
    changeLoginPage: PropTypes.func,
    fetchLogin: PropTypes.func,
    fetchCompanyInfo: PropTypes.func,
    error: PropTypes.string,
    domain: PropTypes.object,
    loginSuccess: PropTypes.bool,
    count: PropTypes.number,
    sendCode: PropTypes.func,
    checkCodeLogin: PropTypes.func,
    checkPhoneRegister: PropTypes.func,
    phoneCodeRegister: PropTypes.func,
    username: PropTypes.string,
    changeJoinStep: PropTypes.func,
  }

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    // const damain = document.domain.split('.')[0];
    const domain = 'test';
    this.props.fetchCompanyInfo(domain);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.error && !this.props.error) {
      message.error(nextProps.error);
    }
    if (nextProps.loginSuccess) {
      message.success('登录成功');
    }
  }

  changePage = (pageTab) => {
    this.props.changeLoginPage({pageTab})
  }

  render() {
    const {pageTab} = this.props;
    return (
      <div className={styles.login}>
        <div className={styles.joinTop}>
          <div className={styles.fontIcon}>
            <i className="font_family icon-phone" />
          </div>
          <div className={styles.join} onClick={() => this.changePage('joinIn')}>加入企业</div>
        </div>
        <div className={styles.loginContent}>
          <Tabs onChange={this.changePage} animated={false} activeKey={pageTab}>
            <TabPane tab="登录" key="login">
              <LoginForm
                changePage={this.props.changeLoginPage}
                fetchLogin={this.props.fetchLogin}
                loginSuccess={this.props.loginSuccess}
                sendCode={this.props.sendCode}
                checkCodeLogin={this.props.checkCodeLogin}
                // checkPhoneRegister={this.props.checkPhoneRegister}
                phoneCodeRegister={this.props.phoneCodeRegister}
                username={this.props.username}
                pageTab={this.props.pageTab}
                changeJoinStep={this.props.changeJoinStep}
              />
            </TabPane>
            <TabPane tab="注册企业" key="register">
              <RegisterForm />
            </TabPane>
          </Tabs>
        </div>
        <div className={styles.contactUs}>
          <span>用户协议</span>
          <span>联系我们</span>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  loginSuccess: state.login.get('loginSuccess'),
  username: state.login.get('username'),
});

const mapDispatchToProps = (dispatch) => ({
  fetchCompanyInfo: params => dispatch({type: LoginAction.GET_COMPINFO_SAGA, params}),
  fetchLogin: params => dispatch({type: LoginAction.GET_LOGIN_SAGA, params}),
  sendCode: params => dispatch({ type: LoginAction.SEND_CODE_SAGA, params}),
  checkCodeLogin: params => dispatch({ type: LoginAction.CHECK_CODE_SAGA, params}),
  // checkPhoneRegister: params => dispatch({ type: LoginAction.CHECK_PHONE_REGISTER_SAGA, params}),
  phoneCodeRegister: params => dispatch({ type: LoginAction.PHONE_CODE_REGISTER_SAGA, params}),
  changeJoinStep: params => dispatch({type: LoginAction.CHANGE_JOIN_STEP_SAGA, params}),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
