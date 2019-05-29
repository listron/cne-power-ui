import React, { Component, lazy, Suspense } from 'react';
import { hot } from 'react-hot-loader/root';
import moment from 'moment';
import { message, Modal, Button, Spin } from 'antd';
import { Route, Redirect, Switch, withRouter } from 'react-router-dom';
import { routerConfig } from '../../common/routerSetting';
import styles from './style.scss';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
// import FixedHelper from '../../components/Common/FixedHelper/FixedHelper'; 暂不实现。
import { commonAction } from '../alphaRedux/commonAction';
import { loginAction } from '../Login/loginAction';
import { allStationAction } from '../Monitor/StationMonitor/AllStation/allStationAction';
import TopMenu from '../../components/Layout/TopMenu';
import SideMenu from '../../components/Layout/SideMenu';
import LogoInfo from '../../components/Layout/LogoInfo';
import UserInfo from '../../components/Layout/UserInfo';
import Cookie from 'js-cookie';
// import Loadable from 'react-loadable';

const Login = lazy(() => import('../Login/LoginLayout'));

class Main extends Component {
  static propTypes = {
    userFullName: PropTypes.string,
    userLogo: PropTypes.string,
    username: PropTypes.string,
    getStations: PropTypes.func,
    getDeviceTypes: PropTypes.func,
    login: PropTypes.object,
    history: PropTypes.object,
    enterpriseId: PropTypes.string,
    changeLoginStore: PropTypes.func,
    getMonitorDataUnit: PropTypes.func,
    resetCommonStore: PropTypes.func,
    resetMonitorData: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      current: 'home',
      logined: false,
      showFeedback: false,
    };
  }

  componentDidMount() {
    const { pathname } = this.props.history.location;
    if (pathname !== '/login') {
      const authData = Cookie.get('authData');
      if (authData) {
        this.props.getStations();
        this.props.getDeviceTypes();
        //请求企业的数据单位
        this.props.getMonitorDataUnit();
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const authData = Cookie.get('authData');
    const refreshToken = Cookie.get('refresh_token');
    const isTokenValid = moment().isBefore(Cookie.get('expireData'), 'second');
    if (isTokenValid && authData && this.props.history.location.pathname === '/login'
      && Cookie.get('isNotLogin') === '0') {
      this.props.history.push('/monitor/station');
    }
    if (authData && !isTokenValid && refreshToken) {
      message.error('token已过期，请刷新页面重新登录后使用');
      // this.props.refreshToken({ 
      //   grant_type: 'refresh_token',
      //   refresh_token:refreshToken
      // })
    }
    if (nextProps.login.size > 0 && this.props.login.size === 0) {
      this.props.getStations();
      this.props.getDeviceTypes();
      this.props.getMonitorDataUnit();
    }
  }
  componentWillUnmount() {
    this.props.resetMonitorData();
    this.props.resetCommonStore();
  }

  logout = () => { // 删除登录凭证并退出。
    Cookie.remove('authData');
    Cookie.remove('enterpriseId');
    Cookie.remove('enterpriseName');
    Cookie.remove('enterpriseLogo');
    Cookie.remove('userId');
    Cookie.remove('username');
    Cookie.remove('userFullName');
    Cookie.remove('userLogo');
    Cookie.remove('expireData');
    Cookie.remove('refresh_token');
    Cookie.remove('isNotLogin');
    Cookie.remove('auto');
    Cookie.remove('userRight');
    Cookie.remove('rightMenu');
    this.props.resetMonitorData();
    this.props.resetCommonStore();
    this.props.changeLoginStore({ pageTab: 'login' });
    this.props.history.push('/login');
  }

  render() {
    const { changeLoginStore, history, resetMonitorData, userFullName, username, userLogo, resetCommonStore } = this.props;
    // const authData = Cookie.get('authData') || null;
    const authData = localStorage.getItem('authData') || null;
    const isNotLogin = Cookie.get('isNotLogin');
    const userRight = Cookie.get('userRight');
    const rightMenu = Cookie.get('rightMenu');
    const isTokenValid = moment().isBefore(Cookie.get('expireData'), 'second');
    if (authData && isTokenValid) {
      // axios.defaults.headers.common['Authorization'] = "bearer " + JSON.parse(authData);
      axios.defaults.headers.common['Authorization'] = "bearer " + authData;
    }
    if (isTokenValid && authData && (isNotLogin === '0')) {
      // if(true){
      const homePageArr = ['/homepage'];
      const isHomePage = homePageArr.includes(history.location.pathname); // 首页不同的解析规则
      return (
        <div className={styles.app}>
          {!isHomePage && <div className={styles.appHeader}>
            <div className={styles.headerLeft}>
              <LogoInfo />
              <div className={styles.logo}></div>
              <TopMenu />
            </div>
            <div className={styles.headerRight}>
              <img width="294px" height="53px" src="/img/topbg02.png" className={styles.powerConfig} />
              <UserInfo
                username={username}
                userFullName={userFullName}
                userLogo={userLogo}
                changeLoginStore={changeLoginStore}
                resetMonitorData={resetMonitorData}
                resetCommonStore={resetCommonStore}
              />
            </div>
          </div>}
          <div className={styles.appMain}>
            {!isHomePage && <SideMenu />}
            <main className={styles.content} style={{ height: isHomePage ? '100vh' : 'calc(100vh - 59px)' }} id="main" >
              <Switch>
                {routerConfig}
                <Redirect to="/monitor/station" />
              </Switch>
            </main>
          </div>
          {/* <FixedHelper /> */}
          <Modal
            title=""
            visible={!userRight && !rightMenu}
            closable={false}
            footer={null}
            wrapClassName={styles.userRightTip}
          >
            <p>对不起，您的用户角色尚未设置，请联系管理员进行设置！</p>
            <Button onClick={this.logout} className={styles.exitSystem} >退出系统</Button>
          </Modal>
        </div>
      );
    } else {
      return (
        <Switch>
          <Route path="/login" exact render={() => (
            <Suspense fallback={
              <div className={styles.preComponent}>
                  <Spin size="large" tip="Loading..." />
              </div>}
            >
              <Login {...this.props} />
            </Suspense>)}
          />
          <Redirect to="/login" />
        </Switch>
      );
    }
  }
}

const mapStateToProps = (state) => {
  return ({
    login: state.login.get('loginData'),
    enterpriseId: state.login.get('enterpriseId'),
    username: state.common.get('username'),
    userFullName: state.common.get('userFullName'),
    userLogo: state.common.get('userLogo'),
  });
}

const mapDispatchToProps = (dispatch) => ({
  getStations: payload => dispatch({ type: commonAction.getStations, payload }),
  getDeviceTypes: payload => dispatch({ type: commonAction.getDeviceTypes, payload }),
  getMonitorDataUnit: payload => dispatch({ type: commonAction.getMonitorDataUnit, payload }),
  changeLoginStore: params => dispatch({ type: loginAction.CHANGE_LOGIN_STORE_SAGA, params }),
  resetMonitorData: params => dispatch({ type: allStationAction.resetMonitorData, params }),
  resetCommonStore: params => dispatch({ type: commonAction.resetCommonStore, params }),
  // refreshToken: payload => dispatch({ type: commonAction.REFRESHTOKEN_SAGA, payload})
});

export default hot(withRouter(connect(mapStateToProps, mapDispatchToProps)(Main)));
