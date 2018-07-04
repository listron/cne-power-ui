import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Tabs } from 'antd';
import PropTypes from 'prop-types';
import styles from './preLogin.scss'
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
          <span onClick={()=>this.changePage('register')}>加入企业</span>
        </div>
        登录页面!!!!!
        <div className={styles.loginContent}>
          <Tabs onChange={this.changePage} animated={false} activeKey={pageTab}>
            <TabPane tab="登录" key="login">Content of Tab Pane 1</TabPane>
            <TabPane tab="注册" key="register">Content of Tab Pane 2</TabPane>
          </Tabs>
          <input placeholder={'账户/邮箱/用户名'} />
          <input placeholder={'请输入密码'} />
        </div>
        <Button type={'primary'} onClick={()=>this.changePage('register')} > 注册企业 </Button>
        <Button type={'primary'} onClick={()=>this.changePage('joinIn')}> 加入企业 </Button>
        <Button type={'primary'} onClick={()=>this.changePage('forget')}> 忘记密码 </Button>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  // pageTab: state.preLogin.get('pageTab'),
});

const mapDispatchToProps = (dispatch) => ({
  // changePreLoginPage: parmas => dispatch({type: CHANGE_PRELOGIN_PAGE_SAGA, payload: parmas}),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginContainer);
