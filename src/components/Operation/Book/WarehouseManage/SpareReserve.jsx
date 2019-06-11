import React, { Component } from 'react';
import { Icon, Table, Select, Input, Button } from 'antd';
import PropTypes from 'prop-types';
import moment from 'moment';
import { ReserveDetail } from './ManageCommon/ReserveDetail';
import CommonPagination from '../../../Common/CommonPagination';
import styles from './warehouseManageComp.scss';
import { dataFormat } from '../../../../utils/utilFunc';

export default class SpareReserve extends Component {

  static propTypes = {
    tabName: PropTypes.string,
    reserveInventoryId: PropTypes.number,
    reserveDetail: PropTypes.object,
    reserveListInfo: PropTypes.object,
    reserveParams: PropTypes.object,
    backList: PropTypes.func,
    changeStore: PropTypes.func,
    getReserveDetail: PropTypes.func,
    getReserveList: PropTypes.func,
    deleteReserveInfo: PropTypes.func,
    recallReserveInfo: PropTypes.func,
  }

  onPaginationChange = ({ pageSize, currentPage }) => { // 翻页
    const { reserveParams } = this.props;
    this.queryReserveList({
      ...reserveParams,
      pageNum: currentPage,
      pageSize,
    })
  }

  tableChange = (pagination, filter, sorter) => { // 排序
    const { field, order } = sorter;
    const { reserveParams } = this.props;
    const sortTemplete = {
      price: 'price',
      user: 'username',
      enteryTime: 'entry_time',
      outTime: 'we_entry_time',
      isEntry: 'is_entry',
      descend: 'desc',
      ascend: 'asc',
    };
    const sortField = field ? sortTemplete[field] : 'entry_time';
    const sortMethod = order ? sortTemplete[order] : 'desc';
    this.queryReserveList({
      ...reserveParams,
      sortField,
      sortMethod
    })
  }
  
  queryReserveList = (reserveParams) => { // 请求库存列表
    const { changeStore, getReserveList, reserveInventoryId } = this.props;
    changeStore({ reserveParams });
    getReserveList({
      inventoryId: reserveInventoryId,
      ...reserveParams
    })
  }

  reserveColumn = () => {
    const reserveBox = this.reserveBox;
    const timeWidth = 160;
    const pricePersonWidth = 90;
    const statusWidth = 70;
    let codeWidth = 140, handleWidth = 90, textWidth = 120;
    if (reserveBox) { // 样式对齐，防止文字过多错行。
      const { clientWidth } = reserveBox;
      textWidth = (clientWidth - timeWidth * 2 - pricePersonWidth * 2 - statusWidth - codeWidth - handleWidth) / 3;
    }
    return [
      {
        title: '物资编码',
        dataIndex: 'materialCode',
        width: codeWidth,
        className: styles.materialCode,
      }, {
        title: '供货商',
        dataIndex: 'supplierName',
        width: textWidth,
        render: (text) => <div className={styles.supplierName} style={{maxWidth: `${textWidth}px`}} title={text}>{text || '--'}</div>
      }, {
        title: '制造商',
        dataIndex: 'manufactorName',
        width: textWidth,
        render: (text) => <div className={styles.manufactorName} style={{maxWidth: `${textWidth}px`}} title={text}>{text || '--'}</div>
      }, {
        title: '单价/元',
        dataIndex: 'price',
        sorter: true,
        width: pricePersonWidth,
        render: (text) => dataFormat(text)
      }, {
        title: '入库人',
        dataIndex: 'user',
        width: pricePersonWidth,
        sorter: true,
      }, {
        title: '入库时间',
        dataIndex: 'enteryTime',
        width: timeWidth,
        sorter: true,
        render: (text) => text ? moment(text).format('YYYY/MM/DD HH:mm:ss') : '--'
      }, {
        title: '出库时间',
        dataIndex: 'outTime',
        width: timeWidth,
        sorter: true,
        render: (text) => text ? moment(text).format('YYYY/MM/DD HH:mm:ss') : '--'
      }, {
        title: '备注',
        dataIndex: 'remarks',
        width: textWidth,
        render: (text) => <div className={styles.remarks} style={{maxWidth: `${textWidth}px`}} title={text}>{text || '--'}</div>
      }, {
        title: '状态',
        dataIndex: 'isEntry',
        sorter: true,
        width: statusWidth,
        render: (text) => (
          text > 0 ? <span className={styles.inWarehouse}>在库中</span> : <span className={styles.outWarehouse}>已出库</span>
        )
      }, {
        title: '操作',
        dataIndex: 'handle',
        width: handleWidth,
        render: (text, record) => {
          const { isEntry } = record;
          return (
            <span
              className={styles.handle}
              onClick={isEntry > 0 ? () => this.deleteReserve(record) : () => this.takebackReserve(record)}
            >
              {isEntry > 0 ? <i className="iconfont icon-del" /> : <Icon type="enter" />}
              <span>{isEntry > 0 ? '删除' : '撤回'}</span>
            </span>
          )
        }
      }
    ]
  }

  deleteReserve = ({ materialCode }) => { // 删除物资
    const { deleteReserveInfo } = this.props;
    deleteReserveInfo({ materialCode });
  }

  takebackReserve = ({ materialCode }) => { // 撤回物资
    const { recallReserveInfo } = this.props;
    recallReserveInfo({ materialCode });
  }

  backToList = () => {
    this.props.changeStore({
      reserveInventoryId: null, // 销毁选中的仓库id
      reserveDetail: {},
      reserveListInfo: {},
      reserveParams: { // 重置物资列表请求参数
        pageNum: 1,
        pageSize: 10,
        sortField: 'entry_time', 
        sortMethod: 'desc', 
      },
    });
    this.props.backList();
  }

  render(){
    const { reserveDetail, reserveListInfo, tabName, reserveParams } = this.props;
    const { pageSize, pageNum } = reserveParams;
    const { pageCount = 0 } = reserveListInfo;
    const dataList = reserveListInfo.dataList || [];
    return (
      <section className={styles.reserve} ref={(ref) => this.reserveBox = ref}>
        <h3 className={styles.title}>
          <span className={styles.text}>备品备件 - 库存</span>
          <Icon type="arrow-left" onClick={this.backToList} className={styles.backIcon} />
        </h3>
        <ReserveDetail reserveDetail={reserveDetail} tabName={tabName} />
        <div className={styles.pagination}>
          <CommonPagination
            total={pageCount}
            pageSize={pageSize}
            currentPage={pageNum}
            onPaginationChange={this.onPaginationChange}
          />
        </div>
        <Table
          // loading={loading}
          onChange={this.tableChange}
          columns={this.reserveColumn()}
          dataSource={dataList.map(e => ({ key: e.materialCode, ...e }))}
          pagination={false}
          locale={{ emptyText: <img width="223" height="164" src="/img/nodata.png" /> }}
        />
      </section>
    )
  }
}

