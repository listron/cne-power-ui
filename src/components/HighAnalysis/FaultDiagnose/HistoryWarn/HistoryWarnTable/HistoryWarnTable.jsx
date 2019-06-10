import React from "react";
import PropTypes from "prop-types";
import styles from "./historyWarnTable.scss";
import {Table} from "antd";
import { dateArrFormat } from "../../formatDateUtils/formatDateUtils";

export default class HistoryWarnTable extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    faultWarnHistoryData: PropTypes.object,
    getFaultWarnHistory: PropTypes.func,
    onChangeFilter: PropTypes.func,
    sortField: PropTypes.string,
    sortMethod: PropTypes.string,
    pageSize: PropTypes.number,
    pageNum: PropTypes.number,
    createTimeStart: PropTypes.string,
    createTimeEnd: PropTypes.string,
    stationCode: PropTypes.number,
    selectDeviceCode: PropTypes.array,
    algorithmModalId: PropTypes.array,
    history: PropTypes.object,
  };

  onShowDetail = (data) => {
    const { history } = this.props;
    const { taskId, deviceName, deviceFullcode, stationCode, algorithmName } = data;
    // 跳到单风机详情图表展示
    history.push(`/hidden/analysis/single/fan/${stationCode}`);
    localStorage.setItem("taskId", taskId);
    localStorage.setItem("faultHistory", "1");
    localStorage.setItem("deviceName", deviceName);
    localStorage.setItem("deviceFullCode", deviceFullcode);
    localStorage.setItem("deviceFullName", algorithmName);
  };


  tableChange = (pagination, filter, sorter) => {// 点击表头 排序
    const { field, order } = sorter;
    const { onChangeFilter } = this.props;
    onChangeFilter({
      sortField: field ? field : "",
      sortMethod: order === 'ascend' ? (field ? "asc" : "") : (field ? 'desc' : "")
    });
  };

  render() {
    const { loading, faultWarnHistoryData: {
      dataList,
    }} = this.props;
    const columns = [{
      title: '电站名称',
      dataIndex: 'stationName',
      sorter: true,
    },{
      title: '风机名称',
      dataIndex: 'deviceName',
      sorter: true,
    }, {
      title: '预警日期',
      dataIndex: 'predictionDate',
      sorter: true,
      render: (predictionDate) => {
        return <span>{dateArrFormat(predictionDate)}</span>
      }
    }, {
      title: '算法模型',
      dataIndex: 'algorithmName',
      sorter: true,
    }, {
      title: '检测开始日期',
      dataIndex: 'startTime',
    }, {
      title: '检测结束日期',
      dataIndex: 'endTime',
    }, {
      title: '预期结果',
      dataIndex: 'result',
      align:"center",
      render: (text, record) => (
        <span style={{cursor: "pointer"}}>
          <i className="iconfont icon-look" onClick={() => { this.onShowDetail(record) }} />
        </span>
      )
    }];
    return (
      <div className={styles.historyWarnTable}>
        <Table
          pagination={false}
          dataSource={dataList}
          loading={loading}
          onChange={this.tableChange}
          rowKey={(record, index) => (record.taskId + index) || 'key'}
          columns={columns}
          locale={{ emptyText: <div className={styles.noData}><img src="/img/nodata.png" style={{ width: 223, height: 164 }} /></div> }}
        />
      </div>
    );
  }
}
