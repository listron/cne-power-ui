import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Radio, Popover, Icon } from 'antd';
import moment from 'moment';
import styles from './record.scss';
import CommonPagination from '../../../Common/CommonPagination';
import CneTable from '../../../Common/Power/CneTable';

class StockList extends Component {
  static propTypes = {
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    pageCount: PropTypes.number,
    tableLoading: PropTypes.bool,
    getInRecordList: PropTypes.func,
    getOutRecordList: PropTypes.func,
    stockRecordsStore: PropTypes.func,
    listParams: PropTypes.object,
    tableType: PropTypes.string,
    inRecordListData: PropTypes.array,
    outRecordListData: PropTypes.array,
  };

  constructor(props) {
    super(props);
    this.state = {
      visible: '',
    };
  }

  componentDidMount() {
    const { getInRecordList, listParams } = this.props;
    getInRecordList(listParams);
  }

  sortInfo = {
    'material_code': 'materialCode',
    'goods_name': 'goodsName',
    'goods_type': 'goodsTypeName',
    'manufactor': 'modeName',
    'goods_unit': 'price',
    'warehouse_name': 'warehouseName',
    'create_time': 'entryTime',
    'username': 'user',
    'asc': 'ascend',
    'desc': 'descend',
  };

  onPaginationChange = ({ pageSize, currentPage }) => { // 分页器
    const { stockRecordsStore, getInRecordList, getOutRecordList, listParams, tableType } = this.props;
    const newParams = {
      ...listParams,
      pageSize,
      pageNum: currentPage,
    };
    stockRecordsStore({
      ...newParams,
    });
    tableType === 'inRecord' && getInRecordList({
      ...newParams,
    });
    tableType === 'outRecord' && getOutRecordList({
      ...newParams,
    });
  }

  columns = () => {
    const { tableType } = this.props;
    const columns = [{
      title: '资产编码',
      dataIndex: 'materialCode',
      sorter: true,
      textAlign: 'left',
      width: '10%',
      render: (text) => <div className={styles.materialCode} title={text}>{text}</div>,
    }, {
      title: '物品名称',
      dataIndex: 'goodsName',
      sorter: true,
      textAlign: 'left',
      width: '12%',
      render: (text) => <div className={styles.goodsName} title={text}>{text || '--'}</div>,
    }, {
      title: '库存类型',
      dataIndex: 'goodsTypeName',
      width: '12%',
      sorter: true,
      textAlign: 'left',
      render: (text) => <div className={styles.goodsTypeName} title={text || '--'}>{text || '--'}</div>,
    }, {
      title: '设备型号',
      dataIndex: 'modeName',
      sorter: true,
      textAlign: 'left',
      width: '12%',
      render: (text) => <div className={styles.modeName} title={text || '--'}>{text || '--'}</div>,
    }, {
      title: '单价/元',
      dataIndex: 'price',
      sorter: true,
      textAlign: 'right',
      width: '11%',
      render: (text) => <div className={styles.price} title={text || '--'}>{text || '--'}</div>,
    }, {
      title: '仓库名称',
      dataIndex: 'warehouseName',
      sorter: true,
      textAlign: 'left',
      width: '14%',
      render: (text) => <div className={styles.warehouseName} title={text || '--'}>{text || '--'}</div>,
    }, {
      title: tableType === 'inRecord' && '入库时间' || '出库时间',
      dataIndex: 'entryTime',
      sorter: true,
      textAlign: 'center',
      width: '10%',
      render: (text, record) => moment(text).format('YYYY-MM-DD'),
    }, {
      title: tableType === 'inRecord' && '入库人' || '出库人',
      dataIndex: 'user',
      sorter: true,
      textAlign: 'left',
      width: '10%',
      render: (text) => <div className={styles.user} title={text || '--'}>{text || '--'}</div>,
    }, {
      title: '更多信息',
      dataIndex: 'moreInformation',
      textAlign: 'center',
      width: '9%',
      render: (text, record, index) => (
        <Popover
          content={this.inCheckedPopover(record)}
          trigger="click"
          arrowPointAtCenter
          visible={this.state.visible === index}
          onVisibleChange={() => { return this.handleVisibleChange(index); }}
        >
          <span className={styles.moreInformation}>查看</span>
        </Popover>
      ),
    }];
    return columns;
  }


  handleVisibleChange = (index) => {
    this.setState({ visible: index });
  };

  hidePopover = () => { // 气泡框内部关闭
    this.setState({
      visible: '',
    });
  };

  tableChange = (pagination, filter, sorter) => { // 表格排序
    const { tableType, getInRecordList, getOutRecordList, listParams } = this.props;
    const { field, order } = sorter;
    const { sortField, sortMethod } = listParams;
    const sortInfo = {
      materialCode: 'material_code',
      goodsName: 'goods_name',
      goodsTypeName: 'goods_type',
      modeName: 'manufactor',
      price: 'goods_unit',
      warehouseName: 'warehouse_name',
      entryTime: 'create_time',
      user: 'username',
    };
    let newSortField = sortField, newSortMethod = 'desc';
    if (!field || sortInfo[field] === sortField) {
      newSortMethod = sortMethod === 'desc' ? 'asc' : 'desc';
    } else {
      newSortField = sortInfo[field];
    }
    const newParams = {
      ...listParams,
      sortField: newSortField,
      sortMethod: newSortMethod,
    };


    tableType === 'inRecord' && getInRecordList(newParams);
    tableType === 'outRecord' && getOutRecordList(newParams);
  }


  changeRadio = (e) => { // 切换按钮
    const { stockRecordsStore, getInRecordList, getOutRecordList, listParams } = this.props;
    const tableType = e.target.value;
    stockRecordsStore({ tableType });
    tableType === 'inRecord' && getInRecordList(listParams);
    tableType === 'outRecord' && getOutRecordList(listParams);
  }

  inCheckedPopover = (record) => { // 查看详情
    const { manufactor, supplierName, manufactorName } = record;
    return (
      <div className={styles.inRecordInfo}>
        <div className={styles.title}>
          <span className={styles.text}>更多信息</span>
          <Icon type="close" onClick={this.hidePopover} />
        </div>
        <div className={styles.content}>
          <div className={styles.manufactor}>
            <span className={styles.text}>厂家</span>
            <span>{manufactor || '--'}</span>
          </div>
          <div className={styles.supplierName}>
            <span className={styles.text}>供货商</span>
            <span>{supplierName || '--'}</span>
          </div>
          <div className={styles.manufactorName}>
            <span className={styles.text}>制造商</span>
            <span>{manufactorName || '--'}</span>
          </div>
        </div>
      </div>

    );
  }

  render() {
    const { listParams, tableLoading, inRecordListData, outRecordListData, tableType, pageCount } = this.props;
    const { pageNum, pageSize, sortField, sortMethod } = listParams;
    const dataSource = tableType === 'inRecord' ? inRecordListData.map((e, i) => ({ ...e, key: i })) : outRecordListData.map((e, i) => ({ ...e, key: i }));

    return (
      <div className={styles.stockList}>
        <div className={styles.stockListTop}>
          <div className={styles.switchBtn}>
            <Radio.Group value={tableType} buttonStyle="solid" onChange={this.changeRadio} defaultChecked="inRecord" buttonStyle="solid">
              <Radio.Button value="inRecord">入库</Radio.Button>
              <Radio.Button value="outRecord">出库</Radio.Button>
            </Radio.Group>
          </div>
          <CommonPagination
            className={styles.pagination}
            currentPage={pageNum}
            pageSize={pageSize}
            total={pageCount}
            onPaginationChange={this.onPaginationChange}
          />
        </div>
        <div className={styles.tableBox}>
          <CneTable
            loading={tableLoading}
            className={styles.inRecordList}
            dataSource={dataSource}
            columns={this.columns()}
            onChange={this.tableChange}
            pagination={false}
            // dataError={diagnoseListError}
            sortField={this.sortInfo[sortField]}
            sortMethod={this.sortInfo[sortMethod]}
          />
        </div>
      </div>
    );
  }
}

export default StockList;
