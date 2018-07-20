

import React, { Component } from 'react';
import { Menu, Icon, Button  } from 'antd';
import { Link } from 'react-router-dom';
import styles from './layout.scss';
import PropTypes from 'prop-types';
import { menu } from '../../common/menu';
const { SubMenu,Item } = Menu;

class SideMenu extends Component {
  static propTypes = {
    topMenu: PropTypes.object
  }
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false
    };
  }
  getSideMenuData = () => {//根据顶部菜单判定侧边栏菜单数据
    const { topMenu } = this.props;
    let tmpSideMenuData = menu.find(e => e.path === topMenu.path);
    if(tmpSideMenuData && tmpSideMenuData.children){
      return tmpSideMenuData.children
    }else{ 
      return []
    }
  }
  toggleCollapsed = () => {
    const { collapsed } = this.state;
    this.setState({
      collapsed:  !collapsed
    })
  }
  _createSideMenu = (sideMenuData) => {
    const { collapsed } = this.state;
    if(sideMenuData.length > 0){//至少拥有二级目录
      return (
        <div className={styles.sideLayout}>
          <div className={styles.logo}>
            <span>menuLogo</span>
            <Button type="primary" onClick={this.toggleCollapsed}>
              <Icon type={collapsed ? 'menu-unfold' : 'menu-fold'} />
            </Button>
          </div>
          <Menu mode="inline" theme="dark" inlineCollapsed={collapsed} className={styles.menuList}>
            {sideMenuData.map(e=>{
              if(!e.children || e.children.length === 0){//只有二级目录
                return (<Item key={e.path}>
                  <Link to={e.path}>{e.iconStyle && <Icon type={e.iconStyle} />}{collapsed ? null: e.name}</Link>
                </Item>)
              }else{//有三级目录
                let menuTitle = <span>{e.iconStyle && <Icon type={e.iconStyle} />}<span>{e.name}</span></span>
                return (<SubMenu title={menuTitle} key={e.path} >
                  {e.children.map(m=>(<Item key={m.path}>
                    <Link to={m.path}>{m.name}</Link>
                  </Item>))}
                </SubMenu>)
              }
            })}
          </Menu>
      </div>
      );
    } else{//根目录或只有一级目录
      return null;
    }
  }


  render() {
    const sideMenuData = this.getSideMenuData();
    return (
      <div className={styles.sideMenu} style={{width: this.state.collapsed ? 80 : 180}}>
        {this._createSideMenu(sideMenuData)}
      </div> 
    );
  }
}


export default SideMenu;