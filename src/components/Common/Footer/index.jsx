import React, { Component } from 'react';
import styles from './style.scss';
import PropTypes from 'prop-types';

class Footer extends Component {
  static propTypes = {
    theme: PropTypes.string,
  }

  static defaultProps = {
    theme: 'light',
  }

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { theme } = this.props;
    return (
      <div className={`${styles.footer} ${theme === 'dark' ? styles.darkFooter : styles.lightFooter}`}>
        <span className={styles.footerText}>京ICP备12030847号-2 © 2017-2019 北京动力协合科技有限公司</span>
      </div>
    );
  }
}

export default Footer;
