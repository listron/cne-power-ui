

import React, { Component } from 'react';
import { Menu } from 'antd';
import { menu } from '../../common/menu';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import styles from './layout.scss';
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
      <Menu mode="horizontal" onSelect={this.selectTopMenu} selectedKeys={selectedKeys} className={styles.topMenu}>
        {menu.map((e,i)=>(
          <Item key={e.path}>
            <span>{e.name}</span>
          </Item>
        ))}
      </Menu>
    );
  }
}

export default withRouter(TopMenu);
