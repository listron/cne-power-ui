import React, { Component } from 'react';
import { RouteWithSubRoutes } from '../../router';
import {hashHistory} from 'React-router'; 
import { Link, Route, BrowserRouter,HashRouter,Redirect, Switch,withRouter} from 'react-router-dom';
import { Menu, Icon } from 'antd';
import classnames from 'classnames';
import { routes } from '../../router';
import {routerConfig} from '../../common/routerSetting';
import Loadable from 'react-loadable';
import { connect } from 'react-redux';
import PropTypes from "prop-types";

import './style.scss';
import styles from './style.scss';
import {getCookie} from '../../utils/index.js'
import Power from '../Power';
import Login from '../Login';
import Forget from '../Forget';
import Signup from '../Signup';

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 'home',
      logined:false
    };
    this.handleClick = this.handleClick.bind(this);
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.login.fetched){
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
    if(this.state.logined){
      return (
          <div className="pv-app">
            <div className="pv-app-header">
              <div className="pv-app-header-left">
                <div className="pv-app-header-logo"></div>
                <Menu onClick={this.handleClick} selectedKeys={[this.state.current]} mode="horizontal" theme="dark">
                  <Menu.Item key="home" className="pv-app-header-menu">
                    <span className="iconfont icon-home" />
                    <Link to="/">首页</Link>
                  </Menu.Item>
                  <Menu.Item key="power" className="pv-app-header-menu">               
                    <span className="iconfont icon-eye" />
                    <Link to="/power">电站管理</Link>      
                  </Menu.Item>
                </Menu>
              </div>
            </div>
            <div className="pv-app-content">
              <Switch>
                {routerConfig.map(e=>{
                  let Component = Loadable(e.component)
                  return <Route 
                    key={e.path} 
                    path={e.path} 
                    exact={e.exact} 
                    render={(props)=>{
                      return <Component {...props}/>
                    }}
                  />
                })}
                <Redirect to="/page2" />
              </Switch>
            </div>
          </div>
      );
    }else{
      return (
        <Login />         
      )
    }
  }

  // render() {
  //   return this.props.routes.map((route, i) => (
  //       <RouteWithSubRoutes key={i} {...route}/>
  //   ));
  // }
}

const mapStateToProps = (state) => ({
  login:state.login.login
});

export default withRouter(connect(mapStateToProps)(Main));