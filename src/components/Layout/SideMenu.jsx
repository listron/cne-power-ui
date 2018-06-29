

import React, { Component } from 'react';
import { Menu } from 'antd';
import styles from './layout.scss';
import PropTypes from 'prop-types';
const { SubMenu,Item } = Menu;

class SideMenu extends Component {
  static propTypes = {
    topMenu: PropTypes.object
  }
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { topMenu } = this.props;
    console.log(typeof topMenu)
    return (
      <div>
        <span className={styles.logo} style={{ marginLeft: '40px' }}>侧边菜单</span>
        <div>这是侧边菜单咯</div>
        <Menu mode="inline" theme="dark">
          <Item key={1} >
            {topMenu.get('name')}
          </Item>
          <Item key={2} >
            {topMenu.get('path')}
          </Item>
          <Item key={3} >
            {topMenu.get('clickable')}
          </Item>
        </Menu>
      </div>
      
    );
  }
}
// function createSiderMenu(topMenu,topHash){//顶部单独提取渲染
//   let siderMenu = [];
//   topMenu.find(e=>{
//     if(e.name === topHash){
//       if(e.children && e.children.length>0){
//         siderMenu = e.children
//       }
//       return true
//     }
//   })
//   if(siderMenu.length>0){
//     let Menus = siderMenu.map(e=>{
//       return <Item
//         key={e.path}
//       >
//         {e.icon && <span className={classnames(e.icon, styles.icon)} />}
//         <Link to={e.path}>{e.name}</Link>
//       </Item>
//     })
//     return Menus
//   }
// }

export default SideMenu;






























