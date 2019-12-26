import React, { Component } from 'react';
import { Icon, Table, Popover } from 'antd';
import PropTypes from 'prop-types';
import moment from 'moment';
import { ReserveDetail } from './ManageCommon/ReserveDetail';
import WarningTip from '../../../Common/WarningTip';
import CommonPagination from '../../../Common/CommonPagination';
import styles from './warehouseManageComp.scss';
import { dataFormat } from '../../../../utils/utilFunc';
import { handleRight } from '@utils/utilFunc';

export default class ToolReserve extends Component {

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
    confirmRemind: () => {},
  }

  onPaginationChange = ({ pageSize, currentPage }) => { // 翻页
    const { reserveParams } = this.props;
    this.queryReserveList({
      ...reserveParams,
      pageNum: currentPage,
      pageSize,
    });
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
      sortMethod,
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
    const reserveBox = this.reserveBox;
    const timeWidth = 160; // 入库 出库
    const pricePersonWidth = 90; // 单价 入库人
    const moreInfoWidth = 75; // 更多
    const statusWidth = 70; // 状态
    const codeWidth = 140; // 物资编码
    const handleWidth = 90; // 操作
    let textWidth = 120;
    if (reserveBox) { // 样式对齐，防止文字过多错行。
      const { clientWidth } = reserveBox;
      textWidth = (clientWidth - timeWidth * 2 - pricePersonWidth * 2 - moreInfoWidth - statusWidth - codeWidth - handleWidth) / 2;
    }
    const TextOverflowDOM = (styleText, widthParam) => (text) => ( // 控制指定长度表格字符串的溢出样式。(2 * 8padding值需去除)
      <div
        title={text || '--'}
        className={styles[styleText]}
        style={{maxWidth: `${widthParam - 16}px`}}
      >{text || '--'}</div>
    );
    const toolHandleRight = handleRight('book_operateTool');
    const column = [
      {
        title: '物资编码',
        dataIndex: 'materialCode',
        width: codeWidth,
        className: styles.materialCode,
      }, {
        title: '供货商',
        dataIndex: 'supplierName',
        width: textWidth,
        render: TextOverflowDOM('supplierName', textWidth),
      }, {
        title: '制造商',
        dataIndex: 'manufactorName',
        width: textWidth,
        render: TextOverflowDOM('manufactorName', textWidth),
      }, {
        title: '单价/元',
        dataIndex: 'price',
        sorter: true,
        width: pricePersonWidth,
        render: (text) => dataFormat(text),
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
        render: (text) => text ? moment(text).format('YYYY/MM/DD HH:mm:ss') : '--',
      }, {
        title: '出库时间',
        dataIndex: 'outTime',
        width: timeWidth,
        sorter: true,
        render: (text) => text ? moment(text).format('YYYY/MM/DD HH:mm:ss') : '--',
      }, {
        title: '更多信息',
        dataIndex: 'moreInfo',
        width: moreInfoWidth,
        render: (text, record) => {
          const { isEntry, entryTypeName, outReason, remarks } = record;
          const InfoContent = (
            <div className={styles.infoContent}>
              {!(isEntry > 0) && <div className={styles.eachInfo}>
                <span className={styles.name}>耗损类型</span>
                <span className={styles.info}>{entryTypeName || '--'}</span>
              </div>}
              {!(isEntry > 0) && <div className={styles.eachInfo}>
                <span className={styles.name}>耗损原因</span>
                <span className={styles.info}>{outReason || '--'}</span>
              </div>}
              <div className={styles.eachInfo}>
                <span className={styles.name}>入库备注</span>
                <span className={styles.info}>{remarks || '--'}</span>
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
        title: '状态',
        dataIndex: 'isEntry',
        sorter: true,
        width: statusWidth,
        render: (text) => (
          text > 0 ? <span className={styles.inWarehouse}>在库中</span> : <span className={styles.outWarehouse}>已出库</span>
        ),
      },
    ];
    return toolHandleRight ? column.concat({
      title: '操作',
      dataIndex: 'handle',
      width: handleWidth,
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
    }) : column;
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
      confirmRemind: () => {},
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

  render(){
    const { remindShow, remindText, confirmRemind } = this.state;
    const { reserveDetail, reserveListInfo, tabName, reserveParams, reserveListLoading } = this.props;
    const { pageSize, pageNum } = reserveParams;
    const { pageCount = 0 } = reserveListInfo;
    const dataList = reserveListInfo.dataList || [];
    return (
      <section className={styles.reserve} ref={(ref) => this.reserveBox = ref}>
        <h3 className={styles.title}>
          <span className={styles.text}>工器具 - 库存</span>
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
          loading={reserveListLoading}
          onChange={this.tableChange}
          columns={this.reserveColumn()}
          dataSource={dataList.map(e => ({ key: e.materialCode, ...e }))}
          pagination={false}
          locale={{ emptyText: <img width="223" height="164" src="/img/nodata.png" /> }}
        />
        {remindShow && <WarningTip onOK={confirmRemind} onCancel={this.hideRemindModal} value={remindText} />}
      </section>
    );
  }
}

