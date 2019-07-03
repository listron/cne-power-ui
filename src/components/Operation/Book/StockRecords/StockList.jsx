import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Radio, Popover, Icon } from 'antd';
import moment from 'moment';
import styles from './record.scss';
import CommonPagination from '../../../Common/CommonPagination';

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

  componentDidMount(){
    const { getInRecordList, listParams } = this.props;
    getInRecordList(listParams);
  }

  onPaginationChange = ({ pageSize, currentPage }) => { // 分页器
    console.log('currentPage: ', currentPage);
    console.log('pageSize: ', pageSize);
    const { stockRecordsStore, getInRecordList, getOutRecordList, listParams, tableType } = this.props;
    const newParams = {
      ...listParams,
      pageSize,
      pageNum: currentPage,
    };
    console.log('newParams: ', newParams);
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

  inColumns = () => { // 展示入库列表
    const columns = [{
      title: '资产编码',
      dataIndex: 'materialCode',
      className: 'materialCode',
      sorter: true,
      render: (text) => {
        return <div className={styles.materialCode} title={text}>{text}</div>
      }
    }, {
      title: '物品名称',
      dataIndex: 'goodsName',
      className: 'goodsName',
      sorter: true,
      render: (text) => {
        return <div className={styles.goodsName} title={text}>{text}</div>
      }
    }, {
      title: '库存类型',
      dataIndex: 'goodsTypeName',
      className: 'goodsTypeName',
      sorter: true,
      render: (text) => {
        return <div className={styles.goodsTypeName} title={text}>{text}</div>
      }
    }, {
      title: '设备型号',
      dataIndex: 'modeName',
      className: 'modeName',
      sorter: true,
      render: (text) => {
        return <div className={styles.modeName} title={text}>{text}</div>
      }
    }, {
      title: '单价/元',
      dataIndex: 'price',
      className: 'price',
      sorter: true,
      render: (text) => {
        return <div className={styles.price} title={text}>{text}</div>
      }
    }, {
      title: '仓库名称',
      dataIndex: 'warehouseName',
      className: 'warehouseName',
      sorter: true,
      render: (text) => {
        return <div className={styles.warehouseName} title={text}>{text}</div>
      }
    }, {
      title: '入库时间',
      dataIndex: 'entryTime',
      className: 'entryTime',
      sorter: true,
      render: (text, record) => moment(text).format('YYYY-MM-DD'),
    }, {
      title: '入库人',
      dataIndex: 'user',
      className: 'user',
      sorter: true,
      render: (text) => {
        return <div className={styles.user} title={text}>{text}</div>
      }
    }, {
      title: '更多信息',
      dataIndex: 'moreInformation',
      className: 'moreInformation',
      render: (text, record, index) => (
        <Popover 
          content={this.inCheckedPopover(record)} 
          trigger="click"
          arrowPointAtCenter
          visible={this.state.visible === index}
          onVisibleChange={() => {return this.handleVisibleChange(index)}}
        >
          <span className={styles.moreInformation}>查看</span>
        </Popover>
      )
    }];
    return columns;
  }

  outColumns = () => { // 展示出库列表
    const columns = [{
      title: '物品编码',
      dataIndex: 'materialCode',
      className: 'materialCode',
      sorter: true,
      render: (text) => {
        return <div className={styles.materialCode} title={text}>{text}</div>
      }
    }, {
      title: '物品名称',
      dataIndex: 'goodsName',
      className: 'goodsName',
      sorter: true,
      render: (text) => {
        return <div className={styles.goodsName} title={text}>{text}</div>
      }
    }, {
      title: '库存类型',
      dataIndex: 'goodsTypeName',
      className: 'goodsTypeName',
      sorter: true,
      render: (text) => {
        return <div className={styles.goodsTypeName} title={text}>{text}</div>
      }
    }, {
      title: '设备型号',
      dataIndex: 'modeName',
      className: 'modeName',
      sorter: true,
      render: (text) => {
        return <div className={styles.modeName} title={text}>{text}</div>
      }
    }, {
      title: '单价/元',
      dataIndex: 'price',
      className: 'price',
      sorter: true,
      render: (text) => {
        return <div className={styles.price} title={text}>{text}</div>
      }
    }, {
      title: '仓库名称',
      dataIndex: 'warehouseName',
      className: 'warehouseName',
      sorter: true,
      render: (text) => {
        return <div className={styles.warehouseName} title={text}>{text}</div>
      }
    }, {
      title: '出库时间',
      dataIndex: 'entryTime',
      className: 'entryTime',
      sorter: true,
      render: (text, record) => moment(text).format('YYYY-MM-DD'),
    }, {
      title: '出库人',
      dataIndex: 'user',
      className: 'user',
      sorter: true,
      render: (text) => {
        return <div className={styles.user} title={text}>{text}</div>
      }
    }, {
      title: '更多信息',
      dataIndex: 'moreInformation',
      className: 'moreInformation',
      render: (text, record, index) => (
        <Popover 
          content={this.inCheckedPopover(record)} 
          trigger="click"
          arrowPointAtCenter
          visible={this.state.visible === index}
          onVisibleChange={() => {return this.handleVisibleChange(index)}}
        >
          <span className={styles.moreInformation}>查看</span>
        </Popover>
      )
    }];
    return columns;
  }

  handleVisibleChange = (index) => { 
    this.setState({ visible: index });
  };

  hidePopover = () => { // 气泡框内部关闭
    this.setState({
      visible: "",
    });
  };

  tableChange = (pagination, filter, sorter) => { // 表格排序
    const { stockRecordsStore, getInRecordList, getOutRecordList, listParams } = this.props;
    const { field, order } = sorter;
    const sortInfo = {
      materialCode: "material_code",
      goodsName: "goods_name",
      goodsTypeName: "goods_type",
      modeName: "manufactor",
      price: "goods_unit",
      warehouseName: "warehouse_name",
      entryTime: "create_time",
      user: "username",
    }
    const sortField = sortInfo[field] ? sortInfo[field] : '';
    const orderCommand = order ? (sorter.order === 'ascend' ? 'asc' : 'desc') : '';
    const newParams = {
      ...listParams,
      sortField,
      sortMethod: orderCommand
    }
    stockRecordsStore({
      ...newParams
    })
    getInRecordList({
      ...newParams
    })
    getOutRecordList({
      ...newParams
    })
  }

  sortField(sortField) {
    let result = "";
    switch (sortField) {
      case 'materialCode': result = 'material_code'; break;
      case 'goodsName': result = 'goods_name'; break;
      case 'goodsType': result = 'goods_type'; break;
      case 'modeName': result = 'manufactor'; break;
      case 'price': result = 'goods_unit'; break;
      case 'warehouseName': result = 'warehouse_name'; break;
      case 'entryTime': result = 'create_time'; break;
      case 'username': result = 'username'; break;
      default: result = ""; break;
    }
    return result;
  }

  changeRadio = (e) => { // 切换按钮
    const { stockRecordsStore, getInRecordList, getOutRecordList, listParams } = this.props;
    const tableType = e.target.value;
    stockRecordsStore({tableType});
    const newParams = {
      ...listParams,
    };
    tableType === 'inRecord' && getInRecordList({
      ...newParams,
    });
    tableType === 'outRecord' && getOutRecordList({
      ...newParams,
    });
  }
  
  inCheckedPopover = (record) => { // 入库查看详情
    const { manufactor, supplierName , manufactorName } = record;
    return(
      <div className={styles.inRecordInfo}>
        <div className={styles.title}>
          <span className={styles.text}>更多信息</span>
          <Icon type="close" onClick={this.hidePopover} />
        </div>
        <div className={styles.content}>
          <div className={styles.manufactor}>
            <span className={styles.text}>厂家</span>
            <span>{manufactor}</span>
          </div>
          <div className={styles.supplierName}>
            <span className={styles.text}>供货商</span>
            <span>{supplierName}</span>
          </div>
          <div className={styles.manufactorName}>
            <span className={styles.text}>制造商</span>
            <span>{manufactorName}</span>
          </div>
        </div>
      </div>
      
    )
  }

  outCheckedPopover = (record) => { // 出库查看详情
    const { manufactor, supplierName, manufactorName } = record;
    return(
      <div className={styles.inRecordInfo}>
        <div className={styles.title}>
          <span className={styles.text}>更多信息</span>
          <Icon type="close" onClick={this.hidePopover} />
        </div>
        <div className={styles.content}>
          <div className={styles.manufactor}>
            <span className={styles.text}>厂家</span>
            <span>{manufactor}</span>
          </div>
          <div className={styles.supplierName}>
            <span className={styles.text}>供货商</span>
            <span>{supplierName}</span>
          </div>
          <div className={styles.manufactorName}>
            <span className={styles.text}>制造商</span>
            <span>{manufactorName}</span>
          </div>
        </div>
      </div>
    )
  }

  render() {
    const { listParams, tableLoading, inRecordListData, outRecordListData, tableType , pageCount } = this.props;
    const { pageNum, pageSize } = listParams;
    const dataSource = tableType === 'inRecord' ? inRecordListData.map((e, i) => ({...e, key: i,})) : outRecordListData.map((e, i) => ({...e, key: i,}));
    const columns = tableType === 'inRecord' ? this.inColumns() : this.outColumns(); 

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
            currentPage={pageNum}
            pageSize={pageSize}
            total={pageCount}
            onPaginationChange={this.onPaginationChange}
          />
        </div>
        <Table
          loading={tableLoading}
          className={styles.inRecordList}
          dataSource={dataSource}
          columns={columns}
          onChange={this.tableChange}
          pagination={false}
          locale={{emptyText:<img width="223" height="164" src="/img/nodata.png" />}}
        />
      </div>
      )
    }
  }
  
  export default StockList;