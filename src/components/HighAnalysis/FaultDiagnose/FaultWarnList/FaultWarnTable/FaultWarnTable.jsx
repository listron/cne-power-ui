import React from "react";
import PropTypes from "prop-types";
import { Table } from "antd";
import CommonPagination from '../../../../Common/CommonPagination';
import styles from "./faultWarnTable.scss";
import {getLevel} from "../../../../../constants/ticket";

const pageSize = 10, pageNum = 1, total = 100;
export default class FaultWarnTable extends React.Component {
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
      title: '风机名称',
      dataIndex: 'defectLevel',
      key: 'defectLevel',
      sorter: true,
    }, {
      title: '预警日期',
      dataIndex: 'stationName',
      key: 'stationName',
      sorter: true,
    }, {
      title: '检测开始日期',
      dataIndex: 'deviceName',
      key: 'deviceName',
    }, {
      title: '检测结束日期',
      dataIndex: 'defectTypeName',
      key: 'defectTypeName',
    }, {
      title: '算法模型',
      dataIndex: 'defectDescribe',
      key: 'defectDescribe',
      sorter: true,
    }, {
      title: '预警结果',
      dataIndex: 'result',
      key: 'result',
      render: (text, record) => (
        <span>
          <i className="iconfont icon-look" onClick={() => { this.onShowDetail(record) }} />
        </span>
      )
    }];
    return (
      <div className={styles.faultWarnTable}>
        <div className={styles.warnTablePagination}>
          <CommonPagination pageSize={pageSize} currentPage={pageNum} total={total} onPaginationChange={this.onPaginationChange} />
        </div>
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
