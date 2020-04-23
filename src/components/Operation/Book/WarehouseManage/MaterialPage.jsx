import React, { Component } from 'react';
import ConditionSearch from './ManageCommon/ConditionSearch';
import HandleComponent from './ManageCommon/HandleComponents';
import { Table, Popover } from 'antd';
import PropTypes from 'prop-types';
import { dataFormat } from '../../../../utils/utilFunc';
import { handleRight } from '@utils/utilFunc';
import styles from './warehouseManageComp.scss';
import CneTable from '../../../Common/Power/CneTable';

class MaterialPage extends Component {

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

  state = {
    highlightId: null,
  }

  sortTemplete = {
    'goods_name': 'goodsName',
    'mode_name': 'modeName',
    'goods_type': 'goodsType',
    'warehouse_name': 'warehouseName',
    'inventory_num': 'inventoryNum',
    'devManufactorName': 'devManufactorName',
    'supplier_name': 'supplierName',
    'manufactor_name': 'manufactorName',
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
    getReserveDetail({ inventoryId }); // 库存详情
    getReserveList({ ...reserveParams, inventoryId }); // 库存物品列表
  }

  tableChange = (pagination, filter, sorter) => {
    const { field, order } = sorter;
    const { tableParams, getWarehouseManageList, changeStore } = this.props;
    const sortTemplete = {
      goodsName: 'goods_name',
      modeName: 'mode_name',
      goodsType: 'goods_type',
      warehouseName: 'warehouse_name',
      inventoryNum: 'inventory_num',
      devManufactorName: 'devManufactorName',
      supplierName: 'supplier_name',
      manufactorName: 'manufactor_name',
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
    const goodsInitTypes = { 301: '生活物资', 302: '办公物资', 303: '其他' };
    const materialHandleRight = handleRight('book_operateSupply');
    return [
      {
        title: '物品名称',
        dataIndex: 'goodsName',
        textAlign: 'left',
        width: '10%',
        render: (goodsName) => <div className={styles.goodsName} title={goodsName || '--'}>{goodsName || '--'}</div>,
        sorter: true,
      }, {
        title: '型号',
        dataIndex: 'modeName',
        width: '10%',
        textAlign: 'left',
        render: (modeName) => <div className={styles.modeName} title={modeName || '--'}>{modeName || '--'}</div>,
        sorter: true,
      }, {
        title: '物品类型',
        dataIndex: 'goodsType',
        sorter: true,
        width: '10%',
        textAlign: 'left',
        render: (text) => <div title={goodsInitTypes[text] || '--'} className={styles.goodsType} >{goodsInitTypes[text] || '--'}</div>,
      }, {
        title: '所属仓库',
        dataIndex: 'warehouseName',
        width: '10%',
        textAlign: 'left',
        render: (modeName) => <div className={styles.modeName} title={modeName || '--'}>{modeName || '--'}</div>,
        sorter: true,
      }, {
        title: '库存数量',
        dataIndex: 'inventoryNum',
        sorter: true,
        width: '8%',
        textAlign: 'right',
        render: (text, record) => {
          const { inventoryNum, goodsUnit } = record;
          return <span>{dataFormat(inventoryNum)}{goodsUnit || ''}</span>;
        },
      }, {
        title: '厂家',
        dataIndex: 'devManufactorName',
        width: '13%',
        textAlign: 'left',
        render: (text) => <div className={styles.devManufactorName} title={text || '--'}>{text || '--'}</div>,
        sorter: true,
      }, {
        title: '供货商',
        dataIndex: 'supplierName',
        width: '12%',
        textAlign: 'left',
        render: (text) => <div className={styles.supplierName} title={text || '--'}>{text || '--'}</div>,
        sorter: true,
      }, {
        title: '制造商',
        dataIndex: 'manufactorName',
        width: '12%',
        textAlign: 'left',
        render: (text) => <div className={styles.manufactorName} title={text || '--'}>{text || '--'}</div>,
        sorter: true,
      }, {
        title: '操作',
        dataIndex: 'handle',
        width: '12%',
        render: (text, record) => (
          <div className={styles.stockHandle}>
            {materialHandleRight && <span className={styles.text} onClick={() => this.toInsert(record)}>入库</span>}
            {materialHandleRight && <span className={styles.text} onClick={() => this.toTakeout(record)}>损耗</span>}
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
      <div className={styles.materialPage} >
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

export default MaterialPage;
