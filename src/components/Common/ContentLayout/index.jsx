

import React from 'react';
import CommonBreadcrumb from '../CommonBreadcrumb';
import Footer from '../Footer';
import styles from './index.scss';
import PropTypes from 'prop-types';

export default function ContentLayout ({
  children, layoutClassName, contentClassName, breadcrumb={}, theme = 'light', hasFooter = true,
}) { // 普通页面布局
  const hasBreadCrumb = Object.keys(breadcrumb).length > 0;
  return(
    <div className={`${styles.contentLayout} ${styles[theme]} ${layoutClassName}`}>
      {hasBreadCrumb && <CommonBreadcrumb {...breadcrumb} />}
      <div className={`${styles.contentBox} ${contentClassName}`}>
        {children}
      </div>
      {hasFooter && <Footer />}
    </div>
  );
}

ContentLayout.propTypes = {
  children: PropTypes.any,
  breadcrumb: PropTypes.object, // 可写 面包屑内容
  theme: PropTypes.string, // 可写: 主体关键字, 默认浅色主体
  layoutClassName: PropTypes.string, // 可写 页面外部layout单独的样式, 默认无
  contentClassName: PropTypes.string, // 可写 页面主要布局单独的样式, 默认无
  hasFooter: PropTypes.bool, // 可写, 是否有footer, 默认有页脚
};

// function OverflowLayout // 后续可单独定义: 允许滚动布局

// function FlexLayout // 后续可单独定义: 弹性布局

