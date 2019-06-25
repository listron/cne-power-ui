import React, { Component } from 'react';
// import ConditionSearch from './ManageCommon/ConditionSearch';
// import HandleComponent from './ManageCommon/HandleComponents';
import { Table, Popover } from 'antd';
import PropTypes from 'prop-types';
import styles from './examinerComp.scss';

class HandleExaminer extends Component {

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
    const sortField = field ? sortTemplete[field] : '';
    const sortMethod = order ? sortTemplete[order] : '';
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
    const spareRef = this.spareRef;
    const selectWidth = 60; // 选框宽度
    const fiexedWidth = 95; // 库存数量 = 最低阈值 = 更多信息
    const handleWidth = 140; // 操作
    let calcNormalWidth = 100, calcLongWidth = 200;
    if (spareRef) { // 样式对齐，防止文字过多错行。
      const { clientWidth } = spareRef;
      const restWidth = (clientWidth - selectWidth - fiexedWidth * 3 - handleWidth);
      calcNormalWidth = restWidth / 5; // 物品名称, 型号, 所属仓库
      calcLongWidth = restWidth / 5 * 2; // 资产类型
    }
    const TextOverflowDOM = (styleText, widthParam) => (text) => ( // 控制指定长度表格字符串的溢出样式。(2 * 8padding值需去除)
      <div
        title={text || '--'}
        className={styles[styleText]}
        style={{maxWidth: `${widthParam - 16}px`}}
      >{text || '--'}</div>
    )
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
          const { inventoryNum, goodsUnit, threshold } = record;
          let StockNum = <span />;
          if (!inventoryNum && inventoryNum !== 0 && inventoryNum !== '0') { // 库存不存在
            StockNum = <span>--{goodsUnit || ''}</span>
          } else if (inventoryNum < threshold) { // 库存紧张
            StockNum = (<span className={styles.shortage}>
              <span>{inventoryNum}{goodsUnit || ''}</span>
              <span className={styles.config}>紧张</span>
            </span>)
          } else {
            StockNum = <span>{inventoryNum}{goodsUnit || ''}</span>
          }
          return StockNum;
        }
      }, {
        title: '对应资产类型',
        dataIndex: 'assetsPath',
        width: calcLongWidth,
        render: TextOverflowDOM('assetsPath', calcLongWidth),
      }, {
        title: '最低阈值',
        dataIndex: 'threshold',
        width: fiexedWidth,
        sorter: true,
      }, {
        title: '更多信息',
        className: styles.moreInfo,
        width: fiexedWidth,
        dataIndex: 'moreInfo',
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
          )
          return (
            <Popover
              content={InfoContent}
              title={<span className={styles.infoContentTitle}>更多信息</span>}
              trigger="hover"
            >
              <button className={styles.trigButton}>查看</button>
            </Popover>
          )
        }
      }, {
        title: '操作',
        dataIndex: 'handle',
        width: handleWidth,
        render: (text, record) => (
          <div className={styles.stockHandle}>
            <span className={styles.text} onClick={() => this.toInsert(record)}>入库</span>
            <span className={styles.text} onClick={() => this.toTakeout(record)}>出库</span>
            <span className={styles.text} onClick={() => this.getReserveDetail(record)}>库存</span>
          </div>
        )
      }
    ]
  }

  render(){
    const { checkedStocks, stocksList, stocksListLoading } = this.props;
    return (
      <div className={styles.sparePage} ref={(ref) => this.spareRef = ref}>
        表格页面 = 操作表格
        {/* <ConditionSearch {...this.props} /> */}
        {/* <HandleComponent {...this.props} /> */}
        {/* <Table
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
        /> */}
      </div>
    )
  }
}

export default HandleExaminer;