import React, { Component } from 'react';
import ConditionSearch from './ManageCommon/ConditionSearch';
import { EnterWarehouse } from './ManageCommon/HandleComponents';
import CommonPagination from '../../../Common/CommonPagination';
import { Button, Table, Popover } from 'antd';
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

  onPaginationChange = ({pageSize, currentPage}) => { // 翻页
    const { tableParams, getWarehouseManageList, changeStore } = this.props;
    changeStore({
      pageNum: currentPage,
      pageSize,
      checkedStocks: [], // 清空选中
    });
    getWarehouseManageList({
      ...tableParams,
      pageNum: currentPage, 
      pageSize
    });
  }

  onTableRowSelect = (selectedRowKeys, checkedStocks) => { // 选中条目
    this.props.changeStore({ checkedStocks });
  }

  getStockDetail = (record) => { // 操作 - 查看库存
    
  }

  toAdd = (record) => { // 操作 - 再入库

  }

  toTakeout = (record) => { // 操作 - 出库

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
      render: (text, record) => {
        const { inventoryNum, goodsUnit, threshold } = record;
        console.log(record)
        let StockNum = <span></span>;
        if (!inventoryNum && inventoryNum !== 0 && inventoryNum !== '0') { // 库存不存在
          StockNum = <span className={styles.stockSaved}>--{goodsUnit || ''}</span>
        } else if (inventoryNum < threshold) { // 库存紧张
          StockNum = (<span className={styles.shortage}>
            <span className={styles.stockSaved}>--{goodsUnit || ''}</span>
            <span className={styles.config}>紧张</span>
          </span>)
        } else {
          StockNum = <span className={styles.stockSaved}>{inventoryNum}{goodsUnit || ''}</span>
        }
        return StockNum;
      }
    }, {
      title: '对应资产类型',
      dataIndex: 'assetsPath',
      className: styles.assetsPath,
      render: (text) => <div title={text} className={styles.assetsPath}>{text}</div>
    }, {
      title: '最低阈值',
      dataIndex: 'threshold',
      className: styles.threshold,
      sorter: true,
    }, {
      title: '更多信息',
      className: styles.moreInfo,
      dataIndex: 'moreInfo',
      render: (text, record) => (
        <Popover content={<div>
          <span>详细信息</span>
        </div>} title="更多信息" trigger="click">
          <span className={styles.text}>查看</span>
        </Popover>
      )
    }, {
      title: '操作',
      dataIndex: 'handle',
      render: (record) => (
        <div className={styles.stockHandle}>
          <span className={styles.text} onClick={() => this.toAdd(record)}>入库</span>
          <span className={styles.text} onClick={() => this.toTakeout(record)}>出库</span>
          <span className={styles.text} onClick={() => this.getStockDetail(record)}>库存</span>
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
          rowSelection={{
            selectedRowKeys: checkedStocks.map(e => e.key),
            onChange: this.onTableRowSelect
          }}
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