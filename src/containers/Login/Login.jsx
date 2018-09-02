import React, {Component} from 'react';
import {connect} from 'react-redux';
import { withRouter } from 'react-router-dom';
import {Tabs, message} from 'antd';
import PropTypes from 'prop-types';
import styles from './loginLayout.scss';
import LoginForm from '../../components/Login/LoginForm';
import RegisterForm from '../../components/Login/RegisterForm';
import {loginAction} from '../../constants/actionTypes/loginAction';

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
  }

  constructor(props) {
    super(props);
  }

  changePage = (pageTab) => {
    this.props.changeLoginStore({pageTab, registerStep: 1, joinStep: 1,enterpriseId: ''})
  }

  toSeeAgreement = () => {
    this.props.changeLoginStore({pageTab: 'agreement'})
  }

  toContactUs = () => {
    this.props.changeLoginStore({pageTab: 'contact'})
  }

  render() {
    const {pageTab,history} = this.props;

    return (
      <div className={styles.login}>
        <div className={styles.joinTop}>
          <div className={styles.fontIcon}>
            <i className="iconfont icon-join" />
          </div>
          <div className={styles.join} onClick={() => this.changePage('joinIn')}>加入企业</div>
        </div>
        <div className={styles.loginTab}>
          <Tabs onChange={this.changePage} animated={false} activeKey={pageTab}>
            <TabPane tab="登录" key="login">
              <LoginForm
                changeLoginStore={this.props.changeLoginStore}
                fetchLogin={this.props.fetchLogin}
                sendCode={this.props.sendCode}
                checkCodeLogin={this.props.checkCodeLogin}
                username={this.props.username}
                enterpriseId={this.props.enterpriseId}
                history={history}
                error={this.props.error}
                userEnterpriseStatus={this.props.userEnterpriseStatus}
              />
            </TabPane>
            <TabPane tab="注册企业" key="register">
              <RegisterForm />
            </TabPane>
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
});

const mapDispatchToProps = (dispatch) => ({
  fetchLogin: params => dispatch({type: loginAction.USER_NAME_LOGIN_SAGA, params}),
  sendCode: params => dispatch({ type: loginAction.SEND_CODE_SAGA, params}),
  checkCodeLogin: params => dispatch({ type: loginAction.PHONE_CODE_LOGIN_SAGA, params}),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));
