import React from "react";
import PropTypes from "prop-types";
import { Modal, Table, Tag } from 'antd';
import moment from "moment";
import CommonPagination from '../../../../Common/CommonPagination';
import styles from "./faultAllFanHistory.scss";
import {dataFormat} from "../../../../../utils/utilFunc";

export default class FaultAllFanHistory extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    visibleFlag: PropTypes.bool,
    onVisible: PropTypes.func,
    getFaultInfo: PropTypes.func,
    match: PropTypes.object,
    onChangeFilter: PropTypes.func,
    getFaultReport: PropTypes.func,
    faultReportInfo: PropTypes.object,
    history: PropTypes.object,
    pageSize: PropTypes.number,
    pageNum: PropTypes.number,
  };

  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
  }

  componentDidMount() {
    const {
      getFaultReport,
      match:{
        params: {
          stationCode
        }
      },
    } = this.props;
    // 读取localStorage
    const algorithmId = localStorage.getItem("algorithmId");
    const params = {
      stationCodes: [`${stationCode}`],
      deviceFullCode: "",
      algorithmIds: [`${algorithmId}`],
      startTime: "",
      endTime: "",
      pageSize: 10,
      pageNum: 1,
      sortField: "",
      sortMethod: ""
    };
    getFaultReport(params);
  }

  onPaginationChange = ({ currentPage, pageSize }) => {
    const {
      getFaultReport,
      match:{
        params: {
          stationCode
        }
      },} = this.props;
    // 读取localStorage
    const algorithmId = localStorage.getItem("algorithmId");
    const params = {
      stationCodes: [`${stationCode}`],
      deviceFullCode: "",
      algorithmIds: [`${algorithmId}`],
      startTime: "",
      endTime: "",
      pageSize: pageSize ? pageSize : 10,
      pageNum: currentPage ? currentPage : 1,
      sortField: "",
      sortMethod: ""
    };
    getFaultReport(params);
  };


  onShowDetail = (data) => {
    const { onVisible, history } = this.props;
    const { taskId, stationCode, algorithmId } = data;
    onVisible(false);
    // 跳到按模型单风机详情图表展示
    history.push(`/hidden/analysis/all/fan/${stationCode}`);
    // localStore存储有故障的风机
    window.location.reload();
    localStorage.setItem("algorithmId", algorithmId);
    localStorage.setItem("warnFans", JSON.stringify(data));
    localStorage.setItem("taskId", taskId);
  };

  handleCancel = () => {
    const { onVisible } = this.props;
    onVisible(false);
  };

  tableChange = (pagination, filter, sorter) => {// 点击表头 排序
    const { field, order } = sorter;
    const {
      getFaultReport,
      pageSize,
      pageNum,
      match:{
        params: {
          stationCode
        }
      },} = this.props;
    // 读取localStorage
    const algorithmId = localStorage.getItem("algorithmId");
    const params = {
      stationCodes: [`${stationCode}`],
      deviceFullCode: "",
      algorithmIds: [`${algorithmId}`],
      startTime: "",
      endTime: "",
      pageSize,
      pageNum,
      sortField: field ? field : "",
      sortMethod: order === 'ascend' ? (field ? "asc" : "") : (field ? 'desc' : "")
    };
    getFaultReport(params);
  };


  render() {
    const { visibleFlag, pageSize, pageNum } = this.props;
    const {
      loading,
      faultReportInfo: {
        dataList,
        count
      }} = this.props;
    const columns = [{
      width: 168,
      title: '检测开始时间',
      dataIndex: 'startTime',
    }, {
      width: 168,
      title: '检测结束时间',
      dataIndex: 'endTime',
    }, {
      width: 240,
      title: '计划执行时间',
      dataIndex: 'planExecuteTime',
      render: (planExecuteTime) => {
        return <span>{planExecuteTime ? moment(planExecuteTime).format("YYYY-MM-DD HH:mm:ss") : "- -"}</span>
      }
    }, {
      width: 240,
      title: '执行开始时间',
      dataIndex: 'executeStartTime',
      render: (executeStartTime) => {
        return <span>{executeStartTime ? moment(executeStartTime).format("YYYY-MM-DD HH:mm:ss") : "- -"}</span>
      }
    }, {
      width: 240,
      title: '执行结束时间',
      dataIndex: 'executeEndTime',
      render: (executeEndTime) => {
        return <span>{executeEndTime ? moment(executeEndTime).format("YYYY-MM-DD HH:mm:ss") : "- -"}</span>
      }
    }, {
      width: 102,
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
    },{
      title: '预警台数',
      dataIndex: 'warningUnitCount',
      sorter: true,
      render: (warningUnitCount) => (<span>{dataFormat(warningUnitCount)}</span>)
    }];
    return (
      <Modal
        visible={visibleFlag}
        footer={null}
        width={1390}
        onCancel={this.handleCancel}
      >
        <div className={styles.faultAllFanHistory}>
          <div className={styles.fanHistoryPagination}>
            <CommonPagination pageSize={pageSize} currentPage={pageNum} total={count} onPaginationChange={this.onPaginationChange} />
          </div>
          <Table
            pagination={false}
            loading={loading}
            scroll={{ y: 410 }}
            rowKey={(record, index) => (record.taskId + index) || "key" }
            dataSource={dataList}
            onChange={this.tableChange}
            columns={columns}
            locale={{ emptyText: <div className={styles.noData}><img src="/img/nodata.png" style={{ width: 223, height: 164 }} /></div> }}
          />
        </div>
      </Modal>
    );
  }
}
