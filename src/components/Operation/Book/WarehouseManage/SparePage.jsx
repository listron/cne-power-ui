import React, { Component } from 'react';
import ConditionSearch from './ManageCommon/ConditionSearch';
import { EnterWarehouse } from './ManageCommon/HandleComponents';
import CommonPagination from '../../../Common/CommonPagination';
import { Button, Table } from 'antd';
import PropTypes from 'prop-types';
import styles from './warehouseManageComp.scss';

class SparePage extends Component {

  static propTypes = {
    totalCount: PropTypes.number,
    checkedStocks: PropTypes.array,
    stocksList: PropTypes.array,
    tableParams: PropTypes.object,
    changeStore: PropTypes.func,
    getWarehouseManageList: PropTypes.func,
  }

  onPaginationChange = ({pageSize, currentPage}) => {
    const { tableParams, getWarehouseManageList, changeStore } = this.props;
    changeStore({ pageNum: currentPage, pageSize });
    getWarehouseManageList({
      ...tableParams,
      pageNum: currentPage, 
      pageSize
    });
  }

  spareColumn = () => [
    {
      title: '物品名称',
      dataIndex: 'goodsName',
      sorter: true,
    }, {
      title: '型号',
      dataIndex: 'modeName',
      sorter: true,
    }, {
      title: '仓库',
      dataIndex: 'warehouseName',
      sorter: true,
    }, {
      title: '库存数量',
      dataIndex: 'inventoryNum',
      sorter: true,
      render: () => (
        <span>库存数量细节</span>
      )
    }, {
      title: '对应资产类型',
      dataIndex: 'assetsPath',
    }, {
      title: '最低阈值',
      dataIndex: 'threshold',
      sorter: true,
    }, {
      title: '更多信息',
      dataIndex: 'moreInfo',
      render: () => (
        <span>查看</span>
      )
    }, {
      title: '操作',
      dataIndex: 'handle',
      render: () => (
        <div>
          <span>入库</span>
          <span>出库</span>
          <span>库存</span>
        </div>
      )
    }
    // 物品名称：goods_name | 库存类型：goods_type |仓库名称：warehouse_name | 库存数量：inventory_num | 最低阈值：threshold | 厂家：devManufactorName | 供货商：supplier_name | 制造商：manufactor_name
  ];

  render(){
    const { tableParams, totalCount, checkedStocks, stocksList } = this.props;
    const { pageSize, pageNum } = tableParams;
    return (
      <div className={styles.sparePage}>
        <ConditionSearch {...this.props} />
        <div className={styles.handleRow}>
          <div className={styles.leftHandler}>
            <EnterWarehouse {...this.props} />
            <Button disabled={!(checkedStocks.length > 0)}>删除</Button>
            <Button>导出</Button>
            <Button>下载导入模板</Button>
          </div>
          <CommonPagination
            total={totalCount}
            pageSize={pageSize}
            currentPage={pageNum}
            onPaginationChange={this.onPaginationChange}
          />
        </div>
        <Table
          // loading={loading}
          onChange={this.tableChange}
          columns={this.spareColumn()}
          dataSource={stocksList.map(e => ({ key: e.inventoryId, ...e }))}
          pagination={false}
          locale={{ emptyText: <img width="223" height="164" src="/img/nodata.png" /> }}
        />
      </div>
    )
  }
}

export default SparePage;