import React, { Component } from 'react';
import styles from './style.scss';
import PropTypes from 'prop-types';
import Cookie from 'js-cookie';

class Footer extends Component {
  static propTypes = {
    className: PropTypes.string,
  }


  constructor(props) {
    super(props);
  }

  render() {
    const theme = Cookie.get('theme') || 'light';
    const { className } = this.props;
    return (
      <div className={`${styles.footer} ${theme === 'dark' ? styles.darkFooter : styles.lightFooter} ${className}`}>
        <span className={styles.footerText}>京ICP备12030847号-2 © 2017-2020 北京动力协合科技有限公司</span>
      </div>
    );
  }
}

export default Footer;
