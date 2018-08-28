import React, { Component } from 'react';
import moment from 'moment';
import { Route,Redirect, Switch,withRouter} from 'react-router-dom';
import {routerConfig} from '../../common/routerSetting';
import { menu } from '../../common/menu';
import styles from './style.scss';
import { connect } from 'react-redux';
import Login from '../Login/LoginLayout';
import PropTypes from 'prop-types';
import axios from 'axios';
import FixedHelper from '../../components/Common/FixedHelper/FixedHelper';
import { commonAction } from '../../constants/actionTypes/commonAction';
import TopMenu from '../../components/Layout/TopMenu';
import SideMenu from '../../components/Layout/SideMenu';
import Cookie from 'js-cookie';
console.log(Cookie.get('nothing'))
console.log(Cookie.get('authData'))
console.log(typeof Cookie.get('authData'))
console.log('bear' + "12113")
const params = "121211212"
console.log('bear params ' + params)
console.log(JSON.parse(Cookie.get('authData')))
console.log(typeof JSON.parse(Cookie.get('authData')))
console.log('bear ' + Cookie.get('authData').toString())

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
    if(authData !== 'undefined' && authData !== null) {
      this.props.getStations();
      this.props.getDeviceTypes();
    }
  }

  componentWillReceiveProps(nextProps) {
    const authData = Cookie.get('authData');
    if(moment().isBefore(Cookie.get('expireData'), 'second') 
    && (authData !== 'undefined' && authData !== null)
    && this.props.history.location.pathname === '/login'
    && Cookie.get('isNotLogin') === '0') {
      this.props.history.push('/');
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
    if(authData && (authData !== 'undefined' && authData !== null) && (moment().isBefore(Cookie.get('expireData'), 'second'))){
      axios.defaults.headers.common['Authorization'] = "bearer " + JSON.parse(authData);
    }
    if((moment().isBefore(Cookie.get('expireData'), 'second')) 
    && (authData !== 'undefined' && authData !== null) 
    && (isNotLogin === '0')){
    // if(true){
      return (
        <div className={styles.app}>
          <div className={styles.appHeader}>
            <div className={styles.headerLeft}>
              <div className={styles.logo}></div>
              <TopMenu setTopMenu={setTopMenu} topMenu={topMenu}  />
            </div>
            <div className={styles.headerRight}>
              <img width="294px" height="53px" src="/img/topbg02.png" className={styles.powerConfig} />
              
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
          <FixedHelper />
        </div>
      );
    }
    else{
      Cookie.remove('authData');
      Cookie.remove('expireData');
      Cookie.remove('isNotLogin');
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
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));