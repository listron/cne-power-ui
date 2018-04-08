import React, { Component } from 'react';
import { HashRouter, Switch, Route, Redirect, Link } from 'react-router-dom';

import Sider from '../../components/Power/Sider';

import { Menu, Icon } from 'antd';
import styles from './style.scss';
const SubMenu = Menu.SubMenu;

class Power extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
        <div className={styles.power} >
          <Sider />
          <div className={styles.powerRight}>
            {/* <Menu mode="horizontal">
              <SubMenu title={<span><Icon type="user" />{this.state.username}</span>}>
                <Menu.Item key="setting:1">退出</Menu.Item>
              </SubMenu>
            </Menu> */}
            <div className={styles.content}>
                this is page of power! 
                DO NOT CALL ME ROUTER! WILL TAKES ERROR WHEN BUILD!
            </div>
          </div>
        </div>
    );
  }
}

/* const UserSubLayout = (props) => {
    return (
        <div className="user-sub-layout">
            <h1 style={{marginBottom: '10px'}}>请参考博文： <a href="http://www.jianshu.com/p/bf6b45ce5bcc">React Router 4：痛过之后的豁然开朗</a></h1>
            <aside>
                <UserNav />
            </aside>
            <div className="primary-content">
                <Switch>
                    <Route path={props.match.path} exact component={BrowseUserTable} />
                    <Route path={`${props.match.url}/:userId`} component={UserProfilePage} />
                </Switch>
            </div>
        </div>
    )
}


const UserComments = ({ match }) => {
    return <div>UserId: {match.params.userId}</div>
}

const UserSettings = ({ match }) => {
    return <div>UserId: {match.params.userId}</div>
}

const UserProfilePage = ({ match }) => {
    return (
        <div>
            User Profile:
      <Route path={`${match.url}/comments`} component={UserComments} />
            <Route path={`${match.path}/settings`} component={UserSettings} />
        </div>
    )
}


const UserNav = () => (
    <div>User Nav</div>
)

const BrowseUserTable = ({ match }) => {
    return (
        <ul>
            <li><Link to={`${match.path}/comments`}>comments</Link></li>
            <li><Link to={`${match.path}/settings`}>settings</Link></li>
        </ul>
    )
}

const UserProfile = ({ userId }) => <div>User: {userId}</div>; */

export default Power;