import React from 'react';
import PropTypes from 'prop-types';
import styles from './alarmStatistic.scss';
import moment from 'moment';
import CommonPagination from '../../../Common/CommonPagination';
import TableColumnTitle from '../../../Common/TableColumnTitle';
import { numWithComma } from '../../../../utils/utilFunc';
import CneTable from '../../../Common/Power/CneTable';

class AlarmSingleStationTable extends React.Component {
  static propTypes = {
    singleAlarmStatistic: PropTypes.array,
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    summaryType: PropTypes.number,
    stationCode: PropTypes.array,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
    onPaginationChange: PropTypes.func,
    getSingleStationAlarmStatistic: PropTypes.func,
    changeAlarmStatisticStore: PropTypes.func,
    singleChartLoading: PropTypes.bool,
    count: PropTypes.number,
    orderField: PropTypes.string,
    orderCommand: PropTypes.string,
  }

  onChangeTable = (pagination, filters, sorter) => {
    const { getSingleStationAlarmStatistic, changeAlarmStatisticStore, stationCode, startTime, endTime, pageSize, pageNum, summaryType, orderField, orderCommand } = this.props;
    const field = sorter.field;
    const arr = ['time', 'alarmNum', 'transferWorkAlarmNum', 'noTransferWorkAlarmNum', 'transferWorkRate'];

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

    getSingleStationAlarmStatistic({
      stationCode, startTime, endTime, pageSize, pageNum,
      orderField: newOrderField,
      orderCommand: newOrderCommand,
    });
  }

  renderColumn() {
    const columns = [
      {
        title: '日期',
        dataIndex: 'time',
        key: 'time',
        sorter: true,
        textAlign: 'center',
        width: '20%',
        render: (text, record) => moment(text).format('YYYY-MM-DD'),
      },
      {
        title: '告警总数',
        dataIndex: 'alarmNum',
        key: 'alarmNum',
        sorter: true,
        render: value => numWithComma(value),
        textAlign: 'right',
        width: '20%',
      },
      {
        title: '转工单数',
        dataIndex: 'transferWorkAlarmNum',
        key: 'transferWorkAlarmNum',
        sorter: true,
        render: value => numWithComma(value),
        textAlign: 'right',
        width: '20%',
      },
      {
        title: '未转工单数',
        dataIndex: 'noTransferWorkAlarmNum',
        key: 'noTransferWorkAlarmNum',
        sorter: true,
        render: value => numWithComma(value),
        textAlign: 'right',
        width: '20%',
      },
      {
        title: () => '转工单率(%)',
        dataIndex: 'transferWorkRate',
        render: value => numWithComma(value),
        sorter: true,
        textAlign: 'right',
        width: '20%',
      },
    ];
    return columns;
  }

  render() {
    const { singleAlarmStatistic, pageNum, pageSize, onPaginationChange, singleChartLoading, count, orderField, orderCommand } = this.props;
    const colunmnKeys = ['time', 'alarmNum', 'transferWorkAlarmNum', 'noTransferWorkAlarmNum', 'transferWorkRate'];
    const sortMethod = ['ascend', 'descend'];
    return (
      <div className={styles.singleStationTable}>
        <div className={styles.pagination}>
          <CommonPagination pageSize={pageSize} currentPage={pageNum} total={count} onPaginationChange={onPaginationChange} />
        </div>
        <CneTable
          columns={this.renderColumn()}
          dataSource={singleAlarmStatistic.map((e, i) => ({ ...e, key: i }))}
          pagination={false}
          loading={singleChartLoading}
          // dataError={diagnoseListError}
          sortField={colunmnKeys[orderField - 1]}
          sortMethod={sortMethod[orderCommand - 1]}
          onChange={this.onChangeTable}
        />
      </div>
    );
  }
}
export default AlarmSingleStationTable;
