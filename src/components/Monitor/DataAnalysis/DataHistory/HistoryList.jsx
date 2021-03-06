import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Table, Icon } from 'antd';
import styles from './historyStyle.scss';
import PropTypes from 'prop-types';
import CommonPagination from '../../../Common/CommonPagination';
import moment from 'moment';
import TableColumnTitle from '../../../Common/TableColumnTitle';
import { numWithComma } from '../../../../utils/utilFunc';


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
      },
    });

    const historyTable = ReactDOM.findDOMNode(this.onScroll),
    historyTableBody = historyTable.querySelector('.ant-table-body');
    historyTableBody.scrollTop = 0; // 操作分页时，表格内容滚动到行首
  }
  showChart = () => {
    this.selectHistoryType('chart');
  }

  showList = () => {
    this.selectHistoryType('list');
  }
  selectHistoryType = (historyType) => { // 切换图表展示类型 'chart'图 / 'list'表格
    const { changeHistoryStore } = this.props;
    changeHistoryStore({ historyType });
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
    );
  }

  render() {
    const { partHistory, listParam, queryParam, tableLoading, historyType } = this.props;
    const { totalCount = 0, dataList = [] } = partHistory;
    const { timeInterval } = queryParam;
    const { pageNum, pageSize } = listParam; // orderField
    const { pointData = [] } = dataList[0] || {};
    const clientWidth = document.body.clientWidth;
    //动态计算冻结列，根据可是窗口1440-1920区间，table的实际宽度为964-1444px,固定列宽度和为700px，测点列设置的为120px,所以的不同宽度下，不同的测点数量，选择何时激活fixed,
    const fixedNum = (clientWidth - 476 - 700) / 120;
    const columns = [
      {
        title: '设备名称',
        dataIndex: 'deviceName',
        // className: 'deviceName',
        fixed: pointData.length > fixedNum ? 'left' : false,
        width: 120,
        render: (text) => <div style={{ paddingLeft: '12px' }} className={styles.deviceTypeName} title={text}>{text}</div>,
        // sorter: true,
        // className: orderField === 'deviceName' ? null : styles.sorterType,
        // sortOrder: this.getSortOrder('deviceName')
      }, {
        title: '电站名称',
        dataIndex: 'stationName',
        // className: 'stationName',
        fixed: pointData.length > fixedNum ? 'left' : false,
        width: 120,
        render: (text) => <div className={styles.deviceTypeName} title={text}>{text}</div>,
        // sorter: true,
        // className: orderField === 'stationName' ? null : styles.sorterType,
        // sortOrder: this.getSortOrder('stationName')
      }, {
        title: '设备类型',
        dataIndex: 'deviceTypeName',
        // className: 'deviceTypeName',
        fixed: pointData.length > fixedNum ? 'left' : false,
        width: 120,
        render: (text) => <div className={styles.deviceTypeName} title={text}>{text}</div>,
        // sorter: true,
        // className: orderField === 'deviceTypeName' ? null : styles.sorterType,
        // sortOrder: this.getSortOrder('deviceTypeName')
      }, {
        title: '型号',
        dataIndex: 'deviceModeName',
        // className: 'deviceModeName',
        fixed: pointData.length > fixedNum ? 'left' : false,
        width: 170,
        render: (text) => <div className={styles.deviceModeName} title={text}>{text}</div>,
        // sorter: true,
        // className: orderField === 'deviceModeName' ? null : styles.sorterType,
        // sortOrder: this.getSortOrder('deviceModeName')
      }, {
        title: '时间',
        dataIndex: 'time',
        // className: 'time',
        fixed: pointData.length > fixedNum ? 'left' : false,
        width: 170,
        render: (text) => <div className={styles.time} title={text}>{text}</div>,
        // sorter: true,
        // className: orderField === 'time' ? null : styles.sorterType,
        // sortOrder: this.getSortOrder('time')
      },
    ];
    const pointColumn = pointData.map(e => ({
      title: e.pointUnit ? () => (<TableColumnTitle
        title={e.pointName}
        unit={e.pointUnit}
        style={{ paddingTop: 12, width: '102px', height: '56px' }}
      />) : e.pointName,
      dataIndex: e.devicePointCode,
      className: 'points',
      render: value => <div className={styles.pointsValue} title={value}>{numWithComma(parseFloat(value).toFixed(2))}</div>,
      // align: 'right'
      // sorter: true,
      // className: orderField === e.e.devicePointCode ? null : styles.sorterType,
      // sortOrder: this.getSortOrder(e.e.devicePointCode)
    }));
    const dataSource = dataList.map((e, i) => { // 数据处理及时间规范。
      const pointInfo = {};
      e.pointData.forEach(point => {
        pointInfo[point.devicePointCode] = point.pointValue;
      });
      return {
        key: i,
        ...e,
        ...pointInfo,
        time: e.time ? moment(e.time).format('YYYY-MM-DD HH:mm:ss') : '--',
      };
    });
    return (
      <div className={styles.historyList}>
        <div className={styles.pagination}>
          <div className={styles.tabIcons}>
            <i onClick={this.showChart} className={historyType === 'chart' ? `${styles.active} iconfont icon-drawing` : `${styles.normal} iconfont icon-drawing`} />
            <i onClick={this.showList} className={historyType === 'list' ? `${styles.active} iconfont icon-table` : `${styles.normal} iconfont icon-table`} />
          </div>
          <span className={styles.eachTitle}>各设备测点历史数据趋势</span>
          <span className={styles.tipTitle}>数据为瞬时值</span>
        </div>
        <div className={styles.pageStyle}>
          <CommonPagination
            currentPage={pageNum}
            pageSize={pageSize}
            total={parseInt(totalCount)}
            onPaginationChange={this.onPaginationChange}
          />
        </div>
        <Table
          scroll={{ x: 700 + pointData.length * 120, y: 470 }}
          showHeader={true}
          bordered={true}
          loading={tableLoading}
          dataSource={dataSource}
          columns={columns.concat(pointColumn)}
          onChange={this.onListChange}
          // scroll={{ x: 800, y: 500 }}
          pagination={false}
          ref={(ref) => this.onScroll = ref}
          locale={{ emptyText: <img width="223" height="164" src="/img/nodata.png" /> }}
        />
      </div>
    );
  }
}

export default HistoryList;
