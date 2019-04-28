import React from "react";
import PropTypes from "prop-types";
import { Table } from "antd";
import CommonPagination from '../../../../Common/CommonPagination';
import styles from "./faultWarnTable.scss";
import { dateArrFormat } from "../../formatDateUtils/formatDateUtils";

export default class FaultWarnTable extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    match: PropTypes.object,
    getList: PropTypes.func,
    listViewData: PropTypes.array,
    sortField: PropTypes.string,
    sortMethod: PropTypes.string,
    pageSize: PropTypes.number,
    pageNum: PropTypes.number,
    singleStationCode: PropTypes.string,
  };

  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(nextProps) {
    const {
      match: {params: {fanWarnId: currentSingleStationCode}},
      getList,
    } = this.props;
    const { match: {params: {fanWarnId: nextSingleStationCode}} } = nextProps;
    const params = {
      stationCode: currentSingleStationCode,
    };
    if (currentSingleStationCode !== nextSingleStationCode) {
      // 算法模型调用
      getList(params);
    }
  }

  onPaginationChange = ({ currentPage, pageSize }) => {
    const {
      getList,
      singleStationCode,
      sortField,
      sortMethod
    } = this.props;
    const params = {
      stationCode: singleStationCode,
      pageNum: currentPage,
      pageSize,
      sortField,
      sortMethod
    };
    getList(params);
  };

  tableChange = (pagination, filter, sorter) => {// 点击表头 排序
    const { field, order } = sorter;
    const { singleStationCode, pageNum, pageSize, getList} = this.props;
    const params = {
      stationCode: singleStationCode,
      pageNum,
      pageSize,
      sortField: field ? field : "",
      sortMethod: order === 'ascend' ? (field ? "asc" : "") : (field ? 'desc' : "")
    };
    getList(params)
  };

  render() {
    const { loading, listViewData, pageSize, pageNum } = this.props;
    const columns = [{
      title: '风机名称',
      dataIndex: 'deviceName',
      sorter: true,
    }, {
      title: '预警日期',
      dataIndex: 'predictionDate',
      sorter: true,
      render: (predictionDate) => {
        return <span>{dateArrFormat(predictionDate)}</span>;
      },
    }, {
      title: '检测开始日期',
      dataIndex: 'startTime',
    }, {
      title: '检测结束日期',
      dataIndex: 'endTime',
    }, {
      title: '算法模型',
      dataIndex: 'algorithmName',
      sorter: true,
    }, {
      title: '预警结果',
      dataIndex: 'result',
      align:"center",
      render: (text, record) => (
        <span style={{cursor: "pointer"}}>
          <i className="iconfont icon-look" onClick={() => { this.onShowDetail(record) }} />
        </span>
      )
    }];
    return (
      <div className={styles.faultWarnTable}>
        <div className={styles.warnTablePagination}>
          <CommonPagination pageSize={pageSize} currentPage={pageNum} total={listViewData.length} onPaginationChange={this.onPaginationChange} />
        </div>
        <Table
          pagination={false}
          dataSource={listViewData}
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
