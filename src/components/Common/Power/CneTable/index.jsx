
import React from 'react';
import { Table } from 'antd';
import PropTypes from 'prop-types';
import styles from './index.scss';

export default function CneTable({ ...props }) {
  const { theme = 'light', className, ...rest } = props;
  return <Table className={`${styles.cneTable} ${className} ${styles[theme]}`} {...rest} />;
}

CneTable.propTypes = {
  theme: PropTypes.string,
  className: PropTypes.any,
};






















