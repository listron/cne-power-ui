

import React, { Component } from 'react';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';
import styles from './layout.scss';
import PropTypes from 'prop-types';
import { menu } from '../../common/menu';
const { SubMenu,Item } = Menu;

console.log(menu)
class SideMenu extends Component {
  static propTypes = {
    topMenu: PropTypes.object
  }
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  getSideMenuData = () => {
    const { topMenu } = this.props;
    let tmpSideMenuData = menu.find(e => e.path === topMenu.path);
    if(tmpSideMenuData && tmpSideMenuData.children){
      return tmpSideMenuData.children
    }else{ 
      return []
    }
  }
  _createSideMenu = (sideMenuData) => {
    if(sideMenuData.length > 0){//至少拥有二级目录
      return (<div>
          <Menu mode="inline" theme="dark">
            {sideMenuData.map(e=>{
              if(!e.children || e.children.length === 0){//只有二级目录
                return (<Item key={e.path}>
                  <Link to={e.path}>{e.name}</Link>
                </Item>)
              }else{//有三级目录
                return (<SubMenu title={e.name} key={e.path} >
                  {e.children.map(m=>(<Item key={e.path}>
                    <Link to={m.path}>{m.name}</Link>
                  </Item>))}
                </SubMenu>)
              }
            })}
          </Menu>
      </div>)
    }else{//根目录或只有一级目录
      return <div style={{'backgroundColor':'yellowgreen'}}>木有侧边栏啊！</div>
    }
  }


  render() {
    const sideMenuData = this.getSideMenu();
    return (
      <div style={{width:'180px'}}>
        {this._createSideMenu(sideMenuData)}
      </div>
      
    );
  }
}


export default SideMenu;






























