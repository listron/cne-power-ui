import React from 'react';
import PropTypes from 'prop-types';
import styles from './index.scss';

/**
 * 组件说明，
 * 三个参数
 * value 设置文本内容(可选参数)
 * className 自定义样式(可选参数) footer默认透明色背景，如果需要给footer设置背景就需要单独设置className
 * theme (可选参数) 样式为保留参数, 后续控制主体样色 - 默认浅色light
 *
 */

export default function CneButton ({ ...props }) {
  const { theme = 'light', className, value = '京ICP备12030847号-2 © 2017-2019 北京动力协合科技有限公司'} = props;
  return (
    <div
      className={`${styles[theme]} ${styles.footerBox} ${className || ''}`}
    >
      {value}
    </div>
  );
}

CneButton.propTypes = {
  theme: PropTypes.string,
  className: PropTypes.string,
  value: PropTypes.string,
};
