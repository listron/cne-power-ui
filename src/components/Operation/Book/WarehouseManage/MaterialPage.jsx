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

  spareColumn = () => {
    const material = this.material;
    const selectWidth = 60; // 选框宽度
    const fiexedWidth = 95; // 物品类型 = 库存数量
    const handleWidth = 140; // 操作
    let calcNormalWidth = 100; // 物品名 + 型号 + 所属仓库 + 厂家 + 供货 + 制造
    if (material) { // 样式对齐，防止文字过多错行。
      const { clientWidth } = material;
      const restWidth = (clientWidth - selectWidth - fiexedWidth * 2 - handleWidth);
      calcNormalWidth = restWidth / 6; // 物品名称, 型号, 所属仓库
    }
    const TextOverflowDOM = (styleText, widthParam) => (text) => ( // 控制指定长度表格字符串的溢出样式。(2 * 8padding值需去除)
      <div
        title={text || '--'}
        className={styles[styleText]}
        style={{maxWidth: `${widthParam - 16}px`}}
      >{text || '--'}</div>
    );
    const goodsInitTypes = {
      201: '安全工器具',
      202: '检修工器具',
      203: '仪器仪表',
    };
    return [
      {
        title: '物品名称',
        dataIndex: 'goodsName',
        width: calcNormalWidth,
        render: TextOverflowDOM('goodsName', calcNormalWidth),
        sorter: true,
      }, {
        title: '型号',
        dataIndex: 'modeName',
        width: calcNormalWidth,
        render: TextOverflowDOM('modeName', calcNormalWidth),
        sorter: true,
      }, {
        title: '物品类型',
        dataIndex: 'goodsType',
        sorter: true,
        width: fiexedWidth,
        render: (text) => (
          <div
            title={goodsInitTypes[text] || '--'}
            className={styles.goodsType}
            style={{maxWidth: `${fiexedWidth - 16}px`}}
          >{goodsInitTypes[text] || '--'}</div>
        )
      }, {
        title: '所属仓库',
        dataIndex: 'warehouseName',
        width: calcNormalWidth,
        render: TextOverflowDOM('warehouseName', calcNormalWidth),
        sorter: true,
      }, {
        title: '库存数量',
        dataIndex: 'inventoryNum',
        sorter: true,
        width: fiexedWidth,
        render: (text, record) => {
          const { inventoryNum, goodsUnit } = record;
          return <span>{dataFormat(inventoryNum)}{goodsUnit || ''}</span>;
        }
      }, {
        title: '厂家',
        dataIndex: 'devManufactorName',
        width: calcNormalWidth,
        render: TextOverflowDOM('devManufactorName', calcNormalWidth),
        sorter: true,
      }, {
        title: '供货商',
        dataIndex: 'supplierName',
        width: calcNormalWidth,
        render: TextOverflowDOM('supplierName', calcNormalWidth),
        sorter: true,
      }, {
        title: '制造商',
        dataIndex: 'manufactorName',
        width: calcNormalWidth,
        render: TextOverflowDOM('manufactorName', calcNormalWidth),
        sorter: true,
      }, {
        title: '操作',
        dataIndex: 'handle',
        width: handleWidth,
        render: (text, record) => (
          <div className={styles.stockHandle}>
            <span className={styles.text} onClick={() => this.toInsert(record)}>入库</span>
            <span className={styles.text} onClick={() => this.toTakeout(record)}>损耗</span>
            <span className={styles.text} onClick={() => this.getReserveDetail(record)}>库存</span>
          </div>
        )
      }
    ];
  }

  render(){
    const { checkedStocks, stocksList, stocksListLoading } = this.props;
    return (
      <div className={styles.materialPage} ref={(ref)=>this.material = ref}>
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