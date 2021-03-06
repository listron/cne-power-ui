

import React, { Component } from 'react';
import { Menu, Icon } from 'antd';
import { Link } from 'react-router-dom';
import styles from './layout.scss';
import PropTypes from 'prop-types';
import { menu } from '../../common/menu';
import { withRouter } from 'react-router-dom';
const { SubMenu, Item } = Menu;
import Cookie from 'js-cookie';

class SideMenu extends Component {
  static propTypes = {
    location: PropTypes.object,
    theme: PropTypes.string,
  }
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
      selectedKeys: [],
      openKeys: [],
      sideMenuData: [],
    };
  }

  componentDidMount() {
    const { pathname } = this.props.location;
    this.getMenuData(pathname);
  }

  componentWillReceiveProps(nextProps) {
    const { pathname } = nextProps.location;
    if (pathname !== this.props.location.pathname) {
      this.getMenuData(pathname);
    }
  }

  onOpenChange = (openKeys) => {
    this.setState({
      openKeys,
    });
  }

  getMenuData = (pathname) => {
    const pathMenuKey = pathname.split('/').filter(e => e)[0]; // 路径第一个关键字。
    const currentMenuData = menu.find(e => pathMenuKey && e.path.replace('/', '') === pathMenuKey) || {}; // 当前路径对应的菜单组
    const sideMenuData = currentMenuData.children || []; // 侧边栏数据
    const openKeys = []; // 菜单展开项
    sideMenuData.forEach(e => {
      if (e.children && e.children.length > 0) {
        e.children.forEach(item => {
          pathname.includes(item.path) && openKeys.push(e.path);
        });
      }
    });
    this.setState({
      sideMenuData,
      openKeys,
    });
  }

  toggleCollapsed = () => {
    const { collapsed } = this.state;
    this.setState({
      collapsed: !collapsed,
    });
  }

  _createSideMenu = (sideMenuData, theme) => {
    const { collapsed, openKeys } = this.state;
    const { pathname } = this.props.location;
    const { stationTypeCount } = this.props;
    //multiple
    if (sideMenuData.length > 0) {//至少拥有二级目录
      return (
        <div className={styles.sideLayout}>
          <div className={styles.logo}>
            {!collapsed && <img src={`/img/${theme === 'dark' ? 'darkmenu' : 'menubg'}.png`} style={{ width: 55, height: 23 }} />}
            <div className={styles.iconfont} style={{ marginTop: 10 }} onClick={this.toggleCollapsed}>
              {collapsed ? <i className="iconfont icon-menu-fold" /> : <i className="iconfont icon-menu-open" />}
            </div>
          </div>
          <span ref={'test'} />
          <Menu
            mode="inline"
            inlineCollapsed={collapsed}
            className={styles.menuList}
            selectedKeys={[pathname]}
            openKeys={openKeys}
            // getContainer={() => this.refs.test}
            onOpenChange={this.onOpenChange}>
            {this.renderSideMenu(sideMenuData)}
          </Menu>
        </div>
      );
    } //根目录或只有一级目录
    return null;

  }

  renderSideMenu(sideMenuData) {
    const { collapsed } = this.state;
    const { stationTypeCount } = this.props;
    const rightMenu = localStorage.getItem('rightMenu');
    return sideMenuData.map(e => {
      const { renderKey } = e;
      const hasNoSubMenu = e && (!e.children || e.children.length === 0) && rightMenu && rightMenu.split(',').includes(e.rightKey);
      const renderStationTypeKey = (!renderKey || stationTypeCount === 'multiple' || stationTypeCount === renderKey);
      if (hasNoSubMenu && renderStationTypeKey) {//只有二级目录
        return (
          <Item key={e.path}>
            <Link to={e.path}>{e.iconStyle && <i className={`iconfont ${e.iconStyle}`} />}{collapsed ? null : e.name}</Link>
          </Item>
        );
      } else if (e && e.children && e.children.length > 0 && rightMenu && rightMenu.split(',').includes(e.rightKey) && renderStationTypeKey) { // 有三级目录
        const menuTitle = <span>{e.iconStyle && <i className={`iconfont ${e.iconStyle}`} />}<span>{collapsed ? null : e.name}</span></span>;
        const filteredMenu = e.children.filter(subItem => rightMenu && rightMenu.split(',').includes(subItem.rightKey)).filter(item => !item.renderKey || stationTypeCount === 'multiple' || stationTypeCount === item.renderKey);
        return (
          <SubMenu title={menuTitle} key={e.path} className={styles.subMenu}>
            {filteredMenu.map(m => {
              return (
                <Item key={m.path}>
                  <Link to={m.path}>{m.name}</Link>
                </Item>
              );
            })}
          </SubMenu>
        );
      }
      return null;

    });
  }

  render() {
    const { sideMenuData, collapsed } = this.state;
    const theme = Cookie.get('theme') || 'light';
    const sideStyle = {
      width: collapsed ? 80 : 180,
      display: sideMenuData.length > 0 ? 'flex' : 'none',
    };
    return (
      <div className={`${styles.sideMenu} ${styles[theme]}`} style={sideStyle} >
        {this._createSideMenu(sideMenuData, theme)}
      </div>
    );
  }
}

export default withRouter(SideMenu);
