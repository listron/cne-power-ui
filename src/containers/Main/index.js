import React, { Component } from 'react';
import { Link, Route,Redirect, Switch,withRouter} from 'react-router-dom';
import { Menu } from 'antd';
import {routerConfig} from '../../common/routerSetting';
import Loadable from 'react-loadable';
import { connect } from 'react-redux';
import './style.scss';
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
    if(this.state.logined || getCookie('phone')){
      console.log(this.props)
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
                <Redirect to="/" />
              </Switch>
            </div>
          </div>
      );
    }
    else{
      return (
        <Switch>
          <Route path='/login' excat component={Login}/>
          <Route path='/forget' excat component={Forget}/>
          <Route path='/signup' excat component={Signup}/>
          <Redirect to="/login" />
        </Switch>  
      )
    }
  }
}

const mapStateToProps = (state) => ({
  login:state.login.login
});

export default withRouter(connect(mapStateToProps)(Main));