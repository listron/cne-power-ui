import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from './custom.scss';

/**
 * title: 表头元素
 * children: 内容元素
 */

export default class CustomTable extends PureComponent {

  static propTypes = {
    className: PropTypes.string,
    theme: PropTypes.string,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    children: PropTypes.any,
  }

  static defaultProps = {
    theme: 'light',
  }

  render(){
    // let totalClassName = `${styles.cneTable} ${className || ''} ${styles[theme] || ''}`;

    const { theme, className, title, children } = this.props;
    return (
      <div className={`${styles.customTable} ${className || ''} ${styles[theme] || ''}`}>
        {title}
        <div className={styles.list}>
          {children}
        </div>
      </div>
    );
  }
}
