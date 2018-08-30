import React, { Component } from 'react';
import { Dropdown, Menu, Icon } from 'antd';
import { withRouter } from 'react-router-dom'
import Cookie from 'js-cookie';
import PropTypes from 'prop-types';
import styles from './userLogo.scss';

class UserInfo extends Component{
  static propTypes = {
    history: PropTypes.object,
  }

  constructor(props){
    super(props)
  }

  editPassword = () => {
    this.props.history.push('/hidden/user/editPassword');
  }

  logout = () => { // 删除登录凭证并退出。
    Cookie.remove('authData');
    Cookie.remove('enterpriseId');
    Cookie.remove('enterpriseName');
    Cookie.remove('enterpriseLogo');
    Cookie.remove('userId');
    Cookie.remove('username');
    Cookie.remove('userLogo');
    Cookie.remove('expireData');
    Cookie.remove('refresh_token');
    Cookie.remove('isNotLogin');
    this.props.history.push('/login');
  }

  render(){
    const username = Cookie.get('username');
    const userLogo = Cookie.get('userLogo');
    const defaultUserLogo = username && username[0];
    const DropdowMenu = (
      <Menu className={styles.layoutUserDropdown}>
        <Menu.Item className={styles.innerItem} onClick={this.editPassword}>
          修改密码
        </Menu.Item>
        <Menu.Item className={styles.innerItem} onClick={this.logout}>
          退出登录
        </Menu.Item>
      </Menu>
    );
    return (
      <div className={styles.layoutUser}>
        <Dropdown overlay={DropdowMenu}>
          <span className={styles.layoutUserContent}>
            {userLogo && <img width="30px" height="30px" src={userLogo} />}
            {!userLogo && <span className={styles.userLogo}>{defaultUserLogo}</span>}
            <span className={styles.username}>{username}</span>
            <Icon type="down" className={styles.downIcon} />
          </span>
        </Dropdown>
      </div>
    )
  }
}

export default withRouter(UserInfo);