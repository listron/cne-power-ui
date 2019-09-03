/*eslint new-cap: ["error", { "capIsNewExceptionPattern": "^wscript\.." }]*/

import React, { Component } from 'react';
import styles from './miniHome.scss';
import moment from 'moment';
import UserInfo from '../../Layout/UserInfo';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Cookie from 'js-cookie';
import { dataFormat } from '../../../utils/utilFunc';

class TopParts extends Component{
  static propTypes = {
    username: PropTypes.string,
    userFullName: PropTypes.string,
    userLogo: PropTypes.string,
    realTimeInfo: PropTypes.object,
    energySaving: PropTypes.object,
    changeLoginStore: PropTypes.func,
    resetMonitorData: PropTypes.func,
    resetCommonStore: PropTypes.func,
  }

  constructor(props){
    super(props);
    this.state = {
      timeText: moment().format('HH:mm:ss YYYY/MM/DD'),
      weekIndex: moment().day(),
      logoSrc: Cookie.get('enterpriseLogo'),
      fullScreen: false,
    };
  }

  componentDidMount(){
    this.timeClock = setTimeout(this.getCurrentTime, 1000);
  }

  componentWillUnmount(){
    clearTimeout(this.timeClock);
  }

  getCurrentTime = () => {
    this.setState({
      timeText: moment().format('HH:mm:ss YYYY/MM/DD'),
      weekIndex: moment().day(),
    });
    this.timeClock = setTimeout(this.getCurrentTime, 1000);
  }

  timeClock = null;
  weekDay = ['日', '一', '二', '三', '四', '五', '六'];

  // <div className={styles.infoShow}>
  //         <div className={styles.upperArrow}>
  //         </div>
  //         <div className={styles.userShow}>
  //         </div>
  //       </div>
  //       <div className={styles.enterpriseTitle}>
  //         {/* 
  //         </div> */}
  //         {/*  */}
  //       </div>

  toggleFullScreen = () => { // 切换全屏。
    const { fullScreen } = this.state;
    const { documentElement } = document;
    const allowFull = documentElement.requestFullScreen || documentElement.webkitRequestFullScreen || documentElement.mozRequestFullScreen || documentElement.msRequestFullScreen;
    const allowBack = document.cancelFullScreen || document.webkitCancelFullScreen || document.mozCancelFullScreen || document.exitFullScreen;
    if(!fullScreen){
      if(allowFull){
        allowFull.call(documentElement);
      }else{
        const wscript = window.ActiveXObject && new window.ActiveXObject('WScript.Shell');
        wscript && wscript.SendKeys('{F11}');
      }
    }
    if(allowBack){
      allowBack.call(document);
    }else{
      const wscript = window.ActiveXObject && new window.ActiveXObject('WScript.Shell');
      wscript && wscript.SendKeys('{F11}');
    }
    this.setState({ fullScreen: !fullScreen });
  }

  render(){
    const { logoSrc, fullScreen, timeText, weekIndex } = this.state;
    const {
      energySaving, changeLoginStore, resetMonitorData, username, userFullName, userLogo, realTimeInfo, resetCommonStore,
    } = this.props;
    const { enterpriseName } = realTimeInfo;
    return (
      <div className={styles.topParts}>
        <div className={styles.leftTop}>
          <div className={styles.logo}>
            <img src={logoSrc} height={40} />
          </div>
          <div className={styles.text}>年累计节能减排</div>
          <div className={styles.save}>
            <img src="/img/co2.png" height="20px" />
            <span className={styles.value}>{dataFormat(energySaving.dioxide)}</span>
            <span className={styles.unit}>kt</span>
            <img src="/img/hot.png" height="20px" />
            <span className={styles.value}>{dataFormat(energySaving.coal)}</span>
            <span className={styles.unit}>kt</span>
          </div>
        </div>
        <div className={styles.middleTop}>
          <Link to="/monitor/station" className={styles.back}>
            <img width="25px" height="20px" src="/img/back.gif" />
          </Link>
          <div className={styles.title}>{enterpriseName || '--'}epower智慧运维平台</div>
        </div>
        <div className={styles.rightTop}>
          <div className={styles.baseInfo}>
            <UserInfo
              changeLoginStore={changeLoginStore}
              inHomepage resetMonitorData={resetMonitorData}
              username={username}
              userFullName={userFullName}
              userLogo={userLogo}
              resetCommonStore={resetCommonStore}
            />
            <span className={styles.timeShow}>{timeText} 星期{this.weekDay[weekIndex]}</span>
          </div>
          <div className={styles.screenHandle}>
            <img
              src={`/img/${fullScreen?'small':'big'}.png`}
              height="28px"
              width="28px"
              onClick={this.toggleFullScreen}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default TopParts;
