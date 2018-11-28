import React from 'react';
import styles from './homeParts.scss';

const StationTypeTag = ({ showTotal, activeType, onChange }) => {
  const activeImg = {background: 'url(/img/all.png)'};
  const normalImg = {background: 'url(/img/other.png)'}
  return (
    <div className={styles.stationTypeTag}>
      {showTotal && <span className={styles.text} style={
        activeType==='all'?activeImg: normalImg
        } onClick={() => onChange('all')}>全</span>
      }
      <span className={styles.text} style={
        activeType==='wind'?activeImg: normalImg
        } onClick={() => onChange('wind')}>风</span>
      <span className={styles.text} style={
        activeType==='pv'?activeImg: normalImg
        } onClick={() => onChange('pv')}>光</span>
    </div>
  )
}

export default StationTypeTag;