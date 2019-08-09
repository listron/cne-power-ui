

import React, { Component } from 'react';
import { Menu } from 'antd';
import { menu } from '../../common/menu';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import styles from './layout.scss';
const { Item } = Menu;
import Cookie from 'js-cookie';
class TopMenu extends Component {
  static propTypes = {
    location: PropTypes.object,
    history: PropTypes.object,
  }
  constructor(props) {
    super(props);
    this.state = {
      selectedKeys: [],
    };
  }

  componentDidMount() {
    const { pathname } = this.props.location;
    this.getMenuData(pathname);
  }

  componentWillReceiveProps(nextProps) {
    const { pathname } = nextProps.location;
    if (pathname !== this.props.location.pathname) {
      this.getMenuData(pathname);
    }
  }

  getMenuData = (pathname) => { // 根据pathname解析对应选中菜单。
    const selectedKeys = [];
    const pathMenuKey = pathname.split('/').filter(e => e)[0]; // 路径第一个关键字。
    const currentMenuData = menu.find(e => pathMenuKey && e.path.replace('/', '') === pathMenuKey) || {}; // 当前路径对应的菜单组
    if (pathname === '/') {
      selectedKeys.push('/');
    } else if (currentMenuData && currentMenuData.path) {
      selectedKeys.push(currentMenuData.path);
    }
    this.setState({ selectedKeys });
  }

  selectTopMenu = ({ item, key, selectedKeys }) => {
    const params = menu.find(e => e.path === key);
    let defaultPath = '/';
    if (params.defaultPath) {
      defaultPath = params.path;
    } else if (params.children && params.children.length > 0) {
      defaultPath = this.findDefaultPath(params.children);
    }
    this.setState({
      selectedKeys,
    });
    this.props.history.push(defaultPath);
  }

  findDefaultPath = (menuArray) => { // 递归查找默认页面。
    const rightMenu = localStorage.getItem('rightMenu') || '';
    const rightArr = rightMenu.split(',');
    const getDefaultPath = menuArray.find(e => e.defaultPath && rightArr.includes(e.rightKey));
    if (getDefaultPath) {
      return getDefaultPath.path;
    }
    for (let i = 0; i < menuArray.length; i += 1) {
      const subMenuArray = menuArray[i].children;
      if (subMenuArray && subMenuArray.length > 0) {
        const getSubDefaultPath = this.findDefaultPath(subMenuArray);
        if (getSubDefaultPath) {
          return getSubDefaultPath;
        }
      }
    }

  }

  render() {
    const { selectedKeys } = this.state;
    const rightMenu = localStorage.getItem('rightMenu');
    const filteredMenu = menu.filter(e => rightMenu && rightMenu.split(',').includes(e.rightKey));
    return (
      <Menu mode="horizontal" onSelect={this.selectTopMenu} selectedKeys={selectedKeys} className={`${styles.topMenu} `}>
        {filteredMenu.map((e, i) => (
          <Item key={e.path}>
            <span className={styles.eachMenu}>{e.name}</span>
          </Item>
        ))}
      </Menu>
    );
  }
}

export default withRouter(TopMenu);
