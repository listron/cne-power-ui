import React from "react";
import PropTypes from "prop-types";
import { Table } from "antd";
import DeviceDetailsTable from "./DeviceDetailsTable/DeviceDetailsTable";

import styles from "./deviceAccountTable.scss";

export default class DeviceAccountTable extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    deviceAccountList: PropTypes.object,
    getDeviceAccountList: PropTypes.func,
    pageSize: PropTypes.number,
    pageNum: PropTypes.number,
    regionName: PropTypes.string,
    stationCodes: PropTypes.array,
    manufactorId: PropTypes.string,
    modeId: PropTypes.string,
    getDeviceAttachments: PropTypes.func,
  };

  constructor (props) {
    super(props);
    this.state = {
      detailsFlag: false
    };
  }

  // 关闭弹窗
  onCancelFunc = () => {
    this.setState({
      detailsFlag: false
    });
  };

  // 详情
  onShowDetail = (data) => {
    const { modeId, assetsId } = data;
    const { getDeviceAttachments } = this.props;
    // 参数
    const params = {
      modeId,
      assetsId,
      orderField: "",
      orderMethod: "",
      pageNum: 1,
      pageSize: 10
    };
    this.setState({
      detailsFlag: true
    }, () => {
      // 接口
      getDeviceAttachments(params);
    });
  };

  // 排序
  tableChange = (pagination, filter, sorter) => {// 点击表头 排序
    const {
      getDeviceAccountList,
      regionName,
      stationCodes,
      manufactorId,
      modeId,
      pageNum,
      pageSize
    } = this.props;
    const { field, order } = sorter;
    // 匹配排序字段
    const sortField = {
      assetsName: "1",
      deviceModeName: "2",
      num: "3",
      manufactorName: "4",
      madeNames: "5",
    };
    const params = {
      regionName,
      stationCodes,
      manufactorId,
      modeId,
      orderField: field ? sortField[field] : "",
      orderMethod: order === 'ascend' ? (field ? "asc" : "") : (field ? 'desc' : ""),
      pageNum,
      pageSize
    };
    // 接口
    getDeviceAccountList(params);
  };

  render() {
    const { detailsFlag } = this.state;
    const {
      loading,
      deviceAccountList: {
        dataList
      }} = this.props;
    const columns = [{
      title: '资产名称',
      dataIndex: 'assetsName',
      sorter: true,
    },{
      title: '设备型号',
      dataIndex: 'deviceModeName',
      sorter: true,
    }, {
      title: '设备数量',
      dataIndex: 'num',
      sorter: true,
    }, {
      title: '厂家',
      dataIndex: 'manufactorName',
      sorter: true,
    }, {
      title: '制造商',
      sorter: true,
      dataIndex: 'madeNames',
      render: (madeNames) => <span>{madeNames.join('') || "--"}</span>
    }, {
      title: '供货商',
      dataIndex: 'supplierNames',
      render: (supplierNames) => <span>{supplierNames.join('') || "--"}</span>
    }, {
      title: '查看备品备件',
      align:"center",
      render: (text, record) => (
        <span style={{cursor: "pointer"}}>
          <i className="iconfont icon-look" onClick={() => { this.onShowDetail(record) }} />
        </span>
      )
    }];
    return (
      <div className={styles.DeviceAccountTable}>
        <Table
          pagination={false}
          dataSource={dataList}
          loading={loading}
          onChange={this.tableChange}
          rowKey={(record, index) => (record.modeId + index) || 'key'}
          columns={columns}
          locale={{ emptyText: <div className={styles.noData}><img src="/img/nodata.png" style={{ width: 223, height: 164 }} /></div> }}
        />
        <DeviceDetailsTable onCancelFunc={this.onCancelFunc} detailsFlag={detailsFlag} {...this.props} />
      </div>
    )
  }
}
