import React, { Component } from 'react';
import { Table } from 'antd';
import styles from './realtimeStyle.scss';
import PropTypes from 'prop-types';
import CommonPagination from '../../../Common/CommonPagination'

class RealtimeList extends Component {
  static propTypes = {
    tableLoading: PropTypes.bool,
    listParam: PropTypes.object,
    queryParam: PropTypes.object,
    listRealtime: PropTypes.object,
    getRealtimeList: PropTypes.func,
    changeRealtimeStore: PropTypes.func,
  }

  onPaginationChange = ({ pageSize, currentPage }) => { // 操作分页器
    const { getRealtimeList, queryParam, listParam, changeRealtimeStore } = this.props;
    const newListParam = {
      ...listParam,
      pageSize,
      pageNum: currentPage,
    }
    changeRealtimeStore({
      listParam: newListParam,
    })
    getRealtimeList({
      queryParam,
      listParam: newListParam,
    })
  }

  getTitle = (title, unit) => { // 标题调整。
    return (
      <div className={styles.listTitle}>
        <div className={styles.text}>{title}</div>
        <div className={styles.unit}>{unit ? `(${unit})` : ''}</div>
      </div>
    )
  }

  render() {
    const { listRealtime, listParam, tableLoading } = this.props;
    const { totalCount, time, dataList = [] } = listRealtime;
    const { pageNum, pageSize } = listParam;
    const { pointData = [] } = dataList[0] || {};
    const columns = [
      {
        title: this.getTitle('设备名称'),
        dataIndex: 'deviceName',
        // className: 'deviceName',
      }, {
        title: this.getTitle('电站名称'),
        dataIndex: 'stationName',
        // className: 'stationName',
      }, {
        title: this.getTitle('设备类型'),
        dataIndex: 'deviceTypeName',
        // className: 'deviceTypeName',
      }, {
        title: this.getTitle('型号'),
        dataIndex: 'deviceModeName',
        // className: 'deviceModeName',
      }
    ];
    
    const pointColumn = pointData.map(e => ({
      title: this.getTitle(e.pointName, e.pointUnit),
      dataIndex: e.devicePointCode,
      // align: 'right'
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
      }
    });
    return (
      <div className={styles.realtimeList}>
        <div className={styles.pagination}>
          <span className={styles.text}>刷新时间: {time}</span>
          <CommonPagination currentPage={pageNum} pageSize={pageSize} total={totalCount} onPaginationChange={this.onPaginationChange} />
        </div>
        <Table
          loading={tableLoading}
          dataSource={dataSource}
          columns={columns.concat(pointColumn)}
          pagination={false}
          locale={{emptyText:<img width="223" height="164" src="/img/nodata.png" />}}
        />
      </div>
    )
  }
}

export default RealtimeList;