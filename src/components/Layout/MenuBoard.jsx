import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { message } from 'antd';
import Cookie from 'js-cookie';
import { withRouter } from 'react-router-dom';
import { Modal } from 'antd';
import styles from './layout.scss';
import { menu } from '../../common/menu';

class MenuBoard extends Component {

  static propTypes = {
    screenAddress: PropTypes.string,
    menuBoardRequired: PropTypes.array,
    menuBoardShow: PropTypes.bool,
    changeCommonStore: PropTypes.func,
    history: PropTypes.object,
  }

  state = {
    rightMenu: localStorage.getItem('rightMenu') ? localStorage.getItem('rightMenu').split(',') : [], // 菜单权限
    linkInfo: [
      { text: '实时监控', menuName: '实时监控', path: '/monitor/station', right: 'monitor_station', redirect: true, icon: 'icon-monitoring', type: 'long', color: '#2b79c9' },
      { text: '工单', menuName: '工单', path: '/operation/workProcess/view', right: 'operation_worklist_work', redirect: true, icon: 'icon-gd2', type: 'short', color: '#bc1d4b' },
      { text: '两票', menuName: '两票管理', path: '/operation/twoTickets/workflow', right: 'operation_twoTicket_work', redirect: true, icon: 'iconfont icon-gd1', type: 'short', color: '#2159c2' },
      { text: '台账', menuName: '台账', path: '/operation/book/assetsConfig', right: 'operation_book_assetConfig', redirect: true, icon: 'icon-gd3', type: 'long', color: '#2e9a00' },

      { text: '日报', menuName: '日报', path: '/operation/running/dayReport', right: 'operation_running_daily', icon: 'icon-running', type: 'short', color: '#623ebe' }, // 核对icon
      { text: '统计分析', menuName: '统计分析', path: '/statistical/stationaccount/allstation', right: 'statistics_station_all', redirect: true, icon: 'icon-station-data', type: 'short', color: '#ba204d' },
      { text: '智能专家库', menuName: '智能专家库', path: '/operation/intelligentExpert', right: 'operation_experience', icon: 'icon-gd4', type: 'long', color: '#d49f04' },
      { text: '运维管理', menuName: '运维管理', path: '/operation/gps', right: 'operation_locate', redirect: true, icon: 'icon-control', type: 'short', color: '#42bcf4' },
      { text: '高级分析', menuName: '高级分析', path: '/analysis/intelligentWarning/realtime', right: 'analysis_intelligentWarning_pending', redirect: true, icon: 'icon-da', type: 'short', color: '#da5534' },

      { text: '监控大屏', icon: 'icon-screen', type: 'long', open: true, color: '#199475' }, // 新开大屏网页
      { text: '统计报表', menuName: '统计报表', path: '/statistical/statement/currency', right: 'statistics_report_general', redirect: true, icon: 'icon-count', type: 'short', color: '#298092' },
      { text: '主页', menuName: '主页', path: '/homepage', icon: 'icon-gohome', right: 'homepage', type: 'short', color: '#525252' },
      { text: '系统管理', menuName: '系统管理', path: '/system/account/enterprise', right: 'system_account_enterprise', redirect: true, icon: 'icon-goset', type: 'long', color: '#2d8ab4' },
    ],
  }

  showBoard = () => {
    this.props.changeCommonStore({ menuBoardShow: true });
  }

  hideBoard = () => {
    this.props.changeCommonStore({ menuBoardShow: false });
  }

  toggleBoard = () => {
    this.props.menuBoardShow ? this.hideBoard() : this.showBoard();
  }

  jumpToPage = (info) => {
    const { history, changeCommonStore, screenAddress } = this.props;
    const { open, right, path, redirect, menuName } = info;
    if (open) { // 直接新开页面
      window.open(screenAddress);
    } else if (this.state.rightMenu.includes(right)) { // 有权限，跳转页面
      history.push(path);
      changeCommonStore({ menuBoardShow: false });
    } else if (redirect){ // 无权限，但不是最底层级菜单 => 允许重定向;
      const redirectMenu = this.getRedirectMenu(menu, menuName); // 获取二级菜单
      const lastMenu = this.getLastMenu(redirectMenu); // 获取三级菜单和没有三级菜单的二级菜单
      const rightMenu = lastMenu.find(e => {
        if (this.state.rightMenu.includes(e.rightKey)) {
          history.push(e.path);
          changeCommonStore({ menuBoardShow: false });
          return e;
        }
      });
      if (menuName === '工单' && !rightMenu && this.state.rightMenu.includes('operation_newworklist')) { // 判断新/旧工单的权限
        history.push('/operation/newWorkProcess/newView');
        changeCommonStore({ menuBoardShow: false });
      }else if (!rightMenu) {
        message.warn('账号无使用权限。');
      }
    } else {
      message.warn('账号无使用权限。');
    }
  }

  getRedirectMenu = (menu, key) => {
      let result = [];
      const findMenu = (data, menuName) => {
        return data.find(e => {
          const { name, children } = e || {};
          if (name === menuName) {
            result = children;
            return true;
          } else if (children && children.length > 0) {
            return findMenu(children, menuName);
          }
          return false;
        });
      };
      findMenu(menu, key);
      return result;
    }

  getLastMenu = (menu) => {
    let result = [];
    menu.forEach(e => {
      if (!e.children) {
        result.push(e);
      }
      if (e.children && e.children.length > 0) {
        result.push(...e.children);
      }
    });
    return result;
  }

  judge = (e) => {
    if (!e.redirect) {
      return this.state.rightMenu.includes(e.right);
    }
    const redirectMenu = this.getRedirectMenu(menu, e.menuName);
    const lastMenu = this.getLastMenu(redirectMenu);
    const rightMenu = lastMenu.find(e => {
      if (this.state.rightMenu.includes(e.rightKey)) {
        return e;
      }
    });
    if (e.menuName === '工单' && !rightMenu && this.state.rightMenu.includes('operation_newworklist')) {
      return true;
    }else if(!rightMenu) {
      return false;
    }
    return true;
  }

  renderItem = (arr, start, end) => arr.slice(start, end).map(e => (
    <div
      key={e.text}
      className={`${styles.eachLink} ${styles[e.type]}`}
      onClick={() => this.jumpToPage(e)}
      style={{
        backgroundColor: e.color,
        cursor: (e.open || this.judge(e)) ? 'pointer' : 'not-allowed',
      }}>
      <span className={`iconfont ${e.icon} ${styles.icon}`} />
      <span className={styles.text}>{e.text}</span>
    </div>
  ))

  render() {
    const { linkInfo } = this.state;
    const { menuBoardShow, menuBoardRequired } = this.props;
    const enterpriseId = Cookie.get('enterpriseId');
    const needBoardIcon = menuBoardRequired.includes(enterpriseId);
    return (
      <div className={styles.menuBoard}>
        {needBoardIcon && <div className={styles.boardIcon} onClick={this.toggleBoard}>
          <div className={styles.eachPart} />
          <div className={styles.eachPart} />
          <div className={styles.eachPart} />
          <div className={styles.eachPart} />
        </div>}
        <Modal
          visible={menuBoardShow}
          footer={null}
          mask={false}
          closable={false}
          width={1140}
          wrapClassName={styles.boardWrap}
        >
          <div className={styles.menuLinks}>
            <div className={styles.left}>
              {this.renderItem(linkInfo, 0, 4)}
            </div>
            <div className={styles.middle}>
              {this.renderItem(linkInfo, 4, 9)}
            </div>
            <div className={styles.right}>
              {this.renderItem(linkInfo, 9)}
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default withRouter(MenuBoard);
