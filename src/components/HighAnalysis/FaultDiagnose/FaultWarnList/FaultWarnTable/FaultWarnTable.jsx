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
    listViewData: PropTypes.object,
    sortField: PropTypes.string,
    sortMethod: PropTypes.string,
    pageSize: PropTypes.number,
    pageNum: PropTypes.number,
    singleStationCode: PropTypes.string,
    history: PropTypes.object,
    getAlgoModel: PropTypes.func,
  };

  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(nextProps) {
    const {
      match: {params: {fanWarnId: currentSingleStationCode}},
      getList,
      getAlgoModel
    } = this.props;
    const { match: {params: {fanWarnId: nextSingleStationCode}} } = nextProps;
    const params = {
      stationCode: nextSingleStationCode,
    };
    if (currentSingleStationCode !== nextSingleStationCode) {
      // 算法模型调用
      getList(params);
      // 算法模型调用
      getAlgoModel(params);
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

  onShowDetail = (data) => {
    const {
      history,
      match: {
        params:{
          fanWarnId
        }
      },
    } = this.props;
    const { taskId, deviceName, deviceFullCode, algorithmName } = data;
    // 跳到单风机详情图表展示
    history.push(`/hidden/analysis/single/fan/${fanWarnId}`);
    localStorage.setItem("taskId", taskId);
    localStorage.setItem("faultHistory", "");
    localStorage.setItem("deviceName", deviceName);
    localStorage.setItem("deviceFullCode", deviceFullCode);
    localStorage.setItem("deviceFullName", algorithmName);
  };

  tableChange = (pagination, filter, sorter) => {// 点击表头 排序
    const { field, order } = sorter;
    const { singleStationCode, pageNum, pageSize, getList} = this.props;
    // 根据字段匹配排序字段
    const sortName = {
      deviceName: "device_name",
      predictionDate: "prediction_date",
      algorithmName: "algorithm_name"
    };
    const params = {
      stationCode: singleStationCode,
      pageNum,
      pageSize,
      sortField: field ? sortName[field] : "",
      sortMethod: order === 'ascend' ? (field ? "asc" : "") : (field ? 'desc' : "")
    };
    getList(params)
  };

  render() {
    const { loading, listViewData: {
      totalSize,
      resultList
    }, pageSize, pageNum } = this.props;
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
          <CommonPagination pageSize={pageSize} currentPage={pageNum} total={totalSize} onPaginationChange={this.onPaginationChange} />
        </div>
        <Table
          pagination={false}
          dataSource={resultList}
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
