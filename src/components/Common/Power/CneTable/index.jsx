
import React from 'react';
import { Table } from 'antd';
import PropTypes from 'prop-types';
import styles from './index.scss';

export default function CneTable ({ ...props }) {
  const { theme = 'light', className, ...rest } = props;
  return (
    <Table
      className={`${styles.cneTable} ${className} ${styles[theme]}`}
      locale={{ emptyText: <img width="223" height="164" src="/img/nodata.png" /> }}
      pagination={false}
      {...rest}
    />
  );
}

CneTable.propTypes = {
  theme: PropTypes.string,
  className: PropTypes.string,
};






















