import React, { Component } from 'react';
import { Route,Redirect, Switch,withRouter} from 'react-router-dom';
import {routerConfig} from '../../common/routerSetting';
import Loadable from 'react-loadable';
import styles from './style.scss';
import { connect } from 'react-redux';
import {getCookie} from '../../utils/index.js'
import Login from '../Login';
import Forget from '../Forget';
import Signup from '../Signup';
import NotFund from '../Exception/404';
import PropTypes from 'prop-types';

import TopMenu from '../../components/Layout/Topmenu'
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
      return (
        <div className={styles.app}>
          <div className={styles.appHeader}>
            <div className={styles.headerLeft}>
              <div className={styles.logo}></div>
            </div>
            <TopMenu />
          </div>
          <div className={styles.content}>
            <Switch>
              {routerConfig.map(e=>{
                let Component = Loadable(e.component)
                return (
                  <Route 
                    key={e.path} 
                    path={e.path} 
                    exact={e.exact} 
                    render={(props)=>{
                      return <Component {...props} />
                    }}
                  />
                );
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
Main.propTypes = {
  login: PropTypes.object,
  history: PropTypes.object,
};
const mapStateToProps = (state) => ({
  login: state.login
});

export default withRouter(connect(mapStateToProps)(Main));