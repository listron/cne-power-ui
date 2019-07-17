import React, { Component } from 'react';
import styles from './homepageParts.scss';
import moment from 'moment';
import UserInfo from '../Layout/UserInfo';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { dataFormat } from '../../utils/utilFunc';

class HomepageTop extends Component{
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
    const weekDay = ['日', '一', '二', '三', '四', '五', '六'];
    const { timeText, weekIndex, fullScreen } = this.state;
    const {
      changeLoginStore, realTimeInfo, energySaving, resetMonitorData, resetCommonStore, username, userFullName, userLogo,
    } = this.props;
    const { enterpriseName } = realTimeInfo;
    const dioxide = dataFormat(energySaving.dioxide);
    const coal = dataFormat(energySaving.coal);
    return (
      <div className={styles.topBox}>
        <div className={styles.infoShow}>
          <div className={styles.timeShow}>{timeText} 星期{weekDay[weekIndex]}</div>
          <div className={styles.upperArrow}>
            <Link to="/monitor/station">
              <img width="25px" height="20px" src="/img/back.gif" />
            </Link>
          </div>
          <div className={styles.userShow}>
            <UserInfo
              changeLoginStore={changeLoginStore}
              inHomepage resetMonitorData={resetMonitorData}
              username={username}
              userFullName={userFullName}
              userLogo={userLogo}
              resetCommonStore={resetCommonStore}
            />
            <img className={styles.logo} width="105px" height="26px" src="/img/powerLogo.png" />
          </div>
        </div>
        <div className={styles.enterpriseTitle}>
          <div className={styles.saving}>
            <div className={styles.savingText}>年累计节能减排</div>
            <div className={styles.saveInfo}>
              <span className={styles.eachSaving}>
                <img src="/img/co2.png" height="20px" />
                <span className={styles.value}>{dioxide}</span>
                <span className={styles.unit}>kt</span>
              </span>
              <span className={styles.eachSaving}>
                <img src="/img/hot.png" height="20px" />
                <span className={styles.value}>{coal}</span>
                <span className={styles.unit}>kt</span>
              </span>
            </div>
          </div>
          <div className={styles.title}>{enterpriseName || '--'}运营监控中心</div>
          <div className={styles.sizeImg}>
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

export default HomepageTop;
