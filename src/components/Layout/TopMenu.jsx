

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
    topMenu: PropTypes.object,
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
    const { location, topMenu } = nextProps;
    const { pathname } = location;
    const { selectedKeys } = this.state;
    const resetTopMenu = topMenu.path !== '/' && pathname === '/';
    if(selectedKeys.length === 0) {  // f5刷新
      const pathArray = pathname.split('/').filter(e=>!!e);
      const selectedKeyName = pathArray.length > 0? `/${pathArray[0]}`:'/';
      this.setState({ selectedKeys:[selectedKeyName] });
    }else if(resetTopMenu){ // 404 页面的跳转重置topMenu至首页
      this.setState({ selectedKeys: ['/'] });
      this.props.setTopMenu({ topMenu: {
        name: '首页',
        path: '/',
        defaultPath: true,
      }});
    }
  }

  selectTopMenu = ({item,key,selectedKeys}) => {
    const params = menu.find(e=>e.path === key);
    let defaultPath = '/';
    if(params.defaultPath){
      defaultPath = params.path;
    }else if(params.children && params.children.length > 0){
      defaultPath = this.findDefaultPath(params.children);
    }
    this.setState({
      selectedKeys
    });
    this.props.history.push(defaultPath);
    this.props.setTopMenu({ topMenu: params });
  }

  findDefaultPath = (menuArray) => { // 递归查找默认页面。
    const getDefaultPath = menuArray.find(e=>e.defaultPath);
    if(getDefaultPath){
      return getDefaultPath.path;
    }else{
      for(let i = 0;i < menuArray.length; i += 1){
        const subMenuArray = menuArray[i].children;
        if(subMenuArray && subMenuArray.length > 0){
          const getSubDefaultPath = this.findDefaultPath(subMenuArray);
          if(getSubDefaultPath){
            return getSubDefaultPath;
          }
        }
      }
    }
  }

  render() {
    const { selectedKeys } = this.state;
    return (
      <Menu mode="horizontal" theme="dark" onSelect={this.selectTopMenu} selectedKeys={selectedKeys}>
        {menu.map((e,i)=>(
          <Item key={e.path}>
            <span>{e.name}</span>
            {/* {(!e.children || e.children.length === 0) && <Link to={e.path}>{e.name}</Link>} */}
            {/* {(!e.children || e.children.length === 0 || e.clickable) && <Link to={e.path}>{e.name}</Link>} */}
            {/* {(e.children && e.children.length > 0) && <span>{e.name}</span>} */}
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
