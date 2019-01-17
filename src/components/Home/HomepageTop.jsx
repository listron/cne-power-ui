import React, { Component } from 'react';
import styles from './homepageParts.scss';
import moment from 'moment';
import UserInfo from '../Layout/UserInfo';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

class HomepageTop extends Component{
  static propTypes = {
    realTimeInfo: PropTypes.object,
    changeLoginStore: PropTypes.func,
  }

  constructor(props){
    super(props);
    this.state = {
      timeText: moment().format('HH:mm:ss YYYY/MM/DD'),
      weekIndex: moment().day(),
      fullScreen: false,
    }
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
    this.timeClock = setTimeout(this.getCurrentTime,1000);
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
        const wscript = window.ActiveXObject && new window.ActiveXObject("WScript.Shell");
        wscript && wscript.SendKeys("{F11}");
      }
    }else{
      if(allowBack){
        allowBack.call(document);
      }else{
        const wscript = window.ActiveXObject && new window.ActiveXObject("WScript.Shell");
        wscript && wscript.SendKeys("{F11}");
      }
    }
    this.setState({ fullScreen: !fullScreen });
  }
  
  render(){
    const weekDay = ['日','一','二','三','四','五','六'];
    const { timeText, weekIndex, fullScreen } = this.state;
    const { changeLoginStore, realTimeInfo } = this.props;
    let { enterpriseName } = realTimeInfo;
    return (
      <div className={styles.topBox}>
        <div className={styles.infoShow}>
          <div className={styles.timeShow}>{timeText} 星期{weekDay[weekIndex]}</div>
          <div className={styles.upperArrow}>
            <Link to="/monitor/station">
              <img width="40px" height="34px" src="/img/back.gif" />
            </Link>
          </div>
          <div className={styles.userShow}>
            <UserInfo changeLoginStore={changeLoginStore} inHomepage />
            <img className={styles.logo} width="171px" height="40px" src="/img/powerLogo.png" />
          </div>
        </div>
        <h1 className={styles.enterpriseTitle}>
          {enterpriseName || '--'}运营监控中心
          <img src={`/img/${fullScreen?'small':'big'}.png`} height="28px" width="28px" onClick={this.toggleFullScreen} />
        </h1>
      </div>
    )
  }
}

export default HomepageTop;
