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
  }

  onPaginationChange = ({ pageSize, currentPage }) => { // 操作分页器
    const { getRealtimeList, queryParam, listParam } = this.props;
    getRealtimeList({
      queryParam,
      listParam: {
        ...listParam,
        pageSize,
        pageNum: currentPage,
      }
    })
  }

  render() {
    const { listRealtime, listParam, tableLoading } = this.props;
    const { totalCount, time, dataList = [] } = listRealtime;
    const { pageNum, pageSize } = listParam;
    const { pointData = [] } = dataList[0] || {};
    const columns = [
      {
        title: '设备名称',
        dataIndex: 'deviceName',
      }, {
        title: '电站名称',
        dataIndex: 'stationName',
      }, {
        title: '设备类型',
        dataIndex: 'deviceTypeName',
      }, {
        title: '型号',
        dataIndex: 'deviceModeName',
      }, {
        title: '风速',
        dataIndex: 'speed',
      }
    ];
    
    const pointColumn = pointData.map(e => ({
      title: e.pointName, // e.pointUnit
      dataIndex: e.devicePointCode,
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
          onChange={this.onListChange}
          pagination={false}
          locale={{emptyText:<img width="223" height="164" src="/img/nodata.png" />}}
        />
      </div>
    )
  }
}

export default RealtimeList;