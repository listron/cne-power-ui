import React from 'react';
import styles from './homepageParts.scss';
import moment from 'moment';
import UserInfo from '../Layout/UserInfo';

const HomepageTop = ({ changeLoginStore }) => {
  const timeText = moment().format('HH:mm:ss YYYY/MM/DD');
  const weekDay = ['日','一','二','三','四','五','六'];
  const weekIndex = moment().day();
  return (<div className={styles.topBox}>
    <div className={styles.infoShow}>
      <div className={styles.timeShow}>{timeText} 星期{weekDay[weekIndex]}</div>\
      <div className={styles.upperArrow}>
        <img width="40px" height="34px" src="/img/back.gif" />
      </div>
      <div className={styles.userShow}>
        <UserInfo changeLoginStore={changeLoginStore} inHomepage />
        <img className={styles.logo} width="171px" height="40px" src="/img/powerLogo.png" />
      </div>
    </div>
    <h1 className={styles.enterpriseTitle}>协合新能源集团运营监控中心(api unkown)</h1>
  </div>)
}

export default HomepageTop;