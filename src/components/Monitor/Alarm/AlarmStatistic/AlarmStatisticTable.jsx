import React from "react";
import PropTypes from "prop-types";
import styles from './alarmStatistic.scss';
import { Table } from "antd";
import CommonPagination from '../../../Common/CommonPagination';

class AlarmStatisticTable extends React.Component {
  static propTypes = {
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    stationDataList: PropTypes.array,
    alarmStatistic:PropTypes.array,
 
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
        title: "电站名称",
        dataIndex: "stationName",
        key: "stationName",
        sorter: (a, b) => a.stationName.localeCompare(b.stationName),
        render: (value, record, index) => {
          return {
            children: (<a href={'javascript:void(0)'} onClick={() => console.log("record", '跳转到单电站')} ><div className={styles.stationName}>{record.stationName}</div></a>
            )
          }
        }
      },
      {
        title: "告警总数",
        dataIndex: "alarmNum",
        key: "alarmNum",
        sorter: (a, b) => a.allAlarmNum - b.allAlarmNum,
      },
      {
        title: "一级总数",
        dataIndex: "oneWarningNum",
        key: "oneWarningNum",
        sorter: (a, b) => a.oneWarningNum - b.oneWarningNum,

      },
      {
        title: "二级总数",
        dataIndex: "twoWarningNum",
        key: "twoWarningNum",
        sorter: (a, b) => a.secondLevelAlarm - b.secondLevelAlarm,

      },
      {
        title: "三级总数",
        dataIndex: "threeWarningNum",
        key: "threeWarningNum",
        sorter: (a, b) => a.threeWarningNum - b.threeWarningNum
      },
      {
        title: "四级总数",
        dataIndex: "fourWarningNum",
        key: "fourWarningNum",
        sorter: (a, b) => a.fourWarningNum - b.fourWarningNum
      },
      {
        title: "平均处理时间",
        dataIndex: "handleAvgTime",
        key: "handleAvgTime",
        sorter: (a, b) => a.handleAvgTime - b.handleAvgTime
      },
      {
        title: "一级处理时间",
        dataIndex: "oneHandleAvgTime",
        key: "oneHandleAvgTime",
        sorter: (a, b) => a.oneHandleAvgTime - b.oneHandleAvgTime,
      },
      {
        title: "二级处理时间",
        dataIndex: "twoHandleAvgTime",
        key: "twoHandleAvgTime",
        sorter: (a, b) => a.twoHandleAvgTime - b.twoHandleAvgTime,
      },
      {
        title: "三级处理时间",
        dataIndex: "threeHandleAvgTime",
        key: "threeHandleAvgTime",
        sorter: (a, b) => a.threeHandleAvgTime - b.threeHandleAvgTime
      },
      {
        title: "四级处理时间",
        dataIndex: "fourHandleAvgTime",
        key: "fourHandleAvgTime",
        sorter: (a, b) => a.fourHandleAvgTime - b.fourHandleAvgTime
      },
    ];    

    return columns;
  }
  render() {
    const { alarmStatistic } = this.props;
    const { pageNum, pageSize, } = this.state;
    const totalNum = alarmStatistic.length;
    let startRow = (pageNum - 1) * pageSize;
    let endRow = pageNum * pageSize;
    endRow = (endRow > totalNum) ? totalNum : endRow;
    let data = alarmStatistic.slice(startRow, endRow).map((item,index)=>{
      item.key=index;
      return item;
    });
    return (
      <div className={styles.alarmStatisticTable}>
        <div className={styles.pagination}>
          <CommonPagination total={totalNum} onPaginationChange={this.onPaginationChange} />
        </div>
        <Table columns={this.renderColumn()} dataSource={data} onChange={this.onChange} pagination={false} />
      </div>
    );
  }
}
export default AlarmStatisticTable;