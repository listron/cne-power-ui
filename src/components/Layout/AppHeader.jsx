
import React from 'react';
import styles from './appheader.scss';
import PropTypes from 'prop-types';
import TopMenu from './TopMenu';
import MenuBoard from './MenuBoard';
import LogoInfo from './LogoInfo';
import UserInfo from './UserInfo';

export default function AppHeader({ ...props }){
    // const themeMenu = (
    //   <ul className={styles.themeMenu}>
    //     <li onClick={() => this.changeTheme('dark')} className={`${theme === 'dark' && styles.active}`}> 深色 </li>
    //     <li onClick={() => this.changeTheme('light')} className={`${theme === 'light' && styles.active}`}> 浅色 </li>
    //   </ul>
    // );
  return (
    <div className={styles.appHeader}>
      <div className={styles.headerLeft}>
        <div className={styles.logoBg}>
          <LogoInfo />
          <MenuBoard
            changeCommonStore={props.changeCommonStore}
            screenAddress={props.screenAddress}
            menuBoardRequired={props.menuBoardRequired}
            menuBoardShow={props.menuBoardShow}
          />
        </div>
        {!props.menuBoardShow && <TopMenu />}
      </div>
      <div className={styles.headerRight}>
        {/* <img width="294px" height="53px" src="/img/topbg02.png" className={styles.powerConfig} /> */}
        {/*
        <Dropdown overlay={themeMenu}
          getPopupContainer={() => this.refs.changeTheme}
          overlayStyle={{ width: '70px' }}
          placement="bottomCenter">
          <div className={styles.changeTheme}> <span className={'iconfont icon-skinpeel'} /> 换肤</div>
        </Dropdown>*/}
        <UserInfo
          username={props.username}
          userFullName={props.userFullName}
          userLogo={props.userLogo}
          changeLoginStore={props.changeLoginStore}
          resetMonitorData={props.resetMonitorData}
          resetCommonStore={props.resetCommonStore}
          theme={props.theme}
        />
      </div>
    </div>
  );
}

AppHeader.propTypes = {
  changeCommonStore: PropTypes.func,
  screenAddress: PropTypes.string,
  menuBoardRequired: PropTypes.array,
  menuBoardShow: PropTypes.bool,
  username: PropTypes.string,
  userFullName: PropTypes.string,
  userLogo: PropTypes.string,
  changeLoginStore: PropTypes.func,
  resetMonitorData: PropTypes.func,
  resetCommonStore: PropTypes.func,
  theme: PropTypes.string,
};







