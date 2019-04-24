import React from "react";
import PropTypes from "prop-types";
import styles from "./historyWarnTable.scss";
import {Table} from "antd";

export default class HistoryWarnTable extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
  }


  render() {
    const { loading } = this.props;
    const columns = [ {
      title: '电站名称',
      dataIndex: 'stationName',
      key: 'stationName',
      sorter: true,
    },{
      title: '风机名称',
      dataIndex: 'defectLevel',
      key: 'defectLevel',
      sorter: true,
    }, {
      title: '预期日期',
      dataIndex: 'deviceName',
      key: 'deviceName',
      sorter: true,
    }, {
      title: '算法模型',
      dataIndex: '检测结束时间',
      key: '检测结束时间',
      sorter: true,
    }, {
      title: '检测开始日期',
      dataIndex: '计划执行时间',
      key: '计划执行时间',
    }, {
      title: '检测结束日期',
      dataIndex: '执行开始时间',
      key: '执行开始时间',
    }, {
      title: '预期结果',
      dataIndex: 'result',
      key: 'result',
      render: (text, record) => (
        <span>
          <i className="iconfont icon-look" onClick={() => { this.onShowDetail(record) }} />
        </span>
      )
    }];
    return (
      <div className={styles.historyWarnTable}>
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
