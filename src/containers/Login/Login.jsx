import React, {Component} from 'react';
import {connect} from 'react-redux';
import { withRouter } from 'react-router-dom';
import {Tabs, message} from 'antd';
import PropTypes from 'prop-types';
import styles from './loginLayout.scss';
import LoginForm from '../../components/Login/LoginForm';
// import RegisterForm from '../../components/Login/RegisterForm';
import {loginAction} from './loginAction';

const {TabPane} = Tabs;

class Login extends Component {
  static propTypes = {
    pageTab: PropTypes.string,
    changeLoginStore: PropTypes.func,
    fetchLogin: PropTypes.func,
    sendCode: PropTypes.func,
    checkCodeLogin: PropTypes.func,
    username: PropTypes.string,
    enterpriseId: PropTypes.string,
    history: PropTypes.object,
    error: PropTypes.object,
    userEnterpriseStatus: PropTypes.number,
    inviteUserLink: PropTypes.func,
    checkLoginPhone: PropTypes.bool,
  }

  constructor(props) {
    super(props);
  }

  onLogin = () => {
    this.props.changeLoginStore({
      userEnterpriseStatus: 3,
      checkLoginPhone: true,
    })
  }

  changePage = (pageTab) => {
    this.props.changeLoginStore({pageTab, registerStep: 1, joinStep: 1,enterpriseId: ''});
  }

  toSeeAgreement = () => {
    this.props.changeLoginStore({pageTab: 'agreement'})
  }

  toContactUs = () => {
    this.props.changeLoginStore({pageTab: 'contact'})
  }

  render() {
    const {pageTab,history, userEnterpriseStatus} = this.props;
    return (
      <div className={styles.login}>
        <div className={styles.joinTop}  >
          <div className={styles.joinBox} onClick={() => this.changePage('joinIn')}>
            <div className={styles.fontIcon}>
              <i className="iconfont icon-join" />
            </div>
            <div className={styles.join}>加入企业</div>
          </div>
          {userEnterpriseStatus !== 3 && <div className={styles.goLogin}>
            <span onClick={this.onLogin}> 登录 </span>
          </div>}
        </div>
       
        <div className={styles.loginTab}>
          <Tabs onChange={this.changePage} animated={false} activeKey={pageTab} className={styles.tab}>
            <TabPane tab="登录" key="login">
              <LoginForm
                {...this.props}
                history={history}
              />
            </TabPane>
            {/* <TabPane tab="注册企业" key="register">
              <RegisterForm />
            </TabPane> */}
          </Tabs>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  username: state.login.getIn(['loginData', 'username']),
  enterpriseId: state.login.getIn(['loginData', 'enterpriseId']),
  userEnterpriseStatus: state.login.get('userEnterpriseStatus'),
  error: state.login.get('error'),
  checkLoginPhone: state.login.get('checkLoginPhone'),
});

const mapDispatchToProps = (dispatch) => ({
  fetchLogin: params => dispatch({type: loginAction.USER_NAME_LOGIN_SAGA, params}),
  sendCode: params => dispatch({ type: loginAction.SEND_CODE_SAGA, params}),
  checkCodeLogin: params => dispatch({ type: loginAction.PHONE_CODE_LOGIN_SAGA, params}),
  inviteUserLink: params => dispatch({ type: loginAction.INVITE_USER_LINK_SAGA, params}),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));
