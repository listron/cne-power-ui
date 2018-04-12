import React, { Component } from 'react';
import { Link, Route, BrowserRouter,HashRouter,Redirect, Switch } from 'react-router-dom';
import { Menu, Icon } from 'antd';
import classnames from 'classnames';
import { routerConfig } from '../../common/routerSetting';
import Loadable from 'react-loadable';
import styles from './style.scss';
import Power from '../Power';
import TopMenu from '../../components/Layout/Topmenu'
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
            <TopMenu/>
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
}

export default Main;