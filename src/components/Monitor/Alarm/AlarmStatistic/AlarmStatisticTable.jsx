import React from 'react';
import PropTypes from 'prop-types';
import styles from './alarmStatistic.scss';
import { Table } from 'antd';
import CommonPagination from '../../../Common/CommonPagination';
import { numWithComma } from '../../../../utils/utilFunc';
import moment from 'moment';

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
    // stationDataList: PropTypes.array,
    // onTableChange: PropTypes.func,
    // onChangeFilter: PropTypes.func,
  }
  constructor(props) {
    super(props);
  }

  onPaginationChange = ({ currentPage, pageSize }) => {//分页器
    // this.props.onTableChange({
    //   pageNum: currentPage,
    //   pageSize,
    // });
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
    const { getStationsAlarmStatistic, changeAlarmStatisticStore, stationType, stationCode, startTime, endTime, pageSize, pageNum } = this.props;
    const field = sorter.field;
    const arr = ['stationName', 'alarmNum', 'oneWarningNum', 'twoWarningNum', 'threeWarningNum', 'fourWarningNum', 'handleAvgTime', 'oneHandleAvgTime', 'twoHandleAvgTime', 'threeWarningNum', 'fourHandleAvgTime'];
    // this.props.onTableChange({
    //   orderField: (arr.indexOf(field) + 1).toString(),
    //   orderCommand: sorter.order === 'ascend' ? '1' : '2',
    // });
    if (stationCode.length > 0) {
      changeAlarmStatisticStore({
        orderField: (arr.indexOf(field) + 1).toString(),
        orderCommand: sorter.order === 'ascend' ? '1' : '2',
      });

      getStationsAlarmStatistic({
        stationType, stationCode, startTime, endTime, pageSize, pageNum, orderField: (arr.indexOf(field) + 1).toString(), orderCommand: sorter.order === 'ascend' ? '1' : '2',
      });
    }
  }

  getDuration(seconds) {
    // console.log('seconds: ', seconds);
    // const milliseconds = seconds * 1000;
    // const minuteNum = seconds / 60;
    // const duration = moment.duration(milliseconds);
    // const day = parseInt(minuteNum / (60 * 24)) > 99 ? 99 : parseInt(minuteNum / (60 * 24));
    // const displayDay = (day < 10 && day !== 0) ? '0' + day : day;
    // const hour = duration.hours();
    // const displayHour = hour < 10 ? '0' + hour : hour;
    // const minute = duration.minutes();
    // const displayMiute = minute < 10 ? '0' + minute : minute; 
    // return `${displayDay}天${displayHour}小时${displayMiute}分钟`;
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
      }, {
        title: '告警总数',
        dataIndex: 'alarmNum',
        key: 'alarmNum',
        render: value => numWithComma(value),
        sorter: true,
      }, {
        title: '一级总数',
        dataIndex: 'oneWarningNum',
        key: 'oneWarningNum',
        render: value => numWithComma(value),
        sorter: true,
      }, {
        title: '二级总数',
        dataIndex: 'twoWarningNum',
        key: 'twoWarningNum',
        render: value => numWithComma(value),
        sorter: true,
      }, {
        title: '三级总数',
        dataIndex: 'threeWarningNum',
        key: 'threeWarningNum',
        render: value => numWithComma(value),
        sorter: true,
      }, {
        title: '四级总数',
        dataIndex: 'fourWarningNum',
        key: 'fourWarningNum',
        render: value => numWithComma(value),
        sorter: true,
      }, {
        title: '平均处理时间',
        dataIndex: 'handleAvgTime',
        key: 'handleAvgTime',
        render: (text, record) => {
          return this.getDuration(text);
        },
        sorter: true,
      }, {
        title: '一级处理时间',
        dataIndex: 'oneHandleAvgTime',
        key: 'oneHandleAvgTime',
        render: (text, record) => {
          return this.getDuration(text);
        },
        sorter: true,
      }, {
        title: '二级处理时间',
        dataIndex: 'twoHandleAvgTime',
        key: 'twoHandleAvgTime',
        render: (text, record) => {
          return this.getDuration(text);
        },
        sorter: true,
      }, {
        title: '三级处理时间',
        dataIndex: 'threeHandleAvgTime',
        key: 'threeHandleAvgTime',
        render: (text, record) => {
          return this.getDuration(text);
        },
        sorter: true,
      }, {
        title: '四级处理时间',
        dataIndex: 'fourHandleAvgTime',
        key: 'fourHandleAvgTime',
        render: (text, record) => {
          return this.getDuration(text);
        },
        sorter: true,
      },
    ];

    return columns;
  }
  render() {
    const { alarmStatistic, pageNum, pageSize, allChartLoading } = this.props;
    const totalNum = alarmStatistic.length;
    const startRow = (pageNum - 1) * pageSize;
    let endRow = pageNum * pageSize;
    endRow = (endRow > totalNum) ? totalNum : endRow;
    const data = alarmStatistic.slice(startRow, endRow).map((item, index) => {
      item.key = index;
      return item;
    });
    return (
      <div className={styles.alarmStatisticTable}>
        <div className={styles.pagination}>
          <CommonPagination pageSize={pageSize} currentPage={pageNum} total={totalNum} onPaginationChange={this.onPaginationChange} />
        </div>
        <Table
          loading={allChartLoading}
          columns={this.renderColumn()}
          dataSource={data}
          onChange={this.onChangeTable}
          pagination={false}
          locale={{ emptyText: <div className={styles.noData}><img src="/img/nodata.png" style={{ width: 223, height: 164 }} /></div> }}
        />
      </div>
    );
  }
}
export default AlarmStatisticTable;
