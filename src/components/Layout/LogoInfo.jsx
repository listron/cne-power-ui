import React from 'react';
import Cookie from 'js-cookie';
import styles from './layout.scss';

function LogoInfo() {
  const enterpriseLogo = Cookie.get('enterpriseLogo') || '/img/defult_logo.png';
  const enterpriseName = Cookie.get('enterpriseName');
  const theme = Cookie.get('theme');
  return (
    <div className={`${styles.layoutEnterprise}  ${styles[theme]}`} >
      <span className={styles.logoImg}>
        <img src={enterpriseLogo} />
      </span>
      <span className={styles.enterpriseName}>{enterpriseName}</span>
    </div>
  );
}

export default LogoInfo
;