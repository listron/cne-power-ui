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
import { commonAction } from '../alphaRedux/commonAction';
import { loginAction } from '../Login/loginAction';
import { allStationAction } from '../Monitor/StationMonitor/AllStation/allStationAction';
import AppHeader from '../../components/Layout/AppHeader';
import SideMenu from '../../components/Layout/SideMenu';
import Cookie from 'js-cookie';
import { enterFirstPage } from '../../utils/utilFunc';
import { hasTokenToQuery, appRenderType, renderWithoutMenu } from './authToken';

const Login = lazy(() => import('../Login/LoginLayout'));

class Main extends Component {
  static propTypes = {
    screenAddress: PropTypes.string,
    userFullName: PropTypes.string,
    userLogo: PropTypes.string,
    username: PropTypes.string,
    getStations: PropTypes.func,
    getDeviceTypes: PropTypes.func,
    login: PropTypes.object,
    history: PropTypes.object,
    enterpriseId: PropTypes.string,
    stationTypeCount: PropTypes.string,
    menuBoardShow: PropTypes.bool,
    menuBoardRequired: PropTypes.array,
    changeLoginStore: PropTypes.func,
    getMonitorDataUnit: PropTypes.func,
    resetCommonStore: PropTypes.func,
    resetMonitorData: PropTypes.func,
    changeCommonStore: PropTypes.func,
    theme: PropTypes.string,
  };

  componentDidMount() {
    const { pathname = '', search = '' } = this.props.history.location;
    const hasToken = hasTokenToQuery({ pathname, search });
    hasToken && this.getInitData(true); // F5或外系统携凭证跳入本系统
  }

  componentWillReceiveProps(nextProps) {
    const authData = localStorage.getItem('authData') || '';
    const refreshToken = Cookie.get('refresh_token');
    const isTokenValid = Cookie.get('expireData') && moment().isBefore(new Date(Cookie.get('expireData')), 'second');
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
    if (nextProps.login.size > 0 && this.props.login.size === 0) { // 登录成功
      this.getInitData(false);
    }
  }

  getInitData = (isLogined) => { // 具有登录凭证 - 进行默认数据初始化(todo - 该逻辑与结构不相关，放置saga解耦更合适)
    this.props.getStations(); // 请求用户下所有电站基本信息
    this.props.getDeviceTypes(); // 请求用户下所有设备类型数据
    this.props.getMonitorDataUnit(); // 请求企业的数据单位
    axios.get('/menuBoardRequired.json').then((req) => { // 根据企业判定是否展示菜单遮罩
      const { data } = req || {};
      const { menuBoardRequired, screenAddress } = data || {};
      const enterpriseId = Cookie.get('enterpriseId');
      const menuBoardShow = isLogined ? false : menuBoardRequired.includes(enterpriseId); // isLogined已登录完成的刷新, 不需展示快捷面板
      this.props.changeCommonStore({ menuBoardShow, menuBoardRequired, screenAddress });
    });
  }

  changeTheme = (themeValue) => {
    Cookie.set('theme', themeValue);
    this.props.changeCommonStore({ theme: themeValue });
  }

  logout = () => { // 删除登录凭证并退出。
    Cookie.remove('authData'); // 这一堆cookie看着都烦。有空赶紧进行集合+优化。
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
    // Cookie.remove('theme');
    this.props.resetMonitorData();
    this.props.resetCommonStore();
    this.props.changeLoginStore({ pageTab: 'login' });
    this.props.history.push('/login');
  }

  render() {
    const { history, theme, stationTypeCount } = this.props;
    const { location } = history || {};
    const userRight = localStorage.getItem('rightHandler');
    const rightMenu = localStorage.getItem('rightMenu') || '';
    const layoutRenderKey = appRenderType(location); // 是否渲染界面
    const hideLayoutMenu = renderWithoutMenu(location); // 渲染界面内是否有顶部及侧边菜单
    if (layoutRenderKey) {
      // if(true){
      return (
        <div className={`${styles.app} ${styles[theme]}`}>
          {!hideLayoutMenu && <AppHeader {...this.props} />}
          <div className={styles.appMain}>
            {!hideLayoutMenu && <SideMenu stationTypeCount={stationTypeCount} />}
            <main
              className={`${styles.content} ${styles[theme]}`}
              style={{ height: hideLayoutMenu ? '100vh' : 'calc(100vh - 40px)' }}
              id="main"
            >
              <Switch>
                {routerConfig}
                <Redirect to={enterFirstPage()} />
              </Switch>
            </main>
          </div>
          <Modal
            title=""
            visible={!userRight && !rightMenu && layoutRenderKey !== 'outside'}
            closable={false}
            footer={null}
            wrapClassName={styles.userRightTip}
          >
            <p>对不起，您的用户角色尚未设置，请联系管理员进行设置！</p>
            <Button onClick={this.logout} className={styles.exitSystem} >退出系统</Button>
          </Modal>
        </div>
      );
    }
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

const mapStateToProps = (state) => {
  return ({
    login: state.login.get('loginData'),
    enterpriseId: state.login.get('enterpriseId'),
    ...state.common.toJS(),
    theme: state.common.get('theme'),
  });
};

const mapDispatchToProps = (dispatch) => ({
  getStations: payload => dispatch({ type: commonAction.getStations, payload }),
  getDeviceTypes: payload => dispatch({ type: commonAction.getDeviceTypes, payload }),
  getMonitorDataUnit: payload => dispatch({ type: commonAction.getMonitorDataUnit, payload }),
  changeLoginStore: params => dispatch({ type: loginAction.CHANGE_LOGIN_STORE_SAGA, params }),
  resetMonitorData: params => dispatch({ type: allStationAction.resetMonitorData, params }),
  resetCommonStore: params => dispatch({ type: commonAction.resetCommonStore, params }),
  changeCommonStore: payload => dispatch({ type: commonAction.CHANGE_COMMON_STORE, payload }),
  // refreshToken: payload => dispatch({ type: commonAction.REFRESHTOKEN_SAGA, payload})
});

export default hot(withRouter(connect(mapStateToProps, mapDispatchToProps)(Main)));


