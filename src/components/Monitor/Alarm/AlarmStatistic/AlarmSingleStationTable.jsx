import React from "react";
import PropTypes from "prop-types";
import styles from './alarmStatistic.scss';
import { Table } from "antd";
import moment from 'moment';
import CommonPagination from '../../../Common/CommonPagination';

class AlarmSingleStationTable extends React.Component {
  static propTypes = {
    singleAlarmStatistic: PropTypes.array,
  }
  constructor(props) {
    super(props);
    this.state = {
      pageNum: 1,
      pageSize: 10,
    }
  }
  onPaginationChange = ({ currentPage, pageSize }) => {//分页器
    this.setState({
      pageNum: currentPage,
      pageSize
    })
  }

  renderColumn() {
    const columns = [
      {
        title: "时间",
        dataIndex: "time",
        key: "time",
        sorter: (a,b) => moment(a.timeOn).isBefore(moment(b.timeOn)),
        render: (text, record) => moment(text).format('YYYY-MM-DD HH:mm'),
      },
      {
        title: "告警总数",
        dataIndex: "alarmNum",
        key: "alarmNum",
        sorter: (a, b) => a.alarmNum - b.alarmNum,

      },
      {
        title: "转工单数",
        dataIndex: "transferWorkAlarmNum",
        key: "transferWorkAlarmNum",
        sorter: (a, b) => a.transferWorkAlarmNum - b.transferWorkAlarmNum,

      },
      {
        title: "未转工单数",
        dataIndex: "secondLevelAlarm",
        key: "secondLevelAlarm",
        sorter: (a, b) => a.secondLevelAlarm - b.secondLevelAlarm,

      },
      {
        title: "转工单率",
        dataIndex: "threeWarningNum",
        dataIndex: "threeWarningNum",
        sorter: (a, b) => a.threeWarningNum - b.threeWarningNum
      }
    ];
    return columns;
  }

  render() {
    const { singleAlarmStatistic } = this.props;
    const { pageNum, pageSize, } = this.state;
   
    const totalNum = singleAlarmStatistic.length;
    let startRow = (pageNum - 1) * pageSize;
    let endRow = pageNum * pageSize;
    endRow = (endRow > totalNum) ? totalNum : endRow;
    let data = singleAlarmStatistic.slice(startRow, endRow);
    return (
      <div className={styles.singleStationTable}>
        <div className={styles.pagination}>
          <CommonPagination total={totalNum} onPaginationChange={this.onPaginationChange} />
        </div>
        <Table columns={this.renderColumn()} dataSource={data} onChange={this.onChange} pagination={false} />
      </div>
    );
  }
}
export default AlarmSingleStationTable;