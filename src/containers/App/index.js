import React, { Component } from 'react';
import { RouteWithSubRoutes } from '../../router';
import { Link, Route, BrowserRouter, Switch } from 'react-router-dom';
import { Menu, Icon } from 'antd';
import { routes } from '../../router';
import './style.scss';
import Power from '../Power';

class App extends Component {
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
      <BrowserRouter>
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
              <Route path="/" exact component={Power} />
              <Route path="/power" exact component={Power} />
            </Switch>
          </div>
        </div>
      </BrowserRouter>
    );
  }

  // render() {
  //   return this.props.routes.map((route, i) => (
  //       <RouteWithSubRoutes key={i} {...route}/>
  //   ));
  // }
}

export default App;