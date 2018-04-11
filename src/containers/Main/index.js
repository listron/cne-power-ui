import React, { Component } from 'react';
import { RouteWithSubRoutes } from '../../router';
import { Link, Route, BrowserRouter,HashRouter,Redirect, Switch } from 'react-router-dom';
import { Menu, Icon } from 'antd';
import classnames from 'classnames';
import { routes } from '../../router';
import {routerConfig} from '../../common/routerSetting';
import Loadable from 'react-loadable';
import './style.scss';
import {getCookie} from '../../utils/utils.js'
import Power from '../Power';
import Login from '../Login';

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 'home'
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    this.setState({
      current: e.key
    });
  }

  render() {
    if(getCookie('phone')){
      return (
        <HashRouter>
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
                {routerCofig.map(e=>{
                  let Component = Loadable(e.component)
                  return <Route 
                    key={e.path} 
                    path={e.path} 
                    exact={e.exact} 
                    render={(props)=>{
                      console.log(props)
                      return <Component {...props}/>
                    }}
                  />
                })}
                <Redirect to="/" />
              </Switch>
            </div>
            <Menu onClick={this.handleClick} selectedKeys={[this.state.current]} mode="horizontal" theme="dark" className={styles.headerMenu}>
              <Menu.Item key="home" className={styles.menuItem}>
                <span className={classnames("iconfont icon-home", styles.icon)} />
                <Link to="/">首页</Link>
              </Menu.Item>
              <Menu.Item key="power" className={styles.menuItem}>               
                <span className={classnames("iconfont icon-eye", styles.icon)} />
                <Link to="/power">电站管理</Link>      
              </Menu.Item>
            </Menu>
          </div>
        </HashRouter>
      );
    }else{
      return (
        <HashRouter>        
          <Login />
        </HashRouter>          
      )
    }
  }

  // render() {
  //   return this.props.routes.map((route, i) => (
  //       <RouteWithSubRoutes key={i} {...route}/>
  //   ));
  // }
}

export default Main;