import React, { Component } from 'react';
import ConditionSearch from './ManageCommon/ConditionSearch';
import HandleComponent from './ManageCommon/HandleComponents';
import { Table, Popover } from 'antd';
import PropTypes from 'prop-types';
import { dataFormat } from '../../../../utils/utilFunc';
import styles from './warehouseManageComp.scss';

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

  onTableRowSelect = (selectedRowKeys, checkedStocks) => { // 选中条目
    this.props.changeStore({ checkedStocks });
  }

  getReserveDetail = (record) => { // 操作 - 查看库存
    const { showSide, getReserveDetail, getReserveList, reserveParams, changeStore } = this.props;
    const { inventoryId } = record;
    showSide('reserve');
    changeStore({ reserveInventoryId: inventoryId })
    getReserveDetail({ inventoryId }); // 库存详情
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
    const sortField = field ? sortTemplete[field] : 'goods_name';
    const sortMethod = order ? sortTemplete[order] : 'desc';
    const newParam = {
      ...tableParams,
      sortField,
      sortMethod,
    }
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

  spareColumn = () => [ // 表头
    {
      title: '物品名称',
      dataIndex: 'goodsName',
      sorter: true,
    }, {
      title: '型号',
      dataIndex: 'modeName',
      sorter: true,
    }, {
      title: '物品类型',
      dataIndex: 'goodsType',
      sorter: true,
      render: (text) => ({
        301: '生活物资',
        302: '办公物资',
        303: '其他',
      }[text])
    },{
      title: '所属仓库',
      dataIndex: 'warehouseName',
      sorter: true,
    }, {
      title: '库存数量',
      dataIndex: 'inventoryNum',
      sorter: true,
      render: (text, record) => {
        const { inventoryNum, goodsUnit } = record;
        return <span>{dataFormat(inventoryNum)}{goodsUnit || ''}</span>;
      }
    }, {
      title: '厂家',
      dataIndex: 'devManufactorName',
      sorter: true,
    }, {
      title: '供货商',
      dataIndex: 'supplierName',
      sorter: true,
    }, {
      title: '制造商',
      dataIndex: 'manufactorName',
      sorter: true,
    }, {
      title: '操作',
      dataIndex: 'handle',
      render: (text, record) => (
        <div className={styles.stockHandle}>
          <span className={styles.text} onClick={() => this.toInsert(record)}>入库</span>
          <span className={styles.text} onClick={() => this.toTakeout(record)}>出库</span>
          <span className={styles.text} onClick={() => this.getReserveDetail(record)}>库存</span>
        </div>
      )
    }
  ];

  render(){
    const { checkedStocks, stocksList, stocksListLoading } = this.props;
    return (
      <div className={styles.sparePage}>
        <ConditionSearch {...this.props} />
        <HandleComponent {...this.props} />
        <Table
          loading={stocksListLoading}
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

export default MaterialPage;