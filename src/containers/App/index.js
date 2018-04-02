import React, { Component } from 'react';
import { RouteWithSubRoutes } from '../../router';
import { Link, Route, BrowserRouter, Switch } from 'react-router-dom';
import { Menu, Icon } from 'antd';
import { routes } from '../../router';
import './style.scss';
import Asset from '../Asset';

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
            <Menu onClick={this.handleClick} selectedKeys={[this.state.current]} mode="horizontal" theme="dark">
              <Menu.Item key="home">
                <span className="icon-home" />
                <Link to="/">首页</Link>
              </Menu.Item>
              <Menu.Item key="asset">
                <span className="icon-asset" />
                <Link to="/asset">资产</Link>
              </Menu.Item>
            </Menu>
          </div>
          <div className="pv-app-content">
            <Switch>
              <Route path="/" exact component={Asset} />
              <Route path="/asset" exact component={Asset} />
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