import React, { Component } from 'react';
import { Dropdown, Menu } from 'antd';
import Cookie from 'js-cookie';
import styles from './userLogo.scss';
const DropdowMenu = (
  <Menu>
    <Menu.Item>
      修改密码
    </Menu.Item>
    <Menu.Item>
      退出登录
    </Menu.Item>
  </Menu>
);

class UserInfo extends Component{
  constructor(props){
    super(props)
  }

  userHandler = (value) => {
    console.log(value);
  }

  render(){
    const username = Cookie.get('username');
    const userLogo = Cookie.get('userLogo');
    const defaultUserLogo = username && username[0];
    console.log(username)
    return (
      <div className={styles.layoutUser}>
        {userLogo && <img width="30px" height="30px" src={userLogo} />}
        {!userLogo && <span>{defaultUserLogo}</span>}
        <Dropdown overlay={DropdowMenu}>
          <span>{username}</span>
        </Dropdown>
      </div>
    )
  }
}

export default UserInfo;