import React, { Component } from 'react';
import { RouteWithSubRoutes } from '../../router';
import { Link, Route, BrowserRouter,HashRouter,Redirect, Switch } from 'react-router-dom';
import { Menu, Icon } from 'antd';
import { routes } from '../../router';
import {routerConfig} from '../../common/routerSetting';
import Loadable from 'react-loadable';
import styles from './style.scss';
import Power from '../Power';
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
    return (
      <HashRouter>
        <div className={styles.app}>
          <div className={styles.appHeader}>
            <div className={styles.headerLeft}>
              <div className={styles.logo}></div>
            </div>
            <Menu onClick={this.handleClick} selectedKeys={[this.state.current]} mode="horizontal" theme="dark" className={styles.headerMenu}>
              <Menu.Item key="home" className={styles.menuItem}>
                <span className="iconfont icon-home" />
                <Link to="/">首页</Link>
              </Menu.Item>
              <Menu.Item key="power" className={styles.menuItem}>               
                <span className="iconfont icon-eye" />
                <Link to="/power">电站管理</Link>      
              </Menu.Item>
            </Menu>
          </div>
          <div className={styles.content}>
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
              <Redirect to="/" />
            </Switch>
          </div>
        </div>
      </HashRouter>
    );
  }

  // render() {
  //   return this.props.routes.map((route, i) => (
  //       <RouteWithSubRoutes key={i} {...route}/>
  //   ));
  // }
}

export default Main;