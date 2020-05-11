import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Cookie from 'js-cookie';
import { withRouter } from 'react-router-dom';
import { Modal, Button } from 'antd';
import styles from './layout.scss';

class NoRightModal extends Component {

  static propTypes = {
    layoutRenderKey: PropTypes.string,
    history: PropTypes.object,
    resetMonitorData: PropTypes.func,
    changeLoginStore: PropTypes.func,
    resetCommonStore: PropTypes.func,
  }

  logout = () => { // 删除登录凭证并退出。
    Cookie.remove('authData'); // 这一堆cookie看着都烦。有空赶紧进行集合+优化。
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
    // Cookie.remove('theme');
    this.props.resetMonitorData();
    this.props.resetCommonStore();
    this.props.changeLoginStore({ pageTab: 'login', loginData: {} });
    this.props.history.push('/login');
  }

  render() {
    const userRight = localStorage.getItem('rightHandler');
    const rightMenu = localStorage.getItem('rightMenu') || '';
    const { layoutRenderKey } = this.props;
    return (
      <Modal
        title=""
        visible={!userRight && !rightMenu && layoutRenderKey !== 'outside'}
        closable={false}
        footer={null}
        wrapClassName={styles.userRightTip}
      >
        <p>对不起，您的用户角色尚未设置，请联系管理员进行设置！</p>
        <Button onClick={this.logout} className={styles.exitSystem} >退出系统</Button>
      </Modal>
    );
  }
}

export default withRouter(NoRightModal);
