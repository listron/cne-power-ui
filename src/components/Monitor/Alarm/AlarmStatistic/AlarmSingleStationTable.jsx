import React from 'react';
import PropTypes from 'prop-types';
import styles from './alarmStatistic.scss';
import { Table } from 'antd';
import moment from 'moment';
import CommonPagination from '../../../Common/CommonPagination';
import TableColumnTitle from '../../../Common/TableColumnTitle';
import { numWithComma } from '../../../../utils/utilFunc';

class AlarmSingleStationTable extends React.Component {
  static propTypes = {
    singleAlarmStatistic: PropTypes.array,
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    orderField: PropTypes.string,
    orderCommand: PropTypes.string,
    stationType: PropTypes.string,
    stationCode: PropTypes.array,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
    // onChangeFilter: PropTypes.func,
    onPaginationChange: PropTypes.func,
    getStationsAlarmStatistic: PropTypes.func,
    changeAlarmStatisticStore: PropTypes.func,
    singleChartLoading: PropTypes.bool,
  }

  onChangeTable = (pagination, filters, sorter) => {
    const { getStationsAlarmStatistic, changeAlarmStatisticStore, stationType, stationCode, startTime, endTime, pageSize, pageNum } = this.props;
    const field = sorter.field;
    const arr = ['time', 'alarmNum', 'transferWorkAlarmNum', 'noTransferWorkAlarmNum', 'transferWorkRate'];
    // this.props.onChangeFilter({
    //   orderField: (arr.indexOf(field) + 1).toString(),
    //   orderCommand: sorter.order === 'ascend' ? '1' : '2',
    // });
    changeAlarmStatisticStore({
      orderField: (arr.indexOf(field) + 1).toString(),
      orderCommand: sorter.order === 'ascend' ? '1' : '2',
    });

    getStationsAlarmStatistic({
      stationType, stationCode, startTime, endTime, pageSize, pageNum, orderField: (arr.indexOf(field) + 1).toString(), orderCommand: sorter.order === 'ascend' ? '1' : '2',
    });
  }

  renderColumn() {
    const columns = [
      {
        title: '日期',
        dataIndex: 'time',
        key: 'time',
        sorter: true,
        render: (text, record) => moment(text).format('YYYY-MM-DD'),
      },
      {
        title: '告警总数',
        dataIndex: 'alarmNum',
        key: 'alarmNum',
        sorter: true,
        render: value => numWithComma(value),
      },
      {
        title: '转工单数',
        dataIndex: 'transferWorkAlarmNum',
        key: 'transferWorkAlarmNum',
        sorter: true,
        render: value => numWithComma(value),
      },
      {
        title: '未转工单数',
        dataIndex: 'noTransferWorkAlarmNum',
        key: 'noTransferWorkAlarmNum',
        sorter: true,
        render: value => numWithComma(value),
      },
      {
        title: () => <TableColumnTitle title="转工单率" unit="%" />,
        dataIndex: 'transferWorkRate',
        render: value => numWithComma(value),
        sorter: true,
      },
    ];
    return columns;
  }

  render() {
    const { singleAlarmStatistic, pageNum, pageSize, onPaginationChange, singleChartLoading } = this.props;
    const totalNum = singleAlarmStatistic && singleAlarmStatistic.length;
    const startRow = (pageNum - 1) * pageSize;
    let endRow = pageNum * pageSize;
    endRow = (endRow > totalNum) ? totalNum : endRow;
    const data = singleAlarmStatistic && singleAlarmStatistic.slice(startRow, endRow).map((item, index) => {
      item.key = index;
      return item;
    });
    return (
      <div className={styles.singleStationTable}>
        <div className={styles.pagination}>
          <CommonPagination pageSize={pageSize} currentPage={pageNum} total={totalNum} onPaginationChange={onPaginationChange} />
        </div>
        <Table
          loading={singleChartLoading}
          columns={this.renderColumn()}
          dataSource={data}
          onChange={this.onChangeTable}
          pagination={false}
          locale={{ emptyText: <div className={styles.noData}><img src="/img/nodata.png" style={{ width: 223, height: 164 }} /></div> }} />
      </div>
    );
  }
}
export default AlarmSingleStationTable;
