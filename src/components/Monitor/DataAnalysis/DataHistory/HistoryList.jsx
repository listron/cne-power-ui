import React, { Component } from 'react';
import { Table } from 'antd';
import styles from './historyStyle.scss';
import PropTypes from 'prop-types';
import CommonPagination from '../../../Common/CommonPagination'
import moment from 'moment';

class HistoryList extends Component {
  static propTypes = {
    tableLoading: PropTypes.bool,
    listParam: PropTypes.object,
    queryParam: PropTypes.object,
    partHistory: PropTypes.object,
    getListHistory: PropTypes.func,
  }

  onPaginationChange = ({ pageSize, currentPage }) => { // 操作分页器
    const { getListHistory, queryParam, listParam } = this.props;
    getListHistory({
      queryParam,
      listParam: {
        ...listParam,
        pageSize,
        pageNum: currentPage,
      }
    })
  }
  
  // onListChange = (pagination, filter, sorter) => { // 表格排序
  //   const { getListHistory, queryParam, listParam } = this.props;
  //   const { orderField, orderType } = listParam;
  //   const { field, order } = sorter;
  //   getListHistory({
  //     queryParam,
  //     listParam: {
  //       ...listParam,
  //       orderField: field || orderField, // 排序字段(默认时间倒序（最新的时间在最上方）
  //       orderType: order ? (order  === 'ascend' ? 0 : 1) : [1, 0][orderType], //	排序方式	否	0：ASC正序，1：DESC倒序
  //     }
  //   })
  // }

  // getSortOrder = (value) => {
  //   const { listParam } = this.props;
  //   const { orderField, orderType } = listParam;
  //   if (value !== orderField) {
  //     return false;
  //   } else {
  //     return orderType === 0 ? 'ascend' : 'descend'
  //   }
  // }

  getTitle = (title, unit) => { // 标题调整。
    return (
      <div className={styles.listTitle}>
        <div className={styles.text}>{title}</div>
        <div className={styles.unit}>{unit ? `(${unit})` : ''}</div>
      </div>
    )
  }

  render() {
    const { partHistory, listParam, queryParam, tableLoading } = this.props;
    const { totalCount, dataList = [] } = partHistory;
    const { timeInterval } = queryParam;
    const { pageNum, pageSize } = listParam; // orderField
    const { pointData = [] } = dataList[0] || {};
    const columns = [
      {
        title: this.getTitle('设备名称'),
        dataIndex: 'deviceName',
        // sorter: true,
        // className: orderField === 'deviceName' ? null : styles.sorterType,
        // sortOrder: this.getSortOrder('deviceName')
      }, {
        title: this.getTitle('电站名称'),
        dataIndex: 'stationName',
        // sorter: true,
        // className: orderField === 'stationName' ? null : styles.sorterType,
        // sortOrder: this.getSortOrder('stationName')
      }, {
        title: this.getTitle('设备类型'),
        dataIndex: 'deviceTypeName',
        // sorter: true,
        // className: orderField === 'deviceTypeName' ? null : styles.sorterType,
        // sortOrder: this.getSortOrder('deviceTypeName')
      }, {
        title: this.getTitle('型号'),
        dataIndex: 'deviceModeName',
        // sorter: true,
        // className: orderField === 'deviceModeName' ? null : styles.sorterType,
        // sortOrder: this.getSortOrder('deviceModeName')
      }, {
        title: this.getTitle('时间'),
        dataIndex: 'time',
        // sorter: true,
        // className: orderField === 'time' ? null : styles.sorterType,
        // sortOrder: this.getSortOrder('time')
      }, {
        title: this.getTitle('风速', 'm/s'),
        dataIndex: 'speed',
        align: 'right'
        // sorter: true,
        // className: orderField === 'speed' ? null : styles.sorterType,
        // sortOrder: this.getSortOrder('speed')
      }
    ];
    const pointColumn = pointData.map(e => ({
      title: this.getTitle(e.pointName, e.pointUnit),
      dataIndex: e.devicePointCode,
      align: 'right'
      // sorter: true,
      // className: orderField === e.e.devicePointCode ? null : styles.sorterType,
      // sortOrder: this.getSortOrder(e.e.devicePointCode)
    }));
    const dataSource = dataList.map((e, i) => { // 数据处理及时间规范。
      let pointInfo = {}
      e.pointData.forEach(point => {
        pointInfo[point.devicePointCode] = point.pointValue
      })
      return {
        key: i,
        ...e,
        ...pointInfo,
        time: e.time ? moment(e.time).format('YYYY-MM-DD HH:mm:ss') : '--',
      }
    });
    return (
      <div className={styles.historyList}>
        <div className={styles.pagination}>
          <span className={styles.text}>数据为{timeInterval === 10 ? '平均值' : '瞬时值'}</span>
          <CommonPagination currentPage={pageNum} pageSize={pageSize} total={totalCount} onPaginationChange={this.onPaginationChange} />
        </div>
        <Table
          loading={tableLoading}
          dataSource={dataSource}
          columns={columns.concat(pointColumn)}
          // onChange={this.onListChange}
          pagination={false}
          locale={{emptyText:<img width="223" height="164" src="/img/nodata.png" />}}
        />
      </div>
    )
  }
}

export default HistoryList;