import React from 'react';
import { Table } from 'antd';
import PropTypes from 'prop-types';
import styles from './index.scss';

/**
 * 现阶段要求所有默认表格只有升序, 降序两种模式,
 * 提前保留props:isSortMode: bool默认false, true时排序模式(升序, 降序, 无序)
 * sortField手动指定得排序字段:string, 与dataIndex对应
 * sortMethod手动指定排序方式:string: ascend descend
 * dataError 数据错误时, 占位图片为数据错误; 无数据时，占位图片为无数据;
 * column内参数textAlign: left /middle / right / none;
 */

export default function CneTable ({ ...props }) {
  const {
    theme = 'light',
    className, sortField, sortMethod, columns, dataError, noMoreDataPic,
    ...rest
  } = props;
  let tableColumn = [...columns];
  if (sortField && sortMethod) {
    tableColumn = columns.map(e => {
      const { sorter, dataIndex, textAlign, className } = e || {};
      if (sorter && sortField === dataIndex) {
        e.sortOrder = sortMethod;
      }
      // textAlign: 默认=left(左padding10px 居左), middle(无padding居中), right(右padding10px居右), none(无padding且居左)
      if (textAlign) {
        e.className = className ? `${className} ${textAlign}Content` : `${textAlign}Content`;
      }
      return { ...e };
    });
  }
  let totalClassName = `${styles.cneTable} ${className || ''} ${styles[theme] || ''}`;
  if (noMoreDataPic) { // 需展示 - 没有更多数据 图片
    totalClassName = `${totalClassName} ${styles.nomore}`;
  }
  return (
    <Table
      columns={tableColumn}
      className={totalClassName}
      locale={{
        emptyText: dataError ? <img
          width="84" height="77" src="/img/datawrong.png"
        /> : <img width="223" height="164" src="/img/nodata.png"
        />,
      }}
      pagination={false}
      {...rest}
    />
  );
}

CneTable.propTypes = {
  theme: PropTypes.string,
  noMoreDataPic: PropTypes.bool,
  dataError: PropTypes.bool,
  sortField: PropTypes.string,
  sortMethod: PropTypes.string,
  className: PropTypes.string,
  columns: PropTypes.array,
};
