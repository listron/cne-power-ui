

import React, { Component } from 'react';
import { Menu, Icon } from 'antd';
import { Link } from 'react-router-dom';
import styles from './layout.scss';
import PropTypes from 'prop-types';
import { menu } from '../../common/menu';
import { withRouter } from 'react-router-dom';
const { SubMenu,Item } = Menu;

class SideMenu extends Component {
  static propTypes = {
    topMenu: PropTypes.object,
    location: PropTypes.object,
  }
  constructor(props) {
    super(props);
    const {sideMenuData, selectedKeys, openKeys} = this.getMenuData(props.topMenu, props.location);
    this.state = {
      collapsed: false,
      sideMenuData,
      selectedKeys,
      openKeys
    };
  }

  componentWillReceiveProps(nextProps){
    const { location,topMenu } = nextProps;
    if(nextProps.topMenu.name !== this.props.topMenu.name || location.pathname !== this.props.location.pathname) {
      const {sideMenuData, selectedKeys,openKeys} = this.getMenuData(topMenu, location);
      this.setState({
        sideMenuData,
        selectedKeys,
        openKeys
      });
    }
  }

  onOpenChange = (openKeys) => {
    this.setState({
      openKeys
    });
  }

  getMenuData = (topMenu, location) => {
    const { pathname } = location;
    let selectedKeys = [];//激活菜单选中
    let openKeys = [];
    let tmpSideMenuData = menu.find(e => e.path === topMenu.path);
    let sideMenuData = (tmpSideMenuData && tmpSideMenuData.children) ? tmpSideMenuData.children : [];

    pathname !== '/' && sideMenuData.forEach(e=>{
      if(e.children){
        e.children.forEach(m=>{
          if(pathname.indexOf(m.path) !== -1) {
            selectedKeys.push(m.path);
            openKeys.push(e.path);
          }
        });
      }else{
        e.path === pathname && selectedKeys.push(e.path);
      }
    })
    return {
      sideMenuData,
      selectedKeys,
      openKeys
    }
  }

  // getSideMenuData = () => {//根据顶部菜单判定侧边栏菜单数据
  //   const { topMenu } = this.props;
  //   let tmpSideMenuData = menu.find(e => e.path === topMenu.path);
  //   if(tmpSideMenuData && tmpSideMenuData.children){
  //     return tmpSideMenuData.children
  //   }else{
  //     return []
  //   }
  // }
  toggleCollapsed = () => {
    const { collapsed } = this.state;
    this.setState({
      collapsed:  !collapsed
    })
  }
  
  _createSideMenu = (sideMenuData) => {
    const { collapsed, selectedKeys, openKeys } = this.state;
    if(sideMenuData.length > 0){//至少拥有二级目录
      return (
        <div className={styles.sideLayout}>
          <div className={styles.logo}>
            {!collapsed&&<img src="/img/menubg.png" style={{width:55,height:23}} />}
            <div className={styles.action}>
              <Icon style={{marginTop:10}} onClick={this.toggleCollapsed} type={collapsed ? 'menu-unfold' : 'menu-fold'} />
            </div>
          </div>
          <Menu 
            mode="inline" 
            inlineCollapsed={collapsed} 
            className={styles.menuList} 
            selectedKeys={selectedKeys} 
            openKeys={openKeys}
            onOpenChange={this.onOpenChange}>
            {this.renderSideMenu(sideMenuData)}
          </Menu>
      </div>
      );
    } else{//根目录或只有一级目录
      return null;
    }
  }

  renderSideMenu(sideMenuData) {
    const { collapsed } = this.state;
    const rightMenu = localStorage.getItem('rightMenu');
    return sideMenuData.map(e=>{
      const hasNoSubMenu = e && (!e.children || e.children.length === 0) && rightMenu && rightMenu.includes(e.rightKey);
      if(hasNoSubMenu){//只有二级目录  
        return (
          <Item key={e.path}>
            <Link to={e.path}>{e.iconStyle && <i className={`iconfont ${e.iconStyle}`} />}{collapsed ? null: e.name}</Link>
          </Item>
        );
      }else if(e && e.children && e.children.length > 0){//有三级目录
        let menuTitle = <span>{e.iconStyle && <i className={`iconfont ${e.iconStyle}`} />}<span>{collapsed ? null: e.name}</span></span>
        const filteredMenu = e.children.filter(subItem => rightMenu && rightMenu.includes(subItem.rightKey));
        return (
          <SubMenu title={menuTitle} key={e.path}>
            {filteredMenu.map(m=>{
              return (
                <Item key={m.path}>
                  <Link to={m.path}>{m.name}</Link>
                </Item>
              );
            })}
          </SubMenu>
        );
      }else{
        return null;
      }
    })
  }


  render() {
    // const sideMenuData = this.getSideMenuData();
    const { sideMenuData } = this.state;
    return (
      <div className={styles.sideMenu} style={{width: this.state.collapsed ? 80 : 180}}>
        {this._createSideMenu(sideMenuData)}
      </div>
    );
  }
}


export default withRouter(SideMenu) ;
