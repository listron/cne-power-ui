import React from "react";
import PropTypes from "prop-types";
import { Table } from "antd";
import styles from "./listViewTable.scss";

export default class ListViewTable extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    onChangeFilter: PropTypes.func,
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
    const { loading } = this.props;
    const columns = [{
      title: '算法模型',
      dataIndex: 'defectLevel',
      key: 'defectLevel',
      sorter: true,
    }, {
      title: '电站名称',
      dataIndex: 'stationName',
      key: 'stationName',
      sorter: true,
    }, {
      title: '检测开始时间',
      dataIndex: 'deviceName',
      key: 'deviceName',
    }, {
      title: '检测结束时间',
      dataIndex: '检测结束时间',
      key: '检测结束时间',
    }, {
      title: '计划执行时间',
      dataIndex: '计划执行时间',
      key: '计划执行时间',
    }, {
      title: '执行开始时间',
      dataIndex: '执行开始时间',
      key: '执行开始时间',
    }, {
      title: '执行结束时间',
      dataIndex: 'defectTypeName',
      key: 'defectTypeName',
    }, {
      title: '状态',
      dataIndex: 'defectDescribe',
      key: 'defectDescribe',
    }, {
      title: '预警台数',
      dataIndex: 'result',
      key: 'result',
      sorter: true,
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
          locale={{ emptyText: <div className={styles.noData}><img src="/img/nodata.png" style={{ width: 223, height: 164 }} /></div> }}
        />
      </div>
    );
  }
}
