import React, { Component } from 'react';
import { Route,Redirect, Switch,withRouter} from 'react-router-dom';
import {routerConfig} from '../../common/routerSetting';
import { menu } from '../../common/menu';
import styles from './style.scss';
import { connect } from 'react-redux';
import {getCookie} from '../../utils/index.js'
import Login from '../Login';
import Forget from '../Forget';
import Signup from '../Signup';
import NotFund from '../Exception/404';
import PropTypes from 'prop-types';
import axios from 'axios';

import { GET_TOPMENU_CHANGE_SAGA } from '../../constants/actionTypes/commonAction';

import TopMenu from '../../components/Layout/TopMenu';
import SideMenu from '../../components/Layout/SideMenu';

class Main extends Component {
  static propTypes = {
    setTopMenu: PropTypes.func,
    topMenu: PropTypes.object,
    login: PropTypes.object,
    history: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      current: 'home',
      logined:false
    };
    this.handleClick = this.handleClick.bind(this);
  }
  componentDidMount(){//根据路径缓存topMenu值
    const { pathname } = this.props.history.location;
    let pathArray = pathname.split('/').filter(e=>e);
    const params = menu.find(e=>e.path===`/${pathArray[0]?pathArray[0]:''}`);
    this.props.setTopMenu(params);
  }

  componentWillReceiveProps(nextProps) {   
    if(nextProps.login.fetched && !this.props.login.fetched){
      this.props.history.push('/');
      this.setState({
        logined:true
      })
    }
  }

  handleClick(e) {
    this.setState({
      current: e.key
    });
  }

  render() {
    const { setTopMenu, topMenu } = this.props;
    const authData = getCookie('authData');
    if (authData && authData.length) {
      axios.defaults.headers.common['Authorization'] = "bearer " + JSON.parse(authData).access_token;
    }
    if(this.state.logined || getCookie('authData')){
      return (
        <div className={styles.app}>
          <div className={styles.appHeader}>
            <div className={styles.headerLeft}>
              <div className={styles.logo}></div>
            </div>
            <TopMenu setTopMenu={setTopMenu} />
          </div>
          <div className={styles.appMain}>
            <SideMenu topMenu={topMenu} />
            <div className={styles.content}>
              <Switch>
                {routerConfig}
                <Redirect to="/" />
              </Switch>
            </div>
          </div>
        </div>
      );
    }
    else{
      return (
        <Switch>
          <Route path="/login" excat component={Login} />
          <Route path="/forget" excat component={Forget} />
          <Route path="/signup" excat component={Signup} />
          <Route path="/404" excat component={NotFund} />          
          <Redirect to="/login" />
        </Switch>  
      );
    }
  }
}

const mapStateToProps = (state) => ({
  login: state.login,
  topMenu: state.common.get('topMenu')? state.common.get('topMenu').toJS() : {},
});

const mapDispatchToProps = (dispatch) => ({
  setTopMenu: params => dispatch({ type: GET_TOPMENU_CHANGE_SAGA, params }),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));