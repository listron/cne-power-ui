import React, { Component } from 'react';
import ConditionSearch from './ManageCommon/ConditionSearch';
import HandleComponent from './ManageCommon/HandleComponents';
import { Table, Popover } from 'antd';
import PropTypes from 'prop-types';
import { handleRight } from '@utils/utilFunc';
import styles from './warehouseManageComp.scss';
import CneTable from '../../../Common/Power/CneTable';

class SparePage extends Component {

  static propTypes = {
    checkedStocks: PropTypes.array,
    stocksList: PropTypes.array,
    stocksListLoading: PropTypes.bool,
    tableParams: PropTypes.object,
    reserveParams: PropTypes.object,
    changeStore: PropTypes.func,
    showSide: PropTypes.func,
    getReserveDetail: PropTypes.func,
    getReserveList: PropTypes.func,
    getWarehouseManageList: PropTypes.func,
  }

  sortTemplete = {
    'goods_name': 'goodsName',
    'mode_name': 'modeName',
    'warehouse_name': 'warehouseName',
    'inventory_num': 'inventoryNum',
    'threshold': 'threshold',
    'desc': 'descend',
    'asc': 'ascend',
  };

  onTableRowSelect = (selectedRowKeys, checkedStocks) => { // 选中条目
    this.props.changeStore({ checkedStocks });
  }

  getReserveDetail = (record) => { // 操作 - 查看库存
    const { showSide, getReserveDetail, getReserveList, reserveParams, changeStore } = this.props;
    const { inventoryId } = record;
    showSide('reserve');
    changeStore({ reserveInventoryId: inventoryId });
    getReserveDetail({ inventoryId: `${inventoryId}` }); // 库存详情
    getReserveList({ ...reserveParams, inventoryId }); // 库存物品列表
  }

  tableChange = (pagination, filter, sorter) => {
    const { field, order } = sorter;
    const { tableParams, getWarehouseManageList, changeStore } = this.props;
    const sortTemplete = {
      goodsName: 'goods_name',
      modeName: 'mode_name',
      warehouseName: 'warehouse_name',
      inventoryNum: 'inventory_num',
      threshold: 'threshold',
      descend: 'desc',
      ascend: 'asc',
    };
    const { sortField, sortMethod } = tableParams;
    let newSortField = sortField, newSortMethod = 'desc';
    if (!field || sortTemplete[field] === sortField) {
      newSortMethod = sortMethod === 'desc' ? 'asc' : 'desc';
    } else {
      newSortField = sortTemplete[field];
    }
    const newParam = {
      ...tableParams,
      sortField: newSortField,
      sortMethod: newSortMethod,
    };
    changeStore({ tableParams: newParam });
    getWarehouseManageList({ ...newParam });
  }

  toInsert = (record) => { // 操作 - 再入库
    const { changeStore, showSide } = this.props;
    changeStore({ originInsertInfo: record });
    showSide('insert');
  }

  toTakeout = (record) => { // 操作 - 出库
    const { changeStore, showSide } = this.props;
    changeStore({ originTakeoutInfo: record });
    showSide('takeout');
  }

  spareColumn = () => {
    const spareHandleRight = handleRight('book_operateSpare');
    return [
      {
        title: '物品名称',
        dataIndex: 'goodsName',
        sorter: true,
        width: '10%',
        textAlign: 'left',
        render: (text) => <div className={styles.goodsName} title={text || '--'}>{text || '--'}</div>,
      }, {
        title: '型号',
        dataIndex: 'modeName',
        width: '14%',
        textAlign: 'left',
        render: (text) => <div className={styles.modeName} title={text || '--'}>{text || '--'}</div>,
        sorter: true,
      }, {
        title: '所属仓库',
        dataIndex: 'warehouseName',
        width: '11%',
        textAlign: 'left',
        render: (text) => <div className={styles.warehouseName} title={text || '--'}>{text || '--'}</div>,
        sorter: true,
      }, {
        title: '库存数量',
        dataIndex: 'inventoryNum',
        sorter: true,
        width: '8%',
        textAlign: 'left',
        render: (text, record) => {
          const { inventoryNum, goodsUnit, threshold } = record;
          let StockNum = <span />;
          if (!inventoryNum && inventoryNum !== 0 && inventoryNum !== '0') { // 库存不存在
            StockNum = <span>--{goodsUnit || ''}</span>;
          } else if (inventoryNum < threshold) { // 库存紧张
            StockNum = (<span className={styles.shortage}>
              <span>{inventoryNum}{goodsUnit || ''}</span>
              <span className={styles.config}>紧张</span>
            </span>);
          } else {
            StockNum = <span>{inventoryNum}{goodsUnit || ''}</span>;
          }
          return StockNum;
        },
      }, {
        title: '对应资产类型',
        dataIndex: 'assetsPath',
        width: '25%',
        textAlign: 'left',
        render: (text) => <div className={styles.assetsPath} title={text || '--'}>{text || '--'}</div>,
      }, {
        title: '最低阈值',
        dataIndex: 'threshold',
        sorter: true,
        width: '8%',
        textAlign: 'right',
      }, {
        title: '更多信息',
        className: styles.moreInfo,
        dataIndex: 'moreInfo',
        width: '7%',
        textAlign: 'center',
        render: (text, record) => {
          const InfoContent = (
            <div className={styles.infoContent}>
              <div className={styles.eachInfo}>
                <span className={styles.name}>厂家</span>
                <span className={styles.info}>{record.devManufactorName || '--'}</span>
              </div>
              <div className={styles.eachInfo}>
                <span className={styles.name}>供货商</span>
                <span className={styles.info}>{record.supplierName || '--'}</span>
              </div>
              <div className={styles.eachInfo}>
                <span className={styles.name}>制造商</span>
                <span className={styles.info}>{record.manufactorName || '--'}</span>
              </div>
            </div>
          );
          return (
            <Popover
              content={InfoContent}
              title={<span className={styles.infoContentTitle}>更多信息</span>}
              trigger="hover"
            >
              <button className={styles.trigButton}>查看</button>
            </Popover>
          );
        },
      }, {
        title: '操作',
        dataIndex: 'handle',
        width: '12%',
        render: (text, record) => (
          <div className={styles.stockHandle}>
            {spareHandleRight && <span className={styles.text} onClick={() => this.toInsert(record)}>入库</span>}
            {spareHandleRight && <span className={styles.text} onClick={() => this.toTakeout(record)}>出库</span>}
            <span className={styles.text} onClick={() => this.getReserveDetail(record)}>库存</span>
          </div>
        ),
      },
    ];
  }

  render() {
    const { checkedStocks, stocksList, stocksListLoading, tableParams } = this.props;
    const { sortField, sortMethod } = tableParams;
    return (
      <div className={styles.sparePage} ref={(ref) => { this.spareRef = ref; }}>
        <ConditionSearch {...this.props} />
        <HandleComponent {...this.props} />
        <CneTable
          loading={stocksListLoading}
          onChange={this.tableChange}
          rowSelection={{
            selectedRowKeys: checkedStocks.map(e => e.key),
            onChange: this.onTableRowSelect,
          }}
          columns={this.spareColumn()}
          dataSource={stocksList.map(e => ({ key: e.inventoryId, ...e }))}
          pagination={false}
          // dataError={diagnoseListError}
          sortField={this.sortTemplete[sortField]}
          sortMethod={this.sortTemplete[sortMethod]}
          onChange={this.tableChange}
        />
      </div>
    );
  }
}

export default SparePage;
