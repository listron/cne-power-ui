import React from 'react';
import styles from './homepageParts.scss';
import moment from 'moment';

const HomepageTop = () => {
  const timeText = moment().format('HH:mm:ss YYYY/MM/DD');
  const weekDay = ['日','一','二','三','四','五','六'];
  const weekIndex = moment().day();
  return (<div className={styles.topBox}>
    <div className={styles.infoShow}>
      <div>{timeText} 星期{weekDay[weekIndex]}</div>
      <div>向上箭头</div>
      <div>
        <span>王师傅</span>
        <span>power+logo</span>
      </div>
    </div>
    <h1>协合新能源集团运营监控中心(api unkown)</h1>
  </div>)
}

export default HomepageTop;