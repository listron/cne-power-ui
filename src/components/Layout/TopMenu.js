

import React, { Component } from 'react';
import { Menu, Icon } from 'antd';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import {topMenu} from '../../common/menu';
import styles from './layout.scss'
const { SubMenu,Item } = Menu;

class TopMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <Menu mode="horizontal" theme="dark">
        {createAllMenu(topMenu)}
      </Menu>
    );
  }
}
function createTopMenu(topMenu){//顶部单独提取渲染
  if(!topMenu || !topMenu.length){
    return []
  }
  let Menus = topMenu.map(e=>{
    return <Item
      key={e.path}
    >
      {e.icon && <span className={classnames(e.icon, styles.icon)} />}
      <Link to={e.path}>{e.name}</Link>
    </Item>
  })
  return Menus
}

function createAllMenu(topMenu){//所有嵌套渲染
  if(!topMenu || !topMenu.length){
    return []
  }
  let Menus = topMenu.map(e=>{
    if(e.children && e.children.length>0){
      return <SubMenu key={e.path} title={<span>
          {e.icon && <span className={classnames(e.icon, styles.icon)} />}
          <span>{e.name}</span>
        </span>}
      >
        {createAllMenu(e.children)}
      </SubMenu>
    }else{
      return <Item
        key={e.path}
      >
        {e.icon && <span className={classnames(e.icon, styles.icon)} />}
        <Link to={e.path}>{e.name}</Link>
      </Item>
    }
  })
  return Menus
}

export default TopMenu;

{/* <Menu mode="horizontal" theme="dark">
  <Menu.Item key="home" className={styles.menuItem}>
    <span className={classnames("iconfont icon-home", styles.icon)} />
    <Link to="/">首页</Link>
  </Menu.Item>
  <Menu.Item key="power" className={styles.menuItem}>               
    <span className={classnames("iconfont icon-eye", styles.icon)} />
    <Link to="/power">电站管理</Link>      
  </Menu.Item> 
</Menu> */}






























