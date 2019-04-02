import React, { Component } from 'react';
import { Tabs, Menu, Icon } from 'antd';
import PropTypes from 'prop-types';
import styles from './accountSettings.scss';
import { othersAction } from '../alphaRedux/othersAction';
import { connect } from 'react-redux';
const { SubMenu, Item } = Menu;
import EditUserName from '../../components/Others/AccountSettings/EditUserName';
import EditPasswordForm from '../../components/Others/AccountSettings/EditPasswordForm';
import EditPhone from '../../components/Others/AccountSettings/EditPhone';
import CommonBreadcrumb from '../../components/Common/CommonBreadcrumb';
import Footer from '../../components/Common/Footer';

const TabPane = Tabs.TabPane;

class AccountSettings extends Component {
  static propTypes = {
  }

  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
      selectedKeys: [],
      openKeys: ['/hidden/user/accountSettings'],
      selectMenu: 'editUserName',
    }
  }

  toggleCollapsed = () => {
    const { collapsed } = this.state;
    this.setState({ collapsed: !collapsed })
  }

  onOpenChange = (openKeys) => {
    this.setState({
      openKeys
    });
  }

  selectMenu = (item) => {
    this.setState({selectMenu: item.key })
  }

  render() {
    const { collapsed, openKeys, selectMenu } = this.state;
    const { pathname } = this.props.location;
    return (
      <div className={styles.accountSettings}>
        <h3 className={styles.sideLayout} style={{ width: collapsed ? 80 : 180 }}>
          <div className={styles.logo}>
            {!collapsed && <img src="/img/menubg.png" style={{ width: 55, height: 23 }} />}
            <div className={styles.action}>
              <Icon style={{ marginTop: 10 }} onClick={this.toggleCollapsed} type={collapsed ? 'menu-unfold' : 'menu-fold'} />
            </div>
          </div>
          <Menu
            mode="inline"
            inlineCollapsed={collapsed}
            className={styles.menuList}
            selectedKeys={[pathname]}
            openKeys={openKeys}
            onSelect={this.selectMenu}
            onOpenChange={this.onOpenChange}>
            <SubMenu key={'/hidden/user/accountSettings'} title={
              <span> <i className={'iconfont icon-usermanage'}></i><span>{collapsed ? null : '账户管理'}</span></span>}>
              <Item key="editUserName"><a>账户信息</a></Item>
              <Item key="editPassword">修改密码</Item>
              <Item key="editPhone">修改手机</Item>
            </SubMenu>
          </Menu>
        </h3>
        <div className={styles.accoutCont}>
          <CommonBreadcrumb breadData={[{ name: '账户信息' }]} style={{ paddingLeft: '38px', background: '#fff' }} />
          <div className={styles.accoutContainer}>
            {selectMenu === "editUserName" && <EditUserName {...this.props} />}
            {selectMenu === "editPassword" && <EditPasswordForm {...this.props} />}
            {selectMenu === "editPhone" && <EditPhone {...this.props} />}
          </div>
          <Footer />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  loading: state.othersReducer.get('loading'),
});

const mapDispatchToProps = (dispatch) => ({
  editUserName: payload => dispatch({ type: othersAction.editUserName, payload, }),
  editPassword: payload => dispatch({ type: othersAction.editPassword, payload, }),
  editPhone: payload => dispatch({ type: othersAction.editPhone, payload, }),
  sendCode: payload => dispatch({ type: othersAction.SEND_CODE_SAGA, payload, }),
})

export default connect(mapStateToProps, mapDispatchToProps)(AccountSettings);