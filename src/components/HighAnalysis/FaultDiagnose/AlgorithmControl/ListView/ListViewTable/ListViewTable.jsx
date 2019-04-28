import React from "react";
import PropTypes from "prop-types";
import { Table } from "antd";
import styles from "./listViewTable.scss";
import moment from "moment";

const defaultDate = "YYYY-MM-DD HH:mm:ss";

export default class ListViewTable extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    onChangeFilter: PropTypes.func,
    algoListView: PropTypes.array,
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

  render() {
    const { loading, algoListView } = this.props;
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
        return <span>{moment(planExecuteTime).format(defaultDate)}</span>
      }
    }, {
      title: '执行开始时间',
      dataIndex: 'executeStartTime',
      render: (executeStartTime) => {
        return <span>{moment(executeStartTime).format(defaultDate)}</span>
      }
    }, {
      title: '执行结束时间',
      dataIndex: 'executeEndTime',
      render: (executeEndTime) => {
        return <span>{moment(executeEndTime).format(defaultDate)}</span>
      }
    }, {
      title: '状态',
      dataIndex: 'status',
    }, {
      title: '预警台数',
      dataIndex: 'warningUnitCount',
      sorter: true,
      align: "center",
      render: (text, record) => (
        <span>
          <i className="iconfont icon-look" onClick={() => { this.onShowDetail(record) }} />
        </span>
      )
    }];
    return (
      <div className={styles.listViewTable}>
        <Table
          pagination={false}
          loading={loading}
          columns={columns}
          rowKey={(record, index) => (record.taskId + index) || "key" }
          dataSource={algoListView}
          locale={{ emptyText: <div className={styles.noData}><img src="/img/nodata.png" style={{ width: 223, height: 164 }} /></div> }}
        />
      </div>
    );
  }
}
