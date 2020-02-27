import React from 'react';
import { Button } from 'antd';
import PropTypes from 'prop-types';
import styles from './index.scss';

/**
 * 基础交互沿用antd Button, 参数可直接顺序传递
 * 样式额外添加cnebtn, hover有背景色由中扩散至全部按钮, 不同屏幕分辨率下, 按钮文字大小适配变化
 * theme样式为保留参数, 后续控制主体样色 - 默认浅色light
 *
 */

export default function CneButton ({ ...props }) {
  const { theme = 'light', className, children, ...rest } = props;
  return (
    <Button
      className={`${styles[theme]} ${styles.cnebtn} ${className || ''}`}
      {...rest}
    >{children}</Button>
  );
}

CneButton.propTypes = {
  theme: PropTypes.string,
  dataError: PropTypes.bool,
  sortField: PropTypes.string,
  sortMethod: PropTypes.string,
  className: PropTypes.string,
  columns: PropTypes.array,
  children: PropTypes.any,
};
