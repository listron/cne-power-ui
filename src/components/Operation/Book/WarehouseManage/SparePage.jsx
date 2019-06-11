import React, { Component } from 'react';
import ConditionSearch from './ManageCommon/ConditionSearch';
import HandleComponent from './ManageCommon/HandleComponents';
import { Table, Popover } from 'antd';
import PropTypes from 'prop-types';
import styles from './warehouseManageComp.scss';

class SparePage extends Component {

  static propTypes = {
    checkedStocks: PropTypes.array,
    stocksList: PropTypes.array,
    reserveParams: PropTypes.object,
    changeStore: PropTypes.func,
    showSide: PropTypes.func,
    getReserveDetail: PropTypes.func,
    getReserveList: PropTypes.func,
  }

  state = {
    highlightId: null,
  }

  onTableRowSelect = (selectedRowKeys, checkedStocks) => { // 选中条目
    this.props.changeStore({ checkedStocks });
  }

  getMoreInfo = () => {

  }

  getReserveDetail = (record) => { // 操作 - 查看库存
    const { showSide, getReserveDetail, getReserveList, reserveParams, changeStore } = this.props;
    const { inventoryId } = record;
    showSide('reserve');
    changeStore({ reserveInventoryId: inventoryId })
    getReserveDetail({ inventoryId }); // 库存详情
    getReserveList({ ...reserveParams, inventoryId }); // 库存物品列表
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
      title: '仓库',
      dataIndex: 'warehouseName',
      sorter: true,
    }, {
      title: '库存数量',
      dataIndex: 'inventoryNum',
      sorter: true,
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
            trigger="click"
          >
            <button className={styles.trigButton}>查看</button>
          </Popover>
        )
      }
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
    const { checkedStocks, stocksList } = this.props;
    return (
      <div className={styles.sparePage}>
        <ConditionSearch {...this.props} />
        <HandleComponent {...this.props} />
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