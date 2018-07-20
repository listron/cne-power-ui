import React, { Component } from 'react';
import { Route,Redirect, Switch,withRouter} from 'react-router-dom';
import {routerConfig} from '../../common/routerSetting';
import { menu } from '../../common/menu';
import styles from './style.scss';
import { connect } from 'react-redux';
import {getCookie} from '../../utils/index.js'
import Login from '../Login/LoginLayout';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Icon } from 'antd';

import { CommonAction } from '../../constants/actionTypes/commonAction';

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
      logined: false,
      isScroll: false,
      showFeedback: false,
    };
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount(){//根据路径缓存topMenu值
    const { pathname } = this.props.history.location;
    let pathArray = pathname.split('/').filter(e=>e);
    const params = menu.find(e=>e.path===`/${pathArray[0]?pathArray[0]:''}`);
    this.props.setTopMenu(params);
    if(this.refs.main) {
      this.refs.main.addEventListener('scroll', this.onScroll);
    }
  }


  componentWillReceiveProps(nextProps) {  
    if(nextProps.login.get('loginSuccess') && !this.props.login.get('loginSuccess')){
      this.props.history.push('/');
      this.setState({
        logined:true
      })
    }
  }

  componentWillUnmount() {
    if(this.refs.main) {
      this.refs.main.removeEventListener('scroll', this.onScroll);
    }
  }


  onScroll = () => {
    let isScroll = this.refs.main.scrollTop > 0;
    this.setState({
      isScroll
    });
  }

  handleClick(e) {
    this.setState({
      current: e.key
    });
  }

  renderFeedback() {

  }


  render() {
    const { setTopMenu, topMenu } = this.props;
    const authData = getCookie('authData');
    if(authData && (authData !== 'undefined' && authData !== null)){
      axios.defaults.headers.common['Authorization'] = "bearer " + JSON.parse(authData).access_token;
      console.log(authData);
    }
    if(this.state.logined || (authData !== 'undefined' && authData !== null)){
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
            <div className={styles.content} ref="main">
              <Switch>
                {routerConfig}
                <Redirect to="/" />
              </Switch>
            </div>
          </div>
          <div className={styles.appFloat} style={{height: this.state.isScroll ? 140 : 105}}>
            <div className={styles.floatItem}><Icon type="android-o" /></div>
            <div className={styles.floatItem}><Icon type="apple-o" /></div>
            <div className={styles.floatItem}><Icon type="wechat" /></div>
            {this.state.isScroll && 
            <div className={styles.floatItem}><Icon type="up-circle-o" /></div>}
          </div>
          {this.renderFeedback()}
        </div>
      );
    }
    else{
      return (
        <Switch>
          <Route path="/login" excat component={Login} />
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
  setTopMenu: params => dispatch({ type: CommonAction.GET_TOPMENU_CHANGE_SAGA, params }),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));