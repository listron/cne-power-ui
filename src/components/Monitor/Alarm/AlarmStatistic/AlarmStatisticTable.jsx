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
  constructor(props, context) {
    super(props, context);
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
  onChange = (pagination, filters, sorter) => {
   // console.log("params", pagination, filters, sorter);
  }
  render() {
    const { alarmStatistic } = this.props;
    const { pageNum, pageSize, } = this.state;
    const totalNum = alarmStatistic.length;
    let startRow = (pageNum - 1) * pageSize;
    let endRow = pageNum * pageSize;
    endRow = (endRow > totalNum) ? totalNum : endRow;
    let datalist = alarmStatistic.slice(startRow, endRow)
    const columns = [
      {
        title: "电站名称",
        dataIndex: "stationName",
        onFilter: (value, record) => record.stationName.indexOf(value) === 0,
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
        dataIndex: "allAlarmNum",
        defaultSortOrder: "descend",
        sorter: (a, b) => a.allAlarmNum - b.allAlarmNum,

      },
      {
        title: "一级总数",
        dataIndex: "oneWarningNum",
        defaultSortOrder: "descend",
        sorter: (a, b) => a.oneWarningNum - b.oneWarningNum,

      },
      {
        title: "二级总数",
        dataIndex: "secondLevelAlarm",
        defaultSortOrder: "descend",
        sorter: (a, b) => a.secondLevelAlarm - b.secondLevelAlarm,

      },
      {
        title: "三级总数",
        dataIndex: "threeWarningNum",
        defaultSortOrder: "descend",
        sorter: (a, b) => a.threeWarningNum - b.threeWarningNum
      },
      {
        title: "四级总数",
        dataIndex: "fourWarningNum",
        defaultSortOrder: "descend",
        sorter: (a, b) => a.fourWarningNum - b.fourWarningNum
      },
      {
        title: "平均处理时间",
        dataIndex: "handleAvgTime",
        defaultSortOrder: "descend",
        sorter: (a, b) => a.handleAvgTime - b.handleAvgTime
      },
      {
        title: "一级处理时间",
        dataIndex: "oneHandleAvgTime",
        defaultSortOrder: "descend",
        sorter: (a, b) => a.oneHandleAvgTime - b.oneHandleAvgTime,

      },
      {
        title: "二级处理时间",
        dataIndex: "twoHandleAvgTime",
        defaultSortOrder: "descend",
        sorter: (a, b) => a.twoHandleAvgTime - b.twoHandleAvgTime,

      },
      {
        title: "三级处理时间",
        dataIndex: "threeHandleAvgTime",
        defaultSortOrder: "descend",
        sorter: (a, b) => a.threeHandleAvgTime - b.threeHandleAvgTime
      },
      {
        title: "四级处理时间",
        dataIndex: "fourHandleAvgTime",
        defaultSortOrder: "descend",
        sorter: (a, b) => a.fourHandleAvgTime - b.fourHandleAvgTime
      },
    ];    
    const data = datalist.map((item, i) => {
      return (
        {
          key: `${item.stationCode}`,
          stationName: `${item.stationName || '--'}`,
          allAlarmNum: `${item.alarmNum || '--'}`,
          oneWarningNum: `${item.oneWarningNum || '--'}`,
          secondLevelAlarm: `${item.secondLevelAlarm || '--'}`,
          threeWarningNum: `${item.threeWarningNum || '--'}`,
          fourWarningNum: `${item.fourWarningNum || '--'}`,
          handleAvgTime: `${item.handleAvgTime || '--'}`,
          oneHandleAvgTime: `${item.oneHandleAvgTime || '--'}`,
          twoHandleAvgTime: `${item.twoHandleAvgTime || '--'}`,
          threeHandleAvgTime: `${item.threeHandleAvgTime || '--'}`,
          fourHandleAvgTime: `${item.fourHandleAvgTime || '--'}`,          
        }
      )
    })
    return (
      <div style={{borderTop:"1px dashed #dfdfdf"}}>
        <div className={styles.pagination}>
          <CommonPagination total={totalNum} onPaginationChange={this.onPaginationChange} />
        </div>
        <Table columns={columns} dataSource={data} onChange={this.onChange} pagination={false} />
      </div>
    )
  }
}
export default (AlarmStatisticTable)