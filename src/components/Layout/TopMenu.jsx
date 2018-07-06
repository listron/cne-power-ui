

import React, { Component } from 'react';
import { Menu, Icon } from 'antd';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import { menu } from '../../common/menu';
import PropTypes from 'prop-types';
import styles from './layout.scss'
const { SubMenu,Item } = Menu;

class TopMenu extends Component {
  static propTypes = {
    setTopMenu: PropTypes.func,
  }
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  selectTopMenu = ({item,key,selectedKeys}) => {
    const params = menu.find(e=>e.path === key);
    this.props.setTopMenu(params)
  }

  render() {
    return (
      <Menu mode="horizontal" theme="dark" onSelect={this.selectTopMenu}>
        {menu.map((e,i)=>(
          <Item key={e.path}>
            {e.clickable && <Link to={e.path}>{e.name}</Link>}
            {!e.clickable && <span>{e.name}</span>}
          </Item>
        ))}
      </Menu>
    );
  }
}

// function createAllMenu(menu){//所有嵌套渲染
//   if(!menu || !menu.length){
//     return []
//   }
//   let Menus = menu.map(e=>{
//     if(e.children && e.children.length>0){
//       return (<SubMenu key={e.path} title={<span>
//           {e.icon && <span className={classnames(e.icon, styles.icon)} />}
//           <span>{e.name}</span>
//         </span>}
//       >
//         {createAllMenu(e.children)}
//       </SubMenu>)
//     }else{
//       return (<Item key={e.path} >
//         {e.icon && <span className={classnames(e.icon, styles.icon)} />}
//         <Link to={e.path}>{e.name}</Link>
//       </Item>)
//     }
//   })
//   return Menus
// }

export default TopMenu;