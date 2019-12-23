import React, { Component } from 'react';
import { Table } from 'antd';
import styles from './pvRealtimeStyle.scss';
import PropTypes from 'prop-types';
import moment from 'moment';
import CommonPagination from '../../../Common/CommonPagination';
import TableColumnTitle from '../../../Common/TableColumnTitle';
import { numWithComma } from '../../../../utils/utilFunc';

class PvRealtimeList extends Component {
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

  render() {
    const { listRealtime, listParam, tableLoading } = this.props;
    const { totalCount = 0, time, dataList = [] } = listRealtime;
    const { pageNum, pageSize } = listParam;
    const { pointData = [] } = dataList[0] || {};
    const columns = [
      {
        title: '设备名称',
        dataIndex: 'deviceName',
        className: 'deviceName',
        render: (text) => <span title={text}>{text}</span>
      }, {
        title: '电站名称',
        dataIndex: 'stationName',
        className: 'stationName',
        render: (text) => <span title={text}>{text}</span>
      }, {
        title: '设备类型',
        dataIndex: 'deviceTypeName',
        className: 'deviceTypeName',
        render: (text) => <span title={text}>{text}</span>
      }, {
        title: '型号',
        dataIndex: 'deviceModeName',
        className: 'deviceModeName',
        render: (text) => <span title={text}>{text}</span>
      }
    ];

    const pointColumn = pointData.map(e => ({
      title: e.pointUnit ? () => (<TableColumnTitle
        title={e.pointName}
        unit={e.pointUnit}
        style={{ paddingTop: 0, maxWidth: '100%', height: '52px' }}
      />) : e.pointName,
      dataIndex: e.devicePointCode,
      className: 'points',
      render: value => numWithComma(parseFloat(value).toFixed(2)),
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
          <span className={styles.text}>刷新时间: {moment(time).format('YYYY-MM-DD HH:mm:ss')}</span>
          <CommonPagination
            currentPage={pageNum}
            pageSize={pageSize}
            total={parseInt(totalCount)}
            onPaginationChange={this.onPaginationChange}
          />
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

export default PvRealtimeList;
