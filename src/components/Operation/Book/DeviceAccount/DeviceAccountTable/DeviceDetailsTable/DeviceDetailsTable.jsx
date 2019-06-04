import React from "react";
import PropTypes from "prop-types";
import { Table, Modal } from "antd";
import CommonPagination from "../../../../../Common/CommonPagination/index";

import styles from "./deviceDetailsTable.scss";

export default class DeviceDetailsTable extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    attachmentsList: PropTypes.object,
    pageSizeDetails: PropTypes.number,
    pageNumDetails: PropTypes.number,
    detailsFlag: PropTypes.bool,
    onCancelFunc: PropTypes.func,
    getDeviceAttachments: PropTypes.func,
    modeIdDetails: PropTypes.string,
    assetsIdDetails: PropTypes.string,
    orderFieldDetails: PropTypes.string,
    orderMethodDetails: PropTypes.string,
  };

  // 分页
  onPaginationChange = ({ currentPage, pageSize }) => {
    const {
      modeIdDetails,
      assetsIdDetails,
      orderFieldDetails,
      orderMethodDetails,
      getDeviceAttachments
    } = this.props;
    // 参数
    const params = {
      modeId: modeIdDetails,
      assetsId: assetsIdDetails,
      orderField: orderFieldDetails,
      orderMethod: orderMethodDetails,
      pageNum: currentPage,
      pageSize: pageSize
    };
    // 接口
    getDeviceAttachments(params);
  };

  // 关闭
  handleCancel = () => {
    const { onCancelFunc } = this.props;
    // 关闭弹窗
    onCancelFunc();
  };

  // 排序
  tableChange = (pagination, filter, sorter) => {// 点击表头 排序
    const {
      modeIdDetails,
      assetsIdDetails,
      getDeviceAttachments,
      pageNumDetails,
      pageSizeDetails
    } = this.props;
    const { field, order } = sorter;
    // 根据字段匹配参数
    const sortField = {
      goodsName: "1",
      goodsModeName: "2",
      warehouseName: "3",
      num: "4",
      madeName: "5",
    };
    // 参数
    const params = {
      modeId: modeIdDetails,
      assetsId: assetsIdDetails,
      orderField: field ? sortField[field] : "",
      orderMethod: order === 'ascend' ? (field ? "asc" : "") : (field ? 'desc' : ""),
      pageNum: pageNumDetails,
      pageSize: pageSizeDetails
    };
    // 接口
    getDeviceAttachments(params);
  };

  render() {
    const {
      loading,
      pageSizeDetails,
      pageNumDetails,
      attachmentsList:{
        dataList,
        pageCount
      },
      detailsFlag,
    } = this.props;
    const columns = [{
      title: '物品名称',
      dataIndex: 'goodsName',
      sorter: true,
    },{
      title: '规格/型号',
      dataIndex: 'goodsModeName',
      sorter: true,
    }, {
      title: '所属仓库',
      dataIndex: 'warehouseName',
      sorter: true,
    }, {
      title: '库存数量',
      dataIndex: 'num',
      sorter: true,
      render: (num, record) => {
        if(Number(num) <= record.inventoryNum) {
          return (
            <span style={{color: "#f9b600"}}>
              <span style={{marginRight: "5px"}}>{`${Number(num)}${record.unit}`}</span>
              <sup>low</sup>
            </span>
          );
        }
        return <span>{Number(num)}</span>;
      }
    }, {
      title: '对应资产',
      dataIndex: 'manufactorName',
      render: (manufactorName) => <span>{manufactorName || "--"}</span>
    }, {
      title: '厂家',
      sorter: true,
      dataIndex: 'madeNames',
      render: (madeNames) => <span>{madeNames || "--"}</span>
    }, {
      title: '供货商',
      dataIndex: 'supplierNames',
      render: (supplierNames) => <span>{supplierNames || "--"}</span>
    }];
    return (
      <Modal
        visible={detailsFlag}
        footer={null}
        width={1048}
        onCancel={this.handleCancel}
      >
        <div className={styles.deviceDetailsTable}>
          <div className={styles.deviceDetailsTop}>
            <CommonPagination pageSize={pageSizeDetails} currentPage={pageNumDetails} total={pageCount} onPaginationChange={this.onPaginationChange} />
          </div>
          <Table
            pagination={false}
            dataSource={dataList}
            loading={loading}
            onChange={this.tableChange}
            rowKey={(record, index) => (record.modeId + index) || 'key'}
            columns={columns}
            locale={{ emptyText: <div className={styles.noData}><img src="/img/nodata.png" style={{ width: 223, height: 164 }} /></div> }}
          />
        </div>
      </Modal>
    )
  }
}
