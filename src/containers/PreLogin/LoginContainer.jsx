import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Tabs } from 'antd';
import PropTypes from 'prop-types';
import styles from './preLogin.scss';
import LoginForm from '../../components/PreLogin/LoginForm';
import RegisterForm from '../../components/PreLogin/RegisterForm';
const { TabPane } = Tabs;

class LoginContainer extends Component {
  static propTypes = {
    pageTab: PropTypes.string,
    changePreLoginPage: PropTypes.func,
  }
  constructor(props) {
    super(props);
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
              <LoginForm changePage={this.props.changePreLoginPage} />
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
  // pageTab: state.preLogin.get('pageTab'),
});

const mapDispatchToProps = (dispatch) => ({
  // changePreLoginPage: params => dispatch({type: CHANGE_PRELOGIN_PAGE_SAGA, payload: params}),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginContainer);
