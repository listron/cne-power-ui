import React, { Component } from 'react';
import moment from 'moment';
import { message } from 'antd';
import { Route,Redirect, Switch,withRouter} from 'react-router-dom';
import {routerConfig} from '../../common/routerSetting';
import { menu } from '../../common/menu';
import styles from './style.scss';
import { connect } from 'react-redux';
import Login from '../Login/LoginLayout';
import PropTypes from 'prop-types';
import axios from 'axios';
// import FixedHelper from '../../components/Common/FixedHelper/FixedHelper'; 暂不实现。
import { commonAction } from '../../constants/actionTypes/commonAction';
import TopMenu from '../../components/Layout/TopMenu';
import SideMenu from '../../components/Layout/SideMenu';
import LogoInfo from '../../components/Layout/LogoInfo';
import UserInfo from '../../Components/Layout/UserInfo';
import Cookie from 'js-cookie';

class Main extends Component {
  static propTypes = {
    setTopMenu: PropTypes.func,
    getStations: PropTypes.func,
    getDeviceTypes: PropTypes.func,
    topMenu: PropTypes.object,
    login: PropTypes.object,
    history: PropTypes.object,
    enterpriseId: PropTypes.string,
    username: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      current: 'home',
      logined: false,
      showFeedback: false,
    };
  }

  componentDidMount(){//根据路径缓存topMenu值
    const { pathname } = this.props.history.location;
    let pathArray = pathname.split('/').filter(e=>!!e);
    const params = menu.find(e=>e.path===`/${pathArray[0]?pathArray[0]:''}`);
    this.props.setTopMenu({ topMenu: params });
    const authData = Cookie.get('authData');
    if(authData) {
      this.props.getStations();
      this.props.getDeviceTypes();
    }
  }

  componentWillReceiveProps(nextProps) {
    const authData = Cookie.get('authData');
    const refreshToken = Cookie.get('refresh_token');
    const isTokenValid = moment().isBefore(Cookie.get('expireData'), 'second');
    if(isTokenValid && authData && this.props.history.location.pathname === '/login'
    && Cookie.get('isNotLogin') === '0') {
      this.props.history.push('/');
    }
    if(authData && !isTokenValid && refreshToken){
      message.error('token已过期，请刷新页面重新登录后使用');
      // this.props.refreshToken({ 
      //   grant_type: 'refresh_token',
      //   refresh_token:refreshToken
      // })
    }
    if(nextProps.login.size > 0 && this.props.login.size === 0) {    
      this.props.getStations();
      this.props.getDeviceTypes();
    }
  }

  render() {
    const { setTopMenu, topMenu, } = this.props;
    const authData = Cookie.get('authData');
    const isNotLogin = Cookie.get('isNotLogin');
    const isTokenValid = moment().isBefore(Cookie.get('expireData'), 'second');
    if(authData && isTokenValid){
      axios.defaults.headers.common['Authorization'] = "bearer " + JSON.parse(authData);
    }
    if(isTokenValid && authData && (isNotLogin === '0')){
    // if(true){
      return (
        <div className={styles.app}>
          <div className={styles.appHeader}>
            <div className={styles.headerLeft}>
              <LogoInfo />
              <div className={styles.logo}></div>
              <TopMenu setTopMenu={setTopMenu} topMenu={topMenu}  />
            </div>
            <div className={styles.headerRight}>
              <img width="294px" height="53px" src="/img/topbg02.png" className={styles.powerConfig} />
              <UserInfo />
            </div>
          </div>
          <div className={styles.appMain}>
            {topMenu.children && topMenu.children.length > 0 && <SideMenu topMenu={topMenu} />}
            <div className={styles.content} id="main" >
              <Switch>
                {routerConfig}
                <Redirect to="/" />
              </Switch>
            </div>
          </div>
          {/* <FixedHelper /> */}
        </div>
      );
    }else{
      return (
        <Switch>
          <Route path="/login" excat component={Login} />
          <Redirect to="/login" />
        </Switch>  
      );
    }
  }
}

const mapStateToProps = (state) => ({
  login: state.login.get('loginData'),
  topMenu: state.common.get('topMenu')? state.common.get('topMenu').toJS() : {},
  enterpriseId: state.login.get('enterpriseId'),
  username: state.login.get('username'),
});

const mapDispatchToProps = (dispatch) => ({
  getStations: payload => dispatch({ type: commonAction.GET_STATIONS_SAGA, payload }),
  getDeviceTypes: payload => dispatch({ type: commonAction.GET_DEVICETYPES_SAGA, payload }),
  setTopMenu: payload => dispatch({ type: commonAction.CHANGE_COMMON_STORE_SAGA, payload }),
  // refreshToken: payload => dispatch({ type: commonAction.REFRESHTOKEN_SAGE, payload})
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));