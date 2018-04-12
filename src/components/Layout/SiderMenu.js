

import React, { Component } from 'react';
import { Menu, Icon } from 'antd';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import {topMenu} from '../../common/menu';
import styles from './layout.scss'
const { SubMenu,Item } = Menu;

class SiderMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div>
        <span className={styles.logo} style={{ marginLeft: '40px' }}>侧边菜单</span>
        <Menu mode="inline" theme="dark">
          {createSiderMenu(topMenu)}
        </Menu>
      </div>
      
    );
  }
}
function createSiderMenu(topMenu,topHash){//顶部单独提取渲染
  let siderMenu = [];
  topMenu.find(e=>{
    if(e.name === topHash){
      if(e.children && e.children.length>0){
        siderMenu = e.children
      }
      return true
    }
  })
  if(siderMenu.length>0){
    let Menus = siderMenu.map(e=>{
      return <Item
        key={e.path}
      >
        {e.icon && <span className={classnames(e.icon, styles.icon)} />}
        <Link to={e.path}>{e.name}</Link>
      </Item>
    })
    return Menus
  }
}

export default SiderMenu;






























