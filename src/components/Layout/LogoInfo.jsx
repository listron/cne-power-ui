import React from 'react';
import Cookie from 'js-cookie';
import styles from './layout.scss';

function LogoInfo(){
  const enterpriseLogo = Cookie.get('enterpriseLogo') || '/img/logo.png';
  const enterpriseName = Cookie.get('enterpriseName');
  return (
    <div className={styles.layoutLogo}>
      <img height="32px" src={enterpriseLogo} />
      <span className={styles.enterpriseName}>{enterpriseName}</span>
    </div>
  )
}

export default LogoInfo