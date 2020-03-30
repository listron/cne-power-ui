import React from 'react';
import { Button, Icon } from 'antd';
import PropTypes from 'prop-types';
import styles from './index.scss';

/**
 * 基础交互沿用antd Button, 参数可直接顺序传递
 * 样式额外添加cnebtn, hover有背景色由中扩散至全部按钮, 不同屏幕分辨率下, 按钮文字大小适配变化
 * theme样式为保留参数, 后续控制主体样色 - 默认浅色light
 *
 */

export default function CneButton ({ ...props }) {
  const {
    theme = 'light',
    className, children, disabled,
    iconname, antdIcon, lengthMode,
    ...rest
  } = props;
  const lengthInfo = {
    short: styles.short, // 默认
    long: styles.long,
  }
  // const size
  // iconname - iconfont
  // antdIcon - antd 图标
  // 图标的位置自动化
  // button按钮宽度自适应
  // button按钮支持长短模式;
  let baseClassName = `${styles[theme]} ${styles.cnebtn} ${className || ''}`;
  if (lengthMode) {
    baseClassName = `${baseClassName} ${lengthInfo[lengthMode] || styles.short}`;
  }
  if (iconname || antdIcon) {
    baseClassName = `${baseClassName} ${styles.hasIcon}`;
  }
  if (disabled) {
    rest.onClick = null;
  }
  return (
    <Button
      className={baseClassName}
      {...rest}
      disabled
    >
      {iconname && <span className={`iconfont ${iconname}`} />}
      {antdIcon && <Icon className="iconfont" type={antdIcon} />}
      {children}
    </Button>
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
  disabled: PropTypes.bool,
  iconname: PropTypes.string,
  antdIcon: PropTypes.string,
  lengthMode: PropTypes.string
};
