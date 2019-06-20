import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Cookie from 'js-cookie';
import { withRouter } from 'react-router-dom';
import { Modal } from 'antd';
import styles from './layout.scss';

class MenuBoard extends Component{

  static propTypes = {
    screenAdreess: PropTypes.string,
    menuBoardRequired: PropTypes.array,
    menuBoardShow: PropTypes.bool,
    changeCommonStore: PropTypes.func,
    history: PropTypes.object,
  }

  state = {
    linkInfo: [
      { text: '实时监控', path: '/monitor/station', icon: 'icon-monitoring',  type: 'long', color: '#2b79c9'},
      { text: '工单', path: '/operation/ticket/list', icon: 'icon-gd2',  type: 'short', color: '#bc1d4b'},
      { text: '两票', path: '/operation/twoTickets/typeone', icon: 'iconfont icon-gd1',  type: 'short', color: '#2159c2'},
      { text: '台账', path: '/operation/book/assetsConfig', icon: 'icon-gd3',  type: 'long', color: '#2e9a00'},

      { text: '日报', path: '/operation/running/dayReport', icon: 'icon-running',  type: 'short', color: '#623ebe'}, // 核对icon
      { text: '统计分析', path: '/statistical/stationaccount/allstation', icon: 'icon-station-data',  type: 'short', color: '#ba204d'},
      { text: '智能专家库', path: '/operation/intelligentExpert', icon: 'icon-gd4',  type: 'long', color: '#d49f04'},
      { text: '运维管理', path: '/operation/gps', icon: 'icon-control',  type: 'short', color: '#42bcf4'},
      { text: '高级分析', path: '/analysis/intelligentWarning/realtime', icon: 'icon-da',  type: 'short', color: '#da5534'},

      { text: '监控大屏', icon: 'icon-screen',  type: 'long', open: true, color: '#199475'}, // 新开大屏网页
      { text: '统计报表', path: '/statistical/statement/currency', icon: 'icon-count',  type: 'short', color: '#298092'},
      { text: '主页', path: '/homepage', icon: 'icon-gohome',  type: 'short', color: '#525252', forbidden: true},
      { text: '系统管理', path: '/system/account/enterprise', icon: 'icon-goset',  type: 'long', color: '#2d8ab4'},
    ]
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
    const { history, changeCommonStore, screenAdreess } = this.props;
    const { forbidden, open, path } = info;
    if (forbidden) {
      return;
    }
    if (open) {
      window.open(screenAdreess);
    } else {
      history.push(path);
      changeCommonStore({ menuBoardShow: false });
    }
  }

  render(){
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
              {linkInfo.slice(0, 4).map(e => {
                return (<div
                  key={e.text}
                  className={`${styles.eachLink} ${styles[e.type]}`}
                  onClick={() => this.jumpToPage(e)}
                  style={{backgroundColor: e.color}}>
                  <span className={`iconfont ${e.icon} ${styles.icon}`} />
                  <span className={styles.text}>{e.text}</span>
                </div>)
              })}
            </div>
            <div className={styles.middle}>
              {linkInfo.slice(4, 9).map(e => {
                return (<div key={e.text}
                  className={`${styles.eachLink} ${styles[e.type]}`}
                  onClick={() => this.jumpToPage(e)}
                  style={{backgroundColor: e.color}}>
                  <span className={`iconfont ${e.icon} ${styles.icon}`} />
                  <span className={styles.text}>{e.text}</span>
                </div>)
              })}
            </div>
            <div className={styles.right}>
              {linkInfo.slice(9).map(e => {
                return (<div key={e.text}
                  className={`${styles.eachLink} ${styles[e.type]}`}
                  onClick={() => this.jumpToPage(e)}
                  style={{backgroundColor: e.color}}>
                  <span className={`iconfont ${e.icon} ${styles.icon}`} />
                  <span className={styles.text}>{e.text}</span>
                </div>)
              })}
            </div>
          </div>
        </Modal>
      </div>
    )
  }
}

export default withRouter(MenuBoard);