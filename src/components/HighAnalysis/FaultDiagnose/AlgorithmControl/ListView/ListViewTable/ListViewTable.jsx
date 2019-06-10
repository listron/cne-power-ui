import React from "react";
import PropTypes from "prop-types";
import {Table, Tag} from "antd";
import styles from "./listViewTable.scss";
import moment from "moment";
import { dataFormat } from "../../../../../../utils/utilFunc";

const defaultDate = "YYYY-MM-DD HH:mm:ss";

export default class ListViewTable extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    onChangeFilter: PropTypes.func,
    algoListView: PropTypes.object,
    history: PropTypes.object,
  };

  constructor(props) {
    super(props);
  }

  onPaginationChange = ({ currentPage, pageSize }) => {
    const { onChangeFilter } = this.props;
    onChangeFilter({
      pageNum: currentPage,
      pageSize
    });
  };

  onShowDetail = (data) => {
    const { history } = this.props;
    const { taskId, stationCode, algorithmId } = data;
    // 跳到按模型单风机详情图表展示
    history.push(`/hidden/analysis/all/fan/${stationCode}`);
    // localStore存储有故障的风机
    localStorage.setItem("faultWarnNum", "1");
    localStorage.setItem("algorithmId", algorithmId);
    localStorage.setItem("taskId", taskId);
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
    const { loading, algoListView: {dataList} } = this.props;
    const columns = [{
      title: '算法模型',
      dataIndex: 'algorithmName',
      sorter: true,
    }, {
      title: '电站名称',
      dataIndex: 'stationName',
      sorter: true,
    }, {
      title: '检测开始时间',
      dataIndex: 'startTime',
    }, {
      title: '检测结束时间',
      dataIndex: 'endTime',
    }, {
      title: '计划执行时间',
      dataIndex: 'planExecuteTime',
      render: (planExecuteTime) => {
        return <span>{planExecuteTime ? moment(planExecuteTime).format(defaultDate) : "- -"}</span>
      }
    }, {
      title: '执行开始时间',
      dataIndex: 'executeStartTime',
      render: (executeStartTime) => {
        return <span>{executeStartTime ? moment(executeStartTime).format(defaultDate) : "- -"}</span>
      }
    }, {
      title: '执行结束时间',
      dataIndex: 'executeEndTime',
      render: (executeEndTime) => {
        return <span>{executeEndTime ? moment(executeEndTime).format(defaultDate) : " - -"}</span>
      }
    }, {
      title: '状态',
      dataIndex: 'status',
      render: (status, record) => {
        if(status === 1) {
          return <span>待执行</span>
        }
        if(status === 2) {
          return <span>执行中</span>
        }
        if(status === 3) {
          return <Tag color="#199475" onClick={() => {return this.onShowDetail(record)}}>已完成</Tag>
        }
        return <Tag color="#f9b600" onClick={() => {return this.onShowDetail(record)}}>执行失败</Tag>
      }
    }, {
      title: '预警台数',
      dataIndex: 'warningUnitCount',
      sorter: true,
      render: (warningUnitCount) => (<span>{dataFormat(warningUnitCount)}</span>)
    }];
    return (
      <div className={styles.listViewTable}>
        <Table
          pagination={false}
          loading={loading}
          columns={columns}
          onChange={this.tableChange}
          rowKey={(record, index) => index || "key" }
          dataSource={dataList}
          locale={{ emptyText: <div className={styles.noData}><img src="/img/nodata.png" style={{ width: 223, height: 164 }} /></div> }}
        />
      </div>
    );
  }
}
