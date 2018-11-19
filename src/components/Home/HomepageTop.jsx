import React, { Component } from 'react';
import styles from './homepageParts.scss';
import moment from 'moment';
import UserInfo from '../Layout/UserInfo';
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
  
  render(){
    const weekDay = ['日','一','二','三','四','五','六'];
    const { timeText, weekIndex } = this.state;
    const { changeLoginStore, realTimeInfo } = this.props;
    let { enterpriseName } = realTimeInfo;
    return (
      <div className={styles.topBox}>
        <div className={styles.infoShow}>
          <div className={styles.timeShow}>{timeText} 星期{weekDay[weekIndex]}</div>
          <div className={styles.upperArrow}>
            <img width="40px" height="34px" src="/img/back.gif" />
          </div>
          <div className={styles.userShow}>
            <UserInfo changeLoginStore={changeLoginStore} inHomepage />
            <img className={styles.logo} width="171px" height="40px" src="/img/powerLogo.png" />
          </div>
        </div>
        <h1 className={styles.enterpriseTitle}>{enterpriseName || '--'}</h1>
      </div>
    )
  }
}

export default HomepageTop;
