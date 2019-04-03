import React, { Component } from 'react';
import { hot } from 'react-hot-loader/root';
import moment from 'moment';
import { message, Modal, Button,Spin } from 'antd';
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
import Loadable from 'react-loadable';

// import Monitor from '../Monitor/StationMonitor/AllStation/AllStation';

// axios.interceptors.request.use(config => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers['Authorization'] = `bearer ${token}`;
//   }
//   return config;
// })

// const Loading = ({ pastDelay, timedOut, error }) => {
//   if (pastDelay) {
//     return (<div className={styles.preComponent}>
//      <Spin size="large" tip="Loading..." />
//   </div>);
//   } else if (timedOut) {
//     return <div>Taking a long time...</div>;
//   } else if (error) {
//     return <div className={styles.preComponent}>Error! 请重新刷新页面</div>;
//   }
//   return null;
// };

import Login from '../Login/NewLogin/LoginContainer';
// const Agreement=Loadable({
//   loader: () => import('../../components/Login/Agreement'),
//   loading: Loading
// })
// const Contact=Loadable({
//   loader: () => import('../../components/Login/Contact'),
//   loading: Loading
// })

class Main extends Component {
  static propTypes = {
    loginInfoSaved: PropTypes.bool,
    getStations: PropTypes.func,
    getDeviceTypes: PropTypes.func,
    history: PropTypes.object,
    resetMonitorData: PropTypes.func,
    changeLoginStore: PropTypes.func,
    getMonitorDataUnit: PropTypes.func,
    resetLoginState: PropTypes.func,
  };

  componentDidMount() {
    console.log('did mount get')
    const { history } = this.props;
    const { pathname } = history.location;
    if (pathname !== '/login') { // 非登录页，检查登录凭证是否存在
      const token = localStorage.getItem('token');
      const expireData = localStorage.getItem('expireData');
      const isTokenValid = moment().isBefore(expireData, 'second');
      if ( token && isTokenValid) {
        axios.defaults.headers.common['Authorization'] = `bearer ${token}`;
        this.props.getStations();
        this.props.getDeviceTypes();
        this.props.getMonitorDataUnit(); // 请求企业的数据单位
      }
      // else {
      //   history.push('/login')
      // }
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps)
  //   const { history, loginInfoSaved } = this.props;
  //   const { pathname } = history.location;
  //   if (pathname === '/login' && !loginInfoSaved && nextProps.loginInfoSaved) { // 登录成功
  //     this.props.getStations();
  //     this.props.getDeviceTypes();
  //     this.props.getMonitorDataUnit();
  //   }
  }

  componentWillUnmount() {
    console.log('main page unmount')
    this.props.resetMonitorData();
  }

  checkLoginSuccess = () => { // 基于本地存储信息判定是否登录成功
    try {
      const token = localStorage.getItem('token')
      const expireData = localStorage.getItem('expireData')
      const isTokenValid = moment().isBefore(expireData, 's');
      if (token && isTokenValid) {
        return {
          token,
          loginSuccess: true
        }; // 登录成功
      }
    } catch (err) {
      console.log(err)
    }
    return {
      loginSuccess: false
    };
  }

  // logout = () => { // 删除登录凭证并退出。
  // //   Cookie.remove('authData');
  // //   Cookie.remove('enterpriseName');
  // //   Cookie.remove('enterpriseLogo');
  // //   Cookie.remove('userId');
  // //   Cookie.remove('userFullName');
  // //   Cookie.remove('userLogo');
  // //   Cookie.remove('expireData');
  // //   Cookie.remove('refresh_token');
  // //   Cookie.remove('isNotLogin');
  // //   Cookie.remove('auto');
  // //   Cookie.remove('userRight');
  // //   Cookie.remove('rightMenu');
  //   this.props.resetMonitorData();
  //   this.props.resetLoginState();
  //   localStorage.clear();
  // }

  render() {
    const { changeLoginStore, history, resetMonitorData } = this.props;
    const userRight = localStorage.getItem('userRight');
    const rightMenu = localStorage.getItem('rightMenu');
    const { loginSuccess, token } = this.checkLoginSuccess();
    console.log('main render')
    if (loginSuccess) {
      axios.defaults.headers.common['Authorization'] = 'bearer ' + JSON.parse(token);
    }
    if (loginSuccess) {
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
              <UserInfo changeLoginStore={changeLoginStore} resetMonitorData={resetMonitorData} />
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
          <Route path="/login" exact component={Login} />
          {/* <Route path="/userAgreement" exact component={Agreement} />
          <Route path="/contactUs" exact component={Contact} /> */}
          <Redirect to="/login" />
        </Switch>
      );
    }
  }
}

const mapStateToProps = (state) => ({
  ...state.login.toJS()
})

const mapDispatchToProps = (dispatch) => ({
  getStations: payload => dispatch({ type: commonAction.getStations, payload }),
  getDeviceTypes: payload => dispatch({ type: commonAction.getDeviceTypes, payload }),
  getMonitorDataUnit: payload => dispatch({ type: commonAction.getMonitorDataUnit, payload }),
  changeLoginStore: params => dispatch({ type: loginAction.CHANGE_LOGIN_STORE_SAGA, params }),
  resetMonitorData: params => dispatch({ type: allStationAction.resetMonitorData, params }),
  resetLoginState: params => dispatch({ type: loginAction.RESET_LOGIN_STORE_SAGA, params }),
  // refreshToken: payload => dispatch({ type: commonAction.REFRESHTOKEN_SAGA, payload})
});


export default hot(withRouter(connect(mapStateToProps, mapDispatchToProps)(Main)));