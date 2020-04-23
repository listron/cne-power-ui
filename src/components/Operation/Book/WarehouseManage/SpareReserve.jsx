import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { ReserveDetail } from './ManageCommon/ReserveDetail';
import WarningTip from '../../../Common/WarningTip';
import CommonPagination from '../../../Common/CommonPagination';
import styles from './warehouseManageComp.scss';
import { dataFormat } from '../../../../utils/utilFunc';
import { handleRight } from '@utils/utilFunc';
import CneTable from '../../../Common/Power/CneTable';

export default class SpareReserve extends Component {

  static propTypes = {
    tabName: PropTypes.string,
    reserveInventoryId: PropTypes.number,
    reserveDetail: PropTypes.object,
    reserveListInfo: PropTypes.object,
    reserveListLoading: PropTypes.bool,
    reserveParams: PropTypes.object,
    backList: PropTypes.func,
    changeStore: PropTypes.func,
    getReserveDetail: PropTypes.func,
    getReserveList: PropTypes.func,
    deleteReserveInfo: PropTypes.func,
    recallReserveInfo: PropTypes.func,
  }

  state = {
    remindShow: false,
    remindText: '',
    materialCode: null,
    confirmRemind: () => { },
  }

  sortTemplete = {
    'price': 'price',
    'username': 'user',
    'entry_time': 'enteryTime',
    'we_entry_time': 'outTime',
    'is_entry': 'isEntry',
    'desc': 'descend',
    'asc': 'ascend',
  };


  onPaginationChange = ({ pageSize, currentPage }) => { // 翻页
    const { reserveParams } = this.props;
    this.queryReserveList({
      ...reserveParams,
      pageNum: currentPage,
      pageSize,
    });
  }

  tableChange = (pagination, filter, sorter) => { // 排序
    const { field } = sorter;
    const { reserveParams } = this.props;
    const { sortField, sortMethod } = reserveParams;
    const sortTemplete = {
      price: 'price',
      user: 'username',
      enteryTime: 'entry_time',
      outTime: 'we_entry_time',
      isEntry: 'is_entry',
      descend: 'desc',
      ascend: 'asc',
    };
    let newSortField = sortField, newSortMethod = 'desc';
    if (!field || sortTemplete[field] === sortField) {
      newSortMethod = sortMethod === 'desc' ? 'asc' : 'desc';
    } else {
      newSortField = sortTemplete[field];
    }
    this.queryReserveList({
      ...reserveParams,
      sortField: newSortField,
      sortMethod: newSortMethod,
    });
  }

  queryReserveList = (reserveParams) => { // 请求库存列表
    const { changeStore, getReserveList, reserveInventoryId } = this.props;
    changeStore({ reserveParams });
    getReserveList({
      inventoryId: reserveInventoryId,
      ...reserveParams,
    });
  }

  reserveColumn = () => {
    const spareHandleRight = handleRight('book_operateSpare');
    const baseColumn = [
      {
        title: '物资编码',
        dataIndex: 'materialCode',
        width: '10%',
        textAlign: 'left',
        className: styles.materialCode,
      }, {
        title: '供货商',
        dataIndex: 'supplierName',
        width: '12%',
        textAlign: 'left',
        render: (supplierName) => <div className={styles.supplierName} title={supplierName || '--'}>{supplierName || '--'}</div>,
      }, {
        title: '制造商',
        dataIndex: 'manufactorName',
        width: '12%',
        textAlign: 'left',
        render: (manufactorName) => <div className={styles.manufactorName} title={manufactorName || '--'}>{manufactorName || '--'}</div>,
      }, {
        title: '单价/元',
        dataIndex: 'price',
        sorter: true,
        width: '7.5%',
        textAlign: 'right',
        render: (text) => dataFormat(text),
      }, {
        title: '入库人',
        dataIndex: 'user',
        width: '7.5%',
        sorter: true,
        textAlign: 'left',
        render: (user) => <div className={styles.user} title={user}>{user}</div>,
      }, {
        title: '入库时间',
        dataIndex: 'enteryTime',
        width: '13%',
        sorter: true,
        textAlign: 'center',
        render: (text) => text ? moment(text).format('YYYY/MM/DD HH:mm:ss') : '--',
      }, {
        title: '出库时间',
        dataIndex: 'outTime',
        width: '13%',
        sorter: true,
        textAlign: 'center',
        render: (text) => text ? moment(text).format('YYYY/MM/DD HH:mm:ss') : '--',
      }, {
        title: '备注',
        dataIndex: 'remarks',
        width: '12%',
        textAlign: 'left',
        render: (remarks) => <div className={styles.remarks} title={remarks || '--'}>{remarks || '--'}</div>,
      }, {
        title: '状态',
        dataIndex: 'isEntry',
        sorter: true,
        textAlign: 'center',
        width: '5%',
        render: (text) => (
          text > 0 ? <span className={styles.inWarehouse}>在库中</span> : <span className={styles.outWarehouse}>已出库</span>
        ),
      },
    ];
    return spareHandleRight ? baseColumn.concat({
      title: '操作',
      dataIndex: 'handle',
      width: '8%',
      textAlign: 'center',
      render: (text, record) => {
        const { isEntry } = record;
        return (
          <span
            className={styles.handle}
            onClick={() => this.showRemindModal(record, isEntry > 0 ? 'delete' : 'takeback')}
          >
            {isEntry > 0 ? <i className="iconfont icon-del" /> : <i className="iconfont icon-back2" />}
            <span>{isEntry > 0 ? '删除' : '撤回'}</span>
          </span>
        );
      },
    }) : baseColumn;
  }

  showRemindModal = ({ materialCode }, key) => { // key: 'delete' 'takeback'
    this.setState({
      remindShow: true,
      materialCode,
      remindText: key === 'delete' ? '确定删除么' : '确定撤回且重新入库么',
      confirmRemind: key === 'delete' ? this.deleteReserve : this.takebackReserve,
    });
  }

  hideRemindModal = () => { // 隐藏删除/撤回弹框
    this.setState({
      remindShow: false,
      remindText: '',
      materialCode: null,
      confirmRemind: () => { },
    });
  }


  deleteReserve = () => { // 删除物资
    const { deleteReserveInfo } = this.props;
    const { materialCode } = this.state;
    this.hideRemindModal();
    deleteReserveInfo({ materialCode });
  }

  takebackReserve = () => { // 撤回物资
    const { recallReserveInfo } = this.props;
    const { materialCode } = this.state;
    this.hideRemindModal();
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

  render() {
    const { remindShow, remindText, confirmRemind } = this.state;
    const { reserveDetail, reserveListInfo, tabName, reserveParams, reserveListLoading } = this.props;
    const { pageSize, pageNum, sortField, sortMethod } = reserveParams;
    const { pageCount = 0 } = reserveListInfo;
    const dataList = reserveListInfo.dataList || [];
    return (
      <section className={styles.reserve} ref={(ref) => this.reserveBox = ref}>
        <h3 className={styles.title}>
          <span className={styles.text}>备品备件 - 库存</span>
          <i className={`iconfont icon-fanhui ${styles.backIcon}`} title="返回" onClick={this.backToList} />
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
        <CneTable
          loading={reserveListLoading}
          onChange={this.tableChange}
          columns={this.reserveColumn()}
          dataSource={dataList.map(e => ({ key: e.materialCode, ...e }))}
          pagination={false}
          sortField={this.sortTemplete[sortField]}
          sortMethod={this.sortTemplete[sortMethod]}
        />
        {remindShow && <WarningTip onOK={confirmRemind} onCancel={this.hideRemindModal} value={remindText} />}
      </section>
    );
  }
}

