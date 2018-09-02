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
        sorter: true,
      },
      {
        title: "告警总数",
        dataIndex: "alarmNum",
        key: "alarmNum",
        sorter: true,
      },
      {
        title: "一级总数",
        dataIndex: "oneWarningNum",
        key: "oneWarningNum",
        sorter: true,

      },
      {
        title: "二级总数",
        dataIndex: "twoWarningNum",
        key: "twoWarningNum",
        sorter: true,

      },
      {
        title: "三级总数",
        dataIndex: "threeWarningNum",
        key: "threeWarningNum",
        sorter: true,
      },
      {
        title: "四级总数",
        dataIndex: "fourWarningNum",
        key: "fourWarningNum",
        sorter: true,
      },
      {
        title: "平均处理时间",
        dataIndex: "handleAvgTime",
        key: "handleAvgTime",
        sorter: true,
      },
      {
        title: "一级处理时间",
        dataIndex: "oneHandleAvgTime",
        key: "oneHandleAvgTime",
        sorter: true,
      },
      {
        title: "二级处理时间",
        dataIndex: "twoHandleAvgTime",
        key: "twoHandleAvgTime",
        sorter: true,
      },
      {
        title: "三级处理时间",
        dataIndex: "threeHandleAvgTime",
        key: "threeHandleAvgTime",
        sorter: true,
      },
      {
        title: "四级处理时间",
        dataIndex: "fourHandleAvgTime",
        key: "fourHandleAvgTime",
        sorter: true,
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
        <Table columns={this.renderColumn()} dataSource={data} onChange={this.onChangeTable} pagination={false} />
      </div>
    );
  }
}
export default AlarmStatisticTable;