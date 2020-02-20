import React, { Component } from 'react';
import { Dropdown, Menu, Icon } from 'antd';
import { withRouter } from 'react-router-dom';
import Cookie from 'js-cookie';
import PropTypes from 'prop-types';
import styles from './userInfo.scss';

class UserInfo extends Component {
  static propTypes = {
    username: PropTypes.string,
    userFullName: PropTypes.string,
    userLogo: PropTypes.string,
    history: PropTypes.object,
    inHomepage: PropTypes.bool,
    changeLoginStore: PropTypes.func,
    resetMonitorData: PropTypes.func,
    resetCommonStore: PropTypes.func,
    theme: PropTypes.string,
  }

  constructor(props) {
    super(props);
  }

  accountSettings = () => {
    this.props.history.push('/hidden/user/accountSettings');
  }

  logout = () => { // 删除登录凭证并退出。
    Cookie.remove('authData');
    Cookie.remove('enterpriseId');
    Cookie.remove('enterpriseName');
    Cookie.remove('enterpriseLogo');
    Cookie.remove('userId');
    Cookie.remove('username');
    Cookie.remove('userFullName');
    Cookie.remove('userLogo');
    Cookie.remove('expireData');
    Cookie.remove('refresh_token');
    Cookie.remove('isNotLogin');
    Cookie.remove('auto');
    localStorage.clear();
    this.props.changeLoginStore({ pageTab: 'login' });
    this.props.resetMonitorData();
    this.props.resetCommonStore();
    this.props.history.push('/login');
  }

  render() {
    const { userFullName, username, userLogo, theme } = this.props;
    const defaultUserLogo = username && username[0];
    const DropdowMenu = (
      <Menu className={`${styles.layoutUserDropdown}`}>
        {username !== 'default' &&
          <Menu.Item className={styles.innerItem} onClick={this.accountSettings}>
            <span className="iconfont icon-password1"></span>
            <span className={styles.text}>账户设置</span>
          </Menu.Item>
        }
        <Menu.Item className={styles.innerItem} onClick={this.logout}>
          <span className="iconfont icon-quit"></span>
          <span className={styles.text}>退出登录</span>
        </Menu.Item>
      </Menu>
    );
    const nameStyle = this.props.inHomepage ? { color: '#a6e8ff' } : null;
    return (
      <div className={`${styles.layoutUser} ${styles[theme]}`}>
        <div ref={'changeUser'} />
        <Dropdown overlay={DropdowMenu} placement="bottomRight" getPopupContainer={() => this.refs.changeUser}>
          <span className={styles.layoutUserContent}>
            {userLogo && <img width="30px" height="30px" src={userLogo} />}
            {!userLogo && <span className={styles.userLogo}>{defaultUserLogo}</span>}
            <span className={styles.username} style={nameStyle}>{userFullName || username}</span>
            <Icon type="down" className={styles.downIcon} />
          </span>
        </Dropdown>
      </div>
    );
  }
}

export default withRouter(UserInfo);
