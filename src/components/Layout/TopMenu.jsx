

import React, { Component } from 'react';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';
import { menu } from '../../common/menu';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
const { Item } = Menu;

class TopMenu extends Component {
  static propTypes = {
    setTopMenu: PropTypes.func,
    location: PropTypes.object,
    history: PropTypes.object,
  }
  constructor(props) {
    super(props);
    this.state = {
      selectedKeys: []
    };
  }

  componentWillReceiveProps(nextProps){
    const { location } = nextProps;
    const { pathname } = location;
    if(this.state.selectedKeys.length === 0) {//点击一级菜单的切换选中在selectTopMenu里做了
      const pathArray = pathname.split('/').filter(e=>!!e);
      const selectedKeyName = pathArray.length > 0? `/${pathArray[0]}`:'/';
      this.setState({
        selectedKeys:[selectedKeyName]
      });
    }
  }

  selectTopMenu = ({item,key,selectedKeys}) => {
    const params = menu.find(e=>e.path === key);
    const defaultPath = {
      '/': '/',
      '/operation':'/operation/ticket',
      '/system':'/system/account/enterprise',
      '/monitor':'/monitor/stationmonitor'
    }
    this.setState({
      selectedKeys
    });
    this.props.history.push(defaultPath[key]);
    this.props.setTopMenu({ topMenu: params });
  }

  render() {
    const { selectedKeys } = this.state;
    return (
      <Menu mode="horizontal" theme="dark" onSelect={this.selectTopMenu} selectedKeys={selectedKeys} defaultOpenKeys={selectedKeys} >
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

export default withRouter(TopMenu);
