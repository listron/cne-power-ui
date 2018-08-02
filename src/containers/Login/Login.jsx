import React, {Component} from 'react';
import {connect} from 'react-redux';
import { withRouter } from 'react-router-dom';
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
    changeLoginStore: PropTypes.func,
    fetchLogin: PropTypes.func,
    sendCode: PropTypes.func,
    checkCodeLogin: PropTypes.func,
    username: PropTypes.string,
    enterpriseId: PropTypes.string,
    history: PropTypes.object
  }

  constructor(props) {
    super(props);
  }

  changePage = (pageTab) => {
    this.props.changeLoginStore({pageTab, registerStep: 1, joinStep: 1,enterpriseId: ''})
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
        <div className={styles.loginContent}>
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
  username: state.login.getIn(['loginData', 'username']),
  enterpriseId: state.login.getIn(['loginData', 'enterpriseId']),
});

const mapDispatchToProps = (dispatch) => ({
  fetchLogin: params => dispatch({type: LoginAction.GET_LOGIN_SAGA, params}),
  sendCode: params => dispatch({ type: LoginAction.SEND_CODE_SAGA, params}),
  checkCodeLogin: params => dispatch({ type: LoginAction.CHECK_CODE_SAGA, params}),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));
