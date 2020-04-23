import React from 'react';
import PropTypes from 'prop-types';
import { Table, Modal } from 'antd';
import CommonPagination from '../../../../../Common/CommonPagination/index';
import CneTable from '../../../../../Common/Power/CneTable';
import styles from './deviceDetailsTable.scss';

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
      getDeviceAttachments,
    } = this.props;
    // 参数
    const params = {
      modeId: modeIdDetails,
      assetsId: assetsIdDetails,
      orderField: orderFieldDetails,
      orderMethod: orderMethodDetails,
      pageNum: currentPage,
      pageSize: pageSize,
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
      pageSizeDetails,
    } = this.props;
    const { field, order } = sorter;
    // 根据字段匹配参数
    const sortField = {
      goodsName: '1',
      goodsModeName: '2',
      warehouseName: '3',
      num: '4',
      madeName: '5',
    };
    // 参数
    const params = {
      modeId: modeIdDetails,
      assetsId: assetsIdDetails,
      orderField: field ? sortField[field] : '',
      orderMethod: order === 'ascend' ? (field ? 'asc' : '') : (field ? 'desc' : ''),
      pageNum: pageNumDetails,
      pageSize: pageSizeDetails,
    };
    // 接口
    getDeviceAttachments(params);
  };

  render() {
    const {
      loading,
      pageSizeDetails,
      pageNumDetails,
      attachmentsList: {
        // dataList,
        pageCount,
      },
      detailsFlag,
    } = this.props;
    const dataList = [
      {
        'assetsId': '519822824199680',
        'assetsName': '升压站系统/升压站/升压站部件',
        'assetsNames': null,
        'deviceId': null,
        'deviceIds': null,
        'deviceModeCode': null,
        'deviceModeName': null,
        'deviceTypeCode': null,
        'goodsId': '519817308689920',
        'goodsModeName': '升压站部件型号',
        'goodsName': '备品备件',
        'inventoryNum': 9,
        'madeNames': [],
        'manufactorName': null,
        'modeId': null,
        'num': 0,
        'supplierNames': [],
        'unit': '件',
        'warehouseName': '仓库01',
      },
      {
        'assetsId': '519822824199680',
        'assetsName': '升压站系统/升压站/升压站部件',
        'assetsNames': null,
        'deviceId': null,
        'deviceIds': null,
        'deviceModeCode': null,
        'deviceModeName': null,
        'deviceTypeCode': null,
        'goodsId': '519817308689920',
        'goodsModeName': '升压站部件型号',
        'goodsName': '备品备件',
        'inventoryNum': 30,
        'madeNames': [],
        'manufactorName': null,
        'modeId': null,
        'num': 0,
        'supplierNames': [],
        'unit': '件',
        'warehouseName': '云南仓库',
      },
    ];
    const columns = [{
      title: '物品名称',
      dataIndex: 'goodsName',
      sorter: true,
      width: '10%',
      textAlign: 'left',
    }, {
      title: '规格/型号',
      dataIndex: 'goodsModeName',
      sorter: true,
      width: '14%',
      textAlign: 'left',
      render: (goodsModeName) => <div className={styles.goodsModeName} title={goodsModeName}>{goodsModeName}</div>,
    }, {
      title: '所属仓库',
      dataIndex: 'warehouseName',
      sorter: true,
      width: '14%',
      textAlign: 'left',
      render: (warehouseName) => <div className={styles.warehouseName} title={warehouseName}>{warehouseName}</div>,
    }, {
      title: '库存数量',
      dataIndex: 'inventoryNum',
      sorter: true,
      width: '10%',
      textAlign: 'right',
      render: (inventoryNum, record) => {
        if (Number(inventoryNum) <= record.num) {
          return (
            <span style={{ color: '#f9b600' }}>
              <span style={{ marginRight: '5px' }}>{`${Number(inventoryNum)}${record.unit}`}</span>
              <sup>low</sup>
            </span>
          );
        }
        return <span>{Number(inventoryNum)}</span>;
      },
    }, {
      title: '对应资产',
      dataIndex: 'assetsName',
      width: '20%',
      textAlign: 'left',
      render: (assetsName) => <span className={styles.assetsName} title={assetsName}>{assetsName || '--'}</span>,
    }, {
      title: '厂家',
      sorter: true,
      dataIndex: 'madeNames',
      width: '16%',
      textAlign: 'left',
      render: (madeNames) => <span className={styles.madeNames} title={madeNames}>{madeNames && madeNames.length > 0 ? madeNames.join(',') : '--'}</span>,
    }, {
      title: '供货商',
      dataIndex: 'supplierNames',
      width: '16%',
      textAlign: 'left',
      render: (supplierNames) => <span className={styles.supplierNames} title={supplierNames}>{supplierNames && supplierNames.length > 0 ? supplierNames.join(',') : '--'}</span>,
    }];
    return (
      <Modal
        visible={detailsFlag}
        footer={null}
        width={1250}
        onCancel={this.handleCancel}
      >
        <div className={styles.deviceDetailsTable}>
          <div className={styles.deviceDetailsTop}>
            <CommonPagination pageSize={pageSizeDetails} currentPage={pageNumDetails} total={pageCount} onPaginationChange={this.onPaginationChange} />
          </div>
          {/* <Table
            pagination={false}
            dataSource={dataList}
            loading={loading}
            onChange={this.tableChange}
            rowKey={(record, index) => (record.modeId + index) || 'key'}
            columns={columns}
            locale={{ emptyText: <div className={styles.noData}><img src="/img/nodata.png" style={{ width: 223, height: 164 }} /></div> }}
          /> */}
          <CneTable
            columns={columns}
            dataSource={dataList}
            rowKey={(record, index) => (record.modeId + index) || 'key'}
            pagination={false}
            loading={loading}
            // dataError={diagnoseListError}
            // sortField={['assetsName', 'deviceModeName', 'num', 'manufactorName', 'madeNames'][orderField - 1]}
            // sortMethod={{ 'asc': 'ascend', 'desc': 'descend' }[orderMethod]}
            onChange={this.tableChange}
          />
        </div>
      </Modal>
    );
  }
}
