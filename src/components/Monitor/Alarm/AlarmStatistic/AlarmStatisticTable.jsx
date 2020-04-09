import React from 'react';
import PropTypes from 'prop-types';
import styles from './alarmStatistic.scss';
import { Table } from 'antd';
import CommonPagination from '../../../Common/CommonPagination';
import { numWithComma } from '../../../../utils/utilFunc';
import CneTable from '../../../Common/Power/CneTable';

class AlarmStatisticTable extends React.Component {
  static propTypes = {
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    orderField: PropTypes.string,
    orderCommand: PropTypes.string,
    alarmStatistic: PropTypes.array,
    allChartLoading: PropTypes.bool,
    stationType: PropTypes.string,
    stationCode: PropTypes.array,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
    getStationsAlarmStatistic: PropTypes.func,
    changeAlarmStatisticStore: PropTypes.func,
  }
  constructor(props) {
    super(props);
  }

  onPaginationChange = ({ currentPage, pageSize }) => {//分页器
    const { getStationsAlarmStatistic, changeAlarmStatisticStore, stationType, stationCode, startTime, endTime, orderField, orderCommand } = this.props;
    if (stationCode.length > 0) {
      changeAlarmStatisticStore({
        pageNum: currentPage,
        pageSize,
      });

      getStationsAlarmStatistic({
        stationType, stationCode, startTime, endTime, pageSize, pageNum: currentPage, orderField, orderCommand,
      });
    }
  }

  onChangeTable = (pagination, filters, sorter) => {
    const { getStationsAlarmStatistic, changeAlarmStatisticStore, stationType, stationCode, startTime, endTime, pageSize, pageNum, orderField, orderCommand } = this.props;
    const { field } = sorter;
    const arr = ['stationName', 'alarmNum', 'oneWarningNum', 'twoWarningNum', 'threeWarningNum', 'fourWarningNum', 'handleAvgTime', 'oneHandleAvgTime', 'twoHandleAvgTime', 'threeWarningNum', 'fourHandleAvgTime'];

    if (stationCode.length > 0) {
      let newOrderField = orderField, newOrderCommand = '2';
      if (!field || (`${arr.findIndex(e => e === field) + 1}` === newOrderField)) { // 点击的是正在排序的列
        newOrderCommand = orderCommand === '1' ? '2' : '1'; // 交换排序方式
      } else { // 切换列
        newOrderField = `${arr.findIndex(e => e === field) + 1}`;
      }
      changeAlarmStatisticStore({
        orderField: newOrderField,
        orderCommand: newOrderCommand,
      });

      getStationsAlarmStatistic({
        stationType, stationCode, startTime, endTime, pageSize, pageNum,
        orderField: newOrderField,
        orderCommand: newOrderCommand,
      });
    }
  }

  getDuration(seconds) {
    const date = (+seconds / 60 / 60).toFixed(2);
    return `${date}h`;
  }

  renderColumn() {
    const columns = [
      {
        title: '电站名称',
        dataIndex: 'stationName',
        key: 'stationName',
        sorter: true,
        className: styles.stationName,
        render: (text) => (<div title={text || '--'} className={styles.stationNameText} title={text}>{text || '--'}</div>),
      }, {
        title: '告警总数',
        dataIndex: 'alarmNum',
        key: 'alarmNum',
        render: value => numWithComma(value),
        sorter: true,
        textAlign: 'right',
        width: '8%',
      }, {
        title: '一级总数',
        dataIndex: 'oneWarningNum',
        key: 'oneWarningNum',
        render: value => numWithComma(value),
        sorter: true,
        textAlign: 'right',
        width: '8%',
      }, {
        title: '二级总数',
        dataIndex: 'twoWarningNum',
        key: 'twoWarningNum',
        render: value => numWithComma(value),
        sorter: true,
        textAlign: 'right',
        width: '8%',
      }, {
        title: '三级总数',
        dataIndex: 'threeWarningNum',
        key: 'threeWarningNum',
        render: value => numWithComma(value),
        sorter: true,
        textAlign: 'right',
        width: '8%',
      }, {
        title: '四级总数',
        dataIndex: 'fourWarningNum',
        key: 'fourWarningNum',
        render: value => numWithComma(value),
        sorter: true,
        textAlign: 'right',
        width: '8%',
      }, {
        title: '平均处理时间',
        dataIndex: 'handleAvgTime',
        key: 'handleAvgTime',
        textAlign: 'right',
        render: (text, record) => this.getDuration(text),
        sorter: true,
        width: '10%',
      }, {
        title: '一级处理时间',
        dataIndex: 'oneHandleAvgTime',
        key: 'oneHandleAvgTime',
        textAlign: 'right',
        render: (text, record) => this.getDuration(text),
        sorter: true,
        width: '10%',
      }, {
        title: '二级处理时间',
        dataIndex: 'twoHandleAvgTime',
        key: 'twoHandleAvgTime',
        textAlign: 'right',
        render: (text, record) => this.getDuration(text),
        sorter: true,
        width: '10%',
      }, {
        title: '三级处理时间',
        dataIndex: 'threeHandleAvgTime',
        key: 'threeHandleAvgTime',
        textAlign: 'right',
        render: (text, record) => this.getDuration(text),
        sorter: true,
        width: '10%',
      }, {
        title: '四级处理时间',
        dataIndex: 'fourHandleAvgTime',
        key: 'fourHandleAvgTime',
        textAlign: 'right',
        render: (text, record) => this.getDuration(text),
        sorter: true,
        width: '10%',
      },
    ];

    return columns;
  }
  render() {
    const { alarmStatistic, pageNum, pageSize, allChartLoading, orderField, orderCommand } = this.props;
    const totalNum = alarmStatistic.length;
    const startRow = (pageNum - 1) * pageSize;
    let endRow = pageNum * pageSize;
    endRow = (endRow > totalNum) ? totalNum : endRow;
    const data = alarmStatistic.slice(startRow, endRow).map((item, index) => {
      item.key = index;
      return item;
    });
    const colunmnKeys = ['stationName', 'alarmNum', 'oneWarningNum', 'twoWarningNum', 'threeWarningNum', 'fourWarningNum', 'handleAvgTime', 'oneHandleAvgTime', 'twoHandleAvgTime', 'threeWarningNum', 'fourHandleAvgTime'];
    const sortMethod = ['ascend', 'descend'];

    return (
      <div className={styles.alarmStatisticTable}>
        <div className={styles.pagination}>
          <CommonPagination pageSize={pageSize} currentPage={pageNum} total={totalNum} onPaginationChange={this.onPaginationChange} />
        </div>
        <CneTable
          columns={this.renderColumn()}
          dataSource={data}
          pagination={false}
          loading={allChartLoading}
          // dataError={diagnoseListError}
          sortField={colunmnKeys[orderField - 1]}
          sortMethod={sortMethod[orderCommand - 1]}
          onChange={this.onChangeTable}
        />
      </div>
    );
  }
}
export default AlarmStatisticTable;
